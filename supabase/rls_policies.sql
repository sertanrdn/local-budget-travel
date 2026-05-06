-- Allow anyone (including unauthenticated visitors) to read all rows.
-- These tables contain only public travel content — no user data.

create policy "Public read" on cities    for select using (true);
create policy "Public read" on categories for select using (true);
create policy "Public read" on activities for select using (true);
