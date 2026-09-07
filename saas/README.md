# JobAI Slovakia — isolated SaaS layer

This folder is intentionally NOT connected to `index.html` yet.

Goal: add accounts, secure cloud sync and monetization without touching the currently working resume/vacancy flow.

## Safety rules

1. Never put Supabase service-role keys, Stripe secret keys or webhook secrets in GitHub Pages JavaScript.
2. Keep the existing local-first JobAI flow working when the user is not signed in.
3. Account features are enabled only after separate testing.
4. Every cloud row must be protected by Supabase Row Level Security (RLS).
5. Resume content should be client-side encrypted before cloud storage in a later phase.
6. Stripe Checkout / Customer Portal must be created server-side or through a trusted serverless function.
7. Do not log resume text, phone numbers, email addresses, photos or vacancy analysis payloads.
8. Support complete account/data deletion.

## Current status

### Accounts / Supabase
- email/password registration and login are active on `saas/account.html`
- production `index.html` is still not connected to the SaaS layer
- `profiles`, `resumes`, `saved_jobs`, `subscriptions` use RLS
- new users receive a server-created Free subscription row
- browser users cannot grant themselves Pro

### Billing backend
Deployed Supabase Edge Functions:
- `jobai-create-checkout` — JWT required; accepts only `monthly` or `yearly`, maps them to server-side Stripe Price IDs
- `jobai-customer-portal` — JWT required; opens Stripe Customer Portal only for the signed-in account
- `jobai-stripe-webhook` — no JWT because Stripe calls it server-to-server; validates `Stripe-Signature` with HMAC before changing subscription data

Webhook endpoint:
`https://roxzulbpbufxgudvenbm.supabase.co/functions/v1/jobai-stripe-webhook`

Required Stripe events:
- `checkout.session.completed`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`

## Required Supabase Edge Function secrets

These values must be set in Supabase Edge Function secrets and must never be committed to GitHub:
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_PRICE_MONTHLY`
- `STRIPE_PRICE_YEARLY`

Supabase-provided `SUPABASE_URL`, `SUPABASE_ANON_KEY` and `SUPABASE_SERVICE_ROLE_KEY` are read only inside Edge Functions.

Until the Stripe secrets/Price IDs are configured, Checkout returns `billing_not_configured` and no payment can be created.

## Rollout

Phase 1 — isolated prototype ✅
- account UI
- Free / Pro pricing UI
- database schema + RLS

Phase 2 — Supabase accounts ✅
- email registration/login
- verified session
- profiles
- protected subscription state

Phase 3 — monetization in progress
- Stripe product + monthly/yearly prices — pending Stripe account connection
- Checkout Edge Function — ready
- Customer Portal Edge Function — ready
- signed Stripe webhook — ready
- Stripe secrets + webhook endpoint registration — pending Stripe account connection

Phase 4 — cloud resume sync
- client-side encrypt resume payload before upload
- sync only after explicit user action / account sign-in

Phase 5 — production integration
- add Account button to JobAI only after isolated end-to-end payment tests
- local-first fallback remains available
- feature gates use server-side subscription state

## Proposed plans

Free
- 1 local resume
- basic vacancy analysis
- local-only storage

Pro
- cloud sync
- multiple resumes
- saved vacancies / history
- premium analysis features
- future safe resume tailoring

Testing price target: EUR 4.99/month and EUR 39.99/year. Final commercial pricing can be changed later without changing the core app.
