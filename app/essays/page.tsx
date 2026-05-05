"use client";

/* ============================================================
   StudyLaunch — Surface 05 · Essay Co-Pilot
   Refactor goals:
   - Fully responsive (mobile-first, collapses to drawer)
   - Editorial / artful: kinetic header, floating panels, glass,
     voice-fingerprint, rubric scoring, version timeline
   - Same theme (Syne / DM Sans / forest + jade + cream)
   - Single-file, drop-in replacement for /app/page.tsx
============================================================ */

import { useEffect, useMemo, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useInView,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  Sparkles,
  Wand2,
  RefreshCcw,
  Check,
  FileText,
  MessageSquareQuote,
  ArrowUpRight,
  Brain,
  Compass,
  Save,
  History,
  Layers,
  Mic,
  Lock,
  ChevronDown,
  ShieldCheck,
  Bookmark,
  Download,
  Share2,
  X,
} from "lucide-react";
import PageShell from "@/components/site/PageShell";

/* ============================================================
   DATA
============================================================ */
const initial = `Growing up in Pune, I watched my grandfather — a retired statistician — solve crossword puzzles with the precision of a chess player. He taught me that elegance in a solution is not a luxury; it is a sign that you have understood the problem at its root.

This early apprenticeship in clarity led me to computer science, and eventually to systems research. As a software engineer at Razorpay, I designed the rate-limiting layer that processes 2.8 billion API calls a month. The work taught me that distributed systems are not just engineering artefacts — they are social contracts written in code.

At Oxford, I want to formalise these intuitions under Prof. Marta Kwiatkowska — pairing my production scars with the rigor of probabilistic verification.`;

const suggestions = [
  {
    type: "Voice",
    icon: Mic,
    severity: "med",
    note: "Replace 'apprenticeship in clarity' with a concrete image — Oxford committees reward specificity over abstraction.",
    snippet: "apprenticeship in clarity",
  },
  {
    type: "Evidence",
    icon: Brain,
    severity: "high",
    note: "Quantify the impact of your rate-limiter. '2.8B requests' is good; add a latency or savings metric.",
    snippet: "2.8 billion API calls a month",
  },
  {
    type: "Hook",
    icon: Sparkles,
    severity: "low",
    note: "Strong opening. Consider tightening the second paragraph by one sentence.",
    snippet: "early apprenticeship",
  },
  {
    type: "Faculty fit",
    icon: Compass,
    severity: "med",
    note: "Add a single sentence connecting Kwiatkowska's PRISM toolkit to your rate-limiter work.",
    snippet: "Prof. Marta Kwiatkowska",
  },
];

const rubric = [
  {
    l: "Clarity",
    v: 0.86,
  },
  {
    l: "Specificity",
    v: 0.62,
  },
  {
    l: "Faculty fit",
    v: 0.71,
  },
  {
    l: "Voice integrity",
    v: 0.93,
  },
  { l: "Brevity", v: 0.78 },
];

const versions = [
  {
    t: "Now",
    l: "Working draft",
    live: true,
  },
  {
    t: "2h ago",
    l: "Tightened opener · −38 words",
  },
  {
    t: "Yesterday",
    l: "Added Kwiatkowska reference",
  },
  { t: "Mon", l: "Initial seed from Navigator" },
];

const programs = ["Oxford MSc CS", "ETH MSc CS", "CMU MSCS"];

const expoOut: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* ============================================================
   PRIMITIVES
============================================================ */

function WordReveal({
  text,
  className = "",
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  const words = text.split(" ");
  return (
    <span className={className}>
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom">
          <motion.span
            initial={{ y: "110%" }}
            whileInView={{ y: "0%" }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{
              duration: 0.8,
              ease: expoOut,
              delay: delay + i * 0.04,
            }}
            className="inline-block pr-[0.25em]"
          >
            {w}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

function ScrollProgressRail() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    restDelta: 0.001,
  });
  return (
    <motion.div
      data-testid="scroll-progress-rail"
      style={{ scaleX }}
      className="fixed left-0 right-0 top-0 z-[60] h-[2px] origin-left bg-[hsl(var(--accent))]"
    />
  );
}

