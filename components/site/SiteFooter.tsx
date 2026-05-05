"use client";

import Link from "next/link";
import { Sparkles, ShieldCheck } from "lucide-react";

export default function SiteFooter() {
  return (
    <footer className="relative mt-24 border-t border-border bg-cream">
      <div className="container py-16 grid md:grid-cols-4 gap-10">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-xl bg-hero grid place-items-center">
              <Sparkles className="w-4 h-4 text-accent" />
            </span>
            <div className="leading-none">
              <div className="font-display font-bold text-lg">StudyLaunch</div>
              <div className="text-[10px] text-muted-foreground font-mono uppercase tracking-[0.18em]">Powered by Poonawalla Fincorp</div>
            </div>
          </div>
          <p className="mt-5 text-sm text-muted-foreground max-w-md leading-relaxed">
            An AI-first financing & engagement platform for Indian students pursuing
            postgraduate education abroad. Built for the TenzorX competition.
          </p>
          <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-success" />
            RBI DLG 2022 · DPDP Act 2023 compliant
          </div>
        </div>

        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-mono mb-4">Product</div>
          <ul className="space-y-2.5 text-sm">
            {[["/navigator", "Navigator"], ["/oracle", "Oracle"], ["/loansense", "LoanSense"], ["/dashboard", "Dashboard"], ["/essay", "Essay Co-Pilot"]].map(([href, l]) => (
              <li key={href}><Link href={href} className="text-muted-foreground hover:text-foreground transition">{l}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-mono mb-4">Company</div>
          <ul className="space-y-2.5 text-sm">
            {["About", "Press", "Careers", "Compliance", "Privacy", "Terms"].map(l => (
              <li key={l}><a className="text-muted-foreground hover:text-foreground transition" href="#">{l}</a></li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container py-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-muted-foreground font-mono">
          <div>© 2026 StudyLaunch · Prototype submission, TenzorX Competition</div>
          <div>v1.0 · Confidential</div>
        </div>
      </div>
    </footer>
  );
}
