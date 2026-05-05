"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import {
  motion,
  AnimatePresence,
  useInView,
  useMotionValue,
  useSpring,
} from "framer-motion";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Trophy,
  Bell,
  ArrowUpRight,
  Wallet,
  Flame,
  BookOpen,
  Crown,
  Zap,
  Play,
  TrendingUp,
  Sparkles,
  Plane,
} from "lucide-react";
import PageShell from "@/components/site/PageShell";

/* ============================================================
   DATA
============================================================ */
const kpis = [
  { v: 4,    suffix: "",   l: "Active apps",      i: FileText, accent: false },
  { v: 11,   suffix: "d",  l: "Next deadline",    i: Clock,    accent: false },
  { v: 42,   prefix: "₹",  suffix: "L",  l: "Loan locked",     i: Wallet, accent: false },
  { v: 82,   suffix: "%",  l: "Avg. admit prob",  i: Trophy,   accent: true  },
] as const;

const gaps = [
  { title: "Submit GRE score report",   due: "Nov 14", status: "urgent", impact: "+8% admit prob.",  program: "Oxford" },
  { title: "Upload 2nd LOR",            due: "Nov 22", status: "soon",   impact: "Required",         program: "Stanford" },
  { title: "Draft SOP v3",              due: "Nov 28", status: "soon",   impact: "+11% admit prob.", program: "ETH Zürich" },
  { title: "Confirm financial documents", due: "Dec 04", status: "later", impact: "Loan disbursal",  program: "All" },
];

const deadlines = [
  { d: 12, m: "JAN", t: "Oxford · MSc CS",       c: "Reach",     days: 38 },
  { d: 15, m: "DEC", t: "ETH Zürich · DS",       c: "Best fit",  days: 11 },
  { d: 3,  m: "JAN", t: "Stanford · CS",         c: "Reach",     days: 29 },
  { d: 28, m: "FEB", t: "Toronto · MEng",        c: "Match",     days: 86 },
];

// 12 weeks × 7 days streak intensity (0-4)
const streakData = Array.from({ length: 12 * 7 }, (_, i) => {
  const seed = (i * 9301 + 49297) % 233280;
  const r = seed / 233280;
  if (r < 0.18) return 0;
  if (r < 0.42) return 1;
  if (r < 0.68) return 2;
  if (r < 0.88) return 3;
  return 4;
});

const programsTrend = [
  {
    name: "Oxford · MSc CS",
    tag: "Reach",
    current: 78,
    delta: +6,
    data: [62, 66, 64, 68, 70, 73, 72, 75, 78].map((v, i) => ({ x: i, y: v })),
  },
  {
    name: "ETH Zürich · DS",
    tag: "Best fit",
    current: 91,
    delta: +3,
    data: [80, 82, 85, 84, 86, 88, 89, 90, 91].map((v, i) => ({ x: i, y: v })),
  },
  {
    name: "Stanford · CS",
    tag: "Reach",
    current: 64,
    delta: -2,
    data: [70, 72, 71, 69, 68, 66, 65, 66, 64].map((v, i) => ({ x: i, y: v })),
  },
  {
    name: "Toronto · MEng",
    tag: "Match",
    current: 87,
    delta: +4,
    data: [78, 79, 81, 82, 83, 85, 84, 86, 87].map((v, i) => ({ x: i, y: v })),
  },
];

const funnel = [
  { stage: "Discovered",  v: 28, color: "hsl(45 30% 80%)"   },
  { stage: "Shortlisted", v: 12, color: "hsl(148 35% 70%)"  },
  { stage: "Applied",     v: 4,  color: "hsl(148 45% 50%)"  },
  { stage: "Admitted",    v: 1,  color: "hsl(156 60% 14%)"  },
];

const courses = [
  {
    title: "GRE Quant · Advanced",
    progress: 72,
    chapters: "18 / 25",
    img: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&q=80&auto=format&fit=crop",
  },
  {
    title: "IELTS Speaking Lab",
    progress: 48,
    chapters: "9 / 18",
    img: "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=600&q=80&auto=format&fit=crop",
  },
  {
    title: "SOP Masterclass · Oxford",
    progress: 91,
    chapters: "11 / 12",
    img: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&q=80&auto=format&fit=crop",
  },
];

