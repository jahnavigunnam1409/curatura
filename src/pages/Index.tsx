import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero-gallery.jpg";

const Index = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Hero Background */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Gallery interior with warm golden lighting"
          className="h-full w-full object-cover opacity-40"
        />
        <div className="gallery-gradient absolute inset-0" />
        <div className="absolute inset-0 bg-background/30" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-3xl text-center"
        >
          <h1 className="mb-2 font-display text-6xl font-light tracking-tight text-foreground md:text-8xl">
            Curatura
          </h1>
          <p className="mb-4 font-display text-lg font-light italic text-primary md:text-xl">
            Curation as a creative act
          </p>
          <p className="mx-auto mb-12 max-w-lg font-body text-sm leading-relaxed text-muted-foreground">
            Select, arrange, and reimagine artworks. Build visual narratives through the art of
            curation — or remix what others have created.
          </p>
        </motion.div>

        {/* Two Paths */}
        <div className="flex w-full max-w-2xl flex-col gap-4 sm:flex-row sm:gap-6">
          <PathCard
            to="/play"
            title="Explore Curations"
            description="Remix and rearrange pre-curated frames on a gallery wall"
            delay={0.3}
          />
          <PathCard
            to="/create"
            title="Create Your Own"
            description="Select artworks, build frames, and compose your narrative"
            delay={0.45}
          />
        </div>
      </div>
    </div>
  );
};

interface PathCardProps {
  to: string;
  title: string;
  description: string;
  delay: number;
}

const PathCard = ({ to, title, description, delay }: PathCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay, ease: "easeOut" }}
    className="flex-1"
  >
    <Link to={to} className="group block">
      <div className="relative overflow-hidden rounded-sm border border-border/50 bg-card/80 p-6 backdrop-blur-sm transition-all duration-300 hover:border-primary/40 hover:bg-card">
        <h2 className="mb-2 font-display text-2xl font-medium text-foreground transition-colors group-hover:text-primary">
          {title}
        </h2>
        <p className="mb-4 font-body text-sm text-muted-foreground">{description}</p>
        <div className="flex items-center gap-1 text-sm text-primary opacity-0 transition-all duration-300 group-hover:opacity-100">
          <span className="font-body">Enter</span>
          <ArrowRight className="h-4 w-4" />
        </div>
        <div
          className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{ boxShadow: "inset 0 0 60px hsl(38 50% 58% / 0.06)" }}
        />
      </div>
    </Link>
  </motion.div>
);

export default Index;
