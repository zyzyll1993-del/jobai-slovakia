function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

async function hmacHex(secret: string, payload: string) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(payload));
  return Array.from(new Uint8Array(sig)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

async function verifyStripeSignature(rawBody: string, header: string, secret: string) {
  const parts = header.split(',').map((x) => x.trim());
  const timestamp = parts.find((x) => x.startsWith('t='))?.slice(2) || '';
  const signatures = parts.filter((x) => x.startsWith('v1=')).map((x) => x.slice(3));
  const ts = Number(timestamp);
  if (!timestamp || !Number.isFinite(ts) || !signatures.length) return false;
  if (Math.abs(Math.floor(Date.now() / 1000) - ts) > 300) return false;
  const expected = await hmacHex(secret, `${timestamp}.${rawBody}`);
  return signatures.some((sig) => safeEqual(sig, expected));
}

async function lookupUserByCustomer(supabaseUrl: string, serviceRole: string, customerId: string) {
  if (!customerId) return '';
  const res = await fetch(
    `${supabaseUrl}/rest/v1/subscriptions?stripe_customer_id=eq.${encodeURIComponent(customerId)}&select=user_id&limit=1`,
    { headers: { apikey: serviceRole, Authorization: `Bearer ${serviceRole}`, Accept: 'application/json' } },
  );
  if (!res.ok) return '';
  const rows = await res.json();
  return Array.isArray(rows) && rows[0]?.user_id ? rows[0].user_id : '';
}

async function saveSubscription(opts: {
  supabaseUrl: string;
  serviceRole: string;
  userId: string;
  customerId: string;
  subscriptionId: string;
  priceId: string;
  status: string;
  currentPeriodEnd?: number | null;
  deleted?: boolean;
  monthlyPrice: string;
  yearlyPrice: string;
}) {
  if (!opts.userId) return false;
  let plan = 'free';
  if (!opts.deleted && opts.priceId === opts.monthlyPrice) plan = 'pro_monthly';
  if (!opts.deleted && opts.priceId === opts.yearlyPrice) plan = 'pro_yearly';

  const payload = {
    user_id: opts.userId,
    stripe_customer_id: opts.customerId || null,
    stripe_subscription_id: opts.subscriptionId || null,
    plan,
    status: opts.status || 'inactive',
    current_period_end: opts.currentPeriodEnd ? new Date(opts.currentPeriodEnd * 1000).toISOString() : null,
    updated_at: new Date().toISOString(),
  };

  const res = await fetch(`${opts.supabaseUrl}/rest/v1/subscriptions?on_conflict=user_id`, {
    method: 'POST',
    headers: {
      apikey: opts.serviceRole,
      Authorization: `Bearer ${opts.serviceRole}`,
      'Content-Type': 'application/json',
      Prefer: 'resolution=merge-duplicates,return=minimal',
    },
    body: JSON.stringify(payload),
  });
  return res.ok;
}

Deno.serve(async (req: Request) => {
  if (req.method !== 'POST') return json({ error: 'method_not_allowed' }, 405);

  const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET') || '';
  const stripeSecret = Deno.env.get('STRIPE_SECRET_KEY') || '';
  const monthlyPrice = Deno.env.get('STRIPE_PRICE_MONTHLY') || '';
  const yearlyPrice = Deno.env.get('STRIPE_PRICE_YEARLY') || '';
  const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
  const serviceRole = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

  if (!webhookSecret || !stripeSecret || !monthlyPrice || !yearlyPrice || !serviceRole) {
    return json({ error: 'billing_not_configured' }, 503);
  }

  const rawBody = await req.text();
  const signature = req.headers.get('Stripe-Signature') || '';
  if (!(await verifyStripeSignature(rawBody, signature, webhookSecret))) {
    return json({ error: 'invalid_signature' }, 401);
  }

  let event: any;
  try { event = JSON.parse(rawBody); } catch (_) { return json({ error: 'invalid_json' }, 400); }
  const type = String(event?.type || '');
  const object = event?.data?.object || {};

  try {
    if (type === 'checkout.session.completed' && object?.mode === 'subscription' && object?.subscription) {
      const subId = String(object.subscription);
      const subRes = await fetch(`https://api.stripe.com/v1/subscriptions/${encodeURIComponent(subId)}`, {
        headers: { Authorization: `Bearer ${stripeSecret}` },
      });
      if (!subRes.ok) return json({ error: 'stripe_subscription_lookup_failed' }, 502);
      const sub = await subRes.json();
      const userId = String(object.client_reference_id || object?.metadata?.user_id || sub?.metadata?.user_id || '');
      const ok = await saveSubscription({
        supabaseUrl, serviceRole, userId,
        customerId: String(sub?.customer || object?.customer || ''),
        subscriptionId: String(sub?.id || subId),
        priceId: String(sub?.items?.data?.[0]?.price?.id || ''),
        status: String(sub?.status || 'inactive'),
        currentPeriodEnd: sub?.current_period_end || null,
        monthlyPrice, yearlyPrice,
      });
      if (!ok) return json({ error: 'subscription_sync_failed' }, 500);
    }

    if (type === 'customer.subscription.created' || type === 'customer.subscription.updated' || type === 'customer.subscription.deleted') {
      const customerId = String(object?.customer || '');
      let userId = String(object?.metadata?.user_id || '');
      if (!userId) userId = await lookupUserByCustomer(supabaseUrl, serviceRole, customerId);
      const ok = await saveSubscription({
        supabaseUrl, serviceRole, userId,
        customerId,
        subscriptionId: String(object?.id || ''),
        priceId: String(object?.items?.data?.[0]?.price?.id || ''),
        status: String(object?.status || (type.endsWith('.deleted') ? 'canceled' : 'inactive')),
        currentPeriodEnd: object?.current_period_end || null,
        deleted: type.endsWith('.deleted'),
        monthlyPrice, yearlyPrice,
      });
      if (!ok && userId) return json({ error: 'subscription_sync_failed' }, 500);
    }

    return json({ received: true });
  } catch (_) {
    return json({ error: 'internal_error' }, 500);
  }
});
