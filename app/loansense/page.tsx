"use client";

import { useState, useMemo } from "react";
import PageShell from "@/components/site/PageShell";
import { ShieldCheck, Wallet, ArrowUpRight, CheckCircle2, BadgeCheck } from "lucide-react";

const offers = [
  { name: "Poonawalla Fincorp · Prime", apr: 9.2, ceiling: 75, tenure: "12 yrs", co: false, badge: "Co-signer free" },
  { name: "HDFC Credila", apr: 10.4, ceiling: 60, tenure: "10 yrs", co: true, badge: "Standard" },
  { name: "Avanse Education", apr: 11.1, ceiling: 50, tenure: "10 yrs", co: true, badge: "Standard" },
];

export default function LoanSense() {
  const [amount, setAmount] = useState(42);
  const [tenure, setTenure] = useState(8);
  const [apr, setApr] = useState(9.2);

  const emi = useMemo(() => {
    const P = amount * 100000;
    const r = apr / 12 / 100;
    const n = tenure * 12;
    const e = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    return Math.round(e);
  }, [amount, tenure, apr]);

  const total = emi * tenure * 12;
  const interest = total - amount * 100000;

  return (
    <PageShell>
      <section className="relative bg-cream border-b border-border">
        <div className="container py-14 md:py-20 grid lg:grid-cols-12 gap-10 items-end">
          <div className="lg:col-span-7">
            <div className="text-[11px] uppercase tracking-[0.22em] font-mono text-accent mb-4">Surface 03 · LoanSense</div>
            <h1 className="font-display text-5xl md:text-6xl font-bold leading-[1.02]">
              Financing that <span className="text-gradient-ink">moves with the admit.</span>
            </h1>
            <p className="mt-5 text-lg text-muted-foreground max-w-xl">
              DLG-ready, co-signer-free loans engineered for top admits. Model your EMI in real time.
            </p>
          </div>
          <div className="lg:col-span-5">
            <div className="p-5 rounded-3xl bg-hero text-primary-foreground flex items-center gap-4">
              <BadgeCheck className="w-9 h-9 text-accent shrink-0" />
              <div>
                <div className="font-display text-lg leading-snug">Pre-sanctioned offer ready</div>
                <div className="text-sm text-primary-foreground/70">Subject to admit confirmation · valid 60 days</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-14 grid lg:grid-cols-12 gap-8">
        {/* Calculator */}
        <div className="lg:col-span-5">
          <div className="p-7 rounded-3xl border border-border bg-surface-elevated shadow-elev">
            <h2 className="font-display text-2xl font-bold flex items-center gap-2"><Wallet className="w-5 h-5 text-accent" /> EMI calculator</h2>
            <div className="mt-7 space-y-7">
              <Slider label="Loan amount" value={amount} min={5} max={75} step={1} onChange={setAmount} display={`₹${amount}L`} />
              <Slider label="Tenure" value={tenure} min={3} max={12} step={1} onChange={setTenure} display={`${tenure} yrs`} />
              <Slider label="APR" value={apr} min={8.5} max={14} step={0.1} onChange={setApr} display={`${apr.toFixed(1)}%`} />
            </div>

            <div className="mt-8 p-6 rounded-2xl bg-hero text-primary-foreground">
              <div className="text-[11px] uppercase font-mono tracking-[0.22em] text-accent">Monthly EMI</div>
              <div className="font-display text-5xl font-bold mt-2">₹{emi.toLocaleString("en-IN")}</div>
              <div className="mt-5 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-[10px] uppercase font-mono text-primary-foreground/60">Total payable</div>
                  <div className="font-mono mt-1">₹{(total / 100000).toFixed(1)}L</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-mono text-primary-foreground/60">Interest</div>
                  <div className="font-mono mt-1">₹{(interest / 100000).toFixed(1)}L</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Offers */}
        <div className="lg:col-span-7 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl font-bold">Offers tuned to your profile</h2>
            <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground"><ShieldCheck className="w-4 h-4 text-success" /> RBI · DLG 2022</span>
          </div>

          {offers.map((o, i) => (
            <div key={i} className={`p-6 rounded-3xl border ${i === 0 ? "border-accent bg-accent-soft/40 shadow-glow" : "border-border bg-surface-elevated"} hover-lift`}>
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-display text-lg font-bold">{o.name}</span>
                    {i === 0 && <span className="px-2 py-0.5 text-[10px] font-mono rounded-full bg-accent text-accent-foreground uppercase tracking-wider">{o.badge}</span>}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1.5 text-sm text-muted-foreground">
                    <span>APR <span className="text-foreground font-mono font-bold">{o.apr}%</span></span>
                    <span>Ceiling <span className="text-foreground font-mono font-bold">₹{o.ceiling}L</span></span>
                    <span>Tenure <span className="text-foreground font-mono font-bold">{o.tenure}</span></span>
                    <span>Co-signer <span className="text-foreground font-mono font-bold">{o.co ? "Required" : "Not required"}</span></span>
                  </div>
                </div>
                <button className={`shrink-0 inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-sm font-medium ${i === 0 ? "bg-primary text-primary-foreground" : "border border-border bg-surface-elevated"}`}>
                  Apply <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
              <div className="mt-5 grid grid-cols-4 gap-2 text-[11px]">
                {["KYC verified", "Income parsed", "Admit attached", "Offer locked"].map((t, j) => (
                  <div key={t} className="flex items-center gap-1.5 text-success"><CheckCircle2 className="w-3.5 h-3.5" /> {t}</div>
                ))}
              </div>
            </div>
          ))}

          <div className="p-6 rounded-3xl bg-hero text-primary-foreground">
            <div className="text-[11px] uppercase font-mono text-accent tracking-[0.22em]">Disclosure</div>
            <p className="text-sm mt-2 text-primary-foreground/80">
              Indicative offers based on your StudyLaunch profile. Final sanction subject to RE underwriting,
              KYC and admit confirmation. APRs include processing fee amortisation.
            </p>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

function Slider({ label, value, min, max, step, onChange, display }: any) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-2">
        <label className="text-sm text-muted-foreground">{label}</label>
        <span className="font-mono font-bold">{display}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full accent-[hsl(var(--accent))]" />
    </div>
  );
}
