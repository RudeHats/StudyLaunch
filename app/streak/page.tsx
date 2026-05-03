'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import Link from 'next/link'
import { Navigation } from '@/components/navigation'

// Daily challenges data
const dailyChallenges = [
  { id: 1, title: 'Complete GRE Vocab Quiz', xp: 50, completed: true, type: 'quiz' },
  { id: 2, title: 'Review 3 Universities', xp: 30, completed: true, type: 'research' },
  { id: 3, title: 'Update SOP Draft', xp: 100, completed: false, type: 'writing' },
  { id: 4, title: 'Practice Quant Section', xp: 75, completed: false, type: 'practice' },
]

// Leaderboard data
const leaderboard = [
  { rank: 1, initials: 'AP', name: 'Arjun Patel', target: 'MS CS - UBC', xp: 8420, streak: 34 },
  { rank: 2, initials: 'PK', name: 'Priya Krishnan', target: 'MBA - LBS', xp: 7980, streak: 28 },
  { rank: 3, initials: 'RM', name: 'Rohan Mehta', target: 'MS DS - Georgia Tech', xp: 7210, streak: 25 },
  { rank: 4, initials: 'SN', name: 'Sneha Nair', target: 'MS ECE - Purdue', xp: 6890, streak: 22 },
  { rank: 5, initials: 'VS', name: 'Vikram Shah', target: 'MFin - LSE', xp: 6340, streak: 19 },
  { rank: 6, initials: 'AG', name: 'Ananya Gupta', target: 'MS AI - CMU', xp: 5980, streak: 17 },
  { rank: 7, initials: 'RK', name: 'Rahul Kumar', target: 'PhD Physics - MIT', xp: 5670, streak: 15 },
  { rank: 8, initials: 'NM', name: 'Neha Mishra', target: 'MS HCI - UMich', xp: 5340, streak: 14 },
]

// Achievements data
const achievements = [
  { id: 1, title: 'Week Warrior', description: '7-day streak', icon: '🔥', unlocked: true, date: '2 weeks ago' },
  { id: 2, title: 'Quiz Master', description: 'Complete 50 quizzes', icon: '🎯', unlocked: true, date: '1 week ago' },
  { id: 3, title: 'Early Bird', description: 'Complete task before 8 AM', icon: '🌅', unlocked: true, date: '3 days ago' },
  { id: 4, title: 'Research Pro', description: 'Review 100 universities', icon: '🔍', unlocked: false, progress: 78 },
  { id: 5, title: 'Writing Legend', description: 'Write 10,000 words', icon: '✍️', unlocked: false, progress: 45 },
  { id: 6, title: 'Month Master', description: '30-day streak', icon: '👑', unlocked: false, progress: 47 },
]

// Weekly XP data for chart
const weeklyXP = [
  { day: 'Mon', xp: 120 },
  { day: 'Tue', xp: 180 },
  { day: 'Wed', xp: 90 },
  { day: 'Thu', xp: 210 },
  { day: 'Fri', xp: 150 },
  { day: 'Sat', xp: 280 },
  { day: 'Sun', xp: 175 },
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
      if (progress < 1) requestAnimationFrame(animate)
    }
    
    requestAnimationFrame(animate)
  }, [isInView, value])

  return <span ref={ref}>{count.toLocaleString('en-IN')}{suffix}</span>
}

