import { motion } from "framer-motion";

interface NarrativePanelProps {
  narrative: string;
  title?: string;
}

const NarrativePanel = ({ narrative, title = "Your Narrative" }: NarrativePanelProps) => {
  if (!narrative) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="rounded-sm border border-border/40 bg-card p-6 shadow-card-deep"
    >
      <h3 className="mb-4 font-display text-xl font-medium text-primary">{title}</h3>
      <p className="font-body text-sm leading-relaxed text-muted-foreground italic">
        "{narrative}"
      </p>
    </motion.div>
  );
};

export default NarrativePanel;
