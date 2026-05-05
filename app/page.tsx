"use client";

/* ============================================================
   StudyLaunch — Refactored Landing (single page.tsx)
   ------------------------------------------------------------
   v2 enhancements (additive — nothing removed from v1):
   • <BlobCursor/>            — corporate-tasteful magnetic cursor
   • <SplitTextReveal/>       — per-letter mask reveal for big titles
   • <Float/>                 — breathing motion wrapper for hero/stat cards
   • Hero SVG flight-path     — animated dashed arc with pulsing endpoint
   • <DestinationsMarquee/>   — image-marquee band of destination cities
   • <ScrapbookCollage/>      — polaroid-style collage before ClosingCTA
   • Journey thumbnails       — each of the 4 steps now has a parallax image
   ============================================================ */

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useInView,
  useReducedMotion,
} from "framer-motion";
import {
  ArrowUpRight,
  Sparkles,
  ShieldCheck,
  Compass,
  GraduationCap,
  FileText,
  Wallet,
  LayoutDashboard,
  Quote,
  Star,
  Plane,
  Linkedin,
  MapPin,
  Globe2,
  Camera,
} from "lucide-react";
import PageShell from "@/components/site/PageShell";

/* ============================================================
   DATA
============================================================ */
const features = [
  {
    href: "/navigator",
    icon: Compass,
    title: "Navigator",
    tag: "Discovery",
    desc: "AI-matched shortlist tuned to profile, budget and goals.",
    img: "https://plus.unsplash.com/premium_photo-1683120963435-6f9355d4a776?q=80&w=663&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    href: "/oracle",
    icon: GraduationCap,
    title: "Oracle",
    tag: "Probability",
    desc: "Real-time admit probability with explainable factors.",
    img: "https://images.unsplash.com/photo-1627556704302-624286467c65?w=2000&q=90&auto=format&fit=crop",
  },
  {
    href: "/loansense",
    icon: Wallet,
    title: "LoanSense",
    tag: "Financing",
    desc: "Co-signer-free loans, EMI modelling, DLG-ready offers.",
    img: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=2000&q=90&auto=format&fit=crop",
  },
  {
    href: "/dashboard",
    icon: LayoutDashboard,
    title: "Dashboard",
    tag: "Command",
    desc: "Deadlines, gap cards, vault — your application HQ.",
    img: "https://images.unsplash.com/photo-1608222351212-18fe0ec7b13b?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    href: "/essays",
    icon: FileText,
    title: "Essay Co-Pilot",
    tag: "Craft",
    desc: "SOP drafting with AI that keeps your voice, not replaces it.",
    img: "https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=2000&q=90&auto=format&fit=crop",
  },
];

const stats = [
  { v: 4200, prefix: "₹", suffix: " Cr", l: "Loans modeled" },
  { v: 112400, prefix: "", suffix: "", l: "Students onboarded", format: "comma" as const },
  { v: 94, prefix: "", suffix: "%", l: "Admit accuracy" },
  { v: 38, prefix: "", suffix: " hrs", l: "Avg. saved / app" },
];

/* journey now carries thumbnail imagery for the pinned rail */
const journey = [
  {
    n: "01",
    t: "Discover",
    d: "Tell us your goal. 12 best-fit programs in 30 seconds.",
    img: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&q=90&auto=format&fit=crop",
  },
  {
    n: "02",
    t: "Predict",
    d: "Oracle scores your admit odds across every shortlist.",
    img: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=1200&q=90&auto=format&fit=crop",
  },
  {
    n: "03",
    t: "Finance",
    d: "LoanSense sanctions a co-signer-free offer.",
    img: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1200&q=90&auto=format&fit=crop",
  },
  {
    n: "04",
    t: "Launch",
    d: "Track deadlines, drafts and disbursals in one cockpit.",
    img: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1200&q=90&auto=format&fit=crop",
  },
];

const testimonials = [
  {
    n: "Aarav S.",
    r: "MS CS, ETH Zürich",
    q: "Oracle changed my shortlist overnight. I dropped two reach schools, added one I'd never have dared — and got in.",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=90&auto=format&fit=crop",
  },
  {
    n: "Priya M.",
    r: "MBA, INSEAD",
    q: "LoanSense sanctioned my loan before my admit was confirmed. That certainty changed how I negotiated stipends.",
    img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=90&auto=format&fit=crop",
  },
  {
    n: "Karan V.",
    r: "MEng, Toronto",
    q: "Essay Co-Pilot kept my voice. My SOP went from generic to genuinely mine in three iterations.",
    img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=90&auto=format&fit=crop",
  },
];

/* NEW — team data */
const team = [
  {
    n: "Anshuman Pathak",
    r: "Gen-AI, Agents",
    bio: "Lead FE. Frames every pixel like a film cut.",
    img: "/assets/team/anshuman.jpg",
    link: "https://www.linkedin.com/in/the-anshuman-pathak/",
  },
  {
    n: "Gaurav Shahi",
    r: "Plateform, API",
    bio: "Full-stack. Owns the contracts and the latency.",
    img: "/assets/team/GauravShahi_.jpeg",
    link: "https://www.linkedin.com/in/gaurav-shahi-levi/",
  },
  {
    n: "Deepanshu Dwivedi",
    r: "SaaS, Growth",
    bio: "RAG, SHAP, and the math behind the gauge.",
    img: "/assets/team/deepanshu.jpeg",
    link: "https://www.linkedin.com/in/deepanshu-dwivedi-89787a2b6/",
  },
];

