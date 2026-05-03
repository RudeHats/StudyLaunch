'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'

const navItems = [
  { icon: 'dashboard', label: 'Dashboard', active: true },
  { icon: 'navigator', label: 'Navigator' },
  { icon: 'oracle', label: 'Oracle' },
  { icon: 'loan', label: 'LoanSense' },
  { icon: 'essay', label: 'Essays' },
  { icon: 'streak', label: 'Streak' },
]

const programs = [
  { name: 'UT Austin MSCS', term: 'Spring 2026', prob: 74, status: 'SOP Draft', statusColor: 'gold' },
  { name: 'UMass Amherst', term: 'Fall 2026', prob: 83, status: 'Submitted', statusColor: 'burgundy' },
  { name: 'Northeastern', term: 'Fall 2026', prob: 61, status: 'Not started', statusColor: 'grey' },
]

export function DashboardPreview() {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: '-100px' })
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], [50, -50])
  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [5, 0, -5])

  return (
    <section ref={containerRef} className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-navy" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-burgundy/5 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 text-xs font-medium text-gold bg-gold/10 rounded-full mb-4">
            Student Dashboard
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-cream mb-4">
            Everything in one{' '}
            <span className="font-serif italic text-gold">command centre.</span>
          </h2>
          <p className="text-lg text-grey max-w-2xl mx-auto">
            Track applications, manage deadlines, and monitor your progress — all in a single, intelligent dashboard.
          </p>
        </motion.div>

        {/* Dashboard frame */}
        <motion.div
          style={{ y, rotateX, perspective: 1000 }}
          className="relative"
        >
          {/* Glow effect */}
          <div className="absolute -inset-4 bg-gradient-to-r from-burgundy/20 via-gold/10 to-burgundy/20 rounded-3xl blur-2xl opacity-50" />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative glass rounded-2xl border border-white/10 overflow-hidden"
          >
            {/* Window controls */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-navy/50">
              <div className="w-3 h-3 rounded-full bg-burgundy" />
              <div className="w-3 h-3 rounded-full bg-gold" />
              <div className="w-3 h-3 rounded-full bg-grey/50" />
              <span className="ml-4 text-xs text-grey/50">app.meridian.in/dashboard</span>
            </div>

            <div className="flex">
              {/* Sidebar */}
              <div className="w-56 border-r border-white/10 p-4 hidden md:block">
                {navItems.map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.3 + i * 0.05 }}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 cursor-pointer transition-colors ${
                      item.active 
                        ? 'bg-burgundy/20 text-cream' 
                        : 'text-grey hover:bg-white/5 hover:text-cream'
                    }`}
                  >
                    <div className="w-5 h-5 flex items-center justify-center">
                      {item.icon === 'dashboard' && (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="1.5">
                          <rect x="2" y="2" width="5" height="5" rx="1" />
                          <rect x="9" y="2" width="5" height="5" rx="1" />
                          <rect x="2" y="9" width="5" height="5" rx="1" />
                          <rect x="9" y="9" width="5" height="5" rx="1" />
                        </svg>
                      )}
                      {item.icon === 'navigator' && (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="1.5">
                          <path d="M2 12l5-8 4 5 2-3 3 6" />
                        </svg>
                      )}
                      {item.icon === 'oracle' && (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="1.5">
                          <circle cx="8" cy="8" r="6" />
                          <path d="M8 5v3l2 2" />
                        </svg>
                      )}
                      {item.icon === 'loan' && (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="1.5">
                          <rect x="2" y="3" width="12" height="10" rx="1.5" />
                          <path d="M5 7h6M5 10h4" />
                        </svg>
                      )}
                      {item.icon === 'essay' && (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="1.5">
                          <path d="M2 13l4-9 3 5 2-3 3 7" />
                        </svg>
                      )}
                      {item.icon === 'streak' && (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="1.5">
                          <path d="M8 2l1.5 4h4l-3.5 2.5 1.5 4L8 10l-3.5 2.5 1.5-4L2.5 6h4z" />
                        </svg>
                      )}
                    </div>
                    <span className="text-sm">{item.label}</span>
                  </motion.div>
                ))}
              </div>

              {/* Main content */}
              <div className="flex-1 p-6">
                {/* Greeting */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : {}}
                  transition={{ duration: 0.4, delay: 0.4 }}
                  className="mb-6"
                >
                  <h3 className="text-xl font-semibold text-cream mb-1">Good morning, Arjun</h3>
                  <p className="text-sm text-grey">Wednesday, 14 August - Cycle 2025</p>
                </motion.div>

                {/* Stats */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.5 }}
                  className="grid grid-cols-3 gap-4 mb-6"
                >
                  {[
                    { label: 'Profile strength', value: '82%', sub: '+12% this week', subColor: 'text-gold' },
                    { label: 'Applications', value: '3', sub: '2 in progress', subColor: 'text-gold' },
                    { label: 'Streak', value: '14', sub: 'Top 15% nationally', subColor: 'text-burgundy' },
                  ].map((stat, i) => (
                    <div key={stat.label} className="bg-navy-light/50 rounded-xl p-4">
                      <div className="text-xs text-grey mb-2">{stat.label}</div>
                      <div className="text-2xl font-bold text-cream">{stat.value}</div>
                      <div className={`text-xs ${stat.subColor}`}>{stat.sub}</div>
                    </div>
                  ))}
                </motion.div>

                {/* Journey progress */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.6 }}
                  className="bg-navy-light/30 rounded-xl p-4 mb-6"
                >
                  <div className="text-sm text-cream mb-4">Your journey</div>
                  <div className="flex items-center justify-between">
                    {['Explore', 'Profile', 'Shortlist', 'Apply', 'Fund'].map((step, i) => (
                      <div key={step} className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium mb-2 ${
                          i < 2 ? 'bg-burgundy text-cream' :
                          i === 2 ? 'bg-gold text-navy ring-2 ring-gold/30' :
                          'bg-navy-light text-grey'
                        }`}>
                          {i < 2 ? '✓' : i + 1}
                        </div>
                        <span className={`text-xs ${i === 2 ? 'text-cream' : 'text-grey'}`}>{step}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Programs table */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.7 }}
                  className="bg-navy-light/30 rounded-xl overflow-hidden mb-6"
                >
                  <div className="grid grid-cols-4 gap-4 px-4 py-3 border-b border-white/10 text-xs text-grey">
                    <span>Program</span>
                    <span>Prob.</span>
                    <span>Status</span>
                    <span>Action</span>
                  </div>
                  {programs.map((program, i) => (
                    <div key={program.name} className="grid grid-cols-4 gap-4 px-4 py-3 items-center hover:bg-white/5 transition-colors">
                      <div>
                        <div className="text-sm font-medium text-cream">{program.name}</div>
                        <div className="text-xs text-grey">{program.term}</div>
                      </div>
                      <div>
                        <span className={`text-xs px-2 py-1 rounded ${
                          program.prob >= 70 ? 'bg-gold/20 text-gold' : 'bg-grey/20 text-grey'
                        }`}>
                          {program.prob}%
                        </span>
                      </div>
                      <div>
                        <span className={`text-xs px-2 py-1 rounded ${
                          program.statusColor === 'gold' ? 'bg-gold/20 text-gold' :
                          program.statusColor === 'burgundy' ? 'bg-burgundy/20 text-burgundy' :
                          'bg-grey/20 text-grey'
                        }`}>
                          {program.status}
                        </span>
                      </div>
                      <div>
                        <button className="text-xs px-3 py-1.5 bg-burgundy/20 text-burgundy rounded hover:bg-burgundy/30 transition-colors">
                          {program.status === 'Not started' ? 'Start' : program.status === 'Submitted' ? 'Track' : 'Continue'}
                        </button>
                      </div>
                    </div>
                  ))}
                </motion.div>

                {/* Nudge card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.8 }}
                  className="flex items-start gap-4 p-4 bg-gradient-to-r from-gold/10 to-burgundy/10 rounded-xl border border-gold/20"
                >
                  <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-gold" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-cream mb-1">
                      You&apos;re 70% done with your UT Austin SOP
                    </div>
                    <div className="text-xs text-grey">
                      3 students with your profile submitted this week. Your essay deadline is in 18 days.
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
