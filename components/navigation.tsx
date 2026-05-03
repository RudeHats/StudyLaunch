'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

const navLinks = [
  { href: '/navigator', label: 'Navigator' },
  { href: '/oracle', label: 'Oracle' },
  { href: '/loansense', label: 'LoanSense' },
  { href: '/essays', label: 'Essays' },
  { href: '/streak', label: 'Streak' },
]

export function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled 
            ? 'glass py-3' 
            : 'bg-transparent py-6'
        }`}
      >
        <nav className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <motion.div 
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.6 }}
              className="relative w-10 h-10"
            >
              <svg viewBox="0 0 40 40" fill="none" className="w-full h-full">
                <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="1.5" className="text-burgundy/40" />
                <circle cx="20" cy="20" r="4" className="fill-burgundy" />
                <line x1="20" y1="2" x2="20" y2="8" className="stroke-burgundy" strokeWidth="2" strokeLinecap="round" />
                <line x1="32" y1="20" x2="38" y2="20" className="stroke-burgundy" strokeWidth="2" strokeLinecap="round" />
                <line x1="20" y1="16" x2="26" y2="10" className="stroke-gold" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </motion.div>
            <span className="text-xl font-semibold text-cream tracking-tight">
              Meridian
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link, i) => (
              <Link 
                key={link.href}
                href={link.href}
                className="relative px-4 py-2 text-sm text-cream/70 hover:text-cream transition-colors group"
              >
                <span className="relative z-10">{link.label}</span>
                <motion.div
                  className="absolute inset-0 rounded-lg bg-burgundy/0 group-hover:bg-burgundy/10 transition-colors"
                  layoutId={`nav-bg-${i}`}
                />
              </Link>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <Link 
              href="/login"
              className="px-4 py-2 text-sm text-cream/80 hover:text-cream transition-colors"
            >
              Log in
            </Link>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link 
                href="/signup"
                className="px-5 py-2.5 text-sm font-medium bg-burgundy text-cream rounded-lg hover:bg-burgundy-dark transition-colors"
              >
                Start free
              </Link>
            </motion.div>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5"
            aria-label="Toggle menu"
          >
            <motion.span 
              animate={{ rotate: mobileOpen ? 45 : 0, y: mobileOpen ? 6 : 0 }}
              className="w-6 h-0.5 bg-cream block"
            />
            <motion.span 
              animate={{ opacity: mobileOpen ? 0 : 1 }}
              className="w-6 h-0.5 bg-cream block"
            />
            <motion.span 
              animate={{ rotate: mobileOpen ? -45 : 0, y: mobileOpen ? -6 : 0 }}
              className="w-6 h-0.5 bg-cream block"
            />
          </button>
        </nav>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-navy pt-24 px-6 lg:hidden"
          >
            <div className="flex flex-col gap-4">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link 
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="block text-2xl text-cream py-3 border-b border-border"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col gap-3 mt-8"
              >
                <Link 
                  href="/login"
                  className="w-full py-3 text-center text-cream border border-border rounded-lg"
                >
                  Log in
                </Link>
                <Link 
                  href="/signup"
                  className="w-full py-3 text-center bg-burgundy text-cream rounded-lg font-medium"
                >
                  Start free
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
