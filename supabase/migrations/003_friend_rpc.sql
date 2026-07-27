create or replace function public.accept_friend_request(request_id uuid)
returns void
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  requester uuid;
  addressee uuid;
begin
  if auth.uid() is null then
    raise exception 'authentication required' using errcode = '42501';
  end if;

  select fr.requester_id, fr.addressee_id
  into requester, addressee
  from public.friend_requests as fr
  where fr.id = request_id
    and fr.addressee_id = auth.uid()
    and fr.status = 'pending'
  for update;

  if not found then
    raise exception 'friend request not found';
  end if;

  update public.friend_requests
  set status = 'accepted'
  where id = request_id
    and addressee_id = auth.uid()
    and status = 'pending';

  insert into public.friendships(user_id, friend_id)
  values
    (requester, addressee),
    (addressee, requester)
  on conflict do nothing;
end;
$$;

revoke all on function public.accept_friend_request(uuid) from public;
grant execute on function public.accept_friend_request(uuid) to authenticated;