/* Voice fingerprint — micro waveform that reacts to text length */
function VoiceFingerprint({ words }: { words: number }) {
  const bars = 28;
  return (
    <div className="flex h-8 items-end gap-[3px]">
      {Array.from({ length: bars }).map((_, i) => {
        const h = 18 + Math.sin((i + words / 9) * 0.7) * 14 + (i % 3) * 4;
        return (
          <motion.span
            key={i}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ delay: i * 0.02, duration: 0.6, ease: expoOut }}
            style={{ height: `${Math.max(6, Math.min(32, h))}px` }}
            className="block w-[3px] origin-bottom rounded-full bg-[hsl(var(--accent))]"
          />
        );
      })}
    </div>
  );
}

/* Animated arc — used for anti-homogenisation gauge */
function ArcMeter({
  value,
  label,
  sub,
}: {
  value: number;
  label: string;
  sub?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, {
    once: true,
    margin: "-15% 0px",
  });
  const progress = useSpring(0, { stiffness: 60, damping: 20 });
  useEffect(() => {
    if (inView) progress.set(value);
  }, [inView, progress, value]);
  const C = 2 * Math.PI * 38;
  const dash = useTransform(progress, (p) => C * (1 - p / 100));
  const [pct, setPct] = useState(0);
  useEffect(
    () => progress.on("change", (v) => setPct(Math.round(v))),
    [progress],
  );

  return (
    <div ref={ref} className="flex items-center gap-4">
      <svg width="92" height="92" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="38"
          stroke="hsl(var(--border))"
          strokeWidth="6"
          fill="none"
        />
        <motion.circle
          cx="50"
          cy="50"
          r="38"
          stroke="hsl(var(--accent))"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
          strokeDasharray={C}
          style={{ strokeDashoffset: dash }}
          transform="rotate(-90 50 50)"
        />
        <text
          x="50"
          y="55"
          textAnchor="middle"
          fontSize="20"
          fontWeight="700"
          fill="hsl(var(--foreground))"
        >
          {pct}
        </text>
      </svg>
      <div>
        <div className="font-display text-base font-700">{label}</div>
        {sub && (
          <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-[hsl(var(--muted-foreground))]">
            {sub}
          </div>
        )}
      </div>
    </div>
  );
}

/* Kinetic page enter (matches landing curtain) */
function PageEnter({ children }: { children: React.ReactNode }) {
  const [done, setDone] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setDone(true), 850);
    return () => clearTimeout(t);
  }, []);
  return (
    <>
      <AnimatePresence>
        {!done && (
          <motion.div
            data-testid="page-curtain"
            initial={{ y: 0 }}
            exit={{ y: "-101%" }}
            transition={{ duration: 0.7, ease: expoOut }}
            className="fixed inset-0 z-[80] flex items-end justify-between bg-[hsl(var(--primary))] px-6 pb-8 text-[hsl(var(--primary-foreground))] sm:px-10 sm:pb-10"
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] sm:text-xs">
              Surface 05
            </span>
            <motion.span
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="font-display text-[14vw] leading-none sm:text-[10vw]"
            >
              draft.
            </motion.span>
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] sm:text-xs">
              Essay Co - Pilot
            </span>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.65, duration: 0.6 }}
      >
        {children}
      </motion.div>
    </>
  );
}

/* ============================================================
   SECTIONS
============================================================ */

