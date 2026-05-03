'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

const footerLinks = {
  product: [
    { label: 'NeuroMatch Navigator', href: '/navigator' },
    { label: 'Admission Oracle', href: '/oracle' },
    { label: 'LoanSense Engine', href: '/loansense' },
    { label: 'Essay Co-Pilot', href: '/essays' },
    { label: 'StudyStreak', href: '/streak' },
  ],
  company: [
    { label: 'About', href: '/about' },
    { label: 'Blog', href: '/blog' },
    { label: 'Consultants', href: '/consultants' },
    { label: 'Careers', href: '/careers' },
    { label: 'Press', href: '/press' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Cookie Policy', href: '/cookies' },
    { label: 'DPDP Compliance', href: '/dpdp' },
  ],
}

export function Footer() {
  return (
    <footer className="relative bg-navy border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 relative">
                <svg viewBox="0 0 40 40" fill="none" className="w-full h-full">
                  <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="1.5" className="text-burgundy/40" />
                  <circle cx="20" cy="20" r="4" className="fill-burgundy" />
                  <line x1="20" y1="2" x2="20" y2="8" className="stroke-burgundy" strokeWidth="2" strokeLinecap="round" />
                  <line x1="32" y1="20" x2="38" y2="20" className="stroke-burgundy" strokeWidth="2" strokeLinecap="round" />
                  <line x1="20" y1="16" x2="26" y2="10" className="stroke-gold" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </div>
              <span className="text-xl font-semibold text-cream">Meridian</span>
            </Link>

            <p className="text-grey text-sm leading-relaxed mb-6 max-w-sm">
              The AI-first platform for Indian students navigating higher education and funding — globally.
            </p>

            {/* Partner badge */}
            <div className="flex items-center gap-3 p-3 bg-gold/5 border border-gold/20 rounded-xl">
              <div className="w-10 h-10 rounded-lg bg-gold/20 flex items-center justify-center">
                <span className="text-xs font-bold text-gold">PF</span>
              </div>
              <div>
                <div className="text-sm font-medium text-cream">Poonawalla Fincorp</div>
                <div className="text-xs text-grey">Regulated lending partner - RBI LSP Compliant</div>
              </div>
            </div>
          </div>

          {/* Product links */}
          <div>
            <h4 className="text-sm font-semibold text-cream mb-4">Product</h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-sm text-grey hover:text-cream transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company links */}
          <div>
            <h4 className="text-sm font-semibold text-cream mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-sm text-grey hover:text-cream transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal links */}
          <div>
            <h4 className="text-sm font-semibold text-cream mb-4">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-sm text-grey hover:text-cream transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-grey">
            <span>2025 Meridian Technologies Pvt. Ltd. - Powered by Poonawalla Fincorp Ltd.</span>
            <span className="text-center">
              StudyLaunch operates as an LSP under RBI Digital Lending Guidelines 2022. All loan products are offered by Poonawalla Fincorp Ltd.
            </span>
          </div>
        </div>
      </div>

      {/* Floating AI button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 w-14 h-14 bg-burgundy rounded-full shadow-lg shadow-burgundy/30 flex items-center justify-center z-50 group"
        title="Chat with Meridian AI"
      >
        <svg className="w-6 h-6 text-cream group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      </motion.button>
    </footer>
  )
}
