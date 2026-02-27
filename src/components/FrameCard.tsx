import { motion } from "framer-motion";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Artwork } from "@/data/mockData";

interface FrameCardProps {
  id: string;
  title: string;
  artworks: Artwork[];
  onClick?: () => void;
  sortable?: boolean;
}

const FrameCard = ({ id, title, artworks, onClick, sortable = false }: FrameCardProps) => {
  const sortableProps = sortable
    ? useSortable({ id })
    : { attributes: {}, listeners: {}, setNodeRef: undefined, transform: null, transition: undefined, isDragging: false };

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = sortableProps;

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...(sortable ? listeners : {})}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4 }}
      onClick={onClick}
      className={`group relative overflow-hidden rounded-sm border border-border/60 bg-card p-4 shadow-card-deep transition-all duration-300 hover:border-primary/30 ${
        onClick ? "cursor-pointer" : ""
      } ${sortable ? "cursor-grab active:cursor-grabbing" : ""}`}
    >
      {/* Frame title */}
      <h3 className="mb-3 font-display text-lg font-medium text-card-foreground">{title}</h3>

      {/* Artwork grid inside frame */}
      <div className="flex gap-2">
        {artworks.map((artwork) => (
          <div
            key={artwork.id}
            className="relative h-20 flex-1 overflow-hidden rounded-sm shadow-frame"
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
        ))}
      </div>

      {/* Hover glow */}
      <div className="absolute inset-0 rounded-sm opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ boxShadow: "inset 0 0 30px hsl(38 50% 58% / 0.05)" }}
      />
    </motion.div>
  );
};

export default FrameCard;
