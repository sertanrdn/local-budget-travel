-- Allow anyone (including unauthenticated visitors) to read all rows.
-- These tables contain only public travel content — no user data.

create policy "Public read" on cities    for select using (true);
create policy "Public read" on categories for select using (true);
create policy "Public read" on activities for select using (true);

-- ============================================================
-- Profiles
-- Public to read (needed for /profile/[username] later), but a
-- user can only ever update their own row. Rows are inserted by
-- the handle_new_user trigger (security definer), which bypasses
-- RLS — so no insert policy is needed for normal users.
-- ============================================================

alter table profiles enable row level security;

create policy "Public read" on profiles
  for select using (true);

create policy "Users can update own profile" on profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

alter table activities enable row level security;

drop policy if exists "Users can insert own activities" on activities;
create policy "Users can insert own activities" on activities
  for insert with check (auth.uid() = submitted_by);

drop policy if exists "Users can update own activities" on activities;
create policy "Users can update own activities" on activities
  for update using (auth.uid() = submitted_by) with check (auth.uid() = submitted_by);

drop policy if exists "Users can delete own activities" on activities;
create policy "Users can delete own activities" on activities
  for delete using (auth.uid() = submitted_by);

-- Anyone can view avatars (bucket is public, but SELECT policy is still required for direct table access)
create policy "Public read access for avatars"
on storage.objects for select
using (bucket_id = 'avatars');

-- A user can only upload into their own folder: avatars/{their_user_id}/...
create policy "Users can upload their own avatar"
on storage.objects for insert
with check (
  bucket_id = 'avatars'
  and auth.uid()::text = (storage.foldername(name))[1]
);

-- A user can only update files in their own folder
create policy "Users can update their own avatar"
on storage.objects for update
using (
  bucket_id = 'avatars'
  and auth.uid()::text = (storage.foldername(name))[1]
)
with check (
  bucket_id = 'avatars'
  and auth.uid()::text = (storage.foldername(name))[1]
);

-- A user can only delete files in their own folder
create policy "Users can delete their own avatar"
on storage.objects for delete
using (
  bucket_id = 'avatars'
  and auth.uid()::text = (storage.foldername(name))[1]
);

-- Anyone can view activity photos (bucket is public, but SELECT policy is still required for direct table access)
create policy "Public read access for activity photos"
on storage.objects for select
using (bucket_id = 'activity-photos');

-- A user can only upload into their own folder: activity-photos/{their_user_id}/...
create policy "Users can upload their own activity photos"
on storage.objects for insert
with check (
  bucket_id = 'activity-photos'
  and auth.uid()::text = (storage.foldername(name))[1]
);

-- A user can only delete files in their own folder
create policy "Users can delete their own activity photos"
on storage.objects for delete
using (
  bucket_id = 'activity-photos'
  and auth.uid()::text = (storage.foldername(name))[1]
);