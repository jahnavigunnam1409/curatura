import { motion } from "framer-motion";
import { BookMarked, Plus, Loader2, Trash2, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useUserCurations } from "@/hooks/useCurations";
import { useAuth } from "@/hooks/useAuth";
import { getArtworkById } from "@/data/mockData";

export default function MyCurations() {
  const { user, signInWithGoogle } = useAuth();
  const { data: curations, isLoading } = useUserCurations();
  const [expanded, setExpanded] = useState<string | null>(null);

  // ── Not signed in ──────────────────────────────────────────
  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background pt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-sm text-center"
        >
          <BookMarked className="mx-auto mb-4 h-12 w-12 text-primary/60" />
          <h2 className="mb-2 font-display text-2xl font-medium text-foreground">
            Your Curations
          </h2>
          <p className="mb-6 font-body text-sm text-muted-foreground">
            Sign in to see and manage your saved curations.
          </p>
          <button
            onClick={signInWithGoogle}
            className="inline-flex items-center gap-2 rounded-sm bg-primary px-6 py-2.5 font-body text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Sign in with Google
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-20 pb-16">
      <div className="mx-auto max-w-7xl px-6">

        {/* ── Page header ── */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 flex items-center justify-between"
        >
          <div>
            <h1 className="font-display text-4xl font-semibold tracking-wide gold-gradient-text">
              My Curations
            </h1>
            <p className="mt-2 font-body text-sm text-muted-foreground">
              All the gallery walls you've assembled and saved.
            </p>
          </div>
          <Link
            to="/create"
            className="flex items-center gap-2 rounded-sm bg-primary px-5 py-2.5 font-body text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            New Curation
          </Link>
        </motion.div>

        {/* ── Loading ── */}
        {isLoading && (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {/* ── Empty state ── */}
        {!isLoading && (!curations || curations.length === 0) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex h-64 flex-col items-center justify-center gap-4 rounded-sm border border-dashed border-border/60 bg-card/30"
          >
            <BookMarked className="h-10 w-10 text-muted-foreground/40" />
            <p className="font-body text-sm text-muted-foreground">
              No curations saved yet. Head to{" "}
              <Link to="/create" className="text-primary underline-offset-2 hover:underline">
                Create
              </Link>{" "}
              to build your first gallery wall.
            </p>
          </motion.div>
        )}

        {/* ── Curations grid ── */}
        {!isLoading && curations && curations.length > 0 && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {curations.map((curation, idx) => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const allArtworkIds = curation.frames?.flatMap((f: any) => f.artworkIds ?? []) ?? [];
              const previewArtworks = allArtworkIds.slice(0, 4).map((id: string) => getArtworkById(id)).filter(Boolean);
              const isOpen = expanded === curation.id;

              return (
                <motion.div
                  key={curation.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.06 }}
                  className="rounded-sm border border-border/50 bg-card shadow-card-deep"
                >
                  {/* Artwork preview strip */}
                  <div className="grid grid-cols-4 gap-0.5 overflow-hidden rounded-t-sm">
                    {[0, 1, 2, 3].map((i) => {
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      const art = previewArtworks[i] as any;
                      return (
                        <div key={i} className="aspect-square overflow-hidden bg-muted/30">
                          {art?.imageUrl ? (
                            <img
                              src={art.imageUrl}
                              alt={art.title}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full" />
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Info */}
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-display text-lg font-medium text-card-foreground">
                          {curation.title}
                        </h3>
                        <p className="mt-0.5 font-body text-xs text-muted-foreground">
                          {curation.frames?.length ?? 0} frames · {allArtworkIds.length} artworks
                          {" · "}
                          {new Date(curation.created_at).toLocaleDateString("en-GB", {
                            day: "numeric", month: "short", year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>

                    {/* Expand toggle */}
                    <button
                      onClick={() => setExpanded(isOpen ? null : curation.id)}
                      className="mt-4 flex items-center gap-1.5 font-body text-xs text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      {isOpen ? "Hide frames" : "View frames"}
                    </button>

                    {/* Frame breakdown */}
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 space-y-3"
                      >
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                        {curation.frames?.map((frame: any, fi: number) => {
                          const frameArts = (frame.artworkIds ?? [])
                            .map((id: string) => getArtworkById(id))
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            .filter(Boolean) as any[];
                          return (
                            <div
                              key={frame.id ?? fi}
                              className="rounded-sm border border-border/40 bg-background/50 p-3"
                            >
                              <p className="mb-2 font-body text-xs font-medium text-muted-foreground">
                                {frame.title ?? `Frame ${fi + 1}`}
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {frameArts.map((art) => (
                                  <div
                                    key={art.id}
                                    className="group relative h-14 w-14 overflow-hidden rounded-sm border border-border/30"
                                    title={art.title}
                                  >
                                    {art.imageUrl ? (
                                      <img
                                        src={art.imageUrl}
                                        alt={art.title}
                                        className="h-full w-full object-cover"
                                      />
                                    ) : (
                                      <div className="flex h-full w-full items-center justify-center bg-muted/30 p-1 text-[9px] text-muted-foreground">
                                        {art.title}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
