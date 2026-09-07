const ORIGIN = 'https://zyzyll1993-del.github.io';
const ACCOUNT_URL = 'https://zyzyll1993-del.github.io/jobai-slovakia/saas/account.html';

const corsHeaders = {
  'Access-Control-Allow-Origin': ORIGIN,
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return json({ error: 'method_not_allowed' }, 405);

  try {
    const authHeader = req.headers.get('Authorization') || '';
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
    const serviceRole = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const stripeSecret = Deno.env.get('STRIPE_SECRET_KEY') || '';

    const userRes = await fetch(`${supabaseUrl}/auth/v1/user`, {
      headers: { Authorization: authHeader, apikey: anonKey },
    });
    if (!userRes.ok) return json({ error: 'unauthorized' }, 401);
    const user = await userRes.json();
    if (!user?.id) return json({ error: 'unauthorized' }, 401);

    if (!stripeSecret) return json({ error: 'billing_not_configured' }, 503);

    const subRes = await fetch(
      `${supabaseUrl}/rest/v1/subscriptions?user_id=eq.${encodeURIComponent(user.id)}&select=stripe_customer_id&limit=1`,
      {
        headers: {
          apikey: serviceRole,
          Authorization: `Bearer ${serviceRole}`,
          Accept: 'application/json',
        },
      },
    );
    if (!subRes.ok) return json({ error: 'subscription_lookup_failed' }, 500);
    const rows = await subRes.json();
    const customerId = Array.isArray(rows) && rows[0]?.stripe_customer_id ? rows[0].stripe_customer_id : '';
    if (!customerId) return json({ error: 'billing_customer_not_found' }, 409);

    const form = new URLSearchParams();
    form.set('customer', customerId);
    form.set('return_url', ACCOUNT_URL);

    const stripeRes = await fetch('https://api.stripe.com/v1/billing_portal/sessions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${stripeSecret}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: form.toString(),
    });
    const stripeData = await stripeRes.json();
    if (!stripeRes.ok || !stripeData?.url) return json({ error: 'stripe_portal_failed' }, 502);

    return json({ url: stripeData.url });
  } catch (_) {
    return json({ error: 'internal_error' }, 500);
  }
});
