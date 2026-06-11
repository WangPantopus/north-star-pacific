-- NSP AI Opportunity Scan — run once in Supabase SQL Editor
-- Service-role API routes write/read this table; enable RLS with no public policies.

create table if not exists public.scan_responses (
  id text primary key,
  created_at timestamptz not null default now(),
  answers jsonb not null,
  readiness int not null check (readiness >= 0 and readiness <= 100),
  band text not null,
  surfaced_zones jsonb not null default '[]'::jsonb,
  route text not null,
  email text not null,
  first_name text not null,
  company text not null,
  audit_booked boolean not null default false
);

create index if not exists scan_responses_created_at_idx
  on public.scan_responses (created_at desc);

create index if not exists scan_responses_email_idx
  on public.scan_responses (email);

alter table public.scan_responses enable row level security;

-- No policies: anon/authenticated roles cannot access rows.
-- Server routes use SUPABASE_SERVICE_ROLE_KEY, which bypasses RLS.
