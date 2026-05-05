"use client";

import { useState, useRef, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion";
import {
  Search,
  Sparkles,
  ArrowUpRight,
  Filter,
  Upload,
  FileText,
  X,
  Send,
  ChevronDown,
  Bot,
  User,
  Loader2,
  CheckCircle2,
  Globe2,
  GraduationCap,
  Wallet,
  CalendarDays,
  Award,
  Languages,
} from "lucide-react";
import PageShell from "@/components/site/PageShell";

const expoOut: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* ============== DATA ============== */
const programs = [
  { name: "MSc Computer Science",     uni: "University of Oxford",       country: "UK",          fit: 96, fee: "₹62L", dur: "12 mo", tag: "Reach",    flag: "🇬🇧", img: "https://images.unsplash.com/photo-1606761568499-6d2451b23c66?w=900&q=80&auto=format&fit=crop" },
  { name: "MS Computer Science",      uni: "Stanford University",        country: "USA",         fit: 88, fee: "₹78L", dur: "21 mo", tag: "Reach",    flag: "🇺🇸", img: "https://images.unsplash.com/photo-1568667256549-094345857637?w=900&q=80&auto=format&fit=crop" },
  { name: "MS Data Science",          uni: "ETH Zürich",                 country: "Switzerland", fit: 92, fee: "₹18L", dur: "18 mo", tag: "Best fit", flag: "🇨🇭", img: "https://images.unsplash.com/photo-1564981797816-1043664bf78d?w=900&q=80&auto=format&fit=crop" },
  { name: "MEng Computer Engineering", uni: "University of Toronto",     country: "Canada",      fit: 90, fee: "₹42L", dur: "16 mo", tag: "Best fit", flag: "🇨🇦", img: "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=900&q=80&auto=format&fit=crop" },
  { name: "MSc AI",                    uni: "Imperial College London",   country: "UK",          fit: 84, fee: "₹54L", dur: "12 mo", tag: "Match",    flag: "🇬🇧", img: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=900&q=80&auto=format&fit=crop" },
  { name: "MSc Computing",             uni: "NUS Singapore",             country: "Singapore",   fit: 89, fee: "₹28L", dur: "18 mo", tag: "Match",    flag: "🇸🇬", img: "https://images.unsplash.com/photo-1567592551488-aa01ddc2a5d2?w=900&q=80&auto=format&fit=crop" },
];

const filterDefs = [
  { key: "country",     label: "Country",       icon: Globe2,        opts: ["Any", "USA", "UK", "Canada", "Germany", "Australia", "Switzerland", "Singapore"] },
  { key: "degree",      label: "Degree",        icon: GraduationCap, opts: ["Any", "MS", "MBA", "MEng", "MSc", "PhD"] },
  { key: "field",       label: "Field",         icon: Sparkles,      opts: ["Any", "CS / AI", "Data Science", "Engineering", "Business", "Public Policy", "Design"] },
  { key: "budget",      label: "Budget",        icon: Wallet,        opts: ["Any", "<₹25L", "₹25–50L", "₹50–75L", "₹75L+"] },
  { key: "intake",      label: "Intake",        icon: CalendarDays,  opts: ["Any", "Fall 2026", "Spring 2026", "Fall 2027"] },
  { key: "test",        label: "Test waiver",   icon: Languages,     opts: ["Any", "GRE optional", "GMAT optional", "Test mandatory"] },
  { key: "scholarship", label: "Scholarship",   icon: Award,         opts: ["Any", "Merit", "Need-based", "Diversity", "Research stipend"] },
] as const;

const ingestionStages = [
  "Parsing PDF structure",
  "Extracting entities · skills · roles",
  "Embedding semantic vectors",
  "Matching against 1,248 programs",
  "Scoring fit · cost · admit odds",
  "Ranking shortlist",
];

/* ============== EMPTY STATE — DROPZONE ============== */
function DropZone({ onFile }: { onFile: (f: File) => void }) {
  const [drag, setDrag] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: expoOut }}
      className="mx-auto max-w-2xl"
    >
      <div
        onDragOver={e => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={e => {
          e.preventDefault(); setDrag(false);
          const f = e.dataTransfer.files?.[0];
          if (f) onFile(f);
        }}
        onClick={() => inputRef.current?.click()}
        className={`relative cursor-pointer overflow-hidden rounded-3xl border-2 border-dashed p-12 text-center transition-all ${
          drag
            ? "border-[hsl(var(--accent))] bg-[hsl(var(--accent-soft))] scale-[1.01]"
            : "border-[hsl(var(--border))] bg-[hsl(var(--card))] hover:border-[hsl(var(--accent))] hover:shadow-elev"
        }`}
        data-testid="navigator-dropzone"
      >
        <motion.div
          animate={{ y: drag ? -6 : 0 }}
          className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] shadow-ink"
        >
          <Upload className="h-7 w-7" />
        </motion.div>
        <h3 className="mt-5 font-display text-2xl font-bold">Drop your resume to begin.</h3>
        <p className="mt-2 text-sm text-[hsl(var(--muted-foreground))]">
          PDF · DOCX · LinkedIn export. We'll extract every relevant signal in seconds.
        </p>
        <button className="mt-5 inline-flex items-center gap-2 rounded-full bg-[hsl(var(--accent))] px-5 py-2.5 text-sm font-medium text-[hsl(var(--accent-foreground))]">
          Browse files <ArrowUpRight className="h-3.5 w-3.5" />
        </button>
        <div className="mt-5 flex items-center justify-center gap-4 font-mono text-[10px] uppercase tracking-[0.2em] text-[hsl(var(--muted-foreground))]">
          <span>· On-device parsing</span>
          <span>· DPDP-safe</span>
          <span>· ChromaDB embeddings</span>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.docx,.doc"
          onChange={e => { const f = e.target.files?.[0]; if (f) onFile(f); }}
          className="hidden"
          data-testid="navigator-file-input"
        />
      </div>
    </motion.div>
  );
}

