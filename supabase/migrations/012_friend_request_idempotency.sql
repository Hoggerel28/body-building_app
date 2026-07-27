create or replace function public.send_friend_request(target_user_id uuid)
returns text
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  requester uuid := auth.uid();
  existing_request_id uuid;
begin
  if requester is null then
    raise exception 'authentication required' using errcode = '42501';
  end if;

  if target_user_id is null or target_user_id = requester then
    raise exception 'invalid addressee';
  end if;

  perform 1
  from auth.users u
  where u.id = target_user_id;

  if not found then
    raise exception 'user not found';
  end if;

  if exists (
    select 1
    from public.friendships f
    where f.user_id = requester
      and f.friend_id = target_user_id
  ) or exists (
    select 1
    from public.friend_requests fr
    where (
      (
        fr.requester_id = requester
        and fr.addressee_id = target_user_id
      )
      or (
        fr.requester_id = target_user_id
        and fr.addressee_id = requester
      )
    )
    and fr.status = 'accepted'
  ) then
    return 'already_friends';
  end if;

  select fr.id
  into existing_request_id
  from public.friend_requests fr
  where fr.requester_id = target_user_id
    and fr.addressee_id = requester
    and fr.status = 'pending'
  for update;

  if existing_request_id is not null then
    update public.friend_requests
    set status = 'accepted'
    where id = existing_request_id;

    insert into public.friendships(user_id, friend_id)
    values
      (requester, target_user_id),
      (target_user_id, requester)
    on conflict do nothing;

    delete from public.friend_requests
    where requester_id = requester
      and addressee_id = target_user_id
      and status = 'pending';

    return 'accepted';
  end if;

  insert into public.friend_requests(requester_id, addressee_id, status)
  values (requester, target_user_id, 'pending')
  on conflict (requester_id, addressee_id) do update
    set status = 'pending'
  where public.friend_requests.status <> 'accepted';

  return 'pending';
end;
$$;

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

  delete from public.friend_requests
  where requester_id = addressee
    and addressee_id = requester
    and status = 'pending';
end;
$$;

revoke all on function public.send_friend_request(uuid) from public;
grant execute on function public.send_friend_request(uuid) to authenticated;

revoke all on function public.accept_friend_request(uuid) from public;
grant execute on function public.accept_friend_request(uuid) to authenticated;
