'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'

const leaderboard = [
  { rank: 1, initials: 'AP', name: 'Arjun Patel', target: 'MS CS - UBC', xp: 8420, color: 'bg-burgundy' },
  { rank: 2, initials: 'PK', name: 'Priya Krishnan', target: 'MBA - LBS', xp: 7980, color: 'bg-gold' },
  { rank: 3, initials: 'RM', name: 'Rohan Mehta', target: 'MS DS - Georgia Tech', xp: 7210, color: 'bg-grey' },
  { rank: 4, initials: 'SN', name: 'Sneha Nair', target: 'MS ECE - Purdue', xp: 6890, color: 'bg-burgundy' },
  { rank: 5, initials: 'VS', name: 'Vikram Shah', target: 'MFin - LSE', xp: 6340, color: 'bg-gold' },
]

function AnimatedCounter({ value, suffix = '' }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true })
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!isInView) return

    const duration = 2000
    const start = performance.now()

    const animate = (now: number) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.round(eased * value))

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [isInView, value])

  return (
    <span ref={ref}>
      {count.toLocaleString('en-IN')}{suffix}
    </span>
  )
}

function XPBar({ progress, delay = 0 }: { progress: number; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })

  return (
    <div ref={ref} className="h-2 bg-navy-light rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={isInView ? { width: `${progress}%` } : {}}
        transition={{ duration: 1, delay, ease: [0.16, 1, 0.3, 1] }}
        className="h-full bg-gradient-to-r from-burgundy to-gold rounded-full"
      />
    </div>
  )
}

export function StreakSection() {
  const [hoveredRank, setHoveredRank] = useState<number | null>(null)

  return (
    <section className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-navy via-navy-light to-navy" />
      
      {/* Decorative elements */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-burgundy/10 rounded-full blur-[150px]" />
      <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-gold/10 rounded-full blur-[120px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 text-xs font-medium text-gold bg-gold/10 rounded-full mb-4">
            StudyStreak
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-cream mb-4">
            Your journey is a{' '}
            <span className="font-serif italic text-burgundy">game worth winning.</span>
          </h2>
          <p className="text-lg text-grey max-w-2xl mx-auto">
            Build daily habits, earn XP, and compete with students nationwide on the path to your dream university.
          </p>
        </motion.div>

        {/* Stats cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {[
            { icon: 'fire', value: 14, label: 'Day streak', progress: 68 },
            { icon: 'bolt', value: 2840, label: 'XP earned this month', progress: 57 },
            { icon: 'trophy', value: 12, label: 'National leaderboard rank', prefix: '#', progress: 82 },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="glass rounded-2xl p-6 border border-white/10 group hover:border-burgundy/30 transition-colors"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center">
                  {stat.icon === 'fire' && (
                    <svg className="w-5 h-5 text-gold" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                    </svg>
                  )}
                  {stat.icon === 'bolt' && (
                    <svg className="w-5 h-5 text-gold" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                    </svg>
                  )}
                  {stat.icon === 'trophy' && (
                    <svg className="w-5 h-5 text-gold" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 5a3 3 0 015-2.236A3 3 0 0114.83 6H16a2 2 0 110 4h-1.001a4.5 4.5 0 00.001.09V12a5 5 0 01-4 4.9V18h2a1 1 0 110 2H7a1 1 0 110-2h2v-1.1a5 5 0 01-4-4.9v-1.91A5.507 5.507 0 005 10V5zM7 7a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <span className="text-sm text-grey">{stat.label}</span>
              </div>
              <div className="text-4xl font-bold text-cream mb-4">
                {stat.prefix}
                <AnimatedCounter value={stat.value} />
              </div>
              <XPBar progress={stat.progress} delay={i * 0.1} />
            </motion.div>
          ))}
        </div>

        {/* Leaderboard */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="glass rounded-2xl border border-white/10 overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-white/10">
            <h3 className="text-lg font-semibold text-cream">National Leaderboard</h3>
            <p className="text-sm text-grey">Top performers this week</p>
          </div>
          
          <div className="divide-y divide-white/5">
            {leaderboard.map((user, i) => (
              <motion.div
                key={user.rank}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                onMouseEnter={() => setHoveredRank(user.rank)}
                onMouseLeave={() => setHoveredRank(null)}
                className={`flex items-center gap-4 px-6 py-4 transition-colors ${
                  user.rank <= 2 ? 'bg-gold/5' : ''
                } ${hoveredRank === user.rank ? 'bg-burgundy/10' : ''}`}
              >
                {/* Rank */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  user.rank === 1 ? 'bg-gold text-navy' : 
                  user.rank === 2 ? 'bg-grey text-navy' :
                  user.rank === 3 ? 'bg-burgundy text-cream' :
                  'bg-navy-light text-cream'
                }`}>
                  {user.rank}
                </div>

                {/* Avatar */}
                <div className={`w-10 h-10 rounded-full ${user.color} flex items-center justify-center text-sm font-semibold text-cream`}>
                  {user.initials}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-cream truncate">{user.name}</div>
                  <div className="text-sm text-grey truncate">{user.target}</div>
                </div>

                {/* XP */}
                <div className="text-right">
                  <div className="font-semibold text-gold">{user.xp.toLocaleString()} XP</div>
                  <AnimatePresence>
                    {hoveredRank === user.rank && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="text-xs text-grey"
                      >
                        View profile
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </div>

          {/* View all button */}
          <div className="px-6 py-4 border-t border-white/10">
            <button className="w-full py-3 text-center text-sm font-medium text-burgundy hover:text-gold transition-colors">
              View full leaderboard
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
