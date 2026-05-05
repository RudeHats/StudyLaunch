"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useInView,
} from "framer-motion";
import {
  TrendingUp,
  Sparkles,
  Info,
  ArrowUpRight,
  ChevronUp,
  ChevronDown,
  Brain,
  Database,
  Target,
} from "lucide-react";
import PageShell from "@/components/site/PageShell";

const expoOut: [number, number, number, number] = [0.16, 1, 0.3, 1];

const portraitImg = "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=1000&q=85&auto=format&fit=crop";
const dataVizImg  = "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1600&q=80&auto=format&fit=crop";

/* ============== PRIMITIVES ============== */

function CountUp({ to }: { to: number }) {
  const mv = useMotionValue(to);
  const sp = useSpring(mv, { stiffness: 70, damping: 18 });
  const [v, setV] = useState(to);
  useEffect(() => { mv.set(to); }, [mv, to]);
  useEffect(() => sp.on("change", n => setV(n)), [sp]);
  return <span className="tabular-nums">{Math.round(v)}</span>;
}

/** Dual-ring gauge: outer = confidence (60–95% by data density), inner = probability */
function Gauge({ pct, confidence = 86 }: { pct: number; confidence?: number }) {
  const r = 100;
  const c = 2 * Math.PI * r;
  const r2 = 80;
  const c2 = 2 * Math.PI * r2;

  const probMV = useMotionValue(0);
  const sp = useSpring(probMV, { stiffness: 70, damping: 18 });
  useEffect(() => { probMV.set(pct); }, [probMV, pct]);

  const dashOffset = useTransform(sp, p => c - (p / 100) * c);
  const confOffset = c2 - (confidence / 100) * c2;

  const tone =
    pct >= 80 ? "hsl(158 60% 32%)" :
    pct >= 60 ? "hsl(148 45% 45%)" :
                "hsl(35 85% 50%)";

  return (
    <div className="relative">
      <svg viewBox="-120 -120 240 240" className="w-full max-w-[300px]">
        {/* outer track */}
        <circle r={r} stroke="hsl(var(--muted))" strokeWidth="8" fill="none" />
        {/* outer probability arc */}
        <motion.circle
          r={r}
          stroke={tone}
          strokeWidth="8"
          strokeLinecap="round"
          fill="none"
          strokeDasharray={c}
          style={{ strokeDashoffset: dashOffset, rotate: -90 }}
        />
        {/* inner confidence ring */}
        <circle r={r2} stroke="hsl(var(--muted))" strokeWidth="2" fill="none" />
        <motion.circle
          r={r2}
          stroke="hsl(var(--accent))"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          strokeDasharray={c2}
          strokeDashoffset={confOffset}
          style={{ rotate: -90 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ duration: 1.2, delay: 0.3 }}
        />
        {/* center text */}
        <text x="0" y="-6" textAnchor="middle" className="fill-[hsl(var(--muted-foreground))] font-mono" style={{ fontSize: 10, letterSpacing: 2 }}>
          ADMIT PROBABILITY
        </text>
        <text x="0" y="38" textAnchor="middle" className="fill-[hsl(var(--foreground))] font-display font-bold" style={{ fontSize: 60 }}>
          {/* SVG can't host a React component cleanly, so we overlay via foreignObject */}
        </text>
        <foreignObject x="-80" y="-10" width="160" height="80">
          <div className="flex h-full items-center justify-center font-display text-[64px] font-bold leading-none text-[hsl(var(--foreground))]">
            <CountUp to={pct} />%
          </div>
        </foreignObject>
      </svg>
    </div>
  );
}

/* ============== THINKING THEATRE ============== */
const stages = [
  { icon: Brain,    label: "Reading your profile",      hint: "Tokenizing GPA, scores, intent" },
  { icon: Database, label: "Comparing 1.2M admits",     hint: "k-NN over historical decisions" },
  { icon: Target,   label: "Scoring with calibration",  hint: "SHAP attributions + isotonic fit" },
];