export default function StreakPage() {
  const [selectedTab, setSelectedTab] = useState<'daily' | 'weekly' | 'all-time'>('weekly')
  
  return (
    <>
      <Navigation />
      
      <main className="min-h-screen bg-navy pt-24 pb-20">
        {/* Background effects */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] bg-burgundy/10 rounded-full blur-[200px]" />
          <div className="absolute bottom-1/4 -right-1/4 w-[500px] h-[500px] bg-gold/10 rounded-full blur-[150px]" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <div className="flex items-center gap-2 mb-4">
              <Link href="/" className="text-grey hover:text-cream transition-colors text-sm">
                Home
              </Link>
              <span className="text-grey/50">/</span>
              <span className="text-cream text-sm">StudyStreak</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-cream mb-4">
              Study<span className="font-serif italic text-gold">Streak</span>
            </h1>
            <p className="text-grey text-lg max-w-2xl">
              Build consistent study habits, earn XP, and compete with students nationwide on the path to your dream university.
            </p>
          </motion.div>
          
          {/* Stats overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid md:grid-cols-4 gap-6 mb-12"
          >
            {[
              { icon: '🔥', value: 14, label: 'Day Streak', sub: 'Personal best: 21' },
              { icon: '⚡', value: 2840, label: 'Total XP', sub: 'This month' },
              { icon: '🏆', value: 12, label: 'Leaderboard Rank', sub: 'Top 5% nationally', prefix: '#' },
              { icon: '✅', value: 47, label: 'Tasks Completed', sub: 'This week' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                className="glass rounded-2xl p-6 border border-white/10 group hover:border-gold/30 transition-all"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">{stat.icon}</span>
                  <span className="text-sm text-grey">{stat.label}</span>
                </div>
                <div className="text-3xl font-bold text-cream mb-1">
                  {stat.prefix}<AnimatedCounter value={stat.value} />
                </div>
                <div className="text-xs text-grey/60">{stat.sub}</div>
              </motion.div>
            ))}
          </motion.div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left column - Daily challenges & XP chart */}
            <div className="lg:col-span-2 space-y-8">
              {/* Daily challenges */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="glass rounded-2xl border border-white/10 overflow-hidden"
              >
                <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-cream">Daily Challenges</h2>
                    <p className="text-sm text-grey">Complete tasks to earn XP</p>
                  </div>
                  <div className="text-sm text-gold">
                    2/4 completed
                  </div>
                </div>
                
                <div className="divide-y divide-white/5">
                  {dailyChallenges.map((challenge, i) => (
                    <motion.div
                      key={challenge.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.4 + i * 0.1 }}
                      className={`flex items-center gap-4 px-6 py-4 hover:bg-white/5 transition-colors ${
                        challenge.completed ? 'opacity-60' : ''
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        challenge.completed ? 'bg-gold/20' : 'bg-burgundy/20'
                      }`}>
                        {challenge.completed ? (
                          <svg className="w-5 h-5 text-gold" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <div className="w-4 h-4 rounded-full border-2 border-burgundy" />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className={`font-medium ${challenge.completed ? 'text-grey line-through' : 'text-cream'}`}>
                          {challenge.title}
                        </div>
                        <div className="text-xs text-grey/60 capitalize">{challenge.type}</div>
                      </div>
                      
                      <div className={`text-sm font-semibold ${challenge.completed ? 'text-grey' : 'text-gold'}`}>
                        +{challenge.xp} XP
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
              
              {/* Weekly XP chart */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="glass rounded-2xl border border-white/10 p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-semibold text-cream">XP Progress</h2>
                    <p className="text-sm text-grey">Your activity this week</p>
                  </div>
                  <div className="flex gap-2">
                    {['daily', 'weekly', 'all-time'].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setSelectedTab(tab as typeof selectedTab)}
                        className={`px-3 py-1.5 text-xs rounded-lg transition-all ${
                          selectedTab === tab
                            ? 'bg-burgundy text-cream'
                            : 'text-grey hover:text-cream'
                        }`}
                      >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Simple bar chart */}
                <div className="flex items-end justify-between gap-2 h-48">
                  {weeklyXP.map((day, i) => {
                    const maxXP = Math.max(...weeklyXP.map(d => d.xp))
                    const height = (day.xp / maxXP) * 100
                    const isToday = i === weeklyXP.length - 1
                    
                    return (
                      <motion.div
                        key={day.day}
                        className="flex-1 flex flex-col items-center gap-2"
                      >
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${height}%` }}
                          transition={{ duration: 0.8, delay: 0.6 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                          className={`w-full rounded-t-lg ${
                            isToday 
                              ? 'bg-gradient-to-t from-burgundy to-gold' 
                              : 'bg-burgundy/50'
                          }`}
                        />
                        <span className={`text-xs ${isToday ? 'text-gold font-semibold' : 'text-grey'}`}>
                          {day.day}
                        </span>
                      </motion.div>
                    )
                  })}
                </div>
                
                <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
                  <span className="text-sm text-grey">Total this week</span>
                  <span className="text-lg font-bold text-gold">
                    {weeklyXP.reduce((sum, d) => sum + d.xp, 0)} XP
                  </span>
                </div>
              </motion.div>
              
              {/* Achievements */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="glass rounded-2xl border border-white/10 p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-semibold text-cream">Achievements</h2>
                    <p className="text-sm text-grey">3 of 6 unlocked</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {achievements.map((achievement, i) => (
                    <motion.div
                      key={achievement.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: 0.7 + i * 0.05 }}
                      className={`p-4 rounded-xl border transition-all ${
                        achievement.unlocked
                          ? 'bg-gold/10 border-gold/30'
                          : 'bg-navy-light/50 border-white/10 opacity-60'
                      }`}
                    >
                      <div className="text-3xl mb-2 grayscale-0" style={{ filter: achievement.unlocked ? 'none' : 'grayscale(1)' }}>
                        {achievement.icon}
                      </div>
                      <div className={`font-medium text-sm mb-1 ${achievement.unlocked ? 'text-cream' : 'text-grey'}`}>
                        {achievement.title}
                      </div>
                      <div className="text-xs text-grey/60">
                        {achievement.unlocked ? achievement.date : `${achievement.progress}% complete`}
                      </div>
                      
                      {!achievement.unlocked && (
                        <div className="mt-2 h-1.5 bg-navy-light rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-burgundy to-gold rounded-full"
                            style={{ width: `${achievement.progress}%` }}
                          />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
            
            {/* Right column - Leaderboard */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="glass rounded-2xl border border-white/10 overflow-hidden h-fit sticky top-24"
            >
              <div className="px-6 py-4 border-b border-white/10">
                <h2 className="text-lg font-semibold text-cream">National Leaderboard</h2>
                <p className="text-sm text-grey">Top performers this week</p>
              </div>
              
              <div className="divide-y divide-white/5">
                {leaderboard.map((user, i) => (
                  <motion.div
                    key={user.rank}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.5 + i * 0.05 }}
                    className={`flex items-center gap-3 px-6 py-3 hover:bg-white/5 transition-colors ${
                      user.rank <= 3 ? 'bg-gold/5' : ''
                    }`}
                  >
                    {/* Rank */}
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                      user.rank === 1 ? 'bg-gold text-navy' : 
                      user.rank === 2 ? 'bg-grey text-navy' :
                      user.rank === 3 ? 'bg-burgundy text-cream' :
                      'bg-navy-light text-grey'
                    }`}>
                      {user.rank}
                    </div>
                    
                    {/* Avatar */}
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold text-cream ${
                      user.rank % 2 === 0 ? 'bg-gold/50' : 'bg-burgundy'
                    }`}>
                      {user.initials}
                    </div>
                    
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm text-cream truncate">{user.name}</div>
                      <div className="text-xs text-grey truncate">{user.target}</div>
                    </div>
                    
                    {/* Stats */}
                    <div className="text-right">
                      <div className="font-semibold text-sm text-gold">{user.xp.toLocaleString()}</div>
                      <div className="text-xs text-grey">🔥 {user.streak}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <div className="px-6 py-4 border-t border-white/10">
                <button className="w-full py-3 text-center text-sm font-medium text-burgundy hover:text-gold transition-colors">
                  View Full Leaderboard
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </>
  )
}