/* ============== INGESTION THEATRE ============== */
function IngestionTheatre({ file, onDone }: { file: File; onDone: () => void }) {
  const [stage, setStage] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let s = 0;
    const stageT = setInterval(() => {
      s += 1;
      if (s >= ingestionStages.length) { clearInterval(stageT); setTimeout(onDone, 500); }
      else setStage(s);
    }, 600);
    let p = 0;
    const progT = setInterval(() => {
      p = Math.min(100, p + 100 / (ingestionStages.length * 24));
      setProgress(p);
      if (p >= 100) clearInterval(progT);
    }, 25);
    return () => { clearInterval(stageT); clearInterval(progT); };
  }, [onDone]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-2xl rounded-3xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-8 shadow-elev-lg"
      data-testid="ingestion-theatre"
    >
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[hsl(var(--accent-soft))]">
          <FileText className="h-5 w-5 text-[hsl(var(--primary))]" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate font-medium">{file.name}</div>
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[hsl(var(--muted-foreground))]">{(file.size / 1024).toFixed(1)} KB</div>
        </div>
        <span className="font-mono text-xs tabular-nums text-[hsl(var(--accent))]">{Math.round(progress)}%</span>
      </div>

      <div className="mt-4 h-1 overflow-hidden rounded-full bg-[hsl(var(--muted))]">
        <motion.div
          className="h-full bg-gradient-to-r from-[hsl(var(--accent))] to-[hsl(var(--primary))]"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.1, ease: "linear" }}
        />
      </div>

      <ul className="mt-6 space-y-3">
        {ingestionStages.map((s, i) => {
          const done = i < stage;
          const cur  = i === stage;
          return (
            <motion.li
              key={s}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="flex items-center gap-3"
            >
              {done
                ? <CheckCircle2 className="h-4 w-4 text-[hsl(var(--success))]" />
                : cur
                  ? <Loader2 className="h-4 w-4 animate-spin text-[hsl(var(--accent))]" />
                  : <span className="h-4 w-4 rounded-full border border-[hsl(var(--border))]" />}
              <span className={`text-sm ${done ? "text-[hsl(var(--muted-foreground))] line-through" : cur ? "text-[hsl(var(--foreground))]" : "text-[hsl(var(--muted-foreground))]/50"}`}>{s}</span>
              {cur && (
                <motion.span
                  className="ml-auto inline-flex gap-0.5"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {[0,1,2].map(d => (
                    <motion.span key={d} className="h-1 w-1 rounded-full bg-[hsl(var(--accent))]"
                      animate={{ opacity: [0.2, 1, 0.2] }}
                      transition={{ duration: 0.9, repeat: Infinity, delay: d * 0.15 }} />
                  ))}
                </motion.span>
              )}
            </motion.li>
          );
        })}
      </ul>
    </motion.div>
  );
}

