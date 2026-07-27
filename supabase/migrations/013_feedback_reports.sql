create table if not exists public.feedback_reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  email text not null default '',
  category text not null default 'bug',
  message text not null,
  contact text not null default '',
  diagnostics jsonb,
  app_version text not null default '',
  platform text not null default '',
  status text not null default 'new',
  created_at timestamptz not null default now(),
  constraint feedback_reports_category_check
    check (category in ('bug', 'idea', 'content', 'other')),
  constraint feedback_reports_status_check
    check (status in ('new', 'reviewing', 'done', 'closed'))
);

alter table public.feedback_reports enable row level security;

drop policy if exists "feedback_reports_insert_own" on public.feedback_reports;
create policy "feedback_reports_insert_own"
  on public.feedback_reports for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "feedback_reports_select_own" on public.feedback_reports;
create policy "feedback_reports_select_own"
  on public.feedback_reports for select
  to authenticated
  using (auth.uid() = user_id);

grant select, insert on table public.feedback_reports to authenticated;
