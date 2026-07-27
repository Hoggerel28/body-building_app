create or replace function public.generate_friend_code()
returns text
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  generated_code text;
begin
  loop
    generated_code := 'L' || substr(upper(md5(clock_timestamp()::text || random()::text)), 1, 6);
    exit when not exists (
      select 1
      from public.profiles
      where friend_code = generated_code
    );
  end loop;

  return generated_code;
end;
$$;

alter table public.profiles
  add column if not exists friend_code text;

update public.profiles
set friend_code = public.generate_friend_code()
where friend_code is null
   or friend_code = '';

alter table public.profiles
  alter column friend_code set default public.generate_friend_code();

alter table public.profiles
  alter column friend_code set not null;

create unique index if not exists profiles_friend_code_uidx
  on public.profiles(friend_code);

grant select (friend_code) on table public.profiles to authenticated;

create or replace function public.search_friend_profiles(search_text text)
returns table (
  id uuid,
  display_name text,
  friend_code text
)
language sql
security definer
stable
set search_path = pg_catalog, public
as $$
  with cleaned as (
    select
      trim(coalesce(search_text, '')) as q,
      upper(regexp_replace(coalesce(search_text, ''), '[^a-zA-Z0-9]', '', 'g')) as code
  )
  select p.id, p.display_name, p.friend_code
  from public.profiles p
  cross join cleaned c
  where auth.uid() is not null
    and p.id <> auth.uid()
    and c.q <> ''
    and (
      p.friend_code = c.code
      or (
        p.searchable = true
        and p.display_name ilike ('%' || c.q || '%')
      )
    )
  order by
    case when p.friend_code = c.code then 0 else 1 end,
    p.updated_at desc
  limit 12;
$$;

revoke all on function public.generate_friend_code() from public;
revoke all on function public.search_friend_profiles(text) from public;

grant execute on function public.generate_friend_code() to authenticated;
grant execute on function public.search_friend_profiles(text) to authenticated;
