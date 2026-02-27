import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { artworks as mockArtworks } from "@/data/mockData";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const rawDb = supabase as any;

type LogRow = {
  event_type: string;
  artwork_id: string | null;
  curation_id: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  user_id: string | null;
};

// ── Collection stats — always from local mock data ────────────
export function useCollectionStats() {
  return useQuery({
    queryKey: ["stats", "collection"],
    queryFn: () => {
      const themeCounts: Record<string, number> = {};
      const aspectCounts: Record<string, number> = {};
      const yearCounts: Record<number, number> = {};

      for (const a of mockArtworks) {
        themeCounts[a.theme] = (themeCounts[a.theme] ?? 0) + 1;
        aspectCounts[a.aspectRatio] = (aspectCounts[a.aspectRatio] ?? 0) + 1;
        yearCounts[a.year] = (yearCounts[a.year] ?? 0) + 1;
      }

      return {
        total: mockArtworks.length,
        themes: Object.entries(themeCounts).map(([name, value]) => ({ name, value })),
        aspectRatios: Object.entries(aspectCounts).map(([name, value]) => ({ name, value })),
        byYear: Object.entries(yearCounts)
          .map(([year, count]) => ({ year: Number(year), count }))
          .sort((a, b) => a.year - b.year),
      };
    },
    staleTime: Infinity,
  });
}

// ── Live activity — from Supabase interaction_logs ────────────
export function useActivityStats() {
  return useQuery({
    queryKey: ["stats", "activity"],
    queryFn: async () => {
      const { data, error } = await rawDb
        .from("interaction_logs")
        .select("event_type, artwork_id, curation_id, metadata, created_at, user_id")
        .order("created_at", { ascending: false })
        .limit(5000);

      if (error) throw error;
      const logs = (data ?? []) as LogRow[];

      // ── 1. Event type distribution ─────────────────────────
      const eventCounts: Record<string, number> = {};
      for (const log of logs) {
        const label = log.event_type.replace(/_/g, " ");
        eventCounts[label] = (eventCounts[label] ?? 0) + 1;
      }

      // ── 2. Top artworks: selections vs deselections ────────
      const artworkSel: Record<string, number> = {};
      const artworkDesel: Record<string, number> = {};
      for (const log of logs) {
        if (log.artwork_id) {
          if (log.event_type === "artwork_selected") {
            artworkSel[log.artwork_id] = (artworkSel[log.artwork_id] ?? 0) + 1;
          }
          if (log.event_type === "artwork_deselected") {
            artworkDesel[log.artwork_id] = (artworkDesel[log.artwork_id] ?? 0) + 1;
          }
        }
      }
      const topArtworks = Object.entries(artworkSel)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 12)
        .map(([id, selections]) => {
          const art = mockArtworks.find((a) => a.id === id);
          const deselections = artworkDesel[id] ?? 0;
          const retentionPct = selections > 0 ? Math.round(((selections - deselections) / selections) * 100) : 100;
          return {
            id,
            title: art?.title ?? id,
            theme: art?.theme ?? "unknown",
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          imageUrl: (art as any)?.imageUrl ?? null,
            selections,
            deselections,
            retentionPct: Math.max(0, retentionPct),
          };
        });

      // ── 3. Theme popularity from selection events ──────────
      const themeSel: Record<string, number> = {};
      for (const [id, count] of Object.entries(artworkSel)) {
        const art = mockArtworks.find((a) => a.id === id);
        if (art) {
          themeSel[art.theme] = (themeSel[art.theme] ?? 0) + count;
        }
      }
      const themePopularity = Object.entries(themeSel)
        .sort((a, b) => b[1] - a[1])
        .map(([theme, selections]) => ({ theme, selections }));

      // ── 4. Frame count preferences ─────────────────────────
      const framePref: Record<string, number> = {};
      for (const log of logs) {
        if (log.event_type === "frame_count_chosen" && log.metadata) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const fc = String((log.metadata as any).frameCount ?? "unknown");
          framePref[fc] = (framePref[fc] ?? 0) + 1;
        }
      }
      const frameCountChart = Object.entries(framePref)
        .sort((a, b) => Number(a[0]) - Number(b[0]))
        .map(([name, value]) => ({ name: `${name} frames`, value }));

      // ── 5. Most rearranged frames ──────────────────────────
      const frameMoves: Record<string, number> = {};
      for (const log of logs) {
        if (log.event_type === "wall_rearranged" && log.metadata) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const frame = String((log.metadata as any).movedFrame ?? "unknown");
          frameMoves[frame] = (frameMoves[frame] ?? 0) + 1;
        }
      }
      const mostMovedFrames = Object.entries(frameMoves)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8)
        .map(([frame, moves]) => ({ frame, moves }));

      // ── 6. Activity over last 14 days ──────────────────────
      const now = new Date();
      const bucket: Record<string, number> = {};
      for (let i = 13; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        bucket[d.toISOString().slice(0, 10)] = 0;
      }
      for (const log of logs) {
        const day = log.created_at.slice(0, 10);
        if (day in bucket) bucket[day]++;
      }
      const activityByDay = Object.entries(bucket).map(([date, events]) => ({
        date: date.slice(5),
        events,
      }));

      // ── 7. Unique users ────────────────────────────────────
      const userSet = new Set<string>();
      for (const log of logs) {
        if (log.user_id) userSet.add(log.user_id);
      }
      const uniqueUsers = userSet.size;

      // ── 8. Engagement funnel ───────────────────────────────
      const viewed = logs.filter((l) => l.event_type === "curation_viewed").length;
      const selected = logs.filter((l) => l.event_type === "artwork_selected").length;
      const narrative = logs.filter((l) => l.event_type === "narrative_viewed").length;
      const saved = logs.filter((l) => l.event_type === "curation_saved").length;
      const funnelSteps = [
        { name: "Viewed Wall", value: viewed },
        { name: "Selected Artwork", value: selected },
        { name: "Saw Narrative", value: narrative },
        { name: "Saved Curation", value: saved },
      ];

      return {
        totalEvents: logs.length,
        uniqueUsers,
        events: Object.entries(eventCounts)
          .sort((a, b) => b[1] - a[1])
          .map(([name, value]) => ({ name, value })),
        topArtworks,
        themePopularity,
        frameCountChart,
        mostMovedFrames,
        activityByDay,
        funnelSteps,
        frameRemixes: (eventCounts["frame remixed"] ?? 0),
      };
    },
    staleTime: 1000 * 60 * 2,
  });
}

// ── Total curations saved (global — all users via security-definer RPC) ───────
export function useCurationCount() {
  return useQuery({
    queryKey: ["stats", "curations"],
    queryFn: async () => {
      // Try the security-definer RPC first (returns all curations regardless of RLS)
      const { data: rpcData, error: rpcError } = await rawDb
        .rpc("get_total_curation_count");
      if (!rpcError && rpcData != null) return Number(rpcData);

      // Fallback: direct count (may be limited by RLS to current user's curations)
      const { count, error } = await rawDb
        .from("curations")
        .select("id", { count: "exact", head: true });
      if (error) throw error;
      return count ?? 0;
    },
    staleTime: 1000 * 60 * 2,
  });
}