function ThinkingTheatre({ active, runId }: { active: boolean; runId: number }) {
  const [stage, setStage] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!active) return;
    setStage(0);
    setProgress(0);
    let s = 0;
    const stageT = setInterval(() => {
      s += 1;
      if (s >= stages.length) clearInterval(stageT);
      else setStage(s);
    }, 220);
    let p = 0;
    const progT = setInterval(() => {
      p = Math.min(100, p + 4);
      setProgress(p);
      if (p >= 100) clearInterval(progT);
    }, 26);
    return () => { clearInterval(stageT); clearInterval(progT); };
  }, [active, runId]);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          key={runId}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
          className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]/90 p-4 backdrop-blur-md"
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[hsl(var(--muted-foreground))]">
              Recalculating
            </span>
            <span className="font-mono text-[10px] tabular-nums text-[hsl(var(--accent))]">{progress}%</span>
          </div>
          <div className="mt-2 h-[3px] overflow-hidden rounded-full bg-[hsl(var(--muted))]">
            <motion.div
              className="h-full bg-gradient-to-r from-[hsl(var(--accent))] to-[hsl(var(--primary))]"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.15, ease: "linear" }}
            />
          </div>
          <div className="mt-3 space-y-1.5">
            {stages.map((s, i) => {
              const done = i < stage;
              const cur  = i === stage;
              return (
                <div key={s.label} className="flex items-center gap-2.5">
                  <s.icon className={`h-3.5 w-3.5 shrink-0 ${done ? "text-[hsl(var(--success))]" : cur ? "text-[hsl(var(--accent))]" : "text-[hsl(var(--muted-foreground))]/40"}`} />
                  <span className={`text-xs ${done ? "text-[hsl(var(--muted-foreground))] line-through" : cur ? "text-[hsl(var(--foreground))]" : "text-[hsl(var(--muted-foreground))]/50"}`}>
                    {s.label}
                  </span>
                  {cur && (
                    <span className="ml-auto inline-flex gap-0.5">
                      {[0,1,2].map(d => (
                        <motion.span key={d} className="h-1 w-1 rounded-full bg-[hsl(var(--accent))]"
                          animate={{ opacity: [0.2, 1, 0.2] }}
                          transition={{ duration: 0.9, repeat: Infinity, delay: d * 0.15 }} />
                      ))}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ============== SLIDER ============== */
function Slider({ label, value, min, max, step, onChange, display }: {
  label: string; value: number; min: number; max: number; step: number;
  onChange: (n: number) => void; display: string;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-medium">{label}</span>
        <span className="font-mono text-sm tabular-nums text-[hsl(var(--accent))]">{display}</span>
      </div>
      <div className="relative mt-3 h-2 rounded-full bg-[hsl(var(--muted))]">
        <div className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[hsl(var(--accent))] to-[hsl(var(--primary))]" style={{ width: `${pct}%` }} />
        <div className="absolute -top-1 h-4 w-4 -translate-x-1/2 rounded-full border-2 border-[hsl(var(--card))] bg-[hsl(var(--primary))] shadow-elev" style={{ left: `${pct}%` }} />
        <input
          type="range"
          min={min} max={max} step={step} value={value}
          onChange={e => onChange(parseFloat(e.target.value))}
          className="absolute inset-0 w-full cursor-pointer opacity-0"
        />
      </div>
    </div>
  );
}

/* ============== PAGE ============== */
export default function Oracle() {
  const [gpa, setGpa]       = useState(8.6);
  const [gre, setGre]       = useState(326);
  const [ielts, setIelts]   = useState(8);
  const [workEx, setWorkEx] = useState(2.5);

  const probability = useMemo(() => {
    const score = Math.min(100, (gpa - 5) * 12 + (gre - 280) * 0.45 + (ielts - 5) * 4 + workEx * 3);
    return Math.max(8, Math.round(score));
  }, [gpa, gre, ielts, workEx]);

  // Trigger thinking theatre on every input change
  const [thinking, setThinking] = useState(false);
  const [runId, setRunId] = useState(0);
  useEffect(() => {
    setRunId(r => r + 1);
    setThinking(true);
    const t = setTimeout(() => setThinking(false), 900);
    return () => clearTimeout(t);
  }, [gpa, gre, ielts, workEx]);

  const factors = [
    { label: "Academic GPA",                impact: 22,  up: true  },
    { label: "Standardized tests",          impact: 18,  up: true  },
    { label: "Research output",             impact: -7,  up: false },
    { label: "Work experience relevance",   impact: 11,  up: true  },
    { label: "SOP strength (drafted)",      impact: 9,   up: true  },
  ];

  const portraitRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: portraitRef, offset: ["start end", "end start"] });
  const yPort = useTransform(scrollYProgress, [0, 1], ["-6%", "10%"]);

  return (
    <PageShell>
      {/* ===== HERO STRIP ===== */}
      <section className="relative overflow-hidden border-b border-[hsl(var(--border))] bg-[hsl(var(--surface))]/60 py-14">
        <div className="mx-auto max-w-7xl px-6">
          <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-[hsl(var(--muted-foreground))]">Surface 02 · Oracle</span>
          <h1 className="mt-3 max-w-3xl font-display text-4xl font-bold leading-[1.05] text-[hsl(var(--foreground))] md:text-6xl">
            Know your odds ;) <span className="italic text-gradient-ink">before you apply.</span>
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-[hsl(var(--muted-foreground))]">
            A live probability gauge built on 1.2M+ historical admits. Drag any input the gauge moves with you.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          {/* ===== GAUGE COLUMN ===== */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: expoOut }}
            className="relative lg:col-span-5"
            data-testid="oracle-gauge-col"
          >
            <div className="rounded-3xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-8 shadow-elev-lg">
              <Gauge pct={probability} confidence={86} />

              <div className="mt-6 grid grid-cols-3 gap-2">
                {[
                  ["Reach",  "<60%",  probability < 60],
                  ["Match",  "60–80%", probability >= 60 && probability < 80],
                  ["Safety", "≥80%",   probability >= 80],
                ].map(([t, r, on]: any) => (
                  <div key={t} className={`rounded-xl border p-3 text-center transition-all ${on ? "border-[hsl(var(--primary))] bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]" : "border-[hsl(var(--border))] bg-[hsl(var(--surface))]"}`}>
                    <div className="font-display text-sm font-bold">{t}</div>
                    <div className={`font-mono text-[10px] uppercase tracking-[0.18em] ${on ? "opacity-80" : "text-[hsl(var(--muted-foreground))]"}`}>{r}</div>
                  </div>
                ))}
              </div>

              <div className="mt-5">
                <ThinkingTheatre active={thinking} runId={runId} />
              </div>

              <div className="mt-5 rounded-2xl bg-[hsl(var(--accent-soft))] p-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-3.5 w-3.5 text-[hsl(var(--primary))]" />
                  <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[hsl(var(--primary))]">Oracle insight</span>
                </div>
                <p className="mt-2 text-sm text-[hsl(var(--primary))]">
                  You're <strong>+12%</strong> above the median admit for this program. A targeted research artefact could push you to <strong>92%</strong>.
                </p>
                <button className="mt-3 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-[hsl(var(--primary))] hover:underline">
                  Apply suggestion <ArrowUpRight className="h-3 w-3" />
                </button>
              </div>
            </div>

            {/* Floating editorial portrait */}
            <motion.div
              ref={portraitRef}
              style={{ y: yPort }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.2, ease: expoOut, delay: 0.3 }}
              className="absolute -left-6 -bottom-10 hidden h-44 w-32 overflow-hidden rounded-2xl shadow-ink ring-4 ring-[hsl(var(--background))] md:block"
            >
              <img src={portraitImg} alt="Student" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[hsl(156_60%_8%)]/40 to-transparent" />
            </motion.div>
          </motion.div>

          {/* ===== INPUTS + FACTORS ===== */}
          <div className="space-y-6 lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: expoOut }}
              className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 shadow-elev"
              data-testid="oracle-inputs"
            >
              <div className="flex items-end justify-between">
                <div>
                  <h2 className="font-display text-xl font-bold">Inputs</h2>
                  <p className="text-sm text-[hsl(var(--muted-foreground))]">Move sliders the gauge responds in real time.</p>
                </div>
                <div className="flex items-center gap-2 rounded-full bg-[hsl(var(--success-soft))] px-3 py-1">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[hsl(var(--success))] opacity-75" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[hsl(var(--success))]" />
                  </span>
                  <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[hsl(var(--success))]">Live model</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-7 md:grid-cols-2">
                <Slider label="Academic GPA"  value={gpa}    min={5}   max={10}  step={0.1} onChange={setGpa}    display={`${gpa.toFixed(1)} / 10`} />
                <Slider label="GRE score"     value={gre}    min={280} max={340} step={1}   onChange={setGre}    display={String(gre)} />
                <Slider label="IELTS / TOEFL" value={ielts}  min={5}   max={9}   step={0.5} onChange={setIelts}  display={`${ielts} band`} />
                <Slider label="Work experience" value={workEx} min={0}  max={10}  step={0.5} onChange={setWorkEx} display={`${workEx} yr`} />
              </div>
            </motion.div>

            {/* FACTORS — with abstract data-viz background */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: expoOut }}
              className="relative overflow-hidden rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 shadow-elev"
              data-testid="oracle-factors"
            >
              <img src={dataVizImg} alt="" className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[0.06] mix-blend-multiply" />
              <div className="relative">
                <h2 className="font-display text-xl font-bold">Why this score</h2>
                <p className="text-sm text-[hsl(var(--muted-foreground))]">Explainable factors derived from your profile (SHAP).</p>

                <div className="mt-5 space-y-3">
                  {factors.map((f, i) => {
                    const mag = Math.abs(f.impact);
                    return (
                      <motion.div
                        key={f.label}
                        initial={{ opacity: 0, x: -12 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, ease: expoOut, delay: i * 0.07 }}
                        className="grid grid-cols-[1fr_auto] items-center gap-4"
                      >
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">{f.label}</span>
                            <span className={`font-mono text-xs tabular-nums ${f.up ? "text-[hsl(var(--success))]" : "text-[hsl(var(--destructive))]"}`}>
                              {f.up ? "+" : "−"}{mag}%
                            </span>
                          </div>
                          <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[hsl(var(--muted))]">
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: `${(mag / 25) * 100}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 1.1, ease: expoOut, delay: 0.1 + i * 0.07 }}
                              className={f.up ? "h-full bg-[hsl(var(--success))]" : "h-full bg-[hsl(var(--destructive))]"}
                            />
                          </div>
                        </div>
                        {f.up
                          ? <ChevronUp className="h-4 w-4 text-[hsl(var(--success))]" />
                          : <ChevronDown className="h-4 w-4 text-[hsl(var(--destructive))]" />}
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>

            {/* COMPARED TO ADMITS — distribution */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: expoOut }}
              className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 shadow-elev"
              data-testid="oracle-distribution"
            >
              <h2 className="font-display text-xl font-bold">Compared to admits</h2>
              <p className="text-sm text-[hsl(var(--muted-foreground))]">Your position in the historical distribution.</p>

              <div className="mt-6">
                <div className="relative h-2 rounded-full bg-gradient-to-r from-[hsl(var(--muted))] via-[hsl(var(--accent-soft))] to-[hsl(var(--accent))]">
                  <motion.div
                    initial={{ left: "0%" }}
                    animate={{ left: `${probability}%` }}
                    transition={{ type: "spring", stiffness: 80, damping: 18 }}
                    className="absolute -top-1 -translate-x-1/2"
                  >
                    <div className="flex h-4 w-4 items-center justify-center rounded-full border-2 border-[hsl(var(--card))] bg-[hsl(var(--primary))] shadow-elev" />
                    <div className="absolute left-1/2 top-5 -translate-x-1/2 whitespace-nowrap rounded-md bg-[hsl(var(--primary))] px-2 py-0.5 font-mono text-[10px] text-[hsl(var(--primary-foreground))]">
                      You · {probability}%
                    </div>
                  </motion.div>
                </div>
                <div className="mt-12 grid grid-cols-3 gap-3">
                  {[["P25", "68%"], ["Median", "78%"], ["P90", "91%"]].map(([k, v]) => (
                    <div key={k} className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))] p-3 text-center">
                      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[hsl(var(--muted-foreground))]">{k}</div>
                      <div className="mt-1 font-display text-lg font-bold">{v}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}