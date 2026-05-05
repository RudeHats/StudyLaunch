"use client";

/* ============================================================
   StudyLaunch — The Loop · Resources & Learning Hub
   Drop-in: place at /app/learn/page.tsx in Next.js App Router.
   Theme matches StudyLaunch (forest + jade + cream, Syne / DM Sans).
   Sections:
     1. Header (kinetic + live counter)
     2. Featured video player (YouTube embed) + playlist
     3. Application-season interactive timeline
     4. Editorial bento (latest blog · podcast · webinar · mentor)
     5. Filterable article grid
     6. Mentor connect (interactive card)
     7. Newsletter band
============================================================ */

import { useEffect, useRef, useState } from "react";
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
  Play,
  Pause,
  Sparkles,
  ArrowUpRight,
  Calendar,
  Clock,
  Headphones,
  BookOpen,
  Youtube,
  Mic,
  Compass,
  Wallet,
  Plane,
  GraduationCap,
  Users,
  Bell,
  Search,
  Filter,
  ChevronRight,
  Star,
} from "lucide-react";
import PageShell from "@/components/site/PageShell";

/* ============================================================
   DATA
============================================================ */
const playlist = [
  {
    id: "rfscVS0vtbw",
    title: "Day in the life — MS at ETH Zürich",
    chan: "ETH Zürich",
    len: "12:04",
    cat: "Campus",
    cover:
      "https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=1600&q=90&auto=format&fit=crop",
  },
  {
    id: "dQw4w9WgXcQ",
    title: "How to write an SOP that gets read",
    chan: "Admit Stories",
    len: "18:40",
    cat: "Essays",
    cover:
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1600&q=90&auto=format&fit=crop",
  },
  {
    id: "5qap5aO4i9A",
    title: "Education loans, demystified",
    chan: "LoanSense Live",
    len: "27:12",
    cat: "Financing",
    cover:
      "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1600&q=90&auto=format&fit=crop",
  },
  {
    id: "9bZkp7q19f0",
    title: "F-1 visa interview — what actually matters",
    chan: "Visa Lab",
    len: "09:48",
    cat: "Visa",
    cover:
      "https://images.unsplash.com/photo-1569974498991-d3c12a504f95?w=1600&q=90&auto=format&fit=crop",
  },
  {
    id: "L_jWHffIx5E",
    title: "First 30 days in a US grad program",
    chan: "Karan V.",
    len: "14:30",
    cat: "Life Abroad",
    cover:
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1600&q=90&auto=format&fit=crop",
  },
];

const articles = [
  {
    cat: "Admissions",
    title: "The 7 mistakes Indian applicants make in their SOP",
    read: "8 min",
    img: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1600&q=90&auto=format&fit=crop",
    author: "Priya M.",
  },
  {
    cat: "Financing",
    title: "Co-signer-free loans: what changed in 2026",
    read: "6 min",
    img: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1600&q=90&auto=format&fit=crop",
    author: "Sahil K.",
  },
  {
    cat: "Visa",
    title: "DS-160 in 14 minutes — annotated walkthrough",
    read: "5 min",
    img: "https://images.unsplash.com/photo-1569974498991-d3c12a504f95?w=1600&q=90&auto=format&fit=crop",
    author: "Visa Lab",
  },
  {
    cat: "Life Abroad",
    title: "Forex, EMIs and groceries — your first month abroad",
    read: "10 min",
    img: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1600&q=90&auto=format&fit=crop",
    author: "Karan V.",
  },
  {
    cat: "Admissions",
    title: "How Oracle scores admit probability — the math",
    read: "11 min",
    img: "https://images.unsplash.com/photo-1627556704302-624286467c65?w=1600&q=90&auto=format&fit=crop",
    author: "Priya S.",
  },
  {
    cat: "Career",
    title: "From OPT to H-1B: what your timeline actually looks like",
    read: "9 min",
    img: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1600&q=90&auto=format&fit=crop",
    author: "Aarav S.",
  },
];

const cats = ["All", "Admissions", "Financing", "Visa", "Life Abroad", "Career"];

