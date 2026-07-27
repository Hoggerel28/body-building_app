grant select, insert on table public.friend_requests to authenticated;
grant select on table public.friendships to authenticated;
grant execute on function public.accept_friend_request(uuid) to authenticated;

drop policy if exists "profiles_select_visible" on public.profiles;
create policy "profiles_select_visible"
  on public.profiles for select
  using (
    auth.uid() is not null
    and (
      id = auth.uid()
      or searchable = true
      or exists (
        select 1 from public.friendships f
        where f.user_id = auth.uid()
          and f.friend_id = profiles.id
      )
      or exists (
        select 1 from public.friend_requests fr
        where (
          fr.requester_id = auth.uid()
          and fr.addressee_id = profiles.id
        )
        or (
          fr.addressee_id = auth.uid()
          and fr.requester_id = profiles.id
        )
      )
    )
  );
