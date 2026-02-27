import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
} from "recharts";
import type { LucideIcon } from "lucide-react";
import { Image, Palette, Activity, Layers } from "lucide-react";
import { useCollectionStats, useActivityStats, useCurationCount } from "@/hooks/useStats";

// ── Colour palettes ───────────────────────────────────────────
const THEME_COLORS: Record<string, string> = {
  introspection: "#818cf8",
  horizon:       "#c9a96e",
  nature:        "#4ade80",
  light:         "#fbbf24",
  void:          "#94a3b8",
  bloom:         "#f472b6",
};
const PALETTE = ["#c9a96e", "#818cf8", "#4ade80", "#f472b6", "#38bdf8", "#fb923c", "#a78bfa", "#34d399"];
const ASPECT_COLORS: Record<string, string> = {
  portrait:  "#c9a96e",
  landscape: "#818cf8",
  square:    "#4ade80",
};

// ── Shared tooltip ─────────────────────────────────────────────────
interface TooltipPayloadEntry { name?: string; value?: number; color?: string; fill?: string; }
interface DarkTooltipProps { active?: boolean; payload?: TooltipPayloadEntry[]; label?: string; }
const DarkTooltip = ({ active, payload, label }: DarkTooltipProps) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-sm border border-border/60 bg-card/95 px-3 py-2 text-xs shadow-xl backdrop-blur-sm">
      {label && <p className="mb-1 font-display text-muted-foreground">{label}</p>}
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color ?? p.fill ?? "#c9a96e" }} className="font-body">
          {p.name ? `${p.name}: ` : ""}<span className="font-semibold">{p.value}</span>
        </p>
      ))}
    </div>
  );
};

// ── Custom pie label ─────────────────────────────────────────
interface PieLabelProps { cx: number; cy: number; midAngle: number; outerRadius: number; name: string; value: number; percent: number; }
const PieLabel = ({ cx, cy, midAngle, outerRadius, name, value, percent }: PieLabelProps) => {
  if (percent < 0.05) return null;
  const rad = Math.PI / 180;
  const x = cx + (outerRadius + 22) * Math.cos(-midAngle * rad);
  const y = cy + (outerRadius + 22) * Math.sin(-midAngle * rad);
  return (
    <text x={x} y={y} textAnchor={x > cx ? "start" : "end"} dominantBaseline="central"
      className="fill-muted-foreground text-[10px] font-body">
      {name} ({value})
    </text>
  );
};

