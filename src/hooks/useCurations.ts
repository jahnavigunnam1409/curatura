import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import type {
  CurationWithFrames,
  FrameWithArtworks,
} from "@/types/database";

// ── Fetch all template / public curations (the gallery walls) ─
export function useCurations() {
  return useQuery<CurationWithFrames[]>({
    queryKey: ["curations", "public"],
    queryFn: async () => {
      const { data: curations, error: cErr } = await supabase
        .from("curations")
        .select("*")
        .or("is_template.eq.true,is_public.eq.true")
        .order("created_at", { ascending: false });

      if (cErr) throw cErr;

      // For each curation, load frames + artwork IDs
      const enriched: CurationWithFrames[] = await Promise.all(
        curations.map(async (curation) => {
          const frames = await fetchFramesForCuration(curation.id);
          return { ...curation, frames };
        })
      );

      return enriched;
    },
    staleTime: 1000 * 60 * 5,
  });
}

// ── Fetch curations belonging to the current user ─────────────
export function useUserCurations() {
  const { user } = useAuth();

  return useQuery<CurationWithFrames[]>({
    queryKey: ["curations", "mine", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data: curations, error } = await supabase
        .from("curations")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      return Promise.all(
        curations.map(async (c) => ({
          ...c,
          frames: await fetchFramesForCuration(c.id),
        }))
      );
    },
    enabled: !!user,
  });
}

// ── Save a brand-new curation ──────────────────────────────────
export function useSaveCuration() {
  const queryClient = useQueryClient();
  const { user, profile } = useAuth();

  return useMutation({
    mutationFn: async ({
      title,
      frames,
    }: {
      title: string;
      frames: { title: string; artworkIds: string[] }[];
    }) => {
      if (!user) throw new Error("Must be signed in to save a curation");

      // 1. Create curation row
      const { data: curation, error: cErr } = await supabase
        .from("curations")
        .insert({
          title,
          curator_name: profile?.display_name ?? user.email ?? "Anonymous",
          user_id: user.id,
          is_public: false,
        })
        .select()
        .single();

      if (cErr) throw cErr;

      // 2. Create each frame + its artworks
      for (let fi = 0; fi < frames.length; fi++) {
        const f = frames[fi];

        const { data: frame, error: fErr } = await supabase
          .from("frames")
          .insert({
            title: f.title,
            is_template: false,
            created_by: user.id,
          })
          .select()
          .single();

        if (fErr) throw fErr;

        // 3. Insert frame_artworks
        const artworkRows = f.artworkIds.map((aid, pos) => ({
          frame_id: frame.id,
          artwork_id: aid,
          position: pos,
        }));

        const { error: faErr } = await supabase
          .from("frame_artworks")
          .insert(artworkRows);

        if (faErr) throw faErr;

        // 4. Link frame to curation
        const { error: cfErr } = await supabase
          .from("curation_frames")
          .insert({ curation_id: curation.id, frame_id: frame.id, position: fi });

        if (cfErr) throw cfErr;
      }

      return curation;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["curations"] });
    },
  });
}

// ── Save a remixed frame (from Play page) ─────────────────────
export function useSaveFrameRemix() {
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({
      originalFrameId,
      title,
      artworkIds,
    }: {
      originalFrameId: string;
      title: string;
      artworkIds: string[];
    }) => {
      if (!user) throw new Error("Must be signed in to save a remix");

      const { data: frame, error: fErr } = await supabase
        .from("frames")
        .insert({
          title,
          is_template: false,
          created_by: user.id,
          original_frame_id: originalFrameId,
        })
        .select()
        .single();

      if (fErr) throw fErr;

      const artworkRows = artworkIds.map((aid, pos) => ({
        frame_id: frame.id,
        artwork_id: aid,
        position: pos,
      }));

      const { error: faErr } = await supabase
        .from("frame_artworks")
        .insert(artworkRows);

      if (faErr) throw faErr;

      return frame;
    },
  });
}

// ── Helper: load frames + artwork IDs for a curation ──────────
async function fetchFramesForCuration(curationId: string): Promise<FrameWithArtworks[]> {
  const { data: cfRows, error: cfErr } = await supabase
    .from("curation_frames")
    .select("frame_id, position")
    .eq("curation_id", curationId)
    .order("position");

  if (cfErr) throw cfErr;

  return Promise.all(
    cfRows.map(async (cf) => {
      const { data: frame, error: fErr } = await supabase
        .from("frames")
        .select("*")
        .eq("id", cf.frame_id)
        .single();

      if (fErr) throw fErr;

      const { data: faRows, error: faErr } = await supabase
        .from("frame_artworks")
        .select("artwork_id")
        .eq("frame_id", cf.frame_id)
        .order("position");

      if (faErr) throw faErr;

      return {
        ...frame,
        artworkIds: faRows.map((r) => r.artwork_id),
      };
    })
  );
}