/* ============== FILTER DROPDOWN ============== */
function FilterDropdown({ def, value, onChange }: any) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onDoc = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const active = value && value !== "Any";
  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        data-testid={`filter-${def.key}`}
        className={`group inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-all ${
          active
            ? "border-[hsl(var(--primary))] bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]"
            : "border-[hsl(var(--border))] bg-[hsl(var(--card))] hover:border-[hsl(var(--foreground))]/40"
        }`}
      >
        <def.icon className="h-3.5 w-3.5" />
        <span className="font-medium">{def.label}</span>
        {active && <span className="font-mono text-[10px] opacity-80">· {value}</span>}
        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 top-full z-30 mt-2 w-52 overflow-hidden rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-elev-lg"
          >
            {def.opts.map((o: string) => (
              <button
                key={o}
                onClick={() => { onChange(o); setOpen(false); }}
                className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm transition-colors hover:bg-[hsl(var(--muted))] ${value === o ? "text-[hsl(var(--accent))]" : ""}`}
              >
                {o}
                {value === o && <CheckCircle2 className="h-3.5 w-3.5" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ============== CHAT PANEL ============== */
type Msg = { role: "user" | "assistant"; text: string };

const cannedReplies = [
  "Based on your resume, your strongest signals are systems engineering and a 2.8B-API-call rate-limiter at scale. I've prioritised programs with strong distributed-systems faculty.",
  "Oxford and ETH Zürich are your best-fit shortlist. Stanford is a stretch given the funding-light profile — would you like me to model a co-signer-free loan?",
  "I can re-rank by stipend availability. Want me to filter for programs with research-assistantship guarantees?",
  "Interesting — your GitHub shows strong open-source contributions. ETH Zürich's MS DS values that more than your GRE delta. Shifting it to your top spot.",
];

function ChatPanel() {
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "assistant", text: "Resume ingested. I see 4 high-fit programs in the right rail. Want me to walk through the trade-offs, or filter further?" },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, busy]);

  const send = async () => {
    if (!input.trim() || busy) return;
    const userMsg = input.trim();
    setMsgs(m => [...m, { role: "user", text: userMsg }]);
    setInput("");
    setBusy(true);

    let reply = cannedReplies[Math.floor(Math.random() * cannedReplies.length)];
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg, history: msgs }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data?.reply) reply = data.reply;
      }
    } catch { /* fall back to canned reply */ }

    // simulate streaming feel
    await new Promise(r => setTimeout(r, 700));
    setMsgs(m => [...m, { role: "assistant", text: reply }]);
    setBusy(false);
  };

  const suggestions = [
    "Filter to scholarship-eligible only",
    "Show me cheaper alternatives in Europe",
    "Compare Oxford vs ETH on outcomes",
  ];

  return (
    <div className="flex h-[calc(100vh-220px)] min-h-[560px] flex-col rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-elev" data-testid="chat-panel">
      {/* header */}
      <div className="flex items-center gap-3 border-b border-[hsl(var(--border))] p-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]">
          <Bot className="h-4 w-4" />
        </div>
        <div>
          <div className="font-medium">Navigator</div>
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[hsl(var(--muted-foreground))]">Agentic · Groq llama-3.3-70b</div>
        </div>
        <span className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-[hsl(var(--success-soft))] px-2.5 py-0.5">
          <span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--success))]" />
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[hsl(var(--success))]">Online</span>
        </span>
      </div>

      {/* messages */}
      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {msgs.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: expoOut }}
            className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}
          >
            <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${m.role === "user" ? "bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))]" : "bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]"}`}>
              {m.role === "user" ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
            </div>
            <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${m.role === "user" ? "bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]" : "bg-[hsl(var(--surface))] text-[hsl(var(--foreground))]"}`}>
              {m.text}
            </div>
          </motion.div>
        ))}
        {busy && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]">
              <Bot className="h-3.5 w-3.5" />
            </div>
            <div className="rounded-2xl bg-[hsl(var(--surface))] px-4 py-3">
              <span className="inline-flex gap-1">
                {[0,1,2].map(d => (
                  <motion.span key={d} className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--muted-foreground))]"
                    animate={{ opacity: [0.2, 1, 0.2] }}
                    transition={{ duration: 1, repeat: Infinity, delay: d * 0.15 }} />
                ))}
              </span>
            </div>
          </motion.div>
        )}
        <div ref={endRef} />
      </div>

      {/* suggestions */}
      <div className="flex flex-wrap gap-2 border-t border-[hsl(var(--border))] px-4 py-3">
        {suggestions.map(s => (
          <button
            key={s}
            onClick={() => setInput(s)}
            className="rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--surface))] px-3 py-1 text-xs text-[hsl(var(--muted-foreground))] transition-colors hover:border-[hsl(var(--accent))] hover:text-[hsl(var(--foreground))]"
          >
            {s}
          </button>
        ))}
      </div>

      {/* composer */}
      <div className="flex items-center gap-2 border-t border-[hsl(var(--border))] p-3">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && send()}
          placeholder="Ask Navigator anything…"
          className="flex-1 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--surface))] px-4 py-2.5 text-sm outline-none focus:border-[hsl(var(--accent))]"
          data-testid="chat-input"
        />
        <button
          onClick={send}
          disabled={!input.trim() || busy}
          data-testid="chat-send"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] transition-shadow hover:shadow-glow disabled:opacity-40"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}

/* ============== PAGE ============== */
export default function Navigator() {
  const [phase, setPhase] = useState<"idle" | "ingest" | "ready">("idle");
  const [file, setFile] = useState<File | null>(null);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [search, setSearch] = useState("");

  const filtered = programs.filter(p => {
    if (search && !`${p.name} ${p.uni}`.toLowerCase().includes(search.toLowerCase())) return false;
    if (filters.country && filters.country !== "Any" && p.country !== filters.country) return false;
    return true;
  });

  return (
    <PageShell>
      {/* HERO */}
      <section className="border-b border-[hsl(var(--border))] bg-[hsl(var(--surface))]/60 py-12">
        <div className="mx-auto max-w-7xl px-6">
          <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-[hsl(var(--muted-foreground))]">Surface 01 · Navigator</span>
          <h1 className="mt-3 max-w-3xl font-display text-4xl font-bold leading-[1.05] md:text-6xl">
            Your shortlist, <span className="italic text-gradient-ink">tuned by AI.</span>
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-[hsl(var(--muted-foreground))]">
            Profile-aware program matching across 1,200+ graduate programs in 18 countries.
          </p>
          <div className="mt-6 grid grid-cols-3 gap-4 max-w-xl">
            {[["1,248", "Programs"], ["18", "Countries"], ["96%", "Match accuracy"]].map(([v, l]) => (
              <div key={l} className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-3 text-center">
                <div className="font-display text-xl font-bold">{v}</div>
                <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[hsl(var(--muted-foreground))]">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PHASES */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <AnimatePresence mode="wait">
          {phase === "idle" && (
            <motion.div key="idle" exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.4 }}>
              <DropZone onFile={f => { setFile(f); setPhase("ingest"); }} />
            </motion.div>
          )}

          {phase === "ingest" && file && (
            <motion.div key="ingest" exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.4 }}>
              <IngestionTheatre file={file} onDone={() => setPhase("ready")} />
            </motion.div>
          )}

          {phase === "ready" && (
            <motion.div
              key="ready"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: expoOut }}
            >
              {/* search + filters bar */}
              <div className="mb-6 flex flex-wrap items-center gap-3">
                <div className="relative flex-1 min-w-[280px]">
                  <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[hsl(var(--muted-foreground))]" />
                  <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search programs · universities · cities"
                    className="w-full rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--card))] py-3 pl-11 pr-16 text-sm outline-none focus:border-[hsl(var(--accent))]"
                    data-testid="navigator-search"
                  />
                  <kbd className="absolute right-3 top-1/2 -translate-y-1/2 rounded border border-[hsl(var(--border))] bg-[hsl(var(--surface))] px-2 py-0.5 font-mono text-[10px] text-[hsl(var(--muted-foreground))]">⌘K</kbd>
                </div>
                <button
                  onClick={() => setFilters({})}
                  className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-4 py-2 text-sm hover:bg-[hsl(var(--muted))]"
                >
                  <Filter className="h-3.5 w-3.5" />
                  Reset
                </button>
              </div>

              <div className="mb-8 flex flex-wrap gap-2" data-testid="filters-bar">
                {filterDefs.map(def => (
                  <FilterDropdown
                    key={def.key}
                    def={def}
                    value={filters[def.key] ?? "Any"}
                    onChange={(v: string) => setFilters(f => ({ ...f, [def.key]: v }))}
                  />
                ))}
              </div>

              {/* SPLIT: chat + program rail */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                <div className="lg:col-span-5">
                  <ChatPanel />
                </div>

                <div className="lg:col-span-7">
                  <div className="mb-3 flex items-end justify-between">
                    <div>
                      <h3 className="font-display text-xl font-bold">{filtered.length} programs match</h3>
                      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[hsl(var(--muted-foreground))]">Ranked by fit · re-rankable from chat</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2" data-testid="program-cards">
                    {filtered.map((p, i) => (
                      <motion.a
                        key={p.uni + p.name}
                        href="#"
                        layout
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: expoOut, delay: i * 0.06 }}
                        whileHover={{ y: -4 }}
                        className="group block overflow-hidden rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-elev transition-shadow hover:shadow-elev-lg"
                      >
                        <div className="relative h-32 overflow-hidden">
                          <img src={p.img} alt="" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                          <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--card))] via-transparent to-transparent" />
                          <span className="absolute right-3 top-3 rounded-full bg-white/90 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-[hsl(var(--primary))] backdrop-blur-md">{p.tag}</span>
                          <span className="absolute left-3 top-3 text-2xl">{p.flag}</span>
                        </div>
                        <div className="p-5">
                          <h4 className="font-display text-lg font-bold leading-tight">{p.name}</h4>
                          <p className="mt-0.5 text-sm text-[hsl(var(--muted-foreground))]">{p.uni} · {p.country}</p>

                          <div className="mt-4">
                            <div className="flex items-baseline justify-between">
                              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[hsl(var(--muted-foreground))]">Fit</span>
                              <span className="font-display text-sm font-bold">{p.fit}%</span>
                            </div>
                            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[hsl(var(--muted))]">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${p.fit}%` }}
                                transition={{ duration: 1.1, ease: expoOut, delay: 0.2 + i * 0.05 }}
                                className="h-full bg-gradient-to-r from-[hsl(var(--accent))] to-[hsl(var(--primary))]"
                              />
                            </div>
                          </div>

                          <div className="mt-4 grid grid-cols-2 gap-3 border-t border-[hsl(var(--border))] pt-3 text-sm">
                            <div>
                              <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-[hsl(var(--muted-foreground))]">Tuition</div>
                              <div className="font-display font-bold">{p.fee}</div>
                            </div>
                            <div>
                              <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-[hsl(var(--muted-foreground))]">Duration</div>
                              <div className="font-display font-bold">{p.dur}</div>
                            </div>
                          </div>

                          <div className="mt-4 flex items-center justify-between">
                            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[hsl(var(--muted-foreground))]">Deadline · Jan 12</span>
                            <span className="inline-flex items-center gap-1 text-sm font-medium text-[hsl(var(--primary))]">
                              Open <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                            </span>
                          </div>
                        </div>
                      </motion.a>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </PageShell>
  );
}