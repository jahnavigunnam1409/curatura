-- ============================================================
-- Global aggregate stats RPC — bypasses per-user RLS so the
-- Statistics page shows combined data from ALL visitors.
-- Run this in: Supabase Dashboard → SQL Editor → New query
-- ============================================================

create or replace function get_global_interaction_stats()
returns json
language plpgsql
security definer          -- runs as DB owner, not the calling user
set search_path = public  -- hardened: prevent search_path injection
as $$
declare
  result json;
begin
  select json_build_object(

    -- Total event count across all users
    'totalEvents',
      (select count(*)::int from interaction_logs),

    -- Number of distinct authenticated users who have interacted
    'uniqueUsers',
      (select count(distinct user_id)::int
       from interaction_logs
       where user_id is not null),

    -- Event-type distribution (all users)
    'eventsByType',
      (select coalesce(json_agg(row_to_json(t)), '[]'::json)
       from (
         select event_type as name, count(*)::int as value
         from interaction_logs
         group by event_type
         order by count(*) desc
       ) t),

    -- Top 12 most-selected artworks (all users)
    'artworkSelections',
      (select coalesce(json_agg(row_to_json(t)), '[]'::json)
       from (
         select artwork_id as id, count(*)::int as selections
         from interaction_logs
         where event_type = 'artwork_selected'
           and artwork_id is not null
         group by artwork_id
         order by count(*) desc
         limit 12
       ) t),

    -- Deselection counts per artwork (all users, for retention calc)
    'artworkDeselections',
      (select coalesce(json_agg(row_to_json(t)), '[]'::json)
       from (
         select artwork_id as id, count(*)::int as deselections
         from interaction_logs
         where event_type = 'artwork_deselected'
           and artwork_id is not null
         group by artwork_id
       ) t),

    -- Frame-count preferences (all users)
    'frameCountPrefs',
      (select coalesce(json_agg(row_to_json(t)), '[]'::json)
       from (
         select
           (metadata->>'frameCount') as frame_count,
           count(*)::int as value
         from interaction_logs
         where event_type = 'frame_count_chosen'
           and metadata is not null
           and metadata->>'frameCount' is not null
         group by metadata->>'frameCount'
         order by (metadata->>'frameCount')::int
       ) t),

    -- Most rearranged frames (all users)
    'mostMovedFrames',
      (select coalesce(json_agg(row_to_json(t)), '[]'::json)
       from (
         select
           (metadata->>'movedFrame') as frame,
           count(*)::int as moves
         from interaction_logs
         where event_type = 'wall_rearranged'
           and metadata is not null
           and metadata->>'movedFrame' is not null
         group by metadata->>'movedFrame'
         order by count(*) desc
         limit 8
       ) t),

    -- Daily activity over the last 14 days (all users)
    'activityByDay',
      (select coalesce(json_agg(row_to_json(t) order by t.day), '[]'::json)
       from (
         select
           to_char(created_at::date, 'MM-DD') as day,
           count(*)::int as events
         from interaction_logs
         where created_at >= now() - interval '14 days'
         group by created_at::date
         order by created_at::date
       ) t),

    -- Funnel counts (all users)
    'funnel',
      json_build_object(
        'viewed',    (select count(*)::int from interaction_logs where event_type = 'curation_viewed'),
        'selected',  (select count(*)::int from interaction_logs where event_type = 'artwork_selected'),
        'narrative', (select count(*)::int from interaction_logs where event_type = 'narrative_viewed'),
        'saved',     (select count(*)::int from interaction_logs where event_type = 'curation_saved')
      ),

    -- Frame remixes (all users)
    'frameRemixes',
      (select count(*)::int from interaction_logs where event_type = 'frame_remixed'),

    -- Total curations saved across all users (bypasses per-user RLS)
    'totalCurations',
      (select count(*)::int from curations)

  ) into result;

  return result;
end;
$$;

-- Allow any authenticated (or anon) caller to invoke this function
grant execute on function get_global_interaction_stats() to anon, authenticated;
