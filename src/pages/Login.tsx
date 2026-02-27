import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import heroImage from "@/assets/hero-gallery.jpg";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";

export default function Login() {
  const { user, loading, signInWithGoogle } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const isLight = theme === "light";

  // Redirect if already signed in
  useEffect(() => {
    if (!loading && user) navigate("/", { replace: true });
  }, [user, loading, navigate]);

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-background">

      {/* ── Left panel: artwork backdrop ─────────────────────── */}
      <div className="relative hidden flex-1 lg:block">
        <img
          src={heroImage}
          alt="Gallery"
          className={`absolute inset-0 h-full w-full object-cover ${isLight ? "opacity-70" : "opacity-50"}`}
        />
        {/* vertical gradient fade toward center */}
        <div
          className="absolute inset-0"
          style={{
            background: isLight
              ? "linear-gradient(to right, transparent 40%, hsl(36 28% 94%) 100%)"
              : "linear-gradient(to right, transparent 40%, hsl(30 8% 7%) 100%)",
          }}
        />
        {/* bottom gradient */}
        <div className="absolute inset-0 gallery-gradient" />

        {/* Branding overlay on image */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="absolute bottom-12 left-10 max-w-xs"
        >
          <p className="font-display text-4xl font-light leading-snug text-foreground drop-shadow-sm">
            "Curation is the most personal form of art."
          </p>
          <p className="mt-3 font-body text-sm text-muted-foreground">— Curatura</p>
        </motion.div>
      </div>

      {/* ── Right panel: sign-in card ─────────────────────────── */}
      <div className="flex w-full flex-col items-center justify-center px-8 py-16 lg:w-[480px] lg:shrink-0">

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <span className="font-display text-5xl font-semibold tracking-wide gold-gradient-text">
            Curatura
          </span>
          <p className="mt-2 font-display text-base font-light italic text-primary/80">
            Curation as a creative act
          </p>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.15 }}
          className="w-full max-w-sm rounded-sm border border-border/50 bg-card p-8 shadow-card-deep"
        >
          <h2 className="mb-1 font-display text-2xl font-medium text-card-foreground">
            Welcome back
          </h2>
          <p className="mb-8 font-body text-sm text-muted-foreground">
            Sign in to access your curations, save new galleries, and explore what others have created.
          </p>

          {/* Decorative divider */}
          <div className="mb-8 flex items-center gap-3">
            <div className="h-px flex-1 bg-border/80" />
            <span className="font-body text-[10px] uppercase tracking-widest text-muted-foreground/60">
              continue with
            </span>
            <div className="h-px flex-1 bg-border/80" />
          </div>

          {/* Google button */}
          <motion.button
            whileHover={{ scale: 1.015 }}
            whileTap={{ scale: 0.985 }}
            onClick={signInWithGoogle}
            disabled={loading}
            className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-sm border border-border bg-background px-5 py-3 font-body text-sm font-medium text-foreground shadow-sm transition-all duration-200 hover:border-primary/60 hover:bg-card disabled:opacity-60"
          >
            {/* Subtle gold shimmer on hover */}
            <span
              className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{ background: "linear-gradient(135deg, hsl(38 72% 30% / 0.06) 0%, transparent 60%)" }}
            />
            <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Sign in with Google
          </motion.button>

          <p className="mt-6 text-center font-body text-xs text-muted-foreground/70">
            By signing in, you agree to the collection of interaction analytics used to improve your experience.
          </p>
        </motion.div>

        {/* Feature highlights */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-10 flex flex-col gap-3 text-center"
        >
          {[
            "Save and revisit your curated gallery walls",
            "Remix artworks across pre-built themes",
            "Track which artworks resonate most",
          ].map((text) => (
            <p key={text} className="font-body text-xs text-muted-foreground">
              <span className="mr-2 text-primary">✦</span>
              {text}
            </p>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
