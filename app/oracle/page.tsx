'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'

interface ProfileData {
  gpa: number
  gre: number
  toefl: number
  workExp: number
  research: number
  university: string
}

interface GapAnalysis {
  factor: string
  current: string
  impact: number
  suggestion: string
  potential: number
}

const defaultProfile: ProfileData = {
  gpa: 3.5,
  gre: 318,
  toefl: 105,
  workExp: 2,
  research: 1,
  university: 'IIT Delhi',
}

const gapAnalysis: GapAnalysis[] = [
  {
    factor: 'GRE Score',
    current: '318',
    impact: 12,
    suggestion: 'Scoring 325+ would significantly boost your chances',
    potential: 18,
  },
  {
    factor: 'Research Papers',
    current: '1 publication',
    impact: 8,
    suggestion: 'Adding 1-2 more publications in top conferences',
    potential: 15,
  },
  {
    factor: 'Work Experience',
    current: '2 years',
    impact: 5,
    suggestion: 'FAANG or top startup experience adds weight',
    potential: 10,
  },
  {
    factor: 'Strong LORs',
    current: 'Good',
    impact: 10,
    suggestion: 'Getting recommendation from industry leaders',
    potential: 15,
  },
]

const universities = [
  { name: 'Stanford MSCS', probability: 32, tier: 'Ambitious' },
  { name: 'CMU MHCI', probability: 48, tier: 'Target' },
  { name: 'UC Berkeley EECS', probability: 41, tier: 'Target' },
  { name: 'Georgia Tech MSCS', probability: 72, tier: 'Safe' },
  { name: 'UT Austin MSCS', probability: 68, tier: 'Safe' },
  { name: 'UIUC MCS', probability: 78, tier: 'Safe' },
]

function CircularProgress({ value, size = 200, label }: { value: number; size?: number; label: string }) {
  const ref = useRef<SVGSVGElement>(null)
  const isInView = useInView(ref, { once: true })
  const strokeWidth = 12
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (value / 100) * circumference

  const getColor = (v: number) => {
    if (v >= 70) return { color: 'text-gold', gradient: 'from-gold to-gold-dim' }
    if (v >= 50) return { color: 'text-burgundy', gradient: 'from-burgundy to-burgundy-dark' }
    return { color: 'text-grey', gradient: 'from-grey to-grey/50' }
  }

  const colors = getColor(value)

  return (
    <div className="relative flex flex-col items-center">
      <svg ref={ref} width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-navy-light"
        />
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#gradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={isInView ? { strokeDashoffset: offset } : {}}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" className={`${colors.gradient.split(' ')[0].replace('from-', 'stop-')}`} style={{ stopColor: value >= 70 ? '#FFC85C' : value >= 50 ? '#AE2448' : '#BBD5DA' }} />
            <stop offset="100%" style={{ stopColor: value >= 70 ? '#d4a84a' : value >= 50 ? '#8c1d3a' : '#95adb0' }} />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          initial={{ opacity: 0, scale: 0.5 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.8 }}
          className={`text-5xl font-bold ${colors.color}`}
        >
          {value}%
        </motion.span>
        <span className="text-sm text-grey mt-1">{label}</span>
      </div>
    </div>
  )
}

function Slider({ 
  label, 
  value, 
  onChange, 
  min, 
  max, 
  step = 1,
  unit = '' 
}: { 
  label: string
  value: number
  onChange: (v: number) => void
  min: number
  max: number
  step?: number
  unit?: string
}) {
  const percentage = ((value - min) / (max - min)) * 100

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-grey">{label}</span>
        <span className="text-cream font-medium">{value}{unit}</span>
      </div>
      <div className="relative">
        <div className="h-2 bg-navy-light rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-burgundy to-gold rounded-full transition-all"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full h-2 opacity-0 cursor-pointer"
        />
      </div>
    </div>
  )
}

