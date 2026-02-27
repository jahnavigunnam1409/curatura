import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Artwork } from "@/types/database";
import { artworks as mockArtworks } from "@/data/mockData";

const isSupabaseConfigured =
  !!import.meta.env.VITE_SUPABASE_URL &&
  import.meta.env.VITE_SUPABASE_URL !== "https://your-project-id.supabase.co";

// ── Fetch all artworks ────────────────────────────────────────
// Artworks are local image assets — always served from mockData.
export function useArtworks() {
  return useQuery<Artwork[]>({
    queryKey: ["artworks"],
    queryFn: async () => mockArtworks as unknown as Artwork[],
    staleTime: Infinity,
  });
}

// ── Fetch a single artwork ────────────────────────────────────
export function useArtwork(id: string) {
  return useQuery<Artwork>({
    queryKey: ["artworks", id],
    queryFn: async () => {
      const found = mockArtworks.find((a) => a.id === id);
      if (!found) throw new Error("Artwork not found");
      return found as unknown as Artwork;
    },
    enabled: !!id,
    staleTime: Infinity,
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
    queryFn: async () =>
      [...(mockArtworks as unknown as Artwork[])].slice(0, limit),
    staleTime: Infinity,
  });
}