const leaderboard = [
  { rank: 1, name: "Riya K.",   xp: 4820, streak: 47, you: false, avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&q=80&auto=format&fit=crop" },
  { rank: 2, name: "Devansh P.", xp: 4610, streak: 39, you: false, avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&q=80&auto=format&fit=crop" },
  { rank: 3, name: "Aarav S.",  xp: 4390, streak: 32, you: true,  avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&q=80&auto=format&fit=crop" },
  { rank: 4, name: "Ishaan M.", xp: 4115, streak: 28, you: false, avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=120&q=80&auto=format&fit=crop" },
  { rank: 5, name: "Tara V.",   xp: 3980, streak: 24, you: false, avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&q=80&auto=format&fit=crop" },
];

const activity = [
  { t: "2m",  txt: "Oracle recalculated Oxford to 78%",      icon: TrendingUp },
  { t: "1h",  txt: "Essay v3 reviewed — uniqueness 86/100",  icon: Sparkles  },
  { t: "3h",  txt: "Loan eligibility extended to ₹52L",       icon: Wallet    },
  { t: "1d",  txt: "Riya K. overtook you on the leaderboard", icon: Crown     },
  { t: "2d",  txt: "ETH Zürich deadline now in 11 days",     icon: Plane     },
];

const expoOut: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* ============================================================
   PRIMITIVES
============================================================ */
function CountUp({ to, prefix = "", suffix = "" }: { to: number; prefix?: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const mv = useMotionValue(0);
  const sp = useSpring(mv, { stiffness: 60, damping: 18 });
  const [val, setVal] = useState(0);
  useEffect(() => { if (inView) mv.set(to); }, [inView, mv, to]);
  useEffect(() => sp.on("change", v => setVal(v)), [sp]);
  return <span ref={ref} className="tabular-nums">{prefix}{Math.round(val)}{suffix}</span>;
}

function ProgressRing({ pct, size = 56, stroke = 5, color = "hsl(var(--accent))" }: { pct: number; size?: number; stroke?: number; color?: string }) {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <svg ref={ref} width={size} height={size} className="-rotate-90">
      <circle cx={size/2} cy={size/2} r={r} stroke="hsl(var(--muted))" strokeWidth={stroke} fill="none" />
      <motion.circle
        cx={size/2} cy={size/2} r={r}
        stroke={color} strokeWidth={stroke} strokeLinecap="round" fill="none"
        strokeDasharray={c}
        initial={{ strokeDashoffset: c }}
        animate={inView ? { strokeDashoffset: c - (c * pct) / 100 } : {}}
        transition={{ duration: 1.4, ease: expoOut }}
      />
    </svg>
  );
}

function LiveDot({ label = "Live" }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-[hsl(var(--success-soft))] px-2.5 py-0.5">
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[hsl(var(--success))] opacity-75" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[hsl(var(--success))]" />
      </span>
      <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[hsl(var(--success))]">{label}</span>
    </span>
  );
}

/* ============================================================
   SECTIONS
============================================================ */
function HeaderStrip() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }));
    tick();
    const t = setInterval(tick, 1000 * 30);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="border-b border-[hsl(var(--border))] bg-[hsl(var(--surface))]/60 backdrop-blur-md" data-testid="dashboard-header">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-[hsl(var(--muted-foreground))]">Surface 04 · Dashboard</span>
            <LiveDot label={`Synced ${time}`} />
          </div>
          <h1 className="mt-3 font-display text-4xl font-bold leading-[1.05] text-[hsl(var(--foreground))] md:text-5xl">
            Welcome back, <span className="italic text-gradient-ink">Aarav.</span>
          </h1>
          <p className="mt-2 text-[hsl(var(--muted-foreground))]">
            4 active applications · Next deadline in 11 days · 32-day streak 🔥
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button data-testid="dashboard-notifications" className="group relative inline-flex items-center gap-2 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-4 py-2 text-sm transition-shadow hover:shadow-elev">
            <Bell className="h-4 w-4" />
            Notifications
            <span className="rounded-full bg-[hsl(var(--accent))] px-1.5 py-0.5 font-mono text-[10px] text-[hsl(var(--accent-foreground))]">3</span>
          </button>
          <button data-testid="dashboard-add-program" className="inline-flex items-center gap-2 rounded-full bg-[hsl(var(--primary))] px-4 py-2 text-sm font-medium text-[hsl(var(--primary-foreground))] hover:shadow-glow transition-shadow">
            Add program <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
}

