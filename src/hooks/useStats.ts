import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { artworks as mockArtworks } from "@/data/mockData";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const rawDb = supabase as any;

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

// ── Live activity — from global RPC (bypasses per-user RLS) ──
export function useActivityStats() {
  return useQuery({
    queryKey: ["stats", "activity"],
    queryFn: async () => {
      const { data, error } = await rawDb.rpc("get_global_interaction_stats");
      if (error) throw error;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const g = data as any;

      // ── 1. Event type distribution ─────────────────────────
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const events = (g.eventsByType ?? []).map((e: any) => ({
        name: (e.name as string).replace(/_/g, " "),
        value: e.value as number,
      }));

      // ── 2. Top artworks: selections vs deselections ────────
      const deselMap: Record<string, number> = {};
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      for (const d of (g.artworkDeselections ?? []) as any[]) {
        deselMap[d.id] = d.deselections;
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const topArtworks = (g.artworkSelections ?? []).map((a: any) => {
        const art = mockArtworks.find((m) => m.id === a.id);
        const deselections = deselMap[a.id] ?? 0;
        const retentionPct =
          a.selections > 0
            ? Math.max(0, Math.round(((a.selections - deselections) / a.selections) * 100))
            : 100;
        return {
          id: a.id as string,
          title: art?.title ?? (a.id as string),
          theme: art?.theme ?? "unknown",
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          imageUrl: (art as any)?.imageUrl ?? null,
          selections: a.selections as number,
          deselections,
          retentionPct,
        };
      });

      // ── 3. Theme popularity from selection events ──────────
      const themeSel: Record<string, number> = {};
      for (const art of topArtworks) {
        const m = mockArtworks.find((a) => a.id === art.id);
        if (m) {
          themeSel[m.theme] = (themeSel[m.theme] ?? 0) + art.selections;
        }
      }
      const themePopularity = Object.entries(themeSel)
        .sort((a, b) => b[1] - a[1])
        .map(([theme, selections]) => ({ theme, selections }));

      // ── 4. Frame count preferences ─────────────────────────
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const frameCountChart = (g.frameCountPrefs ?? []).map((f: any) => ({
        name: `${f.frame_count} frames`,
        value: f.value as number,
      }));

      // ── 5. Most rearranged frames ──────────────────────────
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mostMovedFrames = (g.mostMovedFrames ?? []).map((f: any) => ({
        frame: f.frame as string,
        moves: f.moves as number,
      }));

      // ── 6. Activity by day (14 days) ───────────────────────
      // Fill in any missing days with 0
      const now = new Date();
      const rawByDay: Record<string, number> = {};
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      for (const d of (g.activityByDay ?? []) as any[]) {
        rawByDay[d.day as string] = d.events as number;
      }
      const activityByDay: { date: string; events: number }[] = [];
      for (let i = 13; i >= 0; i--) {
        const dt = new Date(now);
        dt.setDate(dt.getDate() - i);
        const key = dt.toISOString().slice(5, 10); // MM-DD
        activityByDay.push({ date: key, events: rawByDay[key] ?? 0 });
      }

      // ── 7. Funnel ──────────────────────────────────────────
      const funnel = g.funnel ?? {};
      const funnelSteps = [
        { name: "Viewed Wall",      value: funnel.viewed    ?? 0 },
        { name: "Selected Artwork", value: funnel.selected  ?? 0 },
        { name: "Saw Narrative",    value: funnel.narrative ?? 0 },
        { name: "Saved Curation",   value: funnel.saved     ?? 0 },
      ];

      return {
        totalEvents:     g.totalEvents    as number,
        uniqueUsers:     g.uniqueUsers    as number,
        events,
        topArtworks,
        themePopularity,
        frameCountChart,
        mostMovedFrames,
        activityByDay,
        funnelSteps,
        frameRemixes:    g.frameRemixes   as number,
        totalCurations:  g.totalCurations as number,
      };
    },
    staleTime: 1000 * 60 * 2,
  });
}

// ── Total curations saved (all users, bypasses RLS via RPC) ──
export function useCurationCount() {
  return useQuery({
    queryKey: ["stats", "curations"],
    queryFn: async () => {
      const { data, error } = await rawDb.rpc("get_global_interaction_stats");
      if (error) throw error;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return ((data as any)?.totalCurations as number) ?? 0;
    },
    staleTime: 1000 * 60 * 2,
  });
}