function Header() {
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "-12%"]);
  const op = useTransform(scrollYProgress, [0, 1], [1, 0.2]);

  const mx = useMotionValue(50);
  const my = useMotionValue(50);
  const onMove = (e: React.MouseEvent) => {
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    mx.set(((e.clientX - r.left) / r.width) * 100);
    my.set(((e.clientY - r.top) / r.height) * 100);
  };
  const mesh = useTransform(
    [mx, my],
    ([x, y]) =>
      `radial-gradient(55% 55% at ${x}% ${y}%, hsl(148 60% 55% / 0.18), transparent 70%), radial-gradient(45% 55% at 80% 20%, hsl(148 70% 70% / 0.10), transparent 60%), linear-gradient(180deg, hsl(45 33% 97%) 0%, hsl(45 28% 94%) 100%)`,
  );

  return (
    <section
      ref={ref}
      onMouseMove={onMove}
      data-testid="essay-header"
      className="relative overflow-hidden pt-28 sm:pt-32"
    >
      <motion.div style={{ background: mesh }} className="absolute inset-0" />
      <div className="grain pointer-events-none absolute inset-0" />

      <motion.div
        style={{ y, opacity: op }}
        className="relative mx-auto max-w-[1400px] px-6 pb-20 sm:pb-28 lg:px-10"
      >
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[hsl(var(--border))] bg-white/70 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.25em] text-[hsl(var(--muted-foreground))] backdrop-blur sm:text-xs">
          <Sparkles className="h-3.5 w-3.5 text-[hsl(var(--accent))]" />
          Surface 05 · Essay Co - Pilot
        </div>

        <h1 className="font-display text-[clamp(2.4rem,7vw,6rem)] font-700 leading-[0.92] tracking-tight">
          <WordReveal text="Your SOP," />
          <br />
          <span className="text-gradient-ink">
            <WordReveal text="in your voice." delay={0.08} />
          </span>
        </h1>

        <p className="mt-7 max-w-2xl text-base leading-relaxed text-[hsl(var(--muted-foreground))] sm:text-lg">
          Draft, refine and pressure - test your statement of purpose against
          the rubric of every program in your shortlist.The AI never overwrites
          — it observes, critiques, and lets you decide.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-4 text-xs font-mono uppercase tracking-[0.25em] text-[hsl(var(--muted-foreground))]">
          <span className="inline-flex items-center gap-2">
            <Lock className="h-3.5 w-3.5 text-[hsl(var(--accent))]" /> On-device
            drafting
          </span>
          <span className="hidden h-3 w-px bg-[hsl(var(--border))] sm:block" />
          <span className="inline-flex items-center gap-2">
            <ShieldCheck className="h-3.5 w-3.5 text-[hsl(var(--accent))]" />{" "}
            Anti-homogenisation
          </span>
          <span className="hidden h-3 w-px bg-[hsl(var(--border))] sm:block" />
          <span> 3 programs · 1 voice</span>
        </div>
      </motion.div>
    </section>
  );
}