const timeline = [
  {
    m: "Jan – Mar",
    t: "Discover",
    d: "Build profile, run Navigator, lock 12 programs.",
    icon: Compass,
  },
  { m: "Apr – Jun", t: "Test", d: "GRE / GMAT / IELTS sprints. Resume & LORs.", icon: GraduationCap },
  { m: "Jul – Sep", t: "Draft", d: "SOP iterations + Oracle pressure tests.", icon: BookOpen },
  { m: "Oct – Dec", t: "Apply", d: "Submit, interview, sanction loans.", icon: Wallet },
  { m: "Jan – Apr", t: "Launch", d: "I-20, F-1, SEVIS, forex, departure.", icon: Plane },
];

const mentors = [
  {
    n: "Aarav Sharma",
    r: "MS CS · ETH Zürich · '24",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=90&auto=format&fit=crop",
    tags: ["SOP", "CS"],
    rate: "Free 20-min",
  },
  {
    n: "Priya Mehta",
    r: "MBA · INSEAD · '23",
    img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=90&auto=format&fit=crop",
    tags: ["MBA", "Loans"],
    rate: "Free 20-min",
  },
  {
    n: "Karan Verma",
    r: "MEng · Toronto · '24",
    img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=90&auto=format&fit=crop",
    tags: ["Visa", "Life"],
    rate: "Free 20-min",
  },
];

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
            transition={{ duration: 0.8, ease: expoOut, delay: delay + i * 0.04 }}
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
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 24, restDelta: 0.001 });
  return (
    <motion.div
      style={{ scaleX }}
      className="fixed left-0 right-0 top-0 z-[60] h-[2px] origin-left bg-[hsl(var(--accent))]"
    />
  );
}

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
            initial={{ y: 0 }}
            exit={{ y: "-101%" }}
            transition={{ duration: 0.7, ease: expoOut }}
            className="fixed inset-0 z-[80] flex items-end justify-between bg-[hsl(var(--primary))] px-6 pb-8 text-[hsl(var(--primary-foreground))] sm:px-10 sm:pb-10"
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] sm:text-xs">
              The Loop
            </span>
            <motion.span
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="font-display text-[14vw] leading-none sm:text-[10vw]"
            >
              learn.
            </motion.span>
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] sm:text-xs">
              Powered by alumni
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

function PulseDot() {
  return (
    <span className="relative inline-flex h-2 w-2">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[hsl(var(--accent))] opacity-60" />
      <span className="relative inline-flex h-2 w-2 rounded-full bg-[hsl(var(--accent))]" />
    </span>
  );
}

/* ============================================================
   1. HEADER
============================================================ */
function Header() {
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "-12%"]);

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
      `radial-gradient(60% 60% at ${x}% ${y}%, hsl(148 60% 55% / 0.2), transparent 70%), radial-gradient(50% 60% at 80% 20%, hsl(40 70% 70% / 0.12), transparent 60%), linear-gradient(180deg, hsl(45 33% 97%) 0%, hsl(45 28% 94%) 100%)`
  );

  return (
    <section
      ref={ref}
      onMouseMove={onMove}
      data-testid="loop-header"
      className="relative overflow-hidden pt-28 sm:pt-32"
    >
      <motion.div style={{ background: mesh }} className="absolute inset-0" />
      <div className="grain pointer-events-none absolute inset-0" />

      <motion.div
        style={{ y }}
        className="relative mx-auto max-w-[1400px] px-6 pb-20 sm:pb-28 lg:px-10"
      >
        <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-[hsl(var(--border))] bg-white/70 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.25em] text-[hsl(var(--muted-foreground))] backdrop-blur sm:text-xs">
          <PulseDot />
          The Loop · 1,283 reading now
        </div>

        <h1 className="font-display text-[clamp(2.6rem,8vw,7rem)] font-700 leading-[0.9] tracking-tight">
          <WordReveal text="Stop guessing." />
          <br />
          <span className="text-gradient-ink">
            <WordReveal text="Start studying" delay={0.08} />
          </span>{" "}
          <span className="italic font-500 text-[hsl(var(--muted-foreground))]">
            <WordReveal text="the application." delay={0.16} />
          </span>
        </h1>

        <p className="mt-7 max-w-2xl text-base leading-relaxed text-[hsl(var(--muted-foreground))] sm:text-lg">
          200+ deconstructed SOPs, 60+ alumni interviews, weekly live sessions and a podcast
          curated by the team that got in. Everything you wish you had on day one.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <div className="relative w-full max-w-md">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[hsl(var(--muted-foreground))]" />
            <input
              data-testid="loop-search"
              placeholder="Search 1,200+ articles, videos, podcasts…"
              className="w-full rounded-full border border-[hsl(var(--border))] bg-white py-3 pl-11 pr-32 text-sm shadow-elev outline-none transition focus:border-[hsl(var(--accent))]"
            />
            <button className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full bg-[hsl(var(--primary))] px-4 py-2 text-xs font-medium text-[hsl(var(--primary-foreground))]">
              Search
            </button>
          </div>
          <button className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--border))] bg-white px-4 py-3 text-xs font-medium hover:bg-[hsl(var(--secondary))]">
            <Filter className="h-3.5 w-3.5" /> Filters
          </button>
        </div>
      </motion.div>
    </section>
  );
}