export default function OraclePage() {
  const [profile, setProfile] = useState<ProfileData>(defaultProfile)
  const [selectedUniversity, setSelectedUniversity] = useState<string | null>(null)
  const [showAnalysis, setShowAnalysis] = useState(false)
  const [isCalculating, setIsCalculating] = useState(false)

  const calculateProbability = () => {
    setIsCalculating(true)
    setTimeout(() => {
      setIsCalculating(false)
      setShowAnalysis(true)
    }, 2000)
  }

  const overallProbability = Math.round(
    (profile.gpa / 4) * 25 +
    (profile.gre / 340) * 25 +
    (profile.toefl / 120) * 15 +
    (profile.workExp / 5) * 15 +
    (profile.research / 5) * 20
  )

  return (
    <main className="relative min-h-screen bg-navy">
      <Navigation />
      
      {/* Hero */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gold/5 via-transparent to-transparent" />
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-gold/15 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-burgundy/10 rounded-full blur-[120px]" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 text-xs font-medium text-gold bg-gold/10 rounded-full mb-4">
              Admission Oracle
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-cream mb-4">
              Know your{' '}
              <span className="font-serif italic text-burgundy">admit chances</span>
              {' '}before you apply.
            </h1>
            <p className="text-lg text-grey max-w-2xl mx-auto">
              Our predictive engine trained on 500K+ admit decisions shows exactly where you stand and what to improve.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Calculator Section */}
      <section className="relative pb-32">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Profile Input */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="glass rounded-2xl border border-white/10 p-6"
            >
              <h3 className="text-xl font-semibold text-cream mb-6">Your Profile</h3>
              
              <div className="space-y-6">
                <Slider
                  label="GPA (out of 4.0)"
                  value={profile.gpa}
                  onChange={(v) => setProfile({ ...profile, gpa: v })}
                  min={2.0}
                  max={4.0}
                  step={0.1}
                />
                
                <Slider
                  label="GRE Score"
                  value={profile.gre}
                  onChange={(v) => setProfile({ ...profile, gre: v })}
                  min={260}
                  max={340}
                />
                
                <Slider
                  label="TOEFL Score"
                  value={profile.toefl}
                  onChange={(v) => setProfile({ ...profile, toefl: v })}
                  min={80}
                  max={120}
                />
                
                <Slider
                  label="Work Experience"
                  value={profile.workExp}
                  onChange={(v) => setProfile({ ...profile, workExp: v })}
                  min={0}
                  max={10}
                  unit=" years"
                />
                
                <Slider
                  label="Research Publications"
                  value={profile.research}
                  onChange={(v) => setProfile({ ...profile, research: v })}
                  min={0}
                  max={10}
                  unit=" papers"
                />

                <div className="space-y-2">
                  <label className="text-sm text-grey">Undergraduate Institution</label>
                  <select
                    value={profile.university}
                    onChange={(e) => setProfile({ ...profile, university: e.target.value })}
                    className="w-full px-4 py-3 bg-navy-light border border-white/10 rounded-xl text-cream focus:outline-none focus:border-burgundy/50"
                  >
                    <option value="IIT Delhi">IIT Delhi</option>
                    <option value="IIT Bombay">IIT Bombay</option>
                    <option value="IIT Madras">IIT Madras</option>
                    <option value="BITS Pilani">BITS Pilani</option>
                    <option value="NIT Trichy">NIT Trichy</option>
                    <option value="Other Tier-1">Other Tier-1</option>
                    <option value="Other Tier-2">Other Tier-2</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={calculateProbability}
                  disabled={isCalculating}
                  className="w-full py-4 bg-burgundy text-cream font-semibold rounded-xl hover:bg-burgundy-dark transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isCalculating ? (
                    <>
                      <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Analyzing...
                    </>
                  ) : (
                    'Calculate My Chances'
                  )}
                </motion.button>
              </div>
            </motion.div>

            {/* Results */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              {/* Overall Score */}
              <div className="glass rounded-2xl border border-white/10 p-6">
                <h3 className="text-xl font-semibold text-cream mb-6 text-center">Overall Admit Probability</h3>
                <div className="flex justify-center">
                  <CircularProgress value={overallProbability} label="Aggregate" />
                </div>
                <p className="text-center text-grey text-sm mt-4">
                  Based on your profile compared to 500K+ historical admits
                </p>
              </div>

              {/* University-wise */}
              <div className="glass rounded-2xl border border-white/10 p-6">
                <h3 className="text-lg font-semibold text-cream mb-4">By University</h3>
                <div className="space-y-3">
                  {universities.map((uni, i) => (
                    <motion.div
                      key={uni.name}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.05 }}
                      onClick={() => setSelectedUniversity(selectedUniversity === uni.name ? null : uni.name)}
                      className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors ${
                        selectedUniversity === uni.name 
                          ? 'bg-burgundy/20 border border-burgundy/30' 
                          : 'bg-navy-light/30 hover:bg-navy-light/50'
                      }`}
                    >
                      <div>
                        <div className="font-medium text-cream">{uni.name}</div>
                        <div className={`text-xs ${
                          uni.tier === 'Ambitious' ? 'text-burgundy' :
                          uni.tier === 'Target' ? 'text-gold' :
                          'text-grey'
                        }`}>
                          {uni.tier}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-24 h-2 bg-navy-light rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${uni.probability}%` }}
                            transition={{ duration: 1, delay: i * 0.1 }}
                            className={`h-full rounded-full ${
                              uni.probability >= 70 ? 'bg-gold' :
                              uni.probability >= 50 ? 'bg-burgundy' :
                              'bg-grey'
                            }`}
                          />
                        </div>
                        <span className={`text-sm font-semibold w-10 text-right ${
                          uni.probability >= 70 ? 'text-gold' :
                          uni.probability >= 50 ? 'text-burgundy' :
                          'text-grey'
                        }`}>
                          {uni.probability}%
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Gap Analysis */}
          <AnimatePresence>
            {showAnalysis && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                transition={{ duration: 0.6 }}
                className="mt-8"
              >
                <div className="glass rounded-2xl border border-white/10 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-cream">Gap Analysis & Recommendations</h3>
                    <span className="px-3 py-1 text-xs bg-gold/10 text-gold rounded-full">AI Powered</span>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    {gapAnalysis.map((gap, i) => (
                      <motion.div
                        key={gap.factor}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: i * 0.1 }}
                        className="p-4 bg-navy-light/30 rounded-xl"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-medium text-cream">{gap.factor}</h4>
                            <p className="text-sm text-grey">Current: {gap.current}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-grey">Impact</div>
                            <div className="text-lg font-semibold text-burgundy">+{gap.impact}%</div>
                          </div>
                        </div>
                        <p className="text-sm text-grey mb-3">{gap.suggestion}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-grey">Potential boost:</span>
                          <span className="text-xs text-gold font-medium">+{gap.potential}%</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="mt-6 p-4 bg-gradient-to-r from-gold/10 to-burgundy/10 rounded-xl border border-gold/20">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-gold" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium text-cream mb-1">Oracle Insight</h4>
                        <p className="text-sm text-grey">
                          With targeted improvements in GRE (+7 points) and one additional publication, 
                          your overall admit probability could increase to <span className="text-gold font-semibold">74%</span>, 
                          making Stanford a realistic Target rather than Ambitious.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <Footer />
    </main>
  )
}
