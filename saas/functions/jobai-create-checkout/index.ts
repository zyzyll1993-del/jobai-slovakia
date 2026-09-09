const ORIGIN = 'https://zyzyll1993-del.github.io';
const ACCOUNT_URL = 'https://zyzyll1993-del.github.io/jobai-slovakia/saas/account.html';
const PRICE_MONTHLY = 'price_1UDREuIgYL4HeKN0hNjpi2qh';
const PRICE_YEARLY = 'price_1UDRF8IgYL4HeKN055k6b2io';

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

function publishableKey() {
  try {
    const raw = Deno.env.get('SUPABASE_PUBLISHABLE_KEYS') || '';
    const parsed = raw ? JSON.parse(raw) : {};
    if (parsed?.default) return String(parsed.default);
  } catch (_) {}
  return Deno.env.get('SUPABASE_ANON_KEY') || '';
}

function stripeErrorPayload(data: any, status: number) {
  return {
    stripe_status: status,
    stripe_code: data?.error?.code || '',
    stripe_type: data?.error?.type || '',
    stripe_param: data?.error?.param || '',
    stripe_message: data?.error?.message || '',
  };
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return json({ error: 'method_not_allowed' }, 405);

  try {
    const authHeader = req.headers.get('Authorization') || '';
    if (!authHeader.startsWith('Bearer ')) return json({ error: 'unauthorized' }, 401);

    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const publicKey = publishableKey();
    if (!supabaseUrl || !publicKey) return json({ error: 'supabase_auth_not_configured' }, 503);

    const userRes = await fetch(`${supabaseUrl}/auth/v1/user`, {
      headers: { Authorization: authHeader, apikey: publicKey },
    });
    if (!userRes.ok) return json({ error: 'unauthorized', auth_status: userRes.status }, 401);
    const user = await userRes.json();
    if (!user?.id) return json({ error: 'unauthorized' }, 401);

    const body = await req.json().catch(() => ({}));
    const plan = body?.plan === 'yearly' ? 'yearly' : body?.plan === 'monthly' ? 'monthly' : '';
    if (!plan) return json({ error: 'invalid_plan' }, 400);

    const stripeSecret = Deno.env.get('STRIPE_SECRET_KEY') || '';
    if (!stripeSecret.startsWith('sk_test_')) {
      return json({ error: 'sandbox_billing_not_configured' }, 503);
    }

    const priceId = plan === 'yearly' ? PRICE_YEARLY : PRICE_MONTHLY;

    const priceRes = await fetch(`https://api.stripe.com/v1/prices/${encodeURIComponent(priceId)}`, {
      headers: { Authorization: `Bearer ${stripeSecret}` },
    });
    const priceData = await priceRes.json().catch(() => ({}));
    if (!priceRes.ok) {
      return json({ error: 'stripe_price_unavailable', ...stripeErrorPayload(priceData, priceRes.status) }, 502);
    }
    if (!priceData?.active || priceData?.currency !== 'eur' || !priceData?.recurring) {
      return json({ error: 'stripe_price_invalid' }, 502);
    }

    const form = new URLSearchParams();
    form.set('mode', 'subscription');
    form.set('line_items[0][price]', priceId);
    form.set('line_items[0][quantity]', '1');
    form.set('success_url', `${ACCOUNT_URL}?billing=success`);
    form.set('cancel_url', `${ACCOUNT_URL}?billing=cancelled`);
    form.set('client_reference_id', user.id);
    if (user.email) form.set('customer_email', user.email);

    const stripeRes = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${stripeSecret}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: form.toString(),
    });
    const stripeData = await stripeRes.json().catch(() => ({}));
    if (!stripeRes.ok || !stripeData?.url) {
      return json({ error: 'stripe_checkout_failed', ...stripeErrorPayload(stripeData, stripeRes.status) }, 502);
    }

    return json({ url: stripeData.url });
  } catch (_) {
    return json({ error: 'internal_error' }, 500);
  }
});
