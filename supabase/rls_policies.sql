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
  for update using (auth.uid() = id);

  create policy "Users can insert own activities" on activities
  for insert with check (auth.uid() = submitted_by);

create policy "Users can update own activities" on activities
  for update using (auth.uid() = submitted_by);

create policy "Users can delete own activities" on activities
  for delete using (auth.uid() = submitted_by);