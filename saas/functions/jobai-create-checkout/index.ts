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

    const userRes = await fetch(`${supabaseUrl}/auth/v1/user`, {
      headers: { Authorization: authHeader, apikey: anonKey },
    });
    if (!userRes.ok) return json({ error: 'unauthorized' }, 401);
    const user = await userRes.json();
    if (!user?.id) return json({ error: 'unauthorized' }, 401);

    const body = await req.json().catch(() => ({}));
    const plan = body?.plan === 'yearly' ? 'yearly' : body?.plan === 'monthly' ? 'monthly' : '';
    if (!plan) return json({ error: 'invalid_plan' }, 400);

    const stripeSecret = Deno.env.get('STRIPE_SECRET_KEY') || '';
    const priceMonthly = Deno.env.get('STRIPE_PRICE_MONTHLY') || '';
    const priceYearly = Deno.env.get('STRIPE_PRICE_YEARLY') || '';
    const priceId = plan === 'yearly' ? priceYearly : priceMonthly;

    if (!stripeSecret || !priceId) return json({ error: 'billing_not_configured' }, 503);

    const form = new URLSearchParams();
    form.set('mode', 'subscription');
    form.set('line_items[0][price]', priceId);
    form.set('line_items[0][quantity]', '1');
    form.set('success_url', `${ACCOUNT_URL}?billing=success`);
    form.set('cancel_url', `${ACCOUNT_URL}?billing=cancelled`);
    form.set('client_reference_id', user.id);
    form.set('metadata[user_id]', user.id);
    form.set('subscription_data[metadata][user_id]', user.id);
    form.set('allow_promotion_codes', 'true');
    if (user.email) form.set('customer_email', user.email);

    const stripeRes = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${stripeSecret}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: form.toString(),
    });
    const stripeData = await stripeRes.json();
    if (!stripeRes.ok || !stripeData?.url) return json({ error: 'stripe_checkout_failed' }, 502);

    return json({ url: stripeData.url });
  } catch (_) {
    return json({ error: 'internal_error' }, 500);
  }
});
