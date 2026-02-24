import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { ArrowLeft, X } from "lucide-react";
import { Link } from "react-router-dom";
import { curatedWalls, getArtworkById, generateNarrative } from "@/data/mockData";
import type { Frame } from "@/data/mockData";
import FrameCard from "@/components/FrameCard";
import ArtworkThumbnail from "@/components/ArtworkThumbnail";
import NarrativePanel from "@/components/NarrativePanel";
import SortableArtwork from "@/components/SortableArtwork";

const PlayCurated = () => {
  const wall = curatedWalls[0];
  const [frames, setFrames] = useState<Frame[]>(wall.frames);
  const [selectedFrame, setSelectedFrame] = useState<Frame | null>(null);
  const [editingArtworks, setEditingArtworks] = useState<string[]>([]);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const handleFrameDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setFrames((prev) => {
        const oldIdx = prev.findIndex((f) => f.id === active.id);
        const newIdx = prev.findIndex((f) => f.id === over.id);
        return arrayMove(prev, oldIdx, newIdx);
      });
    }
  };

  const handleArtworkDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setEditingArtworks((prev) => {
        const oldIdx = prev.indexOf(active.id as string);
        const newIdx = prev.indexOf(over.id as string);
        return arrayMove(prev, oldIdx, newIdx);
      });
    }
  };

  const openFrame = (frame: Frame) => {
    setSelectedFrame(frame);
    setEditingArtworks([...frame.artworkIds]);
  };

  const saveFrame = () => {
    if (!selectedFrame) return;
    setFrames((prev) =>
      prev.map((f) =>
        f.id === selectedFrame.id ? { ...f, artworkIds: editingArtworks } : f
      )
    );
    setSelectedFrame(null);
  };

  const allArtworkIds = frames.flatMap((f) => f.artworkIds);
  const wallNarrative = generateNarrative(allArtworkIds);

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <Link to="/" className="text-muted-foreground transition-colors hover:text-foreground">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="font-display text-3xl font-medium text-foreground">{wall.title}</h1>
            <p className="font-body text-sm text-muted-foreground">
              Curated by {wall.curator} · Drag frames to rearrange · Click to edit
            </p>
          </div>
        </div>

        {/* Wall Grid */}
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleFrameDragEnd}>
          <SortableContext items={frames.map((f) => f.id)} strategy={rectSortingStrategy}>
            <div className="mb-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {frames.map((frame) => (
                <FrameCard
                  key={frame.id}
                  id={frame.id}
                  title={frame.title}
                  artworks={frame.artworkIds.map((id) => getArtworkById(id)!).filter(Boolean)}
                  onClick={() => openFrame(frame)}
                  sortable
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        {/* Narrative */}
        <NarrativePanel narrative={wallNarrative} title="Wall Narrative" />
      </div>

      {/* Frame Editor Modal */}
      <AnimatePresence>
        {selectedFrame && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-2xl rounded-sm border border-border/60 bg-card p-8 shadow-card-deep"
            >
              <button
                onClick={() => setSelectedFrame(null)}
                className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>

              <h2 className="mb-2 font-display text-2xl font-medium text-foreground">
                {selectedFrame.title}
              </h2>
              <p className="mb-6 font-body text-sm text-muted-foreground">
                Drag artworks to reorder them within this frame
              </p>

              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleArtworkDragEnd}>
                <SortableContext items={editingArtworks} strategy={rectSortingStrategy}>
                  <div className="mb-6 flex flex-wrap gap-4">
                    {editingArtworks.map((artId) => {
                      const artwork = getArtworkById(artId);
                      if (!artwork) return null;
                      return <SortableArtwork key={artId} artwork={artwork} />;
                    })}
                  </div>
                </SortableContext>
              </DndContext>

              {/* Preview narrative */}
              <div className="mb-6 rounded-sm border border-border/30 bg-secondary/50 p-4">
                <p className="font-body text-xs italic text-muted-foreground">
                  "{generateNarrative(editingArtworks)}"
                </p>
              </div>

              <button
                onClick={saveFrame}
                className="rounded-sm bg-primary px-6 py-2.5 font-body text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Save Changes
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PlayCurated;
