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

## Planned rollout

Phase 1 — isolated prototype (this folder)
- account UI
- Free / Pro pricing UI
- database schema + RLS
- no production integration

Phase 2 — Supabase
- email registration/login
- verified session
- profiles
- per-user encrypted resume storage

Phase 3 — monetization
- Stripe product + monthly/yearly prices
- Checkout session through serverless function
- Stripe webhook updates subscription status
- Customer Portal

Phase 4 — production integration
- add Account button to JobAI only after smoke tests
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

Suggested starting price for testing: EUR 4.99/month and EUR 39.99/year. Final commercial pricing can be changed later without changing the core app.
