import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Artwork } from "@/data/mockData";

interface SortableArtworkProps {
  artwork: Artwork;
}

const SortableArtwork = ({ artwork }: SortableArtworkProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: artwork.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="cursor-grab active:cursor-grabbing"
    >
      <div className="flex flex-col gap-1.5">
        <div
          className="relative h-32 w-24 overflow-hidden rounded-sm shadow-frame"
          style={!artwork.imageUrl ? { background: artwork.color } : undefined}
        >
          {artwork.imageUrl && (
            <img
              src={artwork.imageUrl}
              alt={artwork.title}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}
        </div>
        <p className="max-w-[96px] truncate font-display text-xs text-card-foreground">
          {artwork.title}
        </p>
      </div>
    </div>
  );
};

export default SortableArtwork;
