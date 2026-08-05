create table if not exists public.app_notices (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null default '',
  category text not null default 'notice',
  target text not null default 'all',
  action_label text not null default '',
  action_url text not null default '',
  published boolean not null default true,
  pinned boolean not null default false,
  published_at timestamptz not null default now(),
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint app_notices_category_check
    check (category in ('notice', 'update', 'maintenance', 'activity', 'other')),
  constraint app_notices_target_check
    check (target in ('all', 'web', 'android'))
);

create index if not exists app_notices_visible_idx
  on public.app_notices(pinned desc, published_at desc)
  where published = true;

alter table public.app_notices enable row level security;

drop policy if exists "app_notices_read_published" on public.app_notices;
create policy "app_notices_read_published"
  on public.app_notices for select
  to anon, authenticated
  using (
    published = true
    and (expires_at is null or expires_at > now())
  );

revoke all on table public.app_notices from anon, authenticated;
grant select on table public.app_notices to anon, authenticated;

insert into public.app_notices (
  id,
  title,
  body,
  category,
  target,
  action_label,
  action_url,
  pinned,
  published_at
) values (
  '00000000-0000-0000-0000-000000000215',
  '官方下载地址',
  '正式版安装包统一在官方下载页发布。以后有新版本时，版本检测和通知都会引导到这个地址。',
  'notice',
  'all',
  '打开官方下载页',
  'https://hoggerel28.github.io/body-building_app/docs/',
  true,
  '2026-08-05 00:00:00+00'
)
on conflict (id) do update
set title = excluded.title,
    body = excluded.body,
    category = excluded.category,
    target = excluded.target,
    action_label = excluded.action_label,
    action_url = excluded.action_url,
    pinned = excluded.pinned,
    published = true,
    updated_at = now();
