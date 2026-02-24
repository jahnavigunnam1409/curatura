import { motion } from "framer-motion";
import type { Artwork } from "@/data/mockData";

interface ArtworkThumbnailProps {
  artwork: Artwork;
  selected?: boolean;
  onClick?: () => void;
  size?: "sm" | "md" | "lg";
  showInfo?: boolean;
  draggable?: boolean;
}

const sizeClasses = {
  sm: "h-24 w-20",
  md: "h-40 w-32",
  lg: "h-56 w-44",
};

const ArtworkThumbnail = ({
  artwork,
  selected = false,
  onClick,
  size = "md",
  showInfo = true,
  draggable = false,
}: ArtworkThumbnailProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      onClick={onClick}
      className={`group relative flex flex-col gap-2 ${onClick ? "cursor-pointer" : ""}`}
    >
      <div
        className={`${sizeClasses[size]} relative overflow-hidden rounded-sm shadow-frame transition-all duration-300 ${
          selected
            ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
            : "ring-1 ring-border/40"
        }`}
        style={{ background: artwork.color }}
      >
        {/* Artwork title overlay */}
        <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100">
          <span className="font-display text-xs text-foreground">{artwork.title}</span>
        </div>

        {/* Selection check */}
        {selected && (
          <div className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary">
            <svg className="h-3 w-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
      </div>

      {showInfo && (
        <div className="space-y-0.5">
          <p className="font-display text-sm font-medium text-card-foreground leading-tight">
            {artwork.title}
          </p>
          <p className="font-body text-xs text-muted-foreground">
            {artwork.artist}, {artwork.year}
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default ArtworkThumbnail;