// ── Stat card ────────────────────────────────────────────────
const StatCard = ({ icon: Icon, label, value, sub, color }: {
  icon: LucideIcon; label: string; value: string | number; sub?: string; color: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
    className="flex items-center gap-4 rounded-sm border border-border/50 bg-card p-5 shadow-card-deep"
  >
    <div className="flex h-12 w-12 items-center justify-center rounded-sm" style={{ background: `${color}18` }}>
      <Icon className="h-5 w-5" style={{ color }} />
    </div>
    <div>
      <p className="font-body text-xs text-muted-foreground tracking-wide uppercase">{label}</p>
      <p className="font-display text-2xl font-semibold text-card-foreground">{value}</p>
      {sub && <p className="font-body text-xs text-muted-foreground">{sub}</p>}
    </div>
  </motion.div>
);

// ── Chart card wrapper ────────────────────────────────────────
const ChartCard = ({ title, subtitle, children }: {
  title: string; subtitle?: string; children: React.ReactNode;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
    className="rounded-sm border border-border/50 bg-card p-6 shadow-card-deep"
  >
    <div className="mb-5">
      <h3 className="font-display text-base font-medium text-card-foreground">{title}</h3>
      {subtitle && <p className="mt-0.5 font-body text-xs text-muted-foreground">{subtitle}</p>}
    </div>
    {children}
  </motion.div>
);

// ── Empty state ───────────────────────────────────────────────
const EmptyState = ({ message }: { message: string }) => (
  <div className="flex h-48 items-center justify-center">
    <p className="font-body text-sm text-muted-foreground italic">{message}</p>
  </div>
);

// ══════════════════════════════════════════════════════════════
export default function Stats() {
  const { data: collection } = useCollectionStats();
  const { data: activity, isLoading: activityLoading } = useActivityStats();
  const { data: curationCount } = useCurationCount();

  const topTheme = collection?.themes.sort((a, b) => b.value - a.value)[0]?.name ?? "—";

  return (
    <div className="min-h-screen bg-background pt-20 pb-16">
      <div className="mx-auto max-w-7xl px-6">

        {/* ── Page header ── */}
        <motion.div
          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="font-display text-4xl font-semibold tracking-wide gold-gradient-text">
            Gallery Statistics
          </h1>
          <p className="mt-2 font-body text-sm text-muted-foreground">
            Live insights into the Curatura collection and visitor activity.
          </p>
        </motion.div>

        {/* ── Stat cards ── */}
        <div className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard icon={Image}     label="Total Artworks"      value={collection?.total ?? 48}     color="#c9a96e" />
          <StatCard icon={Activity}  label="Total Events"        value={activity?.totalEvents ?? 0}  color="#818cf8" sub="interaction logs" />
          <StatCard icon={Layers}    label="Curations Saved"     value={curationCount ?? 0}          color="#4ade80" />
          <StatCard icon={Palette}   label="Top Theme"           value={topTheme}                     color="#f472b6" sub={`${collection?.themes.find(t => t.name === topTheme)?.value ?? 0} artworks`} />
        </div>

        {/* ── Row 1: Three pies ── */}
        <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">

          {/* Theme distribution */}
          <ChartCard title="Artworks by Theme" subtitle="Collection breakdown across 6 thematic walls">
            {collection?.themes.length ? (
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie data={collection.themes} dataKey="value" nameKey="name"
                    cx="50%" cy="50%" outerRadius={80} labelLine={false} label={PieLabel}>
                    {collection.themes.map((entry) => (
                      <Cell key={entry.name} fill={THEME_COLORS[entry.name] ?? PALETTE[0]} />
                    ))}
                  </Pie>
                  <Tooltip content={<DarkTooltip />} />
                  <Legend
                    formatter={(v) => (
                      <span className="font-body text-xs text-muted-foreground capitalize">{v}</span>
                    )}
                    iconType="circle" iconSize={8}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : <EmptyState message="Loading…" />}
          </ChartCard>

          {/* Aspect ratio distribution */}
          <ChartCard title="Aspect Ratio Mix" subtitle="Portrait / landscape / square split">
            {collection?.aspectRatios.length ? (
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie data={collection.aspectRatios} dataKey="value" nameKey="name"
                    cx="50%" cy="50%" innerRadius={50} outerRadius={85}
                    paddingAngle={4} labelLine={false} label={PieLabel}>
                    {collection.aspectRatios.map((entry) => (
                      <Cell key={entry.name} fill={ASPECT_COLORS[entry.name] ?? PALETTE[2]} />
                    ))}
                  </Pie>
                  <Tooltip content={<DarkTooltip />} />
                  <Legend
                    formatter={(v) => (
                      <span className="font-body text-xs text-muted-foreground capitalize">{v}</span>
                    )}
                    iconType="circle" iconSize={8}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : <EmptyState message="Loading…" />}
          </ChartCard>

          {/* Event type pie */}
          <ChartCard title="Event Type Breakdown" subtitle="Which actions visitors take most">
            {activityLoading ? (
              <EmptyState message="Fetching live data…" />
            ) : activity?.events.length ? (
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie data={activity.events} dataKey="value" nameKey="name"
                    cx="50%" cy="50%" outerRadius={80} labelLine={false} label={PieLabel}>
                    {activity.events.map((_, i) => (
                      <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<DarkTooltip />} />
                  <Legend
                    formatter={(v) => (
                      <span className="font-body text-xs text-muted-foreground capitalize">{v}</span>
                    )}
                    iconType="circle" iconSize={8}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState message="No interaction events yet. Start exploring to generate data." />
            )}
          </ChartCard>
        </div>

        {/* ── Row 2: Activity over time (area chart) ── */}
        <div className="mb-6">
          <ChartCard title="Activity Over the Last 14 Days" subtitle="Total interaction events per day">
            {activityLoading ? (
              <EmptyState message="Fetching live data…" />
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={activity?.activityByDay ?? []} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#c9a96e" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#c9a96e" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border)/0.3)" />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))", fontFamily: "inherit" }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))", fontFamily: "inherit" }} />
                  <Tooltip content={<DarkTooltip />} />
                  <Area type="monotone" dataKey="events" name="Events" stroke="#c9a96e"
                    strokeWidth={2} fill="url(#areaGrad)" dot={{ r: 3, fill: "#c9a96e" }} activeDot={{ r: 5 }} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </ChartCard>
        </div>

        {/* ── Row 3: Top selected artworks + yearly output ── */}
        <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">

          {/* Top selected artworks */}
          <ChartCard title="Most Selected Artworks" subtitle="Top 10 by selection events from visitors">
            {activityLoading ? (
              <EmptyState message="Fetching live data…" />
            ) : activity?.topArtworks.length ? (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={activity.topArtworks} layout="vertical"
                  margin={{ top: 0, right: 8, left: 8, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border)/0.3)" />
                  <XAxis type="number" allowDecimals={false}
                    tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))", fontFamily: "inherit" }} />
                  <YAxis type="category" dataKey="title" width={110}
                    tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))", fontFamily: "inherit" }} />
                  <Tooltip content={<DarkTooltip />} />
                  <Bar dataKey="selections" name="Selections" radius={[0, 3, 3, 0]}>
                    {activity.topArtworks.map((_, i) => (
                      <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState message="No artwork selections recorded yet. Start curating!" />
            )}
          </ChartCard>

          {/* Artworks by creation year — Bar */}
          <ChartCard title="Artworks by Year" subtitle="Collection output across 2018 – 2022">
            {collection?.byYear.length ? (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={collection.byYear} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border)/0.3)" />
                  <XAxis dataKey="year" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))", fontFamily: "inherit" }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))", fontFamily: "inherit" }} />
                  <Tooltip content={<DarkTooltip />} />
                  <Bar dataKey="count" name="Artworks" radius={[3, 3, 0, 0]}>
                    {collection.byYear.map((_, i) => (
                      <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : <EmptyState message="Loading…" />}
          </ChartCard>
        </div>

        {/* ── Row 4: Theme radar ── */}
        <div className="mb-6">
          <ChartCard title="Theme Radar" subtitle="Visual balance of the collection across all themes">
            {collection?.themes.length ? (
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart cx="50%" cy="50%" outerRadius={100} data={collection.themes}>
                  <PolarGrid stroke="hsl(var(--border)/0.4)" />
                  <PolarAngleAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))", fontFamily: "inherit" }} />
                  <Radar name="Artworks" dataKey="value" stroke="#c9a96e" fill="#c9a96e" fillOpacity={0.25} strokeWidth={2} />
                  <Tooltip content={<DarkTooltip />} />
                </RadarChart>
              </ResponsiveContainer>
            ) : <EmptyState message="Loading…" />}
          </ChartCard>
        </div>

      </div>
    </div>
  );
}
