import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Loader2, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { SortableContext, arrayMove, rectSortingStrategy } from "@dnd-kit/sortable";
import { frameStructures, generateNarrative } from "@/data/mockData";
import { useArtworks, useTrackArtworkSelection } from "@/hooks/useArtworks";
import { useSaveCuration } from "@/hooks/useCurations";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useAuth } from "@/hooks/useAuth";
import ArtworkThumbnail from "@/components/ArtworkThumbnail";
import NarrativePanel from "@/components/NarrativePanel";
import SortableArtwork from "@/components/SortableArtwork";

const MAX_SELECTION = 15;

type Step = "select" | "assign" | "narrative";

const CreateCuration = () => {
  const [step, setStep] = useState<Step>("select");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [frameCount, setFrameCount] = useState(3);
  const [frameAssignments, setFrameAssignments] = useState<string[][]>([]);
  const [curationTitle, setCurationTitle] = useState("");
  const [savedSuccess, setSavedSuccess] = useState(false);

  const { data: artworks = [], isLoading: artworksLoading } = useArtworks();
  const { mutateAsync: saveCuration, isPending: saving } = useSaveCuration();
  const { mutate: trackSelection } = useTrackArtworkSelection();
  const { trackEvent } = useAnalytics();
  const { user } = useAuth();

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const toggleArtwork = (id: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= MAX_SELECTION) return prev;
      trackSelection(id);
      trackEvent("artwork_selected", { artworkId: id });
      return [...prev, id];
    });
  };

  const goToAssign = () => {
    // Distribute artworks evenly across frames
    const perFrame = Math.ceil(selectedIds.length / frameCount);
    const assignments: string[][] = [];
    for (let i = 0; i < frameCount; i++) {
      assignments.push(selectedIds.slice(i * perFrame, (i + 1) * perFrame));
    }
    setFrameAssignments(assignments);
    setStep("assign");
  };

  const handleFrameArtworkDragEnd = (frameIndex: number) => (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setFrameAssignments((prev) => {
        const next = [...prev];
        const arr = [...next[frameIndex]];
        const oldIdx = arr.indexOf(active.id as string);
        const newIdx = arr.indexOf(over.id as string);
        next[frameIndex] = arrayMove(arr, oldIdx, newIdx);
        return next;
      });
    }
  };

  const fullNarrative = generateNarrative(frameAssignments.flat());

  const handleSaveCuration = async () => {
    if (!user) return;
    const title = curationTitle.trim() || `My Curation — ${new Date().toLocaleDateString()}`;
    try {
      await saveCuration({
        title,
        frames: frameAssignments.map((artIds, i) => ({
          title: `Frame ${i + 1}`,
          artworkIds: artIds,
        })),
      });
      trackEvent("curation_saved");
      setSavedSuccess(true);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <Link to="/" className="text-muted-foreground transition-colors hover:text-foreground">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="font-display text-3xl font-medium text-foreground">
              Create Your Curation
            </h1>
            <p className="font-body text-sm text-muted-foreground">
              {step === "select" && `Select up to ${MAX_SELECTION} artworks (${selectedIds.length} selected)`}
              {step === "assign" && "Arrange artworks within your frames — drag to reorder"}
              {step === "narrative" && "Your curated narrative"}
            </p>
          </div>
        </div>

        {/* Step indicator */}
        <div className="mb-8 flex items-center gap-3">
          {(["select", "assign", "narrative"] as Step[]).map((s, i) => (
            <div key={s} className="flex items-center gap-3">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full font-body text-xs font-medium transition-colors ${
                  step === s
                    ? "bg-primary text-primary-foreground"
                    : i < (["select", "assign", "narrative"] as Step[]).indexOf(step)
                    ? "bg-primary/20 text-primary"
                    : "bg-secondary text-muted-foreground"
                }`}
              >
                {i + 1}
              </div>
              {i < 2 && <div className="h-px w-8 bg-border" />}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* STEP 1: Select Artworks */}
          {step === "select" && (
            <motion.div
              key="select"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              {artworksLoading ? (
                <div className="flex h-48 items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
              <div className="mb-6 grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {artworks.map((art) => (
                  <ArtworkThumbnail
                    key={art.id}
                    artwork={art as any}
                    selected={selectedIds.includes(art.id)}
                    onClick={() => toggleArtwork(art.id)}
                    size="lg"
                  />
                ))}
              </div>
              )}

              {selectedIds.length > 0 && (
                <div className="mt-8 flex items-center justify-between">
                  {/* Frame structure picker */}
                  <div className="flex items-center gap-3">
                    <span className="font-body text-sm text-muted-foreground">Frames:</span>
                    {frameStructures.map((fs) => (
                      <button
                        key={fs.id}
                        onClick={() => setFrameCount(fs.count)}
                        className={`rounded-sm px-4 py-2 font-body text-sm transition-colors ${
                          frameCount === fs.count
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-secondary-foreground hover:bg-muted"
                        }`}
                      >
                        {fs.label}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={goToAssign}
                    className="flex items-center gap-2 rounded-sm bg-primary px-6 py-2.5 font-body text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    Continue
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {/* STEP 2: Assign to Frames */}
          {step === "assign" && (
            <motion.div
              key="assign"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {frameAssignments.map((artIds, frameIdx) => (
                  <div
                    key={frameIdx}
                    className="rounded-sm border border-border/60 bg-card p-5 shadow-card-deep"
                  >
                    <h3 className="mb-4 font-display text-lg font-medium text-card-foreground">
                      Frame {frameIdx + 1}
                    </h3>
                    <DndContext
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragEnd={handleFrameArtworkDragEnd(frameIdx)}
                    >
                      <SortableContext items={artIds} strategy={rectSortingStrategy}>
                        <div className="flex flex-wrap gap-3">
                          {artIds.map((artId) => {
                            const art = artworks.find((a) => a.id === artId);
                            if (!art) return null;
                            return <SortableArtwork key={artId} artwork={art as any} />;
                          })}
                        </div>
                      </SortableContext>
                    </DndContext>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep("select")}
                  className="rounded-sm border border-border px-6 py-2.5 font-body text-sm text-secondary-foreground transition-colors hover:bg-secondary"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep("narrative")}
                  className="flex items-center gap-2 rounded-sm bg-primary px-6 py-2.5 font-body text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Generate Narrative
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Narrative */}
          {step === "narrative" && (
            <motion.div
              key="narrative"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="max-w-3xl"
            >
              <NarrativePanel narrative={fullNarrative} title="Your Curated Narrative" />

              {/* Frame summaries */}
              <div className="mt-8 space-y-4">
                {frameAssignments.map((artIds, i) => (
                  <div key={i} className="rounded-sm border border-border/30 bg-card/50 p-4">
                    <h4 className="mb-2 font-display text-base font-medium text-card-foreground">
                      Frame {i + 1}
                    </h4>
                    <p className="font-body text-sm italic text-muted-foreground">
                      "{generateNarrative(artIds)}"
                    </p>
                  </div>
                ))}
              </div>

              {/* Title input + Save */}
              <div className="mt-8 space-y-4">
                <div className="flex items-center gap-3">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Name your curation (optional)"
                    value={curationTitle}
                    onChange={(e) => setCurationTitle(e.target.value)}
                    className="flex-1 rounded-sm border border-border/60 bg-card px-4 py-2 font-body text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/60 focus:outline-none"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep("assign")}
                    className="rounded-sm border border-border px-6 py-2.5 font-body text-sm text-secondary-foreground transition-colors hover:bg-secondary"
                  >
                    Back
                  </button>

                  {savedSuccess ? (
                    <div className="flex items-center gap-2 rounded-sm bg-accent px-6 py-2.5 font-body text-sm font-medium text-accent-foreground">
                      <Check className="h-4 w-4" />
                      Saved!
                    </div>
                  ) : user ? (
                    <button
                      onClick={handleSaveCuration}
                      disabled={saving}
                      className="flex items-center gap-2 rounded-sm bg-primary px-6 py-2.5 font-body text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
                    >
                      {saving ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Check className="h-4 w-4" />
                      )}
                      {saving ? "Saving…" : "Save Curation"}
                    </button>
                  ) : (
                    <div className="flex items-center gap-2 rounded-sm border border-border/60 bg-card/60 px-6 py-2.5 font-body text-sm text-muted-foreground">
                      Sign in to save your curation
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CreateCuration;