/* NEW — destinations marquee */
const destinations = [
  {
    city: "OXFORD",
    country: "UK",
    img: "https://images.unsplash.com/photo-1548383135-9bf3a73b1cd8?w=1400&q=90&auto=format&fit=crop",
  },
  {
    city: "STANFORD",
    country: "USA",
    img: "https://images.unsplash.com/photo-1564981797816-1043664bf78d?w=1400&q=90&auto=format&fit=crop",
  },
  {
    city: "ZÜRICH",
    country: "CH",
    img: "https://images.unsplash.com/photo-1515488764276-beab7607c1e6?w=1400&q=90&auto=format&fit=crop",
  },
  {
    city: "TORONTO",
    country: "CA",
    img: "https://images.unsplash.com/photo-1517090504586-fde19ea6066f?w=1400&q=90&auto=format&fit=crop",
  },
  {
    city: "SINGAPORE",
    country: "SG",
    img: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=1400&q=90&auto=format&fit=crop",
  },
  {
    city: "PARIS",
    country: "FR",
    img: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1400&q=90&auto=format&fit=crop",
  },
];

/* NEW — scrapbook collage */
const collage = [
  {
    img: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&q=90&auto=format&fit=crop",
    caption: "Convocation · Class of ’25",
    rot: -6,
  },
  {
    img: "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=1200&q=90&auto=format&fit=crop",
    caption: "First day · ETH",
    rot: 4,
  },
  {
    img: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=1200&q=90&auto=format&fit=crop",
    caption: "Studio · Toronto",
    rot: -3,
  },
  {
    img: "https://images.unsplash.com/photo-1606761568499-6d2451b23c66?w=1200&q=90&auto=format&fit=crop",
    caption: "Sevis sorted · JFK",
    rot: 6,
  },
  {
    img: "https://images.unsplash.com/photo-1527269534026-c86f4009eace?w=1200&q=90&auto=format&fit=crop",
    caption: "INSEAD lawns",
    rot: -2,
  },
  {
    img: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&q=90&auto=format&fit=crop",
    caption: "Late nights · Bodleian",
    rot: 5,
  },
];

const heroImage =
  "https://images.unsplash.com/photo-1621355831058-8dd703033138?w=2400&q=90&auto=format&fit=crop";
const heroLibrary =
  "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1600&q=90&auto=format&fit=crop";
const editorialFin =
  "https://images.unsplash.com/photo-1548393488-ae8f117cbc1c?w=1600&q=90&auto=format&fit=crop";
const campusImage =
  "https://images.unsplash.com/photo-1568667256549-094345857637?w=2400&q=90&auto=format&fit=crop";
const closingImage =
  "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=2400&q=90&auto=format&fit=crop";

const logoMarquee = [
  "OXFORD",
  "STANFORD",
  "ETH ZÜRICH",
  "NUS",
  "COLUMBIA",
  "LSE",
  "CARNEGIE MELLON",
  "TORONTO",
  "IMPERIAL",
  "INSEAD",
];

const expoOut: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* ============================================================
   PRIMITIVES
============================================================ */

function ScrollProgressRail() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 24, restDelta: 0.001 });
  return (
    <motion.div
      data-testid="scroll-progress-rail"
      style={{ scaleX }}
      className="fixed left-0 right-0 top-0 z-[60] h-[2px] origin-left bg-[hsl(var(--accent))]"
    />
  );
}

/* NEW — corporate-tasteful magnetic cursor (desktop, motion-safe) */
function BlobCursor() {
  const reduce = useReducedMotion();
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 260, damping: 28, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 260, damping: 28, mass: 0.4 });
  const dotX = useSpring(x, { stiffness: 600, damping: 30, mass: 0.2 });
  const dotY = useSpring(y, { stiffness: 600, damping: 30, mass: 0.2 });
  const [hovering, setHovering] = useState(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (reduce) return;
    // disable on coarse pointers
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (!fine) return;
    setEnabled(true);

    const onMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      if (!t) return;
      setHovering(!!t.closest("a, button, [data-cursor='hover']"));
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
    };
  }, [reduce, x, y]);

  if (!enabled) return null;
  return (
    <>
      <motion.div
        aria-hidden
        style={{ x: sx, y: sy }}
        className="pointer-events-none fixed left-0 top-0 z-[70] -translate-x-1/2 -translate-y-1/2 mix-blend-multiply"
      >
        <motion.div
          animate={{ scale: hovering ? 2.4 : 1, opacity: hovering ? 0.55 : 0.32 }}
          transition={{ duration: 0.45, ease: expoOut }}
          className="h-12 w-12 rounded-full bg-[hsl(var(--accent))] blur-2xl"
        />
      </motion.div>
      <motion.div
        aria-hidden
        style={{ x: dotX, y: dotY }}
        className="pointer-events-none fixed left-0 top-0 z-[71] -translate-x-1/2 -translate-y-1/2"
      >
        <motion.div
          animate={{
            scale: hovering ? 1.6 : 1,
            backgroundColor: hovering ? "hsl(var(--accent))" : "transparent",
            borderColor: hovering ? "hsl(var(--accent))" : "hsl(var(--foreground))",
          }}
          transition={{ duration: 0.25, ease: expoOut }}
          className="h-3 w-3 rounded-full border"
        />
      </motion.div>
    </>
  );
}

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

/* NEW — per-letter masked reveal */
function SplitTextReveal({
  text,
  className = "",
  delay = 0,
  stagger = 0.025,
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
}) {
  const letters = Array.from(text);
  return (
    <span className={className} aria-label={text}>
      {letters.map((ch, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom" aria-hidden>
          <motion.span
            initial={{ y: "110%", opacity: 0 }}
            whileInView={{ y: "0%", opacity: 1 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.7, ease: expoOut, delay: delay + i * stagger }}
            className="inline-block"
          >
            {ch === " " ? "u00A0" : ch}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

/* NEW — breathing float wrapper */
function Float({
  children,
  amplitude = 6,
  duration = 5,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  amplitude?: number;
  duration?: number;
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      animate={reduce ? undefined : { y: [-amplitude, amplitude, -amplitude] }}
      transition={{ duration, repeat: Infinity, ease: "easeInOut", delay }}
    >
      {children}
    </motion.div>
  );
}

function MagneticButton({
  children,
  className = "",
  strength = 22,
  ...rest
}: React.ComponentProps<typeof motion.button> & { strength?: number }) {
  const ref = useRef<HTMLButtonElement | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 14 });
  const sy = useSpring(y, { stiffness: 200, damping: 14 });
  const reduce = useReducedMotion();

  const onMove = (e: React.MouseEvent) => {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set(((e.clientX - r.left) / r.width - 0.5) * strength);
    y.set(((e.clientY - r.top) / r.height - 0.5) * strength);
  };
  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ x: sx, y: sy }}
      className={className}
      {...rest}
    >
      {children}
    </motion.button>
  );
}

function TiltCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const reduce = useReducedMotion();

  const onMove = (e: React.MouseEvent) => {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    ry.set(px * 10);
    rx.set(-py * 10);
  };
  const onLeave = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function CountUp({
  to,
  prefix = "",
  suffix = "",
  format,
}: {
  to: number;
  prefix?: string;
  suffix?: string;
  format?: "comma";
}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-20% 0px" });
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { stiffness: 60, damping: 20 });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (inView) mv.set(to);
  }, [inView, mv, to]);
  useEffect(() => spring.on("change", (v) => setVal(v)), [spring]);

  const display =
    format === "comma"
      ? Math.round(val).toLocaleString("en-IN")
      : Number.isInteger(to)
        ? Math.round(val)
        : val.toFixed(1);
  return (
    <span ref={ref}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}

function Marquee({ items, reverse = false }: { items: string[]; reverse?: boolean }) {
  return (
    <div className="relative overflow-hidden">
      <div
        className="flex gap-14 whitespace-nowrap"
        style={{
          animation: `marquee 40s linear infinite`,
          animationDirection: reverse ? "reverse" : "normal",
        }}
      >
        {[...items, ...items].map((n, i) => (
          <span
            key={i}
            className="font-display text-xl tracking-[0.25em] text-[hsl(var(--muted-foreground))]"
          >
            {n}
          </span>
        ))}
      </div>
    </div>
  );
}

function ArcGauge({ value = 87, label = "Admit Probability" }: { value?: number; label?: string }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-20% 0px" });
  const progress = useSpring(0, { stiffness: 60, damping: 20 });
  useEffect(() => {
    if (inView) progress.set(value);
  }, [inView, progress, value]);

  const C = 2 * Math.PI * 42;
  const dashOffset = useTransform(progress, (p) => C * (1 - p / 100));
  const [pct, setPct] = useState(0);
  useEffect(() => progress.on("change", (v) => setPct(Math.round(v))), [progress]);

  return (
    <div ref={ref} className="flex items-center gap-3">
      <svg width="96" height="96" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="42" stroke="hsl(var(--border))" strokeWidth="6" fill="none" />
        <motion.circle
          cx="50"
          cy="50"
          r="42"
          stroke="hsl(var(--accent))"
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={C}
          style={{ strokeDashoffset: dashOffset }}
          transform="rotate(-90 50 50)"
        />
        <text
          x="50"
          y="55"
          textAnchor="middle"
          fontSize="18"
          fontWeight="700"
          fill="hsl(var(--foreground))"
        >
          {pct}%
        </text>
      </svg>
      <div>
        <div className="text-[11px] uppercase tracking-widest text-[hsl(var(--muted-foreground))]">
          {label}
        </div>
        <div className="font-display text-lg text-[hsl(var(--foreground))]">Oracle</div>
      </div>
    </div>
  );
}

/* curtain reveal on mount */
function PageEnter({ children }: { children: React.ReactNode }) {
  const [done, setDone] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setDone(true), 900);
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
            transition={{ duration: 0.75, ease: expoOut }}
            className="fixed inset-0 z-[80] bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] flex items-end justify-between px-10 pb-10"
          >
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="font-mono text-xs tracking-[0.3em] uppercase"
            >
              StudyLaunch · 2026
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.5 }}
              className="font-display text-[10vw] leading-none"
            >
              hello.
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="font-mono text-xs tracking-[0.3em] uppercase"
            >
              Powered by Poonawalla
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.6 }}
      >
        {children}
      </motion.div>
    </>
  );
}

/* ============================================================
   SECTIONS
============================================================ */

