"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, Sparkles } from "lucide-react";

const links = [
  { href: "/", label: "Home" },
  { href: "/navigator", label: "Navigator" },
  { href: "/oracle", label: "Oracle" },
  { href: "/loansense", label: "LoanSense" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/essays", label: "Essay Co-Pilot" },
  { href: "/learn", label: "The Loop" },
];

export default function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-500 ${scrolled
        ? "backdrop-blur-xl bg-background/80 border-b border-border/60"
        : "bg-transparent"
        }`}
    >
      <div className="container flex items-center justify-between h-16 md:h-20">
        <Link href="/" className="flex items-center gap-2.5 group">
          <span className="relative w-9 h-9 rounded-xl bg-hero shadow-elev grid place-items-center overflow-hidden">
            <Sparkles className="w-4 h-4 text-accent relative z-10" />
            <span className="absolute inset-0 bg-gold opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </span>
          <div className="leading-none">
            <div className="font-display font-bold text-[17px] tracking-tight">StudyLaunch</div>
            <div className="text-[10px] text-muted-foreground font-mono uppercase tracking-[0.18em]">Poonawalla Fincorp</div>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {links.map((l) => {
            const isActive = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`relative px-3.5 py-2 text-sm rounded-lg transition-colors duration-300 ${isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                {l.label}
                {isActive && (
                  <span className="absolute left-3.5 right-3.5 -bottom-0.5 h-px bg-gold" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <Link href="/oracle" className="text-sm text-muted-foreground hover:text-foreground transition">Sign in</Link>
          <Link
            href="/navigator"
            className="relative inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium shadow-elev hover:shadow-ink transition-all duration-500 sheen"
          >
            Get started
            <span className="text-accent">→</span>
          </Link>
        </div>

        <button
          aria-label="Menu"
          className="lg:hidden p-2 rounded-md hover:bg-secondary"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-border bg-background animate-fade-in">
          <div className="container py-4 flex flex-col gap-1">
            {links.map((l) => {
              const isActive = pathname === l.href;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`px-3 py-2.5 rounded-md text-sm ${isActive ? "bg-secondary text-foreground" : "text-muted-foreground"
                    }`}
                >
                  {l.label}
                </Link>
              );
            })}
            <Link
              href="/navigator"
              className="mt-2 px-4 py-2.5 rounded-full bg-primary text-primary-foreground text-sm text-center"
            >
              Get started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
