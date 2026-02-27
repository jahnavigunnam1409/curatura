import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, User, ChevronDown, Sun, Moon } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, loading, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/play", label: "Explore" },
    { path: "/create", label: "Create" },
    { path: "/my-curations", label: "My Curations" },
    { path: "/stats", label: "Statistics" },
  ];

  // Close dropdown on outside click — must be called unconditionally
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const displayName = profile?.display_name ?? user?.user_metadata?.full_name ?? user?.email?.split("@")[0] ?? "User";
  const avatarUrl = profile?.avatar_url ?? user?.user_metadata?.avatar_url ?? null;

  // Hide header on login page (after all hooks)
  if (location.pathname === "/login") return null;

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2">
          <span className="font-display text-2xl font-semibold tracking-wide gold-gradient-text">
            Curatura
          </span>
        </Link>

        <nav className="flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`font-body text-sm tracking-wide transition-colors duration-200 ${
                location.pathname === item.path
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Auth area */}
        <div className="flex items-center gap-3">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="flex h-8 w-8 items-center justify-center rounded-sm border border-border/50 bg-card/60 text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {loading ? (
            <div className="h-8 w-20 animate-pulse rounded-sm bg-secondary" />
          ) : user ? (
            /* Logged-in: avatar + dropdown */
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((o) => !o)}
                className="flex items-center gap-2 rounded-sm border border-border/50 bg-card/60 px-3 py-1.5 font-body text-sm text-foreground transition-colors hover:border-primary/40 hover:bg-card"
              >
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={displayName}
                    className="h-6 w-6 rounded-full object-cover"
                  />
                ) : (
                  <User className="h-4 w-4 text-primary" />
                )}
                <span className="max-w-[120px] truncate">{displayName}</span>
                <ChevronDown
                  className={`h-3 w-3 text-muted-foreground transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-48 rounded-sm border border-border/50 bg-card shadow-card-deep"
                  >
                    <div className="border-b border-border/50 px-4 py-3">
                      <p className="font-body text-xs text-muted-foreground">Signed in as</p>
                      <p className="truncate font-body text-sm font-medium text-foreground">
                        {user.email}
                      </p>
                    </div>
                    <button
                      onClick={() => { signOut(); setDropdownOpen(false); }}
                      className="flex w-full items-center gap-2 px-4 py-3 font-body text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            /* Logged-out: go to dedicated login page */
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/login")}
              className="flex items-center gap-2 rounded-sm border border-primary/40 bg-card/60 px-4 py-1.5 font-body text-sm text-foreground transition-all duration-200 hover:border-primary hover:bg-card"
            >
              <User className="h-4 w-4 text-primary" />
              Sign in
            </motion.button>
          )}
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