function HeroSection() {
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yImg = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const yText = useTransform(scrollYProgress, [0, 1], ["0%", "-10%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);

  const mx = useMotionValue(50);
  const my = useMotionValue(50);
  const onMove = (e: React.MouseEvent) => {
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    mx.set(((e.clientX - r.left) / r.width) * 100);
    my.set(((e.clientY - r.top) / r.height) * 100);
  };
  const meshBg = useTransform(
    [mx, my],
    ([x, y]) =>
      `radial-gradient(60% 60% at ${x}% ${y}%, hsl(148 60% 55% / 0.18), transparent 70%), radial-gradient(50% 60% at 80% 20%, hsl(40 70% 70% / 0.14), transparent 60%), linear-gradient(180deg, hsl(45 33% 97%) 0%, hsl(45 28% 94%) 100%)`
  );

  return (
    <section
      ref={ref}
      onMouseMove={onMove}
      data-testid="hero-section"
      className="relative min-h-[100svh] overflow-hidden"
    >
      <motion.div style={{ background: meshBg }} className="absolute inset-0" />
      <div className="grain absolute inset-0 pointer-events-none" />

      {/* NEW — animated SVG flight path overlay */}
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 h-full w-full"
        viewBox="0 0 1200 800"
        preserveAspectRatio="none"
      >
        <motion.path
          d="M -20 720 C 220 620, 420 220, 720 270 S 1100 80, 1240 60"
          stroke="hsl(var(--accent))"
          strokeWidth="1.25"
          strokeDasharray="2 8"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.55 }}
          transition={{ duration: 2.6, ease: expoOut, delay: 1 }}
        />
        <motion.circle
          cx="1100"
          cy="80"
          r="5"
          fill="hsl(var(--accent))"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0.6, 1.4, 0.6], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", delay: 3.6 }}
        />
        <motion.circle
          cx="-20"
          cy="720"
          r="3"
          fill="hsl(var(--accent))"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 2.6, ease: expoOut, delay: 1 }}
        />
      </svg>

      <motion.div
        style={{ opacity }}
        className="relative z-[1] mx-auto grid min-h-[100svh] max-w-[1400px] grid-cols-1 items-center gap-16 px-6 py-28 lg:grid-cols-[1.05fr_1fr] lg:px-10"
      >
        {/* Left */}
        <motion.div style={{ y: yText }} className="relative z-10">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[hsl(var(--border))] bg-white/60 px-3 py-1 text-xs font-mono uppercase tracking-[0.2em] text-[hsl(var(--muted-foreground))] backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-[hsl(var(--accent))]" />
            TenzorX · Live prototype
          </div>

          <h1 className="font-display text-[clamp(2.8rem,6vw,5.6rem)] font-700 leading-[0.95] tracking-tight text-[hsl(var(--foreground))]">
            <WordReveal text="Launch your" />
            <br />
            <span className="text-gradient-ink">
              <WordReveal text="study abroad" delay={0.1} />
            </span>
            <br />
            <WordReveal text="in one sitting." delay={0.2} />
          </h1>

          <p className="mt-8 max-w-xl text-lg leading-relaxed text-[hsl(var(--muted-foreground))]">
            AI-driven discovery, admit scoring and regulated education financing — orchestrated into a single journey.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <MagneticButton
              data-cursor="hover"
              className="group inline-flex items-center gap-2 rounded-full bg-[hsl(var(--primary))] px-7 py-4 text-sm font-medium text-[hsl(var(--primary-foreground))] shadow-elev hover:shadow-elev-lg"
            >
              <span> Launch your application</span>
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </MagneticButton>
            <Link
              href="/oracle"
              className="underline-grow inline-flex items-center gap-2 text-sm font-medium text-[hsl(var(--foreground))]"
            >
              See your admit odds <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-10 flex items-center gap-6 text-xs font-mono uppercase tracking-[0.2em] text-[hsl(var(--muted-foreground))]">
            <div className="inline-flex items-center gap-2">
              <ShieldCheck className="h-3.5 w-3.5 text-[hsl(var(--accent))]" />
              RBI · DPDP compliant
            </div>
            <div className="hidden h-4 w-px bg-[hsl(var(--border))] sm:block" />
            <div>AI-first by design</div>
          </div>
        </motion.div>

        {/* Right — layered parallax */}
        <div className="relative h-[560px] lg:h-[640px]">
          <motion.div
            style={{ y: yImg, scale }}
            className="absolute inset-0 overflow-hidden rounded-3xl shadow-ink"
          >
            <img
              src={heroImage}
              alt="Graduate at commencement"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--primary))]/50 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 rounded-full bg-white/80 px-3 py-1 text-[11px] font-mono uppercase tracking-widest backdrop-blur">
              Oxford · MSc CS
            </div>
          </motion.div>

          {/* Floating ArcGauge card */}
          <Float amplitude={8} duration={6} className="absolute -left-6 top-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8, ease: expoOut }}
              className="rounded-2xl border border-[hsl(var(--border))] bg-white/90 p-4 shadow-elev-lg backdrop-blur"
            >
              <ArcGauge value={87} />
            </motion.div>
          </Float>

          {/* Floating loan-ready card */}
          <Float amplitude={6} duration={5.4} delay={0.6} className="absolute -right-4 bottom-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8, ease: expoOut }}
              className="rounded-2xl border border-[hsl(var(--border))] bg-white/90 p-4 shadow-elev-lg backdrop-blur"
            >
              <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-widest text-[hsl(var(--muted-foreground))]">
                <Wallet className="h-3.5 w-3.5 text-[hsl(var(--accent))]" />
                Loan ready
              </div>
              <div className="mt-1 font-display text-xl">₹42L · 9.2% p.a.</div>
            </motion.div>
          </Float>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="absolute -bottom-4 left-8 h-32 w-44 overflow-hidden rounded-2xl border border-white shadow-elev-lg"
          >
            <img src={heroLibrary} alt="Library" className="h-full w-full object-cover" />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

function LogoMarqueeBand() {
  return (
    <section
      data-testid="logo-marquee"
      className="border-y border-[hsl(var(--border))] bg-[hsl(var(--surface))] py-10"
    >
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="mb-6 text-center font-mono text-xs uppercase tracking-[0.3em] text-[hsl(var(--muted-foreground))]">
          Trusted onward by admits to
        </div>
        <Marquee items={logoMarquee} />
      </div>
    </section>
  );
}

