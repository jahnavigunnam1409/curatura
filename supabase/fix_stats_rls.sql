-- ============================================================
-- Curatura — Fix Stats RLS: expose aggregate data to all users
-- Run this in Supabase SQL Editor
-- ============================================================

-- ── interaction_logs: replace per-user SELECT with global read ──
drop policy if exists "Users can view their own logs" on interaction_logs;

create policy "Authenticated users can view all logs for stats"
  on interaction_logs for select
  using (auth.role() = 'authenticated');


-- ── curations: add global count for stats ─────────────────────
-- (existing policy only shows own + public curations;
--  this function lets us count ALL curations safely)
create or replace function get_total_curation_count()
returns bigint
language sql
security definer   -- bypasses RLS; safe because no row data is exposed
as $$
  select count(*)::bigint from curations;
$$;

-- Allow all authenticated users to call this function
grant execute on function get_total_curation_count() to authenticated;
grant execute on function get_total_curation_count() to anon;
