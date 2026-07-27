create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '',
  avatar_url text,
  searchable boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles
  alter column searchable set default false;

update public.profiles
set searchable = false
where searchable = true;

create table if not exists public.profile_private_metrics (
  user_id uuid primary key references auth.users(id) on delete cascade default auth.uid(),
  goal text not null default '减脂' check (goal in ('减脂', '增肌')),
  gender text not null default '男' check (gender in ('男', '女')),
  height numeric,
  weight numeric,
  target_weight numeric,
  body_fat numeric,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'profiles'
      and column_name = 'goal'
  ) then
    execute $copy_existing_profile_metrics$
      insert into public.profile_private_metrics(
        user_id,
        goal,
        gender,
        height,
        weight,
        target_weight,
        body_fat,
        created_at,
        updated_at
      )
      select
        id,
        coalesce(goal, '减脂'),
        coalesce(gender, '男'),
        height,
        weight,
        target_weight,
        body_fat,
        now(),
        now()
      from public.profiles
      on conflict (user_id) do update
      set goal = excluded.goal,
          gender = excluded.gender,
          height = excluded.height,
          weight = excluded.weight,
          target_weight = excluded.target_weight,
          body_fat = excluded.body_fat,
          updated_at = now()
    $copy_existing_profile_metrics$;
  end if;
end;
$$;

create table if not exists public.workout_records (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  trained_on date not null,
  part text not null,
  parts text[] not null default '{}',
  action text not null,
  weight numeric not null default 0,
  reps integer not null default 0,
  sets integer not null default 0,
  note text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.body_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  logged_on date not null,
  weight numeric not null default 0,
  body_fat numeric not null default 0,
  created_at timestamptz not null default now(),
  unique(user_id, logged_on)
);

create table if not exists public.training_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  weekday text not null,
  title text not null,
  detail text not null default '',
  goal text not null default '减脂' check (goal in ('减脂', '增肌')),
  created_at timestamptz not null default now()
);

create table if not exists public.food_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  eaten_on date not null,
  name text not null,
  kcal integer not null default 0,
  protein integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.review_posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  trained_on date not null,
  title text not null,
  body text not null,
  mood text not null default '一般',
  visibility text not null default 'private' check (visibility in ('private', 'friends', 'public')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.friend_requests (
  id uuid primary key default gen_random_uuid(),
  requester_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  addressee_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'rejected')),
  created_at timestamptz not null default now(),
  unique(requester_id, addressee_id)
);

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'friend_requests_distinct_users'
      and conrelid = 'public.friend_requests'::regclass
  ) then
    alter table public.friend_requests
      add constraint friend_requests_distinct_users
      check (requester_id <> addressee_id);
  end if;
end;
$$;

create table if not exists public.friendships (
  user_id uuid not null references auth.users(id) on delete cascade,
  friend_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key(user_id, friend_id),
  check (user_id <> friend_id)
);

create table if not exists public.playlist_links (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  platform text not null,
  name text not null,
  url text not null,
  created_at timestamptz not null default now()
);

create index if not exists workout_records_user_date_idx on public.workout_records(user_id, trained_on desc);
create index if not exists review_posts_author_date_idx on public.review_posts(author_id, trained_on desc);
create index if not exists friendships_friend_idx on public.friendships(friend_id, user_id);
