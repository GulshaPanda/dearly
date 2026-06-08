-- =============================================================
-- Dearly — Supabase schema
-- Run this in your Supabase project's SQL Editor after creating
-- a new project. It creates the two app tables, RLS policies,
-- and the storage bucket used for avatars and event covers.
-- =============================================================

-- -------------------------------------------------------------
-- events
-- One row per gifting situation (e.g., "Mom's Birthday").
-- -------------------------------------------------------------
create table public.events (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references auth.users(id) on delete cascade,
  title             text default 'New event',
  recipient_name    text,
  event_date        date,
  status            text default 'planning',
  progress          integer default 0,
  icon              text default '🎁',
  image_url         text,
  image_position_y  integer default 50,
  created_at        timestamptz default now(),
  updated_at        timestamptz default now()
);

create index idx_events_user_created
  on public.events (user_id, created_at desc);

alter table public.events enable row level security;

create policy "Users manage own events"
  on public.events for all
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);


-- -------------------------------------------------------------
-- messages
-- One row per chat message; FK to events with CASCADE delete.
-- -------------------------------------------------------------
create table public.messages (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  event_id    uuid not null references public.events(id) on delete cascade,
  role        text not null check (role in ('user', 'assistant')),
  content     text not null,
  choices     jsonb default '[]'::jsonb,
  products    jsonb default '[]'::jsonb,
  created_at  timestamptz default now()
);

create index idx_messages_event_created
  on public.messages (event_id, created_at);

create index idx_messages_user_created
  on public.messages (user_id, created_at);

alter table public.messages enable row level security;

create policy "Users manage own messages"
  on public.messages for all
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);


-- -------------------------------------------------------------
-- Storage bucket: avatars
-- Used for profile avatars and event cover images.
-- Create via the dashboard (Storage → New bucket → Public),
-- then run the RLS policy below in the SQL editor.
-- -------------------------------------------------------------
-- Bucket name: avatars      (public read)
-- Folder convention:
--   {user_id}/avatar-{timestamp}.{ext}                     -- profile
--   {user_id}/events/{event_id}/cover-{timestamp}.{ext}    -- event cover

create policy "Users upload to own folder"
  on storage.objects for insert
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users update own files"
  on storage.objects for update
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users delete own files"
  on storage.objects for delete
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Public read avatars"
  on storage.objects for select
  using (bucket_id = 'avatars');
