import { supabase } from "@/lib/supabase";

export type AnalyticsEvent =
  | "artwork_selected"
  | "artwork_deselected"
  | "frame_remixed"
  | "curation_saved"
  | "curation_viewed"
  | "wall_rearranged"
  | "narrative_viewed";

interface TrackOptions {
  userId?: string;
  artworkId?: string;
  curationId?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Fire-and-forget analytics tracking.
 * Safe to call without awaiting — errors are silently ignored.
 */
export function track(event: AnalyticsEvent, options: TrackOptions = {}) {
  supabase
    .from("interaction_logs")
    .insert({
      event_type: event,
      user_id: options.userId ?? null,
      artwork_id: options.artworkId ?? null,
      curation_id: options.curationId ?? null,
      metadata: options.metadata ?? null,
    })
    .then(({ error }) => {
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
