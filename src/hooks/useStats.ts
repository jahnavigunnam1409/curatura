import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { artworks as mockArtworks } from "@/data/mockData";

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
      const { data, error } = await supabase
        .from("interaction_logs")
        .select("event_type, artwork_id, curation_id, created_at")
        .order("created_at", { ascending: false })
        .limit(2000);

      if (error) throw error;
      const logs = (data ?? []) as {
        event_type: string;
        artwork_id: string | null;
        curation_id: string | null;
        created_at: string;
      }[];

      // Event type distribution
      const eventCounts: Record<string, number> = {};
      for (const log of logs) {
        const label = log.event_type.replace(/_/g, " ");
        eventCounts[label] = (eventCounts[label] ?? 0) + 1;
      }

      // Top 10 selected artworks
      const artworkSel: Record<string, number> = {};
      for (const log of logs) {
        if (log.event_type === "artwork_selected" && log.artwork_id) {
          artworkSel[log.artwork_id] = (artworkSel[log.artwork_id] ?? 0) + 1;
        }
      }
      const topArtworks = Object.entries(artworkSel)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([id, selections]) => {
          const art = mockArtworks.find((a) => a.id === id);
          return { id, title: art?.title ?? id, selections };
        });

      // Activity over last 14 days
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
        date: date.slice(5), // MM-DD
        events,
      }));

      return {
        totalEvents: logs.length,
        events: Object.entries(eventCounts)
          .sort((a, b) => b[1] - a[1])
          .map(([name, value]) => ({ name, value })),
        topArtworks,
        activityByDay,
      };
    },
    staleTime: 1000 * 60 * 2,
  });
}

// ── Total curations saved ─────────────────────────────────────
export function useCurationCount() {
  return useQuery({
    queryKey: ["stats", "curations"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("curations")
        .select("id", { count: "exact", head: true });
      if (error) throw error;
      return count ?? 0;
    },
    staleTime: 1000 * 60 * 2,
  });
}