function KpiStrip() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-10" data-testid="kpi-strip">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {kpis.map((k, i) => (
          <motion.div
            key={k.l}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: expoOut, delay: i * 0.06 }}
            className={`relative overflow-hidden rounded-2xl border p-5 transition-shadow hover:shadow-elev ${
              k.accent
                ? "border-transparent bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]"
                : "border-[hsl(var(--border))] bg-[hsl(var(--card))]"
            }`}
          >
            <div className="flex items-start justify-between">
              <div className={`font-mono text-[10px] uppercase tracking-[0.22em] ${k.accent ? "opacity-70" : "text-[hsl(var(--muted-foreground))]"}`}>{k.l}</div>
              <k.i className={`h-4 w-4 ${k.accent ? "opacity-80" : "text-[hsl(var(--muted-foreground))]"}`} />
            </div>
            <div className="mt-4 font-display text-4xl font-bold tracking-tight">
              <CountUp to={k.v} prefix={(k as any).prefix ?? ""} suffix={k.suffix} />
            </div>
            {k.accent && (
              <div className="absolute -right-8 -bottom-8 h-28 w-28 rounded-full bg-[hsl(var(--accent))]/30 blur-2xl" />
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function StreakCard() {
  const weeks = 12;
  const days = 7;
  const palette = [
    "hsl(var(--muted))",
    "hsl(148 50% 88%)",
    "hsl(148 50% 70%)",
    "hsl(148 45% 50%)",
    "hsl(156 60% 22%)",
  ];
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: expoOut }}
      className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 shadow-elev"
      data-testid="streak-card"
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Flame className="h-4 w-4 text-[hsl(var(--accent))]" />
            <h3 className="font-display text-xl font-bold">StudyStreak</h3>
          </div>
          <p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">12 weeks of focused effort.</p>
        </div>
        <div className="grid grid-cols-3 gap-5 text-right">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[hsl(var(--muted-foreground))]">Current</div>
            <div className="mt-1 font-display text-2xl font-bold"><CountUp to={32} suffix="d" /></div>
          </div>
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[hsl(var(--muted-foreground))]">Longest</div>
            <div className="mt-1 font-display text-2xl font-bold"><CountUp to={47} suffix="d" /></div>
          </div>
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[hsl(var(--muted-foreground))]">XP</div>
            <div className="mt-1 font-display text-2xl font-bold text-[hsl(var(--accent))]"><CountUp to={4390} /></div>
          </div>
        </div>
      </div>

      {/* heatmap */}
      <div className="mt-6 overflow-x-auto">
        <div className="flex gap-[5px]">
          {Array.from({ length: weeks }).map((_, w) => (
            <div key={w} className="flex flex-col gap-[5px]">
              {Array.from({ length: days }).map((_, d) => {
                const idx = w * days + d;
                const v = streakData[idx];
                return (
                  <motion.div
                    key={d}
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, ease: expoOut, delay: 0.005 * idx }}
                    className="h-3 w-3 rounded-[3px]"
                    style={{ background: palette[v] }}
                    title={`Day ${idx + 1}: ${v} sessions`}
                  />
                );
              })}
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.18em] text-[hsl(var(--muted-foreground))]">
          <span>12 weeks ago</span>
          <div className="flex items-center gap-1.5">
            <span>Less</span>
            {palette.map((c, i) => <span key={i} className="h-2.5 w-2.5 rounded-[2px]" style={{ background: c }} />)}
            <span>More</span>
          </div>
          <span>Today</span>
        </div>
      </div>
    </motion.div>
  );
}