/* ============================================================
   2. FEATURED VIDEO + PLAYLIST
============================================================ */
function VideoTheatre() {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);
  const v = playlist[active];

  return (
    <section data-testid="video-theatre" className="py-16 sm:py-24">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="font-mono text-xs uppercase tracking-[0.3em] text-[hsl(var(--muted-foreground))]">
              Watch · Featured
            </div>
            <h2 className="mt-2 font-display text-[clamp(1.8rem,3.6vw,3rem)] font-700 leading-[0.95]">
              <WordReveal text="Stories from the other side of the admit." />
            </h2>
          </div>
          <a
            href="#"
            className="inline-flex items-center gap-2 text-sm font-medium underline-grow"
          >
            <Youtube className="h-4 w-4 text-[hsl(var(--accent))]" /> Full library
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.6fr_1fr]">
          {/* Player */}
          <motion.div
            layout
            className="relative overflow-hidden rounded-3xl border border-[hsl(var(--border))] bg-[hsl(var(--primary))] shadow-ink"
          >
            <div className="relative aspect-video w-full">
              <AnimatePresence mode="wait">
                {playing ? (
                  <motion.iframe
                    key={`iframe-${v.id}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    src={`https://www.youtube.com/embed/${v.id}?autoplay=1&rel=0`}
                    title={v.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 h-full w-full"
                  />
                ) : (
                  <motion.button
                    key={`cover-${v.id}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    onClick={() => setPlaying(true)}
                    data-testid="play-featured"
                    className="group absolute inset-0 cursor-pointer"
                  >
                    <img src={v.cover} alt={v.title} className="h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute left-6 right-6 top-6 flex items-center justify-between text-white">
                      <span className="rounded-full bg-white/15 px-3 py-1 font-mono text-[11px] uppercase tracking-widest backdrop-blur">
                        {v.cat}
                      </span>
                      <span className="rounded-full bg-white/15 px-3 py-1 font-mono text-[11px] backdrop-blur">
                        {v.len}
                      </span>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.span
                        whileHover={{ scale: 1.08 }}
                        className="flex h-20 w-20 items-center justify-center rounded-full bg-white/95 text-[hsl(var(--primary))] shadow-elev-lg sm:h-24 sm:w-24"
                      >
                        <Play className="ml-1 h-7 w-7 fill-current sm:h-8 sm:w-8" />
                      </motion.span>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white sm:p-8">
                      <div className="font-mono text-[11px] uppercase tracking-[0.25em] opacity-70">
                        {v.chan}
                      </div>
                      <div className="mt-1 font-display text-2xl font-700 leading-tight sm:text-3xl">
                        {v.title}
                      </div>
                    </div>
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Playlist */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-[hsl(var(--muted-foreground))]">
                Up next · {playlist.length - 1} videos
              </span>
              <button className="text-xs font-medium text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]">
                Shuffle
              </button>
            </div>
            <div className="space-y-3 lg:max-h-[520px] lg:overflow-y-auto lg:pr-1">
              {playlist.map((p, i) => (
                <motion.button
                  key={p.id}
                  onClick={() => {
                    setActive(i);
                    setPlaying(false);
                  }}
                  whileHover={{ x: 4 }}
                  data-testid={`playlist-${i}`}
                  className={`group grid w-full grid-cols-[120px_1fr_auto] items-center gap-4 rounded-2xl border p-2 text-left transition ${
                    i === active
                      ? "border-[hsl(var(--accent))] bg-[hsl(var(--accent-soft))]"
                      : "border-[hsl(var(--border))] bg-white hover:border-[hsl(var(--accent))]"
                  }`}
                >
                  <div className="relative aspect-video w-[120px] overflow-hidden rounded-xl">
                    <img src={p.cover} alt="" className="h-full w-full object-cover" />
                    <span className="absolute bottom-1 right-1 rounded bg-black/70 px-1 font-mono text-[10px] text-white">
                      {p.len}
                    </span>
                    {i === active && (
                      <span className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <span className="rounded-full bg-white p-2 text-[hsl(var(--primary))]">
                          <Play className="h-3 w-3 fill-current" />
                        </span>
                      </span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-[hsl(var(--accent))]">
                      {p.cat}
                    </div>
                    <div className="mt-0.5 line-clamp-2 font-display text-sm font-600 leading-snug">
                      {p.title}
                    </div>
                    <div className="mt-1 text-[11px] text-[hsl(var(--muted-foreground))]">
                      {p.chan}
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-[hsl(var(--muted-foreground))] transition group-hover:translate-x-0.5" />
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   3. APPLICATION SEASON TIMELINE
============================================================ */
function SeasonTimeline() {
  return (
    <section
      data-testid="season-timeline"
      className="relative overflow-hidden bg-[hsl(var(--primary))] py-24 text-[hsl(var(--primary-foreground))]"
    >
      <div className="grain pointer-events-none absolute inset-0 opacity-50" />
      <div className="relative mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="font-mono text-xs uppercase tracking-[0.3em] opacity-70">
              The application year
            </div>
            <h2 className="mt-3 font-display text-[clamp(1.8rem,3.6vw,3.2rem)] font-700 leading-[0.95]">
              <WordReveal text="Twelve months." />
              <br />
              <WordReveal text="Five chapters." delay={0.08} />
            </h2>
          </div>
          <p className="max-w-sm text-sm opacity-80">
            Each phase has its own playlist, articles, and live sessions in The Loop. Tap a chapter
            to dive in.
          </p>
        </div>

        <div className="relative">
          <div className="absolute inset-x-0 top-[34px] hidden h-px bg-white/15 md:block" />
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-5">
            {timeline.map((s, i) => (
              <motion.div
                key={s.t}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10% 0px" }}
                transition={{ delay: i * 0.08, duration: 0.7, ease: expoOut }}
                whileHover={{ y: -4 }}
                className="group relative cursor-pointer rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur transition hover:border-[hsl(var(--accent))] hover:bg-white/[0.07]"
              >
                <div className="relative mb-5 flex h-[18px] items-center">
                  <span className="h-[18px] w-[18px] rounded-full border-2 border-[hsl(var(--accent))] bg-[hsl(var(--primary))]" />
                </div>
                <s.icon className="mb-3 h-5 w-5 text-[hsl(var(--accent))]" />
                <div className="font-mono text-[10px] uppercase tracking-[0.25em] opacity-60">
                  {s.m}
                </div>
                <div className="mt-1 font-display text-xl font-700">{s.t}</div>
                <div className="mt-2 text-sm opacity-80">{s.d}</div>
                <div className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-[hsl(var(--accent))] opacity-0 transition group-hover:opacity-100">
                  Open chapter <ArrowUpRight className="h-3 w-3" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   4. EDITORIAL BENTO
============================================================ */
function Bento() {
  return (
    <section data-testid="bento" className="py-24">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <div className="font-mono text-xs uppercase tracking-[0.3em] text-[hsl(var(--muted-foreground))]">
              This week in The Loop
            </div>
            <h2 className="mt-2 font-display text-[clamp(1.8rem,3.6vw,3rem)] font-700">
              Hand-picked, never algorithmic.
            </h2>
          </div>
        </div>

        <div className="grid auto-rows-[200px] grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2">
          {/* Big article */}
          <motion.a
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: expoOut }}
            href="#"
            className="group relative col-span-1 row-span-1 overflow-hidden rounded-3xl shadow-elev sm:col-span-2 lg:row-span-2"
          >
            <img
              src="https://images.unsplash.com/photo-1606761568499-6d2451b23c66?w=2000&q=90&auto=format&fit=crop"
              alt=""
              className="absolute inset-0 h-full w-full object-cover transition duration-[1.2s] group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="relative flex h-full flex-col justify-end p-6 text-white sm:p-8">
              <div className="mb-2 inline-flex items-center gap-2">
                <span className="rounded-full bg-white/20 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest backdrop-blur">
                  Long read
                </span>
                <span className="font-mono text-[10px] uppercase tracking-widest opacity-70">
                  20 min · Jan 2026
                </span>
              </div>
              <div className="font-display text-2xl font-700 leading-tight sm:text-3xl">
                The hidden grammar of admit committees — and how to write to it.
              </div>
              <div className="mt-3 inline-flex items-center gap-2 text-sm opacity-90">
                Read essay <ArrowUpRight className="h-4 w-4" />
              </div>
            </div>
          </motion.a>

          {/* Podcast */}
          <motion.a
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08, duration: 0.7, ease: expoOut }}
            href="#"
            className="group relative overflow-hidden rounded-3xl border border-[hsl(var(--border))] bg-[hsl(var(--primary))] p-5 text-[hsl(var(--primary-foreground))]"
          >
            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] opacity-70">
              <Headphones className="h-3.5 w-3.5 text-[hsl(var(--accent))]" /> Podcast · Ep. 24
            </div>
            <div className="mt-4 font-display text-xl font-700 leading-tight">
              Inside Oracle: probabilistic admissions, explained.
            </div>
            <div className="mt-auto flex items-center justify-between pt-6">
              <span className="rounded-full bg-[hsl(var(--accent))] p-2 text-[hsl(var(--accent-foreground))]">
                <Play className="h-3 w-3 fill-current" />
              </span>
              <span className="font-mono text-[11px] opacity-70">42:18</span>
            </div>
          </motion.a>

          {/* Webinar */}
          <motion.a
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.12, duration: 0.7, ease: expoOut }}
            href="#"
            className="group relative overflow-hidden rounded-3xl border border-[hsl(var(--border))] bg-white p-5"
          >
            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-[hsl(var(--muted-foreground))]">
              <Calendar className="h-3.5 w-3.5 text-[hsl(var(--accent))]" /> Live · Sat 7 PM IST
            </div>
            <div className="mt-3 font-display text-lg font-700 leading-tight">
              SOP teardown · live with INSEAD admits
            </div>
            <div className="mt-3 flex items-center gap-2">
              <PulseDot />
              <span className="text-xs text-[hsl(var(--muted-foreground))]">
                412 attending
              </span>
            </div>
            <button className="mt-auto inline-flex items-center gap-2 self-start rounded-full bg-[hsl(var(--primary))] px-3 py-1.5 text-xs font-medium text-[hsl(var(--primary-foreground))]">
              <Bell className="h-3 w-3" /> Remind me
            </button>
          </motion.a>

          {/* Mentor of week */}
          <motion.a
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.16, duration: 0.7, ease: expoOut }}
            href="#"
            className="group relative col-span-1 overflow-hidden rounded-3xl border border-[hsl(var(--border))] bg-white p-5 sm:col-span-2"
          >
            <div className="flex items-center gap-4">
              <img
                src={mentors[0].img}
                alt=""
                className="h-14 w-14 rounded-full object-cover"
              />
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-[hsl(var(--accent))]">
                  Mentor of the week
                </div>
                <div className="font-display text-lg font-700">{mentors[0].n}</div>
                <div className="text-xs text-[hsl(var(--muted-foreground))]">
                  {mentors[0].r}
                </div>
              </div>
              <span className="ml-auto inline-flex items-center gap-1 text-sm">
                <Star className="h-4 w-4 fill-[hsl(var(--accent))] text-[hsl(var(--accent))]" />{" "}
                4.96
              </span>
            </div>
            <p className="mt-4 text-sm text-[hsl(var(--muted-foreground))]">
              "I rewrote my SOP four times. The fourth one was the first I'd send to my own
              committee."
            </p>
          </motion.a>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   5. ARTICLE GRID (filterable)
============================================================ */
function Articles() {
  const [cat, setCat] = useState("All");
  const filtered = cat === "All" ? articles : articles.filter((a) => a.cat === cat);

  return (
    <section data-testid="articles" className="bg-[hsl(var(--surface))] py-24">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="font-mono text-xs uppercase tracking-[0.3em] text-[hsl(var(--muted-foreground))]">
              Read · 240 articles
            </div>
            <h2 className="mt-2 font-display text-[clamp(1.8rem,3.6vw,3rem)] font-700">
              From the desks of those who did it.
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {cats.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                data-testid={`cat-${c.toLowerCase().replace(" ", "-")}`}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                  cat === c
                    ? "border-[hsl(var(--primary))] bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]"
                    : "border-[hsl(var(--border))] bg-white hover:border-[hsl(var(--accent))]"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <motion.div
          layout
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence>
            {filtered.map((a, i) => (
              <motion.a
                key={`${a.title}-${cat}`}
                layout
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: i * 0.05, duration: 0.5, ease: expoOut }}
                href="#"
                className="group flex flex-col overflow-hidden rounded-3xl border border-[hsl(var(--border))] bg-white shadow-elev hover-lift"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={a.img}
                    alt=""
                    className="h-full w-full object-cover transition duration-[1.2s] group-hover:scale-105"
                    loading="lazy"
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-white/90 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest backdrop-blur">
                    {a.cat}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-display text-xl font-700 leading-tight">{a.title}</h3>
                  <div className="mt-auto flex items-center justify-between pt-6 text-xs text-[hsl(var(--muted-foreground))]">
                    <span>By {a.author}</span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {a.read}
                    </span>
                  </div>
                </div>
              </motion.a>
            ))}
          </AnimatePresence>
        </motion.div>

        <div className="mt-12 text-center">
          <button className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--border))] bg-white px-6 py-3 text-sm font-medium hover:bg-[hsl(var(--secondary))]">
            Load more <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   6. MENTOR CONNECT
============================================================ */
function MentorConnect() {
  const [q, setQ] = useState("");
  return (
    <section data-testid="mentors" className="py-24">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="mb-12 grid grid-cols-1 items-end gap-6 lg:grid-cols-[1fr_auto]">
          <div>
            <div className="font-mono text-xs uppercase tracking-[0.3em] text-[hsl(var(--muted-foreground))]">
              Talk · 60+ mentors
            </div>
            <h2 className="mt-2 font-display text-[clamp(1.8rem,3.6vw,3rem)] font-700">
              <WordReveal text="The fastest way through the application" />
              <br />
              <span className="italic text-[hsl(var(--muted-foreground))]">
                <WordReveal text="is someone who's already been through it." delay={0.08} />
              </span>
            </h2>
          </div>
          <p className="max-w-sm text-sm text-[hsl(var(--muted-foreground))]">
            Every mentor below has an admit at a top-50 program. First 20 minutes, on us.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {mentors.map((m, i) => (
            <motion.div
              key={m.n}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ delay: i * 0.1, duration: 0.7, ease: expoOut }}
              data-testid={`mentor-${i}`}
              className="group relative overflow-hidden rounded-3xl border border-[hsl(var(--border))] bg-white p-6 shadow-elev hover-lift"
            >
              <div className="flex items-start gap-4">
                <div className="relative h-16 w-16 flex-none">
                  <div className="absolute inset-0 rounded-full border border-dashed border-[hsl(var(--accent))] opacity-60 [animation:spin_22s_linear_infinite]" />
                  <img
                    src={m.img}
                    alt={m.n}
                    className="h-full w-full rounded-full object-cover p-[3px]"
                  />
                </div>
                <div>
                  <div className="font-display text-lg font-700">{m.n}</div>
                  <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-[hsl(var(--accent))]">
                    {m.r}
                  </div>
                </div>
                <span className="ml-auto inline-flex items-center gap-1 text-xs">
                  <PulseDot />
                  online
                </span>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {m.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-[hsl(var(--accent-soft))] px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-[hsl(var(--accent))]"
                  >
                    {t}
                  </span>
                ))}
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-[hsl(var(--border))] pt-5">
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-[hsl(var(--muted-foreground))]">
                    First call
                  </div>
                  <div className="font-display text-lg font-700">{m.rate}</div>
                </div>
                <button className="inline-flex items-center gap-2 rounded-full bg-[hsl(var(--primary))] px-4 py-2 text-xs font-medium text-[hsl(var(--primary-foreground))]">
                  Book <ArrowUpRight className="h-3 w-3" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Ask anything */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: expoOut }}
          className="mt-12 overflow-hidden rounded-3xl border border-[hsl(var(--border))] bg-[hsl(var(--primary))] p-6 text-[hsl(var(--primary-foreground))] sm:p-10"
        >
          <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-[1fr_auto]">
            <div>
              <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] opacity-70">
                <Mic className="h-3.5 w-3.5 text-[hsl(var(--accent))]" /> Ask the community
              </div>
              <div className="mt-2 font-display text-2xl font-700 leading-tight sm:text-3xl">
                Got a question? 1,283 alumni reading right now.
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-white p-1.5 shadow-elev">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                data-testid="ask-input"
                placeholder="Ask anything…"
                className="w-full bg-transparent px-4 text-sm text-[hsl(var(--foreground))] outline-none sm:w-72"
              />
              <button className="inline-flex items-center gap-2 rounded-full bg-[hsl(var(--accent))] px-4 py-2 text-xs font-medium text-[hsl(var(--accent-foreground))]">
                Ask <ArrowUpRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ============================================================
   7. NEWSLETTER
============================================================ */
function Newsletter() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  return (
    <section
      data-testid="newsletter"
      className="relative overflow-hidden border-t border-[hsl(var(--border))] py-24"
    >
      <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_30%,hsl(148_60%_85%/.5),transparent_70%)]" />
      <div className="relative mx-auto max-w-[900px] px-6 text-center lg:px-10">
        <Sparkles className="mx-auto h-6 w-6 text-[hsl(var(--accent))]" />
        <h2 className="mt-4 font-display text-[clamp(2rem,5vw,4.5rem)] font-700 leading-[1] tracking-tight">
          <WordReveal text="The Loop, every Saturday." />
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-[hsl(var(--muted-foreground))]">
          One long read. Three short ones. A live session invite. No spam, no growth hacks.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (email) setDone(true);
          }}
          className="mx-auto mt-10 flex w-full max-w-md items-center gap-2 rounded-full border border-[hsl(var(--border))] bg-white p-2 shadow-elev"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            data-testid="newsletter-email"
            placeholder="you@university.edu"
            required
            className="w-full bg-transparent px-4 py-2 text-sm outline-none"
          />
          <button
            data-testid="newsletter-submit"
            className="inline-flex items-center gap-2 rounded-full bg-[hsl(var(--primary))] px-5 py-2.5 text-xs font-medium text-[hsl(var(--primary-foreground))] sm:text-sm"
          >
            {done ? (
              <>
                Subscribed <Sparkles className="h-3.5 w-3.5" />
              </>
            ) : (
              <>
                Subscribe <ArrowUpRight className="h-3.5 w-3.5" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 inline-flex items-center gap-2 font-mono text-xs text-[hsl(var(--muted-foreground))]">
          <Users className="h-3.5 w-3.5 text-[hsl(var(--accent))]" />
          26,400 students already reading
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   PAGE
============================================================ */
export default function Loop() {
  return (
    <PageShell>
      <PageEnter>
        <ScrollProgressRail />
        <Header />
        <VideoTheatre />
        <SeasonTimeline />
        <Bento />
        <Articles />
        <MentorConnect />
        <Newsletter />
      </PageEnter>
    </PageShell>
  );
}