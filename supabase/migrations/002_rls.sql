alter table public.profiles enable row level security;
alter table public.profile_private_metrics enable row level security;
alter table public.workout_records enable row level security;
alter table public.body_logs enable row level security;
alter table public.training_plans enable row level security;
alter table public.food_logs enable row level security;
alter table public.review_posts enable row level security;
alter table public.friend_requests enable row level security;
alter table public.friendships enable row level security;
alter table public.playlist_links enable row level security;

drop policy if exists "profiles_select_visible" on public.profiles;
create policy "profiles_select_visible"
  on public.profiles for select
  using (auth.uid() is not null and (id = auth.uid() or searchable = true));

drop policy if exists "profiles_insert_self" on public.profiles;
create policy "profiles_insert_self"
  on public.profiles for insert
  with check (id = auth.uid());

drop policy if exists "profiles_update_self" on public.profiles;
create policy "profiles_update_self"
  on public.profiles for update
  using (id = auth.uid())
  with check (id = auth.uid());

drop policy if exists "profile_private_metrics_self" on public.profile_private_metrics;
create policy "profile_private_metrics_self"
  on public.profile_private_metrics for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists "workout_records_self" on public.workout_records;
create policy "workout_records_self"
  on public.workout_records for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists "body_logs_self" on public.body_logs;
create policy "body_logs_self"
  on public.body_logs for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists "training_plans_self" on public.training_plans;
create policy "training_plans_self"
  on public.training_plans for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists "food_logs_self" on public.food_logs;
create policy "food_logs_self"
  on public.food_logs for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists "review_posts_owner_write" on public.review_posts;
create policy "review_posts_owner_write"
  on public.review_posts for all
  using (author_id = auth.uid())
  with check (author_id = auth.uid());

drop policy if exists "review_posts_read_visible" on public.review_posts;
create policy "review_posts_read_visible"
  on public.review_posts for select
  using (
    auth.uid() is not null
    and (
      author_id = auth.uid()
      or visibility = 'public'
      or (
        visibility = 'friends'
        and exists (
          select 1 from public.friendships f
          where f.user_id = auth.uid()
            and f.friend_id = review_posts.author_id
        )
      )
    )
  );

drop policy if exists "friend_requests_participants" on public.friend_requests;
create policy "friend_requests_participants"
  on public.friend_requests for select
  using (requester_id = auth.uid() or addressee_id = auth.uid());

drop policy if exists "friend_requests_insert_self" on public.friend_requests;
create policy "friend_requests_insert_self"
  on public.friend_requests for insert
  with check (
    requester_id = auth.uid()
    and requester_id <> addressee_id
    and status = 'pending'
  );

drop policy if exists "friend_requests_update_addressee" on public.friend_requests;

drop policy if exists "friendships_read_self" on public.friendships;
create policy "friendships_read_self"
  on public.friendships for select
  using (user_id = auth.uid() or friend_id = auth.uid());

drop policy if exists "playlist_links_self" on public.playlist_links;
create policy "playlist_links_self"
  on public.playlist_links for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

revoke all on table public.profiles from anon, authenticated;
grant select (id, display_name, avatar_url, searchable, created_at, updated_at)
  on public.profiles to authenticated;
grant insert (id, display_name, avatar_url, searchable)
  on public.profiles to authenticated;
grant update (display_name, avatar_url, searchable, updated_at)
  on public.profiles to authenticated;

revoke all on table public.profile_private_metrics from anon;
grant all on table public.profile_private_metrics to authenticated;
