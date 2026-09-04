-- JobAI Slovakia — proposed Supabase schema
-- ISOLATED: not connected to the production site yet.
-- Run only in a dedicated Supabase project after review.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  locale text not null default 'sk' check (locale in ('sk','uk','en')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.resumes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null default 'Resume',
  language text not null default 'sk' check (language in ('sk','uk','en','de','cs','pl','hu')),
  -- Store ciphertext only. Plain resume content should be encrypted in the browser
  -- before upload in the production cloud-sync phase.
  encrypted_payload text not null,
  crypto_version integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists resumes_user_id_idx on public.resumes(user_id);

create table if not exists public.saved_jobs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  external_job_id text,
  title text,
  source_url text,
  created_at timestamptz not null default now()
);

create index if not exists saved_jobs_user_id_idx on public.saved_jobs(user_id);

create table if not exists public.subscriptions (
  user_id uuid primary key references auth.users(id) on delete cascade,
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  plan text not null default 'free' check (plan in ('free','pro_monthly','pro_yearly')),
  status text not null default 'inactive',
  current_period_end timestamptz,
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.resumes enable row level security;
alter table public.saved_jobs enable row level security;
alter table public.subscriptions enable row level security;

-- Profiles: users can only access their own profile.
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
on public.profiles for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
on public.profiles for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "profiles_delete_own" on public.profiles;
create policy "profiles_delete_own"
on public.profiles for delete
to authenticated
using (auth.uid() = user_id);

-- Resumes: encrypted payload rows are private per account.
drop policy if exists "resumes_select_own" on public.resumes;
create policy "resumes_select_own"
on public.resumes for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "resumes_insert_own" on public.resumes;
create policy "resumes_insert_own"
on public.resumes for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "resumes_update_own" on public.resumes;
create policy "resumes_update_own"
on public.resumes for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "resumes_delete_own" on public.resumes;
create policy "resumes_delete_own"
on public.resumes for delete
to authenticated
using (auth.uid() = user_id);

-- Saved vacancies: private per account.
drop policy if exists "saved_jobs_select_own" on public.saved_jobs;
create policy "saved_jobs_select_own"
on public.saved_jobs for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "saved_jobs_insert_own" on public.saved_jobs;
create policy "saved_jobs_insert_own"
on public.saved_jobs for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "saved_jobs_delete_own" on public.saved_jobs;
create policy "saved_jobs_delete_own"
on public.saved_jobs for delete
to authenticated
using (auth.uid() = user_id);

-- Subscription rows are readable by their owner but must be written only by
-- trusted server-side Stripe webhook / service-role code.
drop policy if exists "subscriptions_select_own" on public.subscriptions;
create policy "subscriptions_select_own"
on public.subscriptions for select
to authenticated
using (auth.uid() = user_id);

-- No INSERT/UPDATE/DELETE policy for authenticated users on subscriptions.
-- This prevents a browser client from granting itself Pro status.
