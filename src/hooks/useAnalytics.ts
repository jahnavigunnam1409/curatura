import { supabase } from "@/lib/supabase";

export type AnalyticsEvent =
  | "artwork_selected"
  | "artwork_deselected"
  | "frame_remixed"
  | "curation_saved"
  | "curation_viewed"
  | "wall_rearranged"
  | "narrative_viewed"
  | "frame_count_chosen";

interface TrackOptions {
  userId?: string;
  artworkId?: string;
  curationId?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Fire-and-forget analytics tracking.
 * Uses an untyped cast to bypass Supabase generated-type quirks on interaction_logs.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const rawDb = supabase as any;

export function track(event: AnalyticsEvent, options: TrackOptions = {}) {
  rawDb
    .from("interaction_logs")
    .insert({
      event_type: event,
      user_id: options.userId ?? null,
      artwork_id: options.artworkId ?? null,
      curation_id: options.curationId ?? null,
      metadata: options.metadata ?? null,
    })
    .then(({ error }: { error: { message: string } | null }) => {
      if (error) console.warn("[analytics]", error.message);
    });
}

// ── React hook version ────────────────────────────────────────
import { useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";

export function useAnalytics() {
  const { user } = useAuth();

  const trackEvent = useCallback(
    (event: AnalyticsEvent, options: Omit<TrackOptions, "userId"> = {}) => {
      track(event, { ...options, userId: user?.id });
    },
    [user?.id]
  );

  return { trackEvent };
}
