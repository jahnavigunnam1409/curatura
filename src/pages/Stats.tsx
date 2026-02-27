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
import { Image, Palette, Activity, Layers, Users, TrendingUp, RefreshCw, Info } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
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

// ── Shared tooltip ─────────────────────────────────────────────
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

// ── Section header ────────────────────────────────────────────
const SectionHeader = ({ title, subtitle }: { title: string; subtitle?: string }) => (
  <motion.div
    initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
    className="mb-5 border-l-2 border-gold pl-4"
    style={{ borderColor: "#c9a96e" }}
  >
    <h2 className="font-display text-lg font-medium text-card-foreground">{title}</h2>
    {subtitle && <p className="mt-0.5 font-body text-xs text-muted-foreground">{subtitle}</p>}
  </motion.div>
);

// ── Chart card wrapper ────────────────────────────────────────
const ChartCard = ({ title, subtitle, description, children }: {
  title: string; subtitle?: string; description?: string; children: React.ReactNode;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
    className="rounded-sm border border-border/50 bg-card p-6 shadow-card-deep"
  >
    <div className="mb-5 flex items-start justify-between gap-3">
      <div>
        <h3 className="font-display text-base font-medium text-card-foreground">{title}</h3>
        {subtitle && <p className="mt-0.5 font-body text-xs text-muted-foreground">{subtitle}</p>}
      </div>
      {description && (
        <div className="group relative mt-0.5 shrink-0">
          <Info className="h-3.5 w-3.5 cursor-pointer text-muted-foreground/50 transition-colors group-hover:text-[#c9a96e]" />
          <div className="pointer-events-none absolute right-0 top-6 z-50 w-56 rounded-sm border border-border/60 bg-card/95 px-3 py-2.5 text-xs shadow-xl backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <p className="font-body text-muted-foreground leading-relaxed">{description}</p>
          </div>
        </div>
      )}
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
  const qc = useQueryClient();
  const { data: collection } = useCollectionStats();
  const { data: activity, isLoading: activityLoading } = useActivityStats();
  const { data: curationCount } = useCurationCount();

  const topTheme = collection?.themes.sort((a, b) => b.value - a.value)[0]?.name ?? "—";

  const handleRefresh = () => {
    qc.invalidateQueries({ queryKey: ["stats", "activity"] });
    qc.invalidateQueries({ queryKey: ["stats", "curations"] });
  };

  return (
    <div className="min-h-screen bg-background pt-20 pb-16">
      <div className="mx-auto max-w-7xl px-6">

        {/* ── Page header ── */}
        <motion.div
          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="mb-10 flex items-start justify-between"
        >
          <div>
            <h1 className="font-display text-4xl font-semibold tracking-wide gold-gradient-text">
              Gallery Statistics
            </h1>
            <p className="mt-2 font-body text-sm text-muted-foreground">
              Live insights into the Curatura collection and all visitor interactions.
            </p>
          </div>
          <button
            onClick={handleRefresh}
            className="mt-2 flex items-center gap-2 rounded-sm border border-border/50 bg-card px-4 py-2 font-body text-xs text-muted-foreground transition hover:border-gold hover:text-gold"
            style={{ "--tw-border-gold": "#c9a96e" } as React.CSSProperties}
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh
          </button>
        </motion.div>

        {/* ── 6 Stat cards ── */}
        <div className="mb-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          <StatCard icon={Image}      label="Total Artworks"  value={collection?.total ?? 48}          color="#c9a96e" />
          <StatCard icon={Activity}   label="Total Events"    value={activity?.totalEvents ?? 0}        color="#818cf8" sub="interaction logs" />
          <StatCard icon={Users}      label="Unique Users"    value={activity?.uniqueUsers ?? 0}        color="#38bdf8" sub="tracked sessions" />
          <StatCard icon={Layers}     label="Curations Saved" value={curationCount ?? 0}                color="#4ade80" />
          <StatCard icon={Palette}    label="Top Theme"       value={topTheme}                          color="#f472b6" sub={`${collection?.themes.find(t => t.name === topTheme)?.value ?? 0} artworks`} />
          <StatCard icon={TrendingUp} label="Frame Remixes"   value={activity?.frameRemixes ?? 0}      color="#fb923c" sub="rearrangements" />
        </div>

        {/* ══ SECTION 1: Live User Activity ══════════════════════ */}
        <SectionHeader title="Live User Activity" subtitle="Real-time interaction logs from all visitors" />

        {/* Activity area chart — full width */}
        <div className="mb-6">
          <ChartCard title="Activity Over the Last 14 Days" subtitle="Total interaction events per day" description="Shows the total number of user interactions logged each day over the past 2 weeks. Peaks indicate high-traffic days with more artwork selections, curation saves, or frame rearrangements.">
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

        {/* Funnel + event pie — 2 col */}
        <div className="mb-12 grid grid-cols-1 gap-6 lg:grid-cols-2">

          {/* Engagement funnel as horizontal bar */}
          <ChartCard title="User Journey Funnel" subtitle="From viewing frames → saving a curation" description="Traces how many users progress through each stage — from viewing artworks to saving a final curation. Narrowing bars reveal exactly where visitors drop off in the experience.">
            {activityLoading ? (
              <EmptyState message="Fetching live data…" />
            ) : activity?.funnelSteps.some(s => s.value > 0) ? (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={activity.funnelSteps} layout="vertical"
                  margin={{ top: 0, right: 16, left: 16, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border)/0.3)" />
                  <XAxis type="number" allowDecimals={false}
                    tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))", fontFamily: "inherit" }} />
                  <YAxis type="category" dataKey="name" width={120}
                    tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))", fontFamily: "inherit" }} />
                  <Tooltip content={<DarkTooltip />} />
                  <Bar dataKey="value" name="Users" radius={[0, 3, 3, 0]}>
                    {activity.funnelSteps.map((_, i) => (
                      <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState message="No funnel data yet. Start exploring to generate events." />
            )}
          </ChartCard>

          {/* Event type pie */}
          <ChartCard title="Event Type Breakdown" subtitle="Which actions visitors take most" description="Proportional split of every interaction type recorded — selections, deselections, frame choices, rearrangements, and saves. Larger slices mean that action is performed more frequently.">
            {activityLoading ? (
              <EmptyState message="Fetching live data…" />
            ) : activity?.events.length ? (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={activity.events} dataKey="value" nameKey="name"
                    cx="50%" cy="50%" outerRadius={75} labelLine={false} label={PieLabel}>
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

        {/* ══ SECTION 2: Artwork Selection Insights ══════════════ */}
        <SectionHeader title="Artwork Selection Insights" subtitle="Which artworks users pick, deselect, and keep" />

        {/* Visual artwork grid */}
        <div className="mb-6">
          <ChartCard title="Most Selected Artworks" subtitle="Top 12 — rank badge / hover shows selections & retention" description="Visual grid of the 12 most-picked artworks, ranked by total selection count. Hover any thumbnail to see its exact selection count and the percentage of users who kept it in their final curation.">
            {activityLoading ? (
              <EmptyState message="Fetching live data…" />
            ) : activity?.topArtworks.length ? (
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
                {activity.topArtworks.map((art, i) => (
                  <div key={art.id} className="group relative overflow-hidden rounded-sm border border-border/40">
                    {art.imageUrl ? (
                      <img
                        src={art.imageUrl}
                        alt={art.title}
                        className="h-28 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-28 items-center justify-center bg-muted/30 text-muted-foreground text-xs px-1 text-center">
                        {art.title}
                      </div>
                    )}
                    {/* Rank badge */}
                    <span
                      className="absolute left-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-black"
                      style={{ background: i === 0 ? "#fbbf24" : i === 1 ? "#94a3b8" : i === 2 ? "#c9a96e" : "#1e293b", color: i < 3 ? "#000" : "#fff" }}
                    >
                      {i + 1}
                    </span>
                    {/* Hover overlay */}
                    <div className="absolute inset-0 flex flex-col items-center justify-end bg-black/70 p-2 opacity-0 transition-opacity group-hover:opacity-100">
                      <p className="text-center font-body text-[9px] text-white/80 leading-tight mb-1 line-clamp-2">{art.title}</p>
                      <p className="font-body text-[10px] text-white">{art.selections} sel.</p>
                      <div className="mt-1 h-1 w-full rounded-full bg-white/20">
                        <div
                          className="h-1 rounded-full"
                          style={{ width: `${art.retentionPct}%`, background: art.retentionPct > 70 ? "#4ade80" : art.retentionPct > 40 ? "#fbbf24" : "#f87171" }}
                        />
                      </div>
                      <p className="mt-0.5 font-body text-[9px]" style={{ color: art.retentionPct > 70 ? "#4ade80" : "#fbbf24" }}>
                        {art.retentionPct}% kept
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState message="No artwork selections recorded yet. Start curating!" />
            )}
          </ChartCard>
        </div>

        {/* Theme popularity + retention rate — 2 col */}
        <div className="mb-12 grid grid-cols-1 gap-6 lg:grid-cols-2">

          <ChartCard title="Theme Popularity by Selections" subtitle="Which themes users gravitate towards when curating" description="Counts how many artworks from each thematic wall were selected across all user sessions. Taller bars indicate themes — like Horizon or Introspection — that resonate most with visitors.">
            {activityLoading ? (
              <EmptyState message="Fetching live data…" />
            ) : activity?.themePopularity.length ? (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={activity.themePopularity} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border)/0.3)" />
                  <XAxis dataKey="theme" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))", fontFamily: "inherit" }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))", fontFamily: "inherit" }} />
                  <Tooltip content={<DarkTooltip />} />
                  <Bar dataKey="selections" name="Selections" radius={[3, 3, 0, 0]}>
                    {activity.themePopularity.map((entry) => (
                      <Cell key={entry.theme} fill={THEME_COLORS[entry.theme] ?? PALETTE[0]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState message="No theme selection data yet." />
            )}
          </ChartCard>

          <ChartCard title="Artwork Retention Rate" subtitle="% of selections not immediately reversed (kept in curation)" description="Percentage of times each artwork was selected and then kept rather than deselected. A high retention score means the artwork consistently earns its place in a visitor's final curation.">
            {activityLoading ? (
              <EmptyState message="Fetching live data…" />
            ) : activity?.topArtworks.length ? (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={activity.topArtworks.slice(0, 10)} layout="vertical"
                  margin={{ top: 0, right: 8, left: 8, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border)/0.3)" />
                  <XAxis type="number" domain={[0, 100]} unit="%" allowDecimals={false}
                    tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))", fontFamily: "inherit" }} />
                  <YAxis type="category" dataKey="title" width={110}
                    tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))", fontFamily: "inherit" }} />
                  <Tooltip content={<DarkTooltip />} />
                  <Bar dataKey="retentionPct" name="Retention %" radius={[0, 3, 3, 0]}>
                    {activity.topArtworks.slice(0, 10).map((art) => (
                      <Cell key={art.id} fill={art.retentionPct > 70 ? "#4ade80" : art.retentionPct > 40 ? "#fbbf24" : "#f87171"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState message="No retention data yet." />
            )}
          </ChartCard>
        </div>

        {/* ══ SECTION 3: Frame & Curation Behaviour ══════════════ */}
        <SectionHeader title="Frame & Curation Behaviour" subtitle="How users arrange frames and choose layout sizes" />

        <div className="mb-12 grid grid-cols-1 gap-6 lg:grid-cols-2">

          {/* Frame count preference pie */}
          <ChartCard title="Frame Count Preference" subtitle="How many frames users choose when building their wall" description="Pie chart of how many frames visitors select when composing their gallery wall (e.g. 2, 3, or 4 frames). Larger slices indicate the most popular layout size chosen.">
            {activityLoading ? (
              <EmptyState message="Fetching live data…" />
            ) : activity?.frameCountChart.length ? (
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie data={activity.frameCountChart} dataKey="value" nameKey="name"
                    cx="50%" cy="50%" outerRadius={80} labelLine={false} label={PieLabel}>
                    {activity.frameCountChart.map((_, i) => (
                      <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<DarkTooltip />} />
                  <Legend
                    formatter={(v) => (
                      <span className="font-body text-xs text-muted-foreground">{v}</span>
                    )}
                    iconType="circle" iconSize={8}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState message="No frame count data yet. Users need to proceed past artwork selection." />
            )}
          </ChartCard>

          {/* Most rearranged frames */}
          <ChartCard title="Most Rearranged Frames" subtitle="Frames dragged most often during wall customisation" description="Ranks each frame position by how many times it was dragged to a new spot on the wall. Frequent moves for a frame suggest users are actively experimenting with its placement in the layout.">
            {activityLoading ? (
              <EmptyState message="Fetching live data…" />
            ) : activity?.mostMovedFrames.length ? (
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={activity.mostMovedFrames} layout="vertical"
                  margin={{ top: 0, right: 8, left: 8, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border)/0.3)" />
                  <XAxis type="number" allowDecimals={false}
                    tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))", fontFamily: "inherit" }} />
                  <YAxis type="category" dataKey="frame" width={120}
                    tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))", fontFamily: "inherit" }} />
                  <Tooltip content={<DarkTooltip />} />
                  <Bar dataKey="moves" name="Rearrangements" radius={[0, 3, 3, 0]}>
                    {activity.mostMovedFrames.map((_, i) => (
                      <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState message="No rearrangement data yet. Drag frames on the Play page to generate events." />
            )}
          </ChartCard>
        </div>

        {/* ══ SECTION 4: Collection Overview ═════════════════════ */}
        <SectionHeader title="Collection Overview" subtitle="Static breakdown of the 48-artwork Curatura collection" />

        {/* Three pies row */}
        <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">

          <ChartCard title="Artworks by Theme" subtitle="Collection breakdown across 6 thematic walls" description="Static distribution of all 48 artworks across the 6 thematic walls in the collection. Each slice shows how many artworks belong to that theme, revealing how evenly the collection is curated.">
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

          <ChartCard title="Aspect Ratio Mix" subtitle="Portrait / landscape / square split" description="Donut chart of the portrait, landscape, and square artwork split across the entire collection. Useful for understanding the visual variety and orientation balance of the gallery.">
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

          <ChartCard title="Artworks by Year" subtitle="Collection output across 2018 – 2022" description="Number of artworks in the collection produced in each year from 2018 to 2022. Shows how the collection is spread across the creative timeline and which years contributed the most works.">
            {collection?.byYear.length ? (
              <ResponsiveContainer width="100%" height={240}>
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

        {/* Theme radar — full width */}
        <div className="mb-6">
          <ChartCard title="Theme Radar" subtitle="Visual balance of the collection across all themes" description="Spider chart overlaying all 6 themes to show collection balance at a glance. A symmetrical shape indicates an evenly distributed collection; spikes reveal dominant or underrepresented themes.">
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