/* ============================================================
   EDITOR + AI CO-PILOT (the centerpiece)
============================================================ */
function Studio() {
  const [text, setText] = useState(initial);
  const [tab, setTab] = useState<"draft" | "outline">("draft");
  const [program, setProgram] = useState(programs[0]);
  const [aiTab, setAiTab] = useState<"suggest" | "rubric" | "history">(
    "suggest",
  );
  const [drawer, setDrawer] = useState(false);
  const [saved, setSaved] = useState<"saved" | "saving" | "idle">("idle");

  const words = useMemo(
    () => text.trim().split(/\s+/).filter(Boolean).length,
    [text],
  );
  const target = 1000;
  const pct = Math.min(100, Math.round((words / target) * 100));

  // simulated save
  useEffect(() => {
    setSaved("saving");
    const t = setTimeout(() => setSaved("saved"), 700);
    return () => clearTimeout(t);
  }, [text]);

  return (
    <section data-testid="studio" className="relative pb-24">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
          {/* ============== EDITOR ============== */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: expoOut }}
            className="relative overflow-hidden rounded-3xl border border-[hsl(var(--border))] bg-white shadow-elev"
          >
            {/* Top bar */}
            <div className="flex flex-wrap items-center gap-3 border-b border-[hsl(var(--border))] bg-[hsl(var(--surface))] px-4 py-3 sm:px-6">
              <div className="flex rounded-full bg-[hsl(var(--muted))] p-1">
                {(["draft", "outline"] as const).map((t) => (
                  <button
                    key={t}
                    data-testid={`tab-${t}`}
                    onClick={() => setTab(t)}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium transition sm:px-4 sm:text-sm ${
                      tab === t
                        ? "bg-white shadow-elev text-[hsl(var(--foreground))]"
                        : "text-[hsl(var(--muted-foreground))]"
                    }`}
                  >
                    {t === "draft" ? "Draft" : "Outline"}
                  </button>
                ))}
              </div>

              <div className="ml-auto flex items-center gap-3 text-[11px] font-mono uppercase tracking-[0.25em] text-[hsl(var(--muted-foreground))] sm:text-xs">
                <span className="hidden sm:inline">SOP ·</span>
                <select
                  value={program}
                  onChange={(e) => setProgram(e.target.value)}
                  data-testid="program-select"
                  className="cursor-pointer rounded-full border border-[hsl(var(--border))] bg-white px-3 py-1 text-[hsl(var(--foreground))]"
                >
                  {programs.map((p) => (
                    <option key={p}>{p}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => setDrawer(true)}
                data-testid="open-copilot-mobile"
                className="ml-auto inline-flex items-center gap-2 rounded-full bg-[hsl(var(--primary))] px-3 py-1.5 text-xs font-medium text-[hsl(var(--primary-foreground))] lg:hidden"
              >
                <Wand2 className="h-3.5 w-3.5" /> Co-pilot
              </button>
            </div>

            {/* Stats strip */}
            <div className="grid grid-cols-2 gap-2 border-b border-[hsl(var(--border))] bg-white px-4 py-4 sm:grid-cols-4 sm:px-6">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-[hsl(var(--muted-foreground))]">
                  Words
                </div>
                <div className="mt-1 flex items-end gap-2">
                  <span className="font-display text-2xl font-700">
                    {words}
                  </span>
                  <span className="pb-1 font-mono text-[11px] text-[hsl(var(--muted-foreground))]">
                    / {target}
                  </span>
                </div>
                <div className="mt-2 h-1 overflow-hidden rounded-full bg-[hsl(var(--muted))]">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.6, ease: expoOut }}
                    className="h-full bg-[hsl(var(--accent))]"
                  />
                </div>
              </div>

              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-[hsl(var(--muted-foreground))]">
                  Voice fingerprint
                </div>
                <div className="mt-2">
                  <VoiceFingerprint words={words} />
                </div>
              </div>

              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-[hsl(var(--muted-foreground))]">
                  Originality
                </div>
                <div className="mt-1 font-display text-2xl font-700 text-[hsl(var(--accent))]">
                  92%
                </div>
                <div className="font-mono text-[10px] text-[hsl(var(--muted-foreground))]">
                  vs. 240k essays
                </div>
              </div>

              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-[hsl(var(--muted-foreground))]">
                  Status
                </div>
                <div className="mt-1 flex items-center gap-2">
                  {saved === "saving" ? (
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{
                        repeat: Infinity,
                        duration: 1.2,
                        ease: "linear",
                      }}
                    >
                      <RefreshCcw className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
                    </motion.span>
                  ) : (
                    <Check className="h-4 w-4 text-[hsl(var(--accent))]" />
                  )}
                  <span className="font-display text-base font-600">
                    {saved === "saving" ? "Saving…" : "All changes saved"}
                  </span>
                </div>
              </div>
            </div>

            {/* Document */}
            <div className="relative px-4 py-8 sm:px-10 sm:py-12">
              <AnimatePresence mode="wait">
                <motion.div
                  key={tab}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.4, ease: expoOut }}
                >
                  {tab === "draft" ? (
                    <textarea
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      data-testid="essay-textarea"
                      spellCheck
                      className="min-h-[420px] w-full resize-none border-0 bg-transparent font-display text-lg leading-[1.7] tracking-[-0.005em] text-[hsl(var(--foreground))] outline-none sm:text-xl sm:leading-[1.75]"
                    />
                  ) : (
                    <ol className="space-y-6 text-base leading-relaxed sm:text-lg">
                      {[
                        [
                          "Hook",
                          "Grandfather + crossword → elegance as understanding.",
                        ],
                        [
                          "Bridge",
                          "Apprenticeship in clarity → CS → systems research.",
                        ],
                        [
                          "Evidence",
                          "Razorpay rate-limiter · 2.8B/mo · social contracts in code.",
                        ],
                        [
                          "Faculty fit",
                          "Kwiatkowska, PRISM, probabilistic verification of distributed systems.",
                        ],
                        ["Close", "Why Oxford specifically + post-MS plan."],
                      ].map(([h, b], i) => (
                        <li key={i} className="grid grid-cols-[auto_1fr] gap-5">
                          <span className="font-mono text-sm text-[hsl(var(--accent))]">
                            0{i + 1}
                          </span>
                          <div>
                            <div className="font-display text-lg font-700">
                              {h}
                            </div>
                            <div className="text-[hsl(var(--muted-foreground))]">
                              {b}
                            </div>
                          </div>
                        </li>
                      ))}
                    </ol>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Footer toolbar */}
            <div className="sticky bottom-0 flex flex-wrap items-center gap-2 border-t border-[hsl(var(--border))] bg-white/85 px-4 py-3 backdrop-blur sm:px-6">
              <button className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--border))] px-3 py-1.5 text-xs font-medium hover:bg-[hsl(var(--secondary))] sm:text-sm">
                <Save className="h-3.5 w-3.5" /> Save
              </button>
              <button className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--border))] px-3 py-1.5 text-xs font-medium hover:bg-[hsl(var(--secondary))] sm:text-sm">
                <Download className="h-3.5 w-3.5" /> Export
              </button>
              <button className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--border))] px-3 py-1.5 text-xs font-medium hover:bg-[hsl(var(--secondary))] sm:text-sm">
                <Share2 className="h-3.5 w-3.5" /> Share
              </button>
              <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.25em] text-[hsl(var(--muted-foreground))] sm:text-xs">
                v · 0.4
              </span>
              <button
                data-testid="ai-polish"
                className="group inline-flex items-center gap-2 rounded-full bg-[hsl(var(--primary))] px-4 py-2 text-xs font-medium text-[hsl(var(--primary-foreground))] shadow-elev hover:shadow-elev-lg sm:text-sm"
              >
                <Wand2 className="h-3.5 w-3.5" />
                AI polish
                <span className="ml-1 rounded-full bg-[hsl(var(--accent))] px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-widest">
                  ⌘K
                </span>
              </button>
            </div>
          </motion.div>

          {/* ============== AI CO-PILOT (desktop) ============== */}
          <aside className="sticky top-6 hidden h-fit lg:block">
            <CoPilot aiTab={aiTab} setAiTab={setAiTab} />
          </aside>
        </div>
      </div>

      {/* ============== AI CO-PILOT (mobile drawer) ============== */}
      <AnimatePresence>
        {drawer && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawer(false)}
              className="fixed inset-0 z-[70] bg-black/40 backdrop-blur-sm lg:hidden"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.45, ease: expoOut }}
              className="fixed inset-x-0 bottom-0 z-[71] max-h-[88vh] overflow-y-auto rounded-t-3xl border-t border-[hsl(var(--border))] bg-white p-5 lg:hidden"
            >
              <div className="mx-auto mb-4 h-1 w-12 rounded-full bg-[hsl(var(--border))]" />
              <div className="mb-3 flex items-center justify-between">
                <div className="font-display text-lg font-700">Co-Pilot</div>
                <button onClick={() => setDrawer(false)}>
                  <X className="h-5 w-5" />
                </button>
              </div>
              <CoPilot aiTab={aiTab} setAiTab={setAiTab} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}

/* ============================================================
   CO-PILOT PANEL
============================================================ */
function CoPilot({
  aiTab,
  setAiTab,
}: {
  aiTab: "suggest" | "rubric" | "history";
  setAiTab: (t: "suggest" | "rubric" | "history") => void;
}) {
  return (
    <div
      data-testid="copilot-panel"
      className="relative overflow-hidden rounded-3xl border border-[hsl(var(--border))] bg-[hsl(var(--surface-elevated))] shadow-elev"
    >
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-[hsl(var(--border))] bg-[hsl(var(--primary))] px-5 py-4 text-[hsl(var(--primary-foreground))]">
        <div className="relative">
          <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-[hsl(var(--accent))] opacity-30" />
          <Wand2 className="h-4 w-4 text-[hsl(var(--accent))]" />
        </div>
        <div>
          <div className="font-display text-base font-700">Co-Pilot</div>
          <div className="font-mono text-[10px] uppercase tracking-[0.25em] opacity-70">
            Reading your draft · live
          </div>
        </div>
        <button className="ml-auto rounded-full border border-white/15 p-1.5 hover:bg-white/10">
          <RefreshCcw className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[hsl(var(--border))]">
        {(
          [
            ["suggest", "Suggestions", MessageSquareQuote],
            ["rubric", "Rubric", Layers],
            ["history", "History", History],
          ] as const
        ).map(([k, l, Icon]) => (
          <button
            key={k}
            onClick={() => setAiTab(k)}
            data-testid={`copilot-tab-${k}`}
            className={`relative flex flex-1 items-center justify-center gap-2 px-3 py-3 text-xs font-medium transition ${
              aiTab === k
                ? "text-[hsl(var(--foreground))]"
                : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
            } `}
          >
            <Icon className="h-3.5 w-3.5" />
            {l}
            {aiTab === k && (
              <motion.span
                layoutId="copilot-indicator"
                className="absolute bottom-0 left-3 right-3 h-[2px] rounded-full bg-[hsl(var(--accent))]"
              />
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-5">
        <AnimatePresence mode="wait">
          {aiTab === "suggest" && (
            <motion.div
              key="suggest"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4, ease: expoOut }}
              className="space-y-3"
            >
              <ArcMeter
                value={92}
                label="Anti-homogenisation"
                sub="vs. 240k essays"
              />

              <div className="my-5 h-px bg-[hsl(var(--border))]" />

              {suggestions.map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07, duration: 0.5, ease: expoOut }}
                  data-testid={`suggestion-${i}`}
                  className="group relative rounded-2xl border border-[hsl(var(--border))] bg-white p-4 transition hover:border-[hsl(var(--accent))]"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex h-6 w-6 items-center justify-center rounded-full ${
                        s.severity === "high"
                          ? "bg-[hsl(var(--accent-soft))] text-[hsl(var(--accent))]"
                          : s.severity === "med"
                            ? "bg-[hsl(var(--info-soft))] text-[hsl(var(--info))]"
                            : "bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]"
                      } `}
                    >
                      <s.icon className="h-3.5 w-3.5" />
                    </span>
                    <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-[hsl(var(--muted-foreground))]">
                      {s.type}
                    </div>
                    <span
                      className={`ml-auto font-mono text-[9px] uppercase tracking-widest ${
                        s.severity === "high"
                          ? "text-[hsl(var(--accent))]"
                          : s.severity === "med"
                            ? "text-[hsl(var(--info))]"
                            : "text-[hsl(var(--muted-foreground))]"
                      } `}
                    >
                      {s.severity}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-[hsl(var(--foreground))]">
                    {s.note}
                  </p>
                  {s.snippet && (
                    <div className="mt-3 inline-flex items-center gap-2 rounded-lg bg-[hsl(var(--accent-soft))] px-2 py-1 text-[11px]">
                      <Bookmark className="h-3 w-3 text-[hsl(var(--accent))]" />
                      <span className="italic">"{s.snippet}"</span>
                    </div>
                  )}
                  <div className="mt-4 flex items-center gap-2">
                    <button className="inline-flex items-center gap-1 rounded-full bg-[hsl(var(--primary))] px-3 py-1 text-[11px] font-medium text-[hsl(var(--primary-foreground))]">
                      <Check className="h-3 w-3" /> Apply
                    </button>
                    <button className="rounded-full border border-[hsl(var(--border))] px-3 py-1 text-[11px] font-medium hover:bg-[hsl(var(--secondary))]">
                      Dismiss
                    </button>
                    <button className="ml-auto inline-flex items-center gap-1 text-[11px] font-medium text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]">
                      Show in draft <ArrowUpRight className="h-3 w-3" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {aiTab === "rubric" && (
            <motion.div
              key="rubric"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4, ease: expoOut }}
            >
              <div className="mb-1 font-display text-base font-700">
                Oxford MSc CS · rubric
              </div>
              <div className="mb-5 font-mono text-[10px] uppercase tracking-[0.25em] text-[hsl(var(--muted-foreground))]">
                weighted by committee priors
              </div>
              <div className="space-y-4">
                {rubric.map((r, i) => (
                  <div key={r.l}>
                    <div className="flex items-center justify-between text-sm">
                      <span>{r.l}</span>
                      <span className="font-mono text-xs">
                        {Math.round(r.v * 100)}
                      </span>
                    </div>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[hsl(var(--muted))]">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${r.v * 100}%` }}
                        transition={{
                          delay: i * 0.07,
                          duration: 0.7,
                          ease: expoOut,
                        }}
                        className="h-full bg-gradient-to-r from-[hsl(var(--primary-glow))] to-[hsl(var(--accent))]"
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 rounded-2xl border border-dashed border-[hsl(var(--border))] p-4 text-sm text-[hsl(var(--muted-foreground))]">
                Want a higher{" "}
                <span className="text-[hsl(var(--foreground))]">
                  Specificity
                </span>{" "}
                score? Apply suggestion #2 to add quantified impact.
              </div>
            </motion.div>
          )}

          {aiTab === "history" && (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4, ease: expoOut }}
            >
              <div className="relative pl-5">
                <div className="absolute left-1 top-2 bottom-2 w-px bg-[hsl(var(--border))]" />
                {versions.map((v, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: i * 0.06,
                      duration: 0.5,
                      ease: expoOut,
                    }}
                    className="relative mb-5"
                  >
                    <span
                      className={`absolute -left-[18px] top-1.5 h-2.5 w-2.5 rounded-full ring-4 ${
                        v.live
                          ? "bg-[hsl(var(--accent))] ring-[hsl(var(--accent-soft))]"
                          : "bg-[hsl(var(--border))] ring-white"
                      } `}
                    />
                    <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-[hsl(var(--muted-foreground))]">
                      {v.t}
                    </div>
                    <div className="text-sm">{v.l}</div>
                  </motion.div>
                ))}
              </div>
              <button className="mt-2 inline-flex items-center gap-2 rounded-full border border-[hsl(var(--border))] px-3 py-1.5 text-xs font-medium hover:bg-[hsl(var(--secondary))]">
                <History className="h-3.5 w-3.5" /> Restore version
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ============================================================
   PROGRAMS RIBBON
============================================================ */
function ProgramsRibbon() {
  return (
    <section
      data-testid="programs-ribbon"
      className="border-y border-[hsl(var(--border))] bg-[hsl(var(--surface))] py-14"
    >
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="mb-6 font-mono text-xs uppercase tracking-[0.3em] text-[hsl(var(--muted-foreground))]">
          One draft. Tuned to every program.
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {programs.map((p, i) => (
            <motion.div
              key={p}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-15% 0px" }}
              transition={{ delay: i * 0.08, duration: 0.7, ease: expoOut }}
              className="group relative overflow-hidden rounded-3xl border border-[hsl(var(--border))] bg-white p-6 shadow-elev hover-lift"
            >
              <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-[hsl(var(--accent))]">
                Program 0{i + 1}
              </div>
              <div className="mt-2 font-display text-2xl font-700">{p}</div>
              <div className="mt-5 flex items-center justify-between text-sm">
                <span className="text-[hsl(var(--muted-foreground))]">
                  Match
                </span>
                <span className="font-mono">{84 - i * 4}%</span>
              </div>
              <div className="mt-2 h-1 overflow-hidden rounded-full bg-[hsl(var(--muted))]">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${84 - i * 4}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, ease: expoOut, delay: 0.2 }}
                  className="h-full bg-[hsl(var(--accent))]"
                />
              </div>
              <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[hsl(var(--accent-soft))] opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-70" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   FOOTER CTA — link to The Loop
============================================================ */
function FooterCTA() {
  return (
    <section className="relative overflow-hidden py-28">
      <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_30%,hsl(148_60%_85%/.5),transparent_70%)]" />
      <div className="relative mx-auto max-w-[1100px] px-6 text-center lg:px-10">
        <div className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-[hsl(var(--accent))]">
          Stuck on a paragraph?
        </div>
        <h2 className="font-display text-[clamp(2rem,4.5vw,4rem)] font-700 leading-[1] tracking-tight">
          <WordReveal text="The Loop has 200+ SOPs that got in." />
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-[hsl(var(--muted-foreground))]">
          Read, deconstruct, learn. Then close the tab and write yours.
        </p>
        <a
          href="/learn"
          data-testid="cta-loop"
          className="group mt-9 inline-flex items-center gap-2 rounded-full bg-[hsl(var(--primary))] px-7 py-4 text-sm font-medium text-[hsl(var(--primary-foreground))] shadow-elev hover:shadow-elev-lg"
        >
          <span>Open The Loop</span>
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </a>
      </div>
    </section>
  );
}

/* ============================================================
   PAGE
============================================================ */
export default function Essay() {
  return (
    <PageShell>
      <PageEnter>
        <ScrollProgressRail />
        <Header />
        <Studio />
        <ProgramsRibbon />
        <FooterCTA />
      </PageEnter>
    </PageShell>
  );
}