function StatsBand() {
  return (
    <section data-testid="stats-band" className="py-28">
      <div className="mx-auto grid max-w-[1400px] grid-cols-2 gap-10 px-6 lg:grid-cols-4 lg:px-10">
        {stats.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ delay: i * 0.08, duration: 0.7, ease: expoOut }}
          >
            <Float amplitude={4} duration={6 + i * 0.4} delay={i * 0.3}>
              <div className="font-display text-5xl font-700 text-[hsl(var(--foreground))] lg:text-6xl">
                <CountUp to={s.v} prefix={s.prefix} suffix={s.suffix} format={s.format} />
              </div>
              <div className="mt-2 font-mono text-xs uppercase tracking-[0.25em] text-[hsl(var(--muted-foreground))]">
                {s.l}
              </div>
            </Float>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* =============== FIVE SURFACES — STICKY HORIZONTAL =============== */
function FiveSurfacesHorizontal() {
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], ["2%", "-72%"]);
  const railFill = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section
      ref={ref}
      data-testid="five-surfaces"
      className="relative h-[420vh] bg-[hsl(var(--surface))]"
    >
      <div className="sticky top-0 flex h-screen flex-col overflow-hidden">
        <div className="flex items-end justify-between px-6 pt-16 lg:px-10">
          <div>
            <div className="font-mono text-xs uppercase tracking-[0.3em] text-[hsl(var(--muted-foreground))]">
              Five surfaces · One journey
            </div>
            <h2 className="mt-3 font-display text-[clamp(2rem,4vw,3.5rem)] font-700 leading-[0.95] tracking-tight">
              <WordReveal text="Built as chapters," />
              <br />
              <span className="text-gradient-ink">
                <WordReveal text="read as one story." delay={0.1} />
              </span>
            </h2>
          </div>
          <div className="hidden items-center gap-3 font-mono text-xs uppercase tracking-[0.3em] text-[hsl(var(--muted-foreground))] lg:flex">
            Scroll →
          </div>
        </div>

        <motion.div style={{ x }} className="mt-16 flex items-stretch gap-8 pl-6 lg:pl-10">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.5, ease: expoOut }}
              className="relative w-[82vw] max-w-[580px] flex-none overflow-hidden rounded-3xl border border-[hsl(var(--border))] bg-white shadow-elev"
            >
              <div className="relative h-[340px] overflow-hidden">
                <img
                  src={f.img}
                  alt={f.title}
                  className="h-full w-full object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.06]"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                <div className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-[11px] font-mono uppercase tracking-widest backdrop-blur">
                  <f.icon className="h-3.5 w-3.5 text-[hsl(var(--accent))]" />
                  {f.tag}
                </div>
                <div className="absolute right-5 top-5 font-mono text-[11px] uppercase tracking-widest text-white/85">
                  0{i + 1} / 0{features.length}
                </div>
              </div>
              <div className="p-7">
                <h3 className="font-display text-3xl font-700">{f.title}</h3>
                <p className="mt-2 text-[hsl(var(--muted-foreground))]">{f.desc}</p>
                <Link
                  href={f.href}
                  className="mt-6 inline-flex items-center gap-2 text-sm font-medium underline-grow"
                  data-cursor="hover"
                >
                  Open {f.title} <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </motion.div>
          ))}

          {/* End CTA */}
          <div className="relative w-[82vw] max-w-[580px] flex-none overflow-hidden rounded-3xl bg-[hsl(var(--primary))] p-10 text-[hsl(var(--primary-foreground))] shadow-ink">
            <div className="font-mono text-xs uppercase tracking-[0.3em] opacity-70">
              All-in-one
            </div>
            <h3 className="mt-4 font-display text-4xl font-700 leading-tight">
              Begin your file in 90 seconds.
            </h3>
            <p className="mt-3 opacity-80">Profile-first onboarding fuels every other surface.</p>
            <MagneticButton
              data-cursor="hover"
              className="mt-10 inline-flex items-center gap-2 rounded-full bg-[hsl(var(--accent))] px-6 py-3 text-sm font-medium text-[hsl(var(--accent-foreground))]"
            >
              <span>Start now</span>
              <ArrowUpRight className="h-4 w-4" />
            </MagneticButton>
          </div>
          <div className="w-16 flex-none" />
        </motion.div>

        <div className="mx-6 mb-8 mt-auto h-[2px] bg-[hsl(var(--border))] lg:mx-10">
          <motion.div style={{ width: railFill }} className="h-full bg-[hsl(var(--accent))]" />
        </div>
      </div>
    </section>
  );
}

