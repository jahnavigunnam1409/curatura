import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Artwork } from "@/types/database";
import { artworks as mockArtworks } from "@/data/mockData";

const isSupabaseConfigured =
  !!import.meta.env.VITE_SUPABASE_URL &&
  import.meta.env.VITE_SUPABASE_URL !== "https://your-project-id.supabase.co";

// ── Fetch all artworks ────────────────────────────────────────
export function useArtworks() {
  return useQuery<Artwork[]>({
    queryKey: ["artworks"],
    queryFn: async () => {
      if (!isSupabaseConfigured) {
        // Fall back to mock data until Supabase is configured
        return mockArtworks as unknown as Artwork[];
      }
      const { data, error } = await supabase
        .from("artworks")
        .select("*")
        .order("title");
      if (error) throw error;
      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 min
  });
}

// ── Fetch a single artwork ────────────────────────────────────
export function useArtwork(id: string) {
  return useQuery<Artwork>({
    queryKey: ["artworks", id],
    queryFn: async () => {
      if (!isSupabaseConfigured) {
        const found = mockArtworks.find((a) => a.id === id);
        if (!found) throw new Error("Artwork not found");
        return found as unknown as Artwork;
      }
      const { data, error } = await supabase
        .from("artworks")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
}

// ── Track artwork selection (increments counter) ─────────────
export function useTrackArtworkSelection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (artworkId: string) => {
      if (!isSupabaseConfigured) return;
      const { error } = await supabase.rpc("increment_artwork_selection", {
        artwork_id_param: artworkId,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["artworks"] });
    },
  });
}

// ── Fetch most popular artworks (by selection_count) ─────────
export function usePopularArtworks(limit = 5) {
  return useQuery<Artwork[]>({
    queryKey: ["artworks", "popular", limit],
    queryFn: async () => {
      if (!isSupabaseConfigured) {
        return [...(mockArtworks as unknown as Artwork[])].slice(0, limit);
      }
      const { data, error } = await supabase
        .from("artworks")
        .select("*")
        .order("selection_count", { ascending: false })
        .limit(limit);
      if (error) throw error;
      return data;
    },
  });
}
