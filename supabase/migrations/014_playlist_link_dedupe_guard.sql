create index if not exists playlist_links_user_url_lookup_idx
  on public.playlist_links(user_id, lower(btrim(url)));

do $$
begin
  if not exists (
    select 1
    from (
      select user_id, lower(btrim(url)) as url_key, count(*) as link_count
      from public.playlist_links
      group by user_id, lower(btrim(url))
      having count(*) > 1
    ) duplicates
  ) then
    execute 'create unique index if not exists playlist_links_user_url_unique_idx on public.playlist_links(user_id, lower(btrim(url)))';
  end if;
end;
$$;