/* =============== JOURNEY — PINNED RAIL (with image cards) =============== */
function JourneyPinned() {
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 60%", "end 40%"] });
  const fill = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section ref={ref} data-testid="journey-section" className="relative py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="mb-16 flex items-end justify-between">
          <div>
            <div className="font-mono text-xs uppercase tracking-[0.3em] text-[hsl(var(--muted-foreground))]">
              The journey
            </div>
            <h2 className="mt-3 font-display text-[clamp(2rem,4vw,3.5rem)] font-700 leading-[0.95] tracking-tight">
              <WordReveal text="Four steps." />
              <br />
              <span className="text-gradient-ink">
                <WordReveal text="One cockpit." delay={0.1} />
              </span>
            </h2>
          </div>
          <Plane className="hidden h-10 w-10 text-[hsl(var(--accent))] lg:block" />
        </div>

        <div className="relative grid grid-cols-1 gap-12 lg:grid-cols-[80px_1fr]">
          <div className="relative hidden lg:block">
            <div className="sticky top-1/3 h-[400px] w-[2px] rounded-full bg-[hsl(var(--border))]">
              <motion.div
                style={{ height: fill }}
                className="w-[2px] rounded-full bg-[hsl(var(--accent))]"
              />
            </div>
          </div>
          <div className="space-y-16">
            {journey.map((s, i) => (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-20% 0px" }}
                transition={{ duration: 0.8, ease: expoOut }}
                className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[auto_1fr_auto]"
              >
                <div className="font-mono text-4xl font-700 text-[hsl(var(--accent))] lg:text-6xl">
                  {s.n}
                </div>
                <div className="max-w-xl">
                  <h3 className="font-display text-3xl font-700">{s.t}</h3>
                  <p className="mt-3 text-lg text-[hsl(var(--muted-foreground))]">{s.d}</p>
                </div>

                {/* NEW — thumbnail with parallax + tilt */}
                <TiltCard className="group relative h-44 w-full overflow-hidden rounded-2xl border border-[hsl(var(--border))] shadow-elev lg:h-36 lg:w-64">
                  <motion.img
                    src={s.img}
                    alt={s.t}
                    initial={{ scale: 1.15 }}
                    whileInView={{ scale: 1.0 }}
                    viewport={{ once: true, margin: "-15% 0px" }}
                    transition={{ duration: 1.4, ease: expoOut }}
                    className="h-full w-full object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-white/85 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.25em] backdrop-blur">
                    <Sparkles className="h-3 w-3 text-[hsl(var(--accent))]" />
                    Step {s.n}
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* =============== NEW: DESTINATIONS MARQUEE =============== */
function DestinationsMarquee() {
  return (
    <section
      data-testid="destinations-marquee"
      className="relative overflow-hidden border-y border-[hsl(var(--border))] bg-[hsl(var(--surface))] py-24"
    >
      <div className="mx-auto mb-12 max-w-[1400px] px-6 lg:px-10">
        <div className="flex items-end justify-between gap-6">
          <div>
            <div className="font-mono text-xs uppercase tracking-[0.3em] text-[hsl(var(--muted-foreground))]">
              <Globe2 className="mr-1.5 inline h-3.5 w-3.5 text-[hsl(var(--accent))]" />
              Destinations served
            </div>
            <h2 className="mt-3 font-display text-[clamp(2rem,4vw,3.5rem)] font-700 leading-[0.95] tracking-tight">
              <SplitTextReveal text="Six time zones." />
              <br />
              <span className="text-gradient-ink">
                <SplitTextReveal text="One launch pad." delay={0.05} />
              </span>
            </h2>
          </div>
          <div className="hidden max-w-xs text-right text-sm text-[hsl(var(--muted-foreground))] lg:block">
            From Oxford spires to Singapore skylines — every shortlist routes through one cockpit.
          </div>
        </div>
      </div>

      <div
        className="flex gap-6 whitespace-nowrap"
        style={{ animation: "marquee 50s linear infinite" }}
      >
        {[...destinations, ...destinations].map((d, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -6, scale: 1.02 }}
            transition={{ duration: 0.5, ease: expoOut }}
            className="relative h-[300px] w-[460px] flex-none overflow-hidden rounded-3xl shadow-elev"
          >
            <img
              src={d.img}
              alt={d.city}
              className="h-full w-full object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.06]"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between text-white">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.3em] opacity-80">
                  <MapPin className="mr-1 inline h-3 w-3" />
                  {d.country}
                </div>
                <div className="mt-1 font-display text-3xl font-700 tracking-tight">{d.city}</div>
              </div>
              <div className="rounded-full bg-white/15 px-3 py-1 font-mono text-[10px] uppercase tracking-widest backdrop-blur">
                Live admits
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div
        className="mt-6 flex gap-6 whitespace-nowrap opacity-60"
        style={{ animation: "marquee 70s linear infinite reverse" }}
      >
        {[...destinations, ...destinations].map((d, i) => (
          <span
            key={`txt-${i}`}
            className="font-display text-2xl tracking-[0.35em] text-[hsl(var(--muted-foreground))]"
          >
            {d.city} · {d.country} ·
          </span>
        ))}
      </div>
    </section>
  );
}

/* =============== NEW: TEAM =============== */
function TeamSection() {
  return (
    <section
      data-testid="team-section"
      className="relative border-y border-[hsl(var(--border))] bg-[hsl(var(--surface))] py-32"
    >
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="mb-16 grid grid-cols-1 items-end gap-8 lg:grid-cols-[1fr_auto]">
          <div>
            <div className="font-mono text-xs uppercase tracking-[0.3em] text-[hsl(var(--muted-foreground))]">
              The builders
            </div>
            <h2 className="mt-3 font-display text-[clamp(2rem,4vw,3.5rem)] font-700 leading-[0.95] tracking-tight">
              <WordReveal text="Three operators," />
              <br />
              <span className="text-gradient-ink">
                <WordReveal text="one obsession." delay={0.1} />
              </span>
            </h2>
          </div>
          <p className="max-w-sm text-[hsl(var(--muted-foreground))]">
            A tight, vertically-stacked team shipping every surface — from the Oracle's math to the
            last pixel of the curtain.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {team.map((m, i) => {
            const initials = m.n
              .split(" ")
              .map((w) => w[0])
              .join("");
            return (
              <motion.div
                key={m.n}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-15% 0px" }}
                transition={{ delay: i * 0.12, duration: 0.8, ease: expoOut }}
                data-testid={`team-card-${i}`}
              >
                <TiltCard className="group relative overflow-hidden rounded-3xl border border-[hsl(var(--border))] bg-white p-8 shadow-elev transition-shadow duration-500 hover:shadow-elev-lg">
                  <div className="flex items-center gap-5">
                    <div className="relative h-20 w-20 flex-none">
                      <div className="absolute inset-0 rounded-full border border-dashed border-[hsl(var(--accent))] opacity-60 [animation:spin_22s_linear_infinite]" />
                      <div className="absolute inset-1 overflow-hidden rounded-full">
                        <img src={m.img} alt={m.n} className="h-full w-full object-cover" />
                      </div>
                      <div className="absolute -bottom-1 -right-1 rounded-full bg-[hsl(var(--primary))] px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-[hsl(var(--primary-foreground))]">
                        {initials}
                      </div>
                    </div>
                    <div>
                      <div className="font-display text-2xl font-700">{m.n}</div>
                      <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-[hsl(var(--accent))]">
                        {m.r}
                      </div>
                    </div>
                  </div>

                  <p className="mt-6 text-[hsl(var(--muted-foreground))]">{m.bio}</p>

                  <div className="mt-8 flex items-center justify-between border-t border-[hsl(var(--border))] pt-5">
                    <Link
                      href={m.link}
                      className="inline-flex items-center gap-2 text-sm font-medium underline-grow"
                      data-cursor="hover"
                    >
                      <Linkedin className="h-4 w-4" /> Connect
                    </Link>
                    <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[hsl(var(--muted-foreground))]">
                      0{i + 1} / 03
                    </span>
                  </div>

                  <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[hsl(var(--accent-soft))] opacity-0 transition-opacity duration-500 group-hover:opacity-60 blur-2xl" />
                </TiltCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* =============== NEW: MANIFESTO BAND =============== */
function ManifestoBand() {
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x1 = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const x2 = useTransform(scrollYProgress, [0, 1], ["10%", "-10%"]);

  return (
    <section
      ref={ref}
      data-testid="manifesto-band"
      className="relative overflow-hidden bg-[hsl(var(--primary))] py-28 text-[hsl(var(--primary-foreground))]"
    >
      <div className="grain absolute inset-0 pointer-events-none" />
      <motion.div
        style={{ x: x1 }}
        className="whitespace-nowrap font-display text-[clamp(4rem,14vw,14rem)] font-800 leading-[0.85] tracking-tight opacity-10"
      >
        DISCOVER · PREDICT · FINANCE · LAUNCH ·
      </motion.div>
      <div className="relative mx-auto max-w-[1200px] px-6 py-16 text-center lg:px-10">
        <div className="mb-5 font-mono text-xs uppercase tracking-[0.35em] opacity-70">
          The manifesto
        </div>
        <h2 className="font-display text-[clamp(2rem,4.5vw,4.5rem)] font-700 leading-[1.05]">
          <WordReveal text="We don't sell admissions." />
          <br />
          <span className="italic opacity-80">
            <WordReveal text="We remove the relay race between dream and disbursal." delay={0.1} />
          </span>
        </h2>
      </div>
      <motion.div
        style={{ x: x2 }}
        className="whitespace-nowrap font-display text-[clamp(4rem,14vw,14rem)] font-800 leading-[0.85] tracking-tight opacity-10"
      >
        INDIA → WORLD · 2026 · STUDYLAUNCH ·
      </motion.div>
    </section>
  );
}

/* =============== EDITORIAL SPLIT (POONAWALLA) =============== */
function EditorialSplit() {
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const yImg = useTransform(scrollYProgress, [0, 1], ["-6%", "10%"]);

  return (
    <section ref={ref} data-testid="editorial-split" className="py-32">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-14 px-6 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:px-10">
        <div>
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-[hsl(var(--accent))]">
            Powered by Poonawalla Fincorp
          </div>
          <h2 className="mt-4 font-display text-[clamp(2rem,4vw,3.5rem)] font-700 leading-[0.95]">
            <WordReveal text="The first DLG-ready" />
            <br />
            <span className="text-gradient-ink">
              <WordReveal text="education loan stack," delay={0.1} />
            </span>
            <br />
            <WordReveal text="inside discovery itself." delay={0.2} />
          </h2>
          <p className="mt-6 max-w-xl text-lg text-[hsl(var(--muted-foreground))]">
            No paperwork relay races. No co-signer ambiguity. Built into the student's first flow.
          </p>

          <div className="mt-10 grid grid-cols-2 gap-6">
            {[
              ["9.2%", "Indicative APR floor"],
              ["₹75L", "Sanction ceiling"],
              ["48 hrs", "Avg. decisioning"],
              ["Co-signer free", "For top admits"],
            ].map(([v, l], i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.6, ease: expoOut }}
                className="border-t border-[hsl(var(--border))] pt-4"
              >
                <div className="font-display text-3xl font-700">{v}</div>
                <div className="mt-1 font-mono text-[11px] uppercase tracking-[0.25em] text-[hsl(var(--muted-foreground))]">
                  {l}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="relative h-[520px] overflow-hidden rounded-3xl shadow-ink">
          <motion.img
            src={editorialFin}
            alt="Financing"
            style={{ y: yImg }}
            className="h-[115%] w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--primary))]/40 via-transparent to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between text-white">
            <div>
              <div className="font-mono text-[11px] uppercase tracking-[0.25em] opacity-70">
                Disbursal velocity
              </div>
              <div className="mt-1 font-display text-2xl">2.1× industry average</div>
            </div>
            <ShieldCheck className="h-10 w-10 opacity-80" />
          </div>
        </div>
      </div>
    </section>
  );
}

/* =============== TESTIMONIALS =============== */
function Testimonials() {
  return (
    <section data-testid="testimonials" className="bg-[hsl(var(--surface))] py-32">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="mb-14 flex items-end justify-between">
          <div>
            <div className="font-mono text-xs uppercase tracking-[0.3em] text-[hsl(var(--muted-foreground))]">
              Voices
            </div>
            <h2 className="mt-3 font-display text-[clamp(2rem,4vw,3.5rem)] font-700 leading-[0.95]">
              <WordReveal text="Quiet proof," />
              <br />
              <span className="text-gradient-ink">
                <WordReveal text="loud outcomes." delay={0.1} />
              </span>
            </h2>
          </div>
          <div className="hidden items-center gap-2 lg:flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-[hsl(var(--accent))] text-[hsl(var(--accent))]" />
            ))}
            <span className="ml-2 font-mono text-xs uppercase tracking-widest text-[hsl(var(--muted-foreground))]">
              4.9 / 5 · 8,200 reviews
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.n}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ delay: i * 0.1, duration: 0.7, ease: expoOut }}
              className="flex flex-col rounded-3xl border border-[hsl(var(--border))] bg-white p-8 shadow-elev hover-lift"
            >
              <Quote className="h-6 w-6 text-[hsl(var(--accent))]" />
              <p className="mt-5 flex-1 text-[hsl(var(--foreground))]">"{t.q}"</p>
              <div className="mt-8 flex items-center gap-4 border-t border-[hsl(var(--border))] pt-5">
                <img src={t.img} alt={t.n} className="h-11 w-11 rounded-full object-cover" />
                <div>
                  <div className="font-display text-base font-700">{t.n}</div>
                  <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-[hsl(var(--muted-foreground))]">
                    {t.r}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* =============== EDITORIAL CAMPUS =============== */
function EditorialCampus() {
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "12%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.05, 1.15]);

  return (
    <section ref={ref} data-testid="editorial-campus" className="relative h-[90vh] overflow-hidden">
      <motion.img
        src={campusImage}
        alt="Campus"
        style={{ y, scale }}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--primary))]/70 via-[hsl(var(--primary))]/20 to-transparent" />
      <div className="relative z-10 mx-auto flex h-full max-w-[1400px] items-end px-6 pb-20 lg:px-10">
        <div className="max-w-2xl text-white">
          <div className="font-mono text-xs uppercase tracking-[0.3em] opacity-80">
            Beyond the admit
          </div>
          <h2 className="mt-3 font-display text-[clamp(2rem,4vw,3.5rem)] font-700 leading-[0.95]">
            We carry you across the border, not just up to it.
          </h2>
          <p className="mt-5 max-w-xl opacity-85">
            SEVIS deposits, forex-optimised disbursals, insurance. One cockpit, end-to-end.
          </p>
          <Link
            href="/dashboard"
            className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-white underline-grow"
            data-cursor="hover"
          >
            Explore dashboard <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* =============== NEW: SCRAPBOOK COLLAGE =============== */
function ScrapbookCollage() {
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y1 = useTransform(scrollYProgress, [0, 1], ["10%", "-10%"]);
  const y2 = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const y3 = useTransform(scrollYProgress, [0, 1], ["6%", "-6%"]);
  const ys = [y1, y2, y3, y1, y2, y3];

  return (
    <section ref={ref} data-testid="scrapbook-collage" className="relative overflow-hidden py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="mb-16 grid grid-cols-1 items-end gap-8 lg:grid-cols-[1fr_auto]">
          <div>
            <div className="font-mono text-xs uppercase tracking-[0.3em] text-[hsl(var(--muted-foreground))]">
              <Camera className="mr-1.5 inline h-3.5 w-3.5 text-[hsl(var(--accent))]" />
              Scrapbook · 2025
            </div>
            <h2 className="mt-3 font-display text-[clamp(2rem,4vw,3.5rem)] font-700 leading-[0.95] tracking-tight">
              <SplitTextReveal text="The receipts," />
              <br />
              <span className="text-gradient-ink">
                <SplitTextReveal text="not the brochures." delay={0.05} />
              </span>
            </h2>
          </div>
          <p className="max-w-sm text-[hsl(var(--muted-foreground))]">
            Polaroids from students who launched their files with us — convocations, first studios,
            late nights at the Bodleian.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-6">
          {collage.map((c, i) => (
            <motion.figure
              key={i}
              style={{ y: ys[i % ys.length] }}
              initial={{ opacity: 0, y: 60, rotate: c.rot * 1.6 }}
              whileInView={{ opacity: 1, y: 0, rotate: c.rot }}
              whileHover={{ rotate: 0, scale: 1.04, zIndex: 10 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.9, ease: expoOut, delay: i * 0.07 }}
              className={[
                "group relative aspect-[3/4] overflow-hidden rounded-md border border-white bg-white p-2 shadow-elev-lg",
                i % 2 === 0 ? "lg:translate-y-6" : "lg:-translate-y-6",
                i === 1 ? "lg:col-span-2" : "",
              ].join(" ")}
            >
              <div className="relative h-[82%] w-full overflow-hidden rounded-sm">
                <img
                  src={c.img}
                  alt={c.caption}
                  className="h-full w-full object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent" />
              </div>
              <figcaption className="mt-2 px-1 font-mono text-[10px] uppercase tracking-[0.2em] text-[hsl(var(--muted-foreground))]">
                {c.caption}
              </figcaption>
              <div className="pointer-events-none absolute -right-2 -top-2 h-6 w-12 rotate-12 bg-[hsl(var(--accent-soft))] opacity-70" />
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}

/* =============== CLOSING CTA =============== */
function ClosingCTA() {
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["10%", "-10%"]);

  return (
    <section ref={ref} data-testid="closing-cta" className="relative overflow-hidden py-36">
      <motion.div
        style={{ y }}
        className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_30%,hsl(148_60%_85%/.6),transparent_70%)]"
      />
      <div className="relative mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-16 px-6 lg:grid-cols-[1.1fr_1fr] lg:px-10">
        <div>
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-[hsl(var(--accent))]">
            Class of 2027
          </div>
          <h2 className="mt-4 font-display text-[clamp(2.4rem,5vw,5rem)] font-700 leading-[0.95]">
            <WordReveal text="Build your profile." />
            <br />
            <span className="text-gradient-ink">
              <WordReveal text="See your odds." delay={0.08} />
            </span>
            <br />
            <WordReveal text="Walk away sanctioned." delay={0.16} />
          </h2>
          <div className="mt-10 flex flex-wrap gap-4">
            <MagneticButton
              data-cursor="hover"
              className="inline-flex items-center gap-2 rounded-full bg-[hsl(var(--primary))] px-7 py-4 text-sm font-medium text-[hsl(var(--primary-foreground))] shadow-elev hover:shadow-elev-lg"
            >
              <span>Start your file</span>
              <ArrowUpRight className="h-4 w-4" />
            </MagneticButton>
            <Link
              href="/loansense"
              className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--border))] px-7 py-4 text-sm font-medium hover:bg-[hsl(var(--secondary))]"
            >
              Model your EMI <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-10 flex items-center gap-4">
            <div className="flex -space-x-3">
              {testimonials.map((t) => (
                <img
                  key={t.n}
                  src={t.img}
                  alt=""
                  className="h-10 w-10 rounded-full border-2 border-white object-cover"
                />
              ))}
            </div>
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-[hsl(var(--muted-foreground))]">
              Joining 1,12,400+ launching their files this season
            </span>
          </div>
        </div>

        <div className="relative h-[520px] overflow-hidden rounded-3xl shadow-ink">
          <img
            src={closingImage}
            alt="Diverse graduate students"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-[hsl(var(--primary))]/50 via-transparent to-transparent" />
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   PAGE
============================================================ */
export default function Home() {
  return (
    <PageShell>
      <PageEnter>
        <BlobCursor />
        <ScrollProgressRail />
        <HeroSection />
        <LogoMarqueeBand />
        <StatsBand />
        <FiveSurfacesHorizontal />
        <JourneyPinned />
        <DestinationsMarquee />
        <TeamSection />
        <ManifestoBand />
        <EditorialSplit />
        <Testimonials />
        <EditorialCampus />
        <ScrapbookCollage />
        <ClosingCTA />
      </PageEnter>
    </PageShell>
  );
}