create or replace function public.cancel_friend_request(request_id uuid)
returns void
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
begin
  if auth.uid() is null then
    raise exception 'authentication required' using errcode = '42501';
  end if;

  delete from public.friend_requests
  where id = request_id
    and requester_id = auth.uid()
    and status = 'pending';

  if not found then
    raise exception 'friend request not found';
  end if;
end;
$$;

create or replace function public.reject_friend_request(request_id uuid)
returns void
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
begin
  if auth.uid() is null then
    raise exception 'authentication required' using errcode = '42501';
  end if;

  delete from public.friend_requests
  where id = request_id
    and addressee_id = auth.uid()
    and status = 'pending';

  if not found then
    raise exception 'friend request not found';
  end if;
end;
$$;

create or replace function public.remove_friend(friend_user_id uuid)
returns void
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
begin
  if auth.uid() is null then
    raise exception 'authentication required' using errcode = '42501';
  end if;

  if friend_user_id is null or friend_user_id = auth.uid() then
    raise exception 'invalid friend user';
  end if;

  delete from public.friendships
  where (user_id = auth.uid() and friend_id = friend_user_id)
     or (user_id = friend_user_id and friend_id = auth.uid());

  delete from public.friend_requests
  where (requester_id = auth.uid() and addressee_id = friend_user_id)
     or (requester_id = friend_user_id and addressee_id = auth.uid());
end;
$$;

revoke all on function public.cancel_friend_request(uuid) from public;
revoke all on function public.reject_friend_request(uuid) from public;
revoke all on function public.remove_friend(uuid) from public;

grant execute on function public.cancel_friend_request(uuid) to authenticated;
grant execute on function public.reject_friend_request(uuid) to authenticated;
grant execute on function public.remove_friend(uuid) to authenticated;
