create table if not exists public.download_counters (
  release_key text primary key,
  download_count bigint not null default 0 check (download_count >= 0),
  updated_at timestamptz not null default now()
);

create table if not exists public.download_visitors (
  release_key text not null references public.download_counters(release_key) on delete cascade,
  visitor_id uuid not null,
  created_at timestamptz not null default now(),
  primary key (release_key, visitor_id)
);

insert into public.download_counters (release_key)
values ('0.2.2')
on conflict (release_key) do nothing;

alter table public.download_counters enable row level security;
alter table public.download_visitors enable row level security;

revoke all on table public.download_counters from anon, authenticated;
revoke all on table public.download_visitors from anon, authenticated;

create or replace function public.get_download_count(p_release_key text)
returns bigint
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (
      select counter.download_count
      from public.download_counters as counter
      where counter.release_key = p_release_key
    ),
    0
  );
$$;

create or replace function public.record_download(
  p_release_key text,
  p_visitor_id uuid
)
returns bigint
language plpgsql
security definer
set search_path = public
as $$
declare
  inserted_rows integer := 0;
  current_count bigint := 0;
begin
  if p_release_key is null
     or p_release_key !~ '^[0-9]+(\.[0-9]+){1,3}$' then
    raise exception 'invalid release key'
      using errcode = '22023';
  end if;

  if p_visitor_id is null then
    raise exception 'visitor id is required'
      using errcode = '22023';
  end if;

  if not exists (
    select 1
    from public.download_counters
    where release_key = p_release_key
  ) then
    raise exception 'unknown release key'
      using errcode = '22023';
  end if;

  insert into public.download_visitors (release_key, visitor_id)
  values (p_release_key, p_visitor_id)
  on conflict do nothing;

  get diagnostics inserted_rows = row_count;

  if inserted_rows = 1 then
    update public.download_counters
    set download_count = download_count + 1,
        updated_at = now()
    where release_key = p_release_key
    returning download_count into current_count;
  else
    select download_count
    into current_count
    from public.download_counters
    where release_key = p_release_key;
  end if;

  return coalesce(current_count, 0);
end;
$$;

revoke all on function public.get_download_count(text) from public;
revoke all on function public.record_download(text, uuid) from public;

grant execute on function public.get_download_count(text) to anon, authenticated;
grant execute on function public.record_download(text, uuid) to anon, authenticated;