function ProgramsTrendTable() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: expoOut }}
      className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 shadow-elev"
      data-testid="programs-trend"
    >
      <div className="flex items-end justify-between">
        <div>
          <h3 className="font-display text-xl font-bold">Admit probability · 9-week trend</h3>
          <p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">Per program, computed nightly by Oracle.</p>
        </div>
        <button className="inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-[0.18em] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]">View all <ArrowUpRight className="h-3 w-3" /></button>
      </div>

      <div className="mt-5 overflow-hidden rounded-xl border border-[hsl(var(--border))]">
        <table className="w-full">
          <thead className="bg-[hsl(var(--muted))]/40 font-mono text-[10px] uppercase tracking-[0.18em] text-[hsl(var(--muted-foreground))]">
            <tr>
              <th className="px-4 py-3 text-left">Program</th>
              <th className="px-4 py-3 text-left">Tag</th>
              <th className="px-4 py-3 text-left hidden md:table-cell">Trend</th>
              <th className="px-4 py-3 text-right">Now</th>
              <th className="px-4 py-3 text-right">Δ</th>
            </tr>
          </thead>
          <tbody>
            {programsTrend.map((p, i) => {
              const positive = p.delta >= 0;
              const stroke = positive ? "hsl(148 45% 45%)" : "hsl(0 65% 55%)";
              return (
                <motion.tr
                  key={p.name}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, ease: expoOut, delay: i * 0.07 }}
                  className="border-t border-[hsl(var(--border))] transition-colors hover:bg-[hsl(var(--muted))]/30"
                >
                  <td className="px-4 py-4 font-medium">{p.name}</td>
                  <td className="px-4 py-4">
                    <span className="rounded-full bg-[hsl(var(--accent-soft))] px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-[hsl(var(--primary))]">{p.tag}</span>
                  </td>
                  <td className="hidden h-12 w-40 px-4 py-2 md:table-cell">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={p.data}>
                        <defs>
                          <linearGradient id={`g${i}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%"   stopColor={stroke} stopOpacity={0.35} />
                            <stop offset="100%" stopColor={stroke} stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <Area type="monotone" dataKey="y" stroke={stroke} strokeWidth={2} fill={`url(#g${i})`} isAnimationActive />
                      </AreaChart>
                    </ResponsiveContainer>
                  </td>
                  <td className="px-4 py-4 text-right font-display text-lg font-bold">{p.current}%</td>
                  <td className="px-4 py-4 text-right">
                    <span className={`font-mono text-xs ${positive ? "text-[hsl(var(--success))]" : "text-[hsl(var(--destructive))]"}`}>
                      {positive ? "▲" : "▼"} {Math.abs(p.delta)}%
                    </span>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

function FunnelCard() {
  const max = Math.max(...funnel.map(f => f.v));
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: expoOut }}
      className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 shadow-elev"
      data-testid="funnel-card"
    >
      <h3 className="font-display text-xl font-bold">Application funnel</h3>
      <p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">Discover → Shortlist → Apply → Admit.</p>
      <div className="mt-6 space-y-4">
        {funnel.map((f, i) => {
          const w = (f.v / max) * 100;
          return (
            <div key={f.stage}>
              <div className="mb-1.5 flex items-baseline justify-between">
                <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[hsl(var(--muted-foreground))]">{f.stage}</span>
                <span className="font-display text-lg font-bold"><CountUp to={f.v} /></span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-[hsl(var(--muted))]">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${w}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, ease: expoOut, delay: i * 0.12 }}
                  style={{ background: f.color }}
                  className="h-full rounded-full"
                />
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-5 rounded-xl bg-[hsl(var(--accent-soft))] p-3 text-sm text-[hsl(var(--primary))]">
        <Sparkles className="mr-1.5 inline h-3.5 w-3.5" />
        Conversion 14.3% — top quartile across the cohort.
      </div>
    </motion.div>
  );
}

function GapCards() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: expoOut }}
      className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 shadow-elev"
      data-testid="gap-cards"
    >
      <div className="flex items-end justify-between">
        <div>
          <h3 className="font-display text-xl font-bold">Gap cards</h3>
          <p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">Close these to maximise admit probability.</p>
        </div>
        <button className="font-mono text-[11px] uppercase tracking-[0.18em] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]">View all →</button>
      </div>

      <div className="mt-5 space-y-3">
        {gaps.map((g, i) => {
          const tone =
            g.status === "urgent" ? "border-[hsl(var(--destructive))]/50 bg-[hsl(var(--destructive))]/5" :
            g.status === "soon"   ? "border-[hsl(var(--warning))]/40 bg-[hsl(var(--warning))]/5" :
                                    "border-[hsl(var(--border))] bg-[hsl(var(--surface))]/50";
          return (
            <motion.div
              key={g.title}
              layout
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: expoOut, delay: i * 0.07 }}
              className={`group flex items-center gap-4 rounded-xl border p-4 ${tone}`}
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[hsl(var(--card))] shadow-elev">
                {g.status === "urgent"
                  ? <AlertCircle className="h-4 w-4 text-[hsl(var(--destructive))]" />
                  : <CheckCircle2 className="h-4 w-4 text-[hsl(var(--accent))]" />}
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-medium text-[hsl(var(--foreground))]">{g.title}</div>
                <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[hsl(var(--muted-foreground))]">{g.program} · Due {g.due}</div>
              </div>
              <div className="hidden text-right md:block">
                <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[hsl(var(--muted-foreground))]">Impact</div>
                <div className="font-display text-sm font-bold">{g.impact}</div>
              </div>
              <button className="rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-3 py-1.5 text-xs font-medium transition-all hover:bg-[hsl(var(--primary))] hover:text-[hsl(var(--primary-foreground))] group-hover:translate-x-0.5">
                Resolve
              </button>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

function NudgeCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: expoOut }}
      className="relative overflow-hidden rounded-2xl bg-[hsl(var(--primary))] p-6 text-[hsl(var(--primary-foreground))] shadow-ink"
      data-testid="nudge-card"
    >
      <motion.div
        animate={{
          background: [
            "radial-gradient(60% 60% at 20% 30%, hsl(148 60% 50% / 0.45), transparent 70%)",
            "radial-gradient(60% 60% at 80% 70%, hsl(148 60% 50% / 0.45), transparent 70%)",
            "radial-gradient(60% 60% at 20% 30%, hsl(148 60% 50% / 0.45), transparent 70%)",
          ],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0"
      />
      <div className="relative">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 backdrop-blur-md">
          <Zap className="h-3 w-3 text-[hsl(var(--accent))]" />
          <span className="font-mono text-[10px] uppercase tracking-[0.2em]">Today's nudge</span>
        </div>
        <h4 className="mt-4 font-display text-2xl font-bold leading-tight">A single LOR upload can lift Stanford by 6%.</h4>
        <p className="mt-2 text-sm opacity-80">Your current shortlist is bottlenecked by the second recommender.</p>
        <button className="mt-5 inline-flex items-center gap-2 rounded-full bg-[hsl(var(--accent))] px-4 py-2 text-sm font-medium text-[hsl(var(--accent-foreground))] hover:scale-[1.02] transition-transform">
          Resolve now <ArrowUpRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </motion.div>
  );
}

function CoursesCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: expoOut }}
      className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 shadow-elev"
      data-testid="courses-card"
    >
      <div className="flex items-center gap-2">
        <BookOpen className="h-4 w-4 text-[hsl(var(--accent))]" />
        <h3 className="font-display text-xl font-bold">Prep modules</h3>
      </div>
      <p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">Auto-curated to your shortlist's bar.</p>

      <div className="mt-5 space-y-4">
        {courses.map((c, i) => (
          <motion.button
            key={c.title}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: expoOut, delay: i * 0.08 }}
            className="group flex w-full items-center gap-4 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))] p-3 text-left hover:shadow-elev transition-shadow"
          >
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg">
              <img src={c.img} alt="" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 grid place-items-center bg-black/30 opacity-0 transition-opacity group-hover:opacity-100">
                <Play className="h-4 w-4 fill-white text-white" />
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate font-medium">{c.title}</div>
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[hsl(var(--muted-foreground))]">{c.chapters} chapters</div>
            </div>
            <div className="relative">
              <ProgressRing pct={c.progress} />
              <div className="absolute inset-0 grid place-items-center font-mono text-[10px] font-bold">{c.progress}%</div>
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}

function LeaderboardCard() {
  const podium = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: expoOut }}
      className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 shadow-elev"
      data-testid="leaderboard-card"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Crown className="h-4 w-4 text-[hsl(var(--accent))]" />
          <h3 className="font-display text-xl font-bold">Cohort leaderboard</h3>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[hsl(var(--muted-foreground))]">This week</span>
      </div>

      {/* Podium */}
      <div className="mt-5 grid grid-cols-3 gap-3">
        {podium.map((p, i) => {
          const heights = ["h-16", "h-20", "h-12"]; // 2nd, 1st, 3rd
          const order = [1, 0, 2][i]; // visually: 2 1 3 — but data is 1 2 3, reorder
          const real = [podium[1], podium[0], podium[2]][i];
          return (
            <div key={real.rank} className="flex flex-col items-center">
              <motion.img
                initial={{ scale: 0, rotate: -10 }}
                whileInView={{ scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 180, damping: 14, delay: 0.2 + i * 0.1 }}
                src={real.avatar}
                alt={real.name}
                className={`h-14 w-14 rounded-full object-cover ring-4 ${
                  real.rank === 1 ? "ring-[hsl(var(--accent))]" :
                  real.rank === 2 ? "ring-[hsl(var(--muted))]" :
                                    "ring-[hsl(40_60%_70%)]"
                } ${real.you ? "ring-offset-2 ring-offset-[hsl(var(--card))]" : ""}`}
              />
              <div className="mt-2 truncate text-center font-medium text-sm">{real.name.split(" ")[0]}{real.you && " (you)"}</div>
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[hsl(var(--muted-foreground))]">{real.xp.toLocaleString()} XP</div>
              <motion.div
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: expoOut, delay: 0.3 + i * 0.1 }}
                style={{ transformOrigin: "bottom" }}
                className={`mt-3 w-full rounded-t-lg ${heights[i]} ${
                  real.rank === 1 ? "bg-[hsl(var(--accent))]" :
                  real.rank === 2 ? "bg-[hsl(var(--muted))]" :
                                    "bg-[hsl(40_60%_75%)]"
                } grid place-items-center font-display text-xl font-bold ${real.rank === 1 ? "text-[hsl(var(--accent-foreground))]" : "text-[hsl(var(--foreground))]"}`}
              >
                {real.rank}
              </motion.div>
            </div>
          );
        })}
      </div>

      {/* Rest */}
      <div className="mt-5 space-y-2">
        {rest.map((p, i) => (
          <motion.div
            key={p.rank}
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 + i * 0.07 }}
            className="flex items-center gap-3 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))] p-3"
          >
            <span className="font-mono text-xs text-[hsl(var(--muted-foreground))] w-5">#{p.rank}</span>
            <img src={p.avatar} alt="" className="h-8 w-8 rounded-full object-cover" />
            <div className="min-w-0 flex-1 truncate text-sm font-medium">{p.name}</div>
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[hsl(var(--muted-foreground))]">🔥 {p.streak}d</span>
            <span className="font-display text-sm font-bold">{p.xp.toLocaleString()}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function DeadlinesCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: expoOut }}
      className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 shadow-elev"
      data-testid="deadlines-card"
    >
      <h3 className="font-display text-xl font-bold">Upcoming deadlines</h3>
      <div className="mt-5 space-y-3">
        {deadlines.map((d, i) => {
          const urgent = d.days <= 14;
          return (
            <motion.div
              key={d.t}
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className="flex items-center gap-4 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))] p-3"
            >
              <div className={`flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-lg ${urgent ? "bg-[hsl(var(--destructive))]/10" : "bg-[hsl(var(--accent-soft))]"}`}>
                <span className={`font-display text-lg font-bold leading-none ${urgent ? "text-[hsl(var(--destructive))]" : "text-[hsl(var(--primary))]"}`}>{d.d}</span>
                <span className="font-mono text-[8px] uppercase tracking-[0.18em] text-[hsl(var(--muted-foreground))]">{d.m}</span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium">{d.t}</div>
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[hsl(var(--muted-foreground))]">{d.c}</span>
              </div>
              <div className={`text-right font-mono text-xs ${urgent ? "text-[hsl(var(--destructive))]" : "text-[hsl(var(--muted-foreground))]"}`}>
                <div className="font-display text-base font-bold">{d.days}d</div>
                <div className="text-[9px] uppercase tracking-[0.18em]">left</div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

function ActivityFeed() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: expoOut }}
      className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 shadow-elev"
      data-testid="activity-feed"
    >
      <div className="flex items-center justify-between">
        <h3 className="font-display text-xl font-bold">Activity</h3>
        <LiveDot />
      </div>
      <ul className="mt-5 relative">
        <span className="absolute left-[15px] top-2 bottom-2 w-px bg-[hsl(var(--border))]" />
        {activity.map((a, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="relative flex items-start gap-4 py-3"
          >
            <div className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-elev">
              <a.icon className="h-3.5 w-3.5 text-[hsl(var(--primary))]" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm">{a.txt}</div>
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[hsl(var(--muted-foreground))]">{a.t} ago</span>
            </div>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}

/* ============================================================
   PAGE
============================================================ */
export default function Dashboard() {
  return (
    <PageShell>
      <HeaderStrip />
      <KpiStrip />

      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Main column */}
          <div className="space-y-6 lg:col-span-8">
            <StreakCard />
            <ProgramsTrendTable />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FunnelCard />
              <DeadlinesCard />
            </div>
            <GapCards />
          </div>

          {/* Right rail */}
          <aside className="space-y-6 lg:col-span-4">
            <NudgeCard />
            <LeaderboardCard />
            <CoursesCard />
            <ActivityFeed />
          </aside>
        </div>
      </section>
    </PageShell>
  );
}
