'use client'

import { useRef, useState } from 'react'
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion'
import Link from 'next/link'

const features = [
  {
    id: 'navigator',
    eyebrow: 'NeuroMatch Navigator',
    title: 'AI that understands your ambitions.',
    description: 'Tell Meridian your goals, scores, and constraints. Our neural matching engine analyzes 12,000+ programs across 850 universities to build your perfect shortlist.',
    href: '/navigator',
    gradient: 'from-burgundy/30 to-burgundy/5',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 32 32" stroke="currentColor">
        <circle cx="16" cy="16" r="12" strokeWidth="2" className="stroke-burgundy" />
        <path d="M16 8v8l6 4" strokeWidth="2" strokeLinecap="round" className="stroke-gold" />
      </svg>
    ),
    stats: [
      { value: '12k+', label: 'Programs analyzed' },
      { value: '< 30s', label: 'Match time' },
    ],
    mockContent: (
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-cream/80">
          <div className="w-2 h-2 bg-gold rounded-full animate-pulse" />
          NeuroMatch is analyzing your profile...
        </div>
        <div className="space-y-2">
          {['Stanford MSCS', 'CMU MHCI', 'MIT Media Lab'].map((uni, i) => (
            <motion.div 
              key={uni} 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center justify-between p-3 bg-navy-light/50 rounded-lg border border-white/5"
            >
              <span className="text-sm text-cream">{uni}</span>
              <span className={`text-xs px-2 py-1 rounded ${i === 0 ? 'bg-gold/20 text-gold' : 'bg-burgundy/20 text-burgundy'}`}>
                {90 - i * 8}% match
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 'oracle',
    eyebrow: 'Admission Oracle',
    title: 'Know your odds before you apply.',
    description: 'Our predictive engine trained on 500K+ admit decisions shows exactly where you stand and what to improve for maximum admit probability.',
    href: '/oracle',
    gradient: 'from-gold/30 to-gold/5',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 32 32" stroke="currentColor">
        <path d="M4 24l6-12 6 8 6-14 6 10" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="stroke-gold" />
        <circle cx="16" cy="16" r="2" className="fill-burgundy" />
      </svg>
    ),
    stats: [
      { value: '500K+', label: 'Decisions analyzed' },
      { value: '89%', label: 'Prediction accuracy' },
    ],
    mockContent: (
      <div>
        <div className="text-center mb-4">
          <motion.div 
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ type: 'spring', bounce: 0.5 }}
            className="text-5xl font-bold text-gold mb-1"
          >
            74%
          </motion.div>
          <div className="text-sm text-cream/60">Admit Probability</div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-cream/60">GRE Score</span>
            <span className="text-gold">+12%</span>
          </div>
          <div className="h-2 bg-navy-light rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              whileInView={{ width: '75%' }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-burgundy to-gold rounded-full" 
            />
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'loansense',
    eyebrow: 'LoanSense Engine',
    title: 'Education funding, demystified.',
    description: 'Calculate your EMI, check eligibility, and get pre-approved for education loans from Poonawalla Fincorp in under 5 minutes. No paperwork chaos.',
    href: '/loansense',
    gradient: 'from-grey/20 to-grey/5',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 32 32" stroke="currentColor">
        <rect x="4" y="8" width="24" height="16" rx="2" strokeWidth="2" className="stroke-grey" />
        <path d="M4 14h24" strokeWidth="2" className="stroke-burgundy" />
        <circle cx="22" cy="18" r="2" className="fill-gold" />
      </svg>
    ),
    stats: [
      { value: '850Cr+', label: 'Disbursed' },
      { value: '< 5min', label: 'Pre-approval' },
    ],
    mockContent: (
      <div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <div className="text-xs text-cream/60 mb-1">Loan Amount</div>
            <div className="text-lg font-semibold text-cream">$45,000</div>
          </div>
          <div>
            <div className="text-xs text-cream/60 mb-1">Monthly EMI</div>
            <div className="text-lg font-semibold text-gold">$892</div>
          </div>
        </div>
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 p-2 bg-gold/10 rounded-lg border border-gold/20"
        >
          <svg className="w-4 h-4 text-gold" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          <span className="text-sm text-gold">Pre-approved</span>
        </motion.div>
      </div>
    ),
  },
  {
    id: 'essays',
    eyebrow: 'Essay Co-Pilot',
    title: 'SOPs that actually get read.',
    description: 'AI co-pilot that helps draft, critique, and uniquify your statement of purpose. Trained on thousands of successful admits to major universities.',
    href: '/essays',
    gradient: 'from-burgundy/10 to-gold/10',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 32 32" stroke="currentColor">
        <path d="M6 6h20v20H6z" strokeWidth="2" className="stroke-cream/40" />
        <path d="M10 12h12M10 16h8M10 20h10" strokeWidth="2" strokeLinecap="round" className="stroke-burgundy" />
      </svg>
    ),
    stats: [
      { value: '10K+', label: 'SOPs refined' },
      { value: '3.2x', label: 'Uniqueness score' },
    ],
    mockContent: (
      <div className="space-y-3">
        <div className="flex items-start gap-2">
          <div className="w-6 h-6 rounded-full bg-burgundy/20 flex items-center justify-center flex-shrink-0 mt-1">
            <span className="text-xs text-burgundy">AI</span>
          </div>
          <div className="text-sm text-cream/80 leading-relaxed">
            Your opening is strong, but consider adding a specific anecdote about your first coding project...
          </div>
        </div>
        <div className="flex gap-2">
          <span className="px-2 py-1 text-xs bg-gold/20 text-gold rounded cursor-pointer hover:bg-gold/30 transition-colors">Apply suggestion</span>
          <span className="px-2 py-1 text-xs bg-cream/10 text-cream/60 rounded cursor-pointer hover:bg-cream/20 transition-colors">Ignore</span>
        </div>
      </div>
    ),
  },
]

function FeatureCard({ feature, index }: { feature: typeof features[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [isHovered, setIsHovered] = useState(false)

  const isEven = index % 2 === 0

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 80 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`grid lg:grid-cols-2 gap-12 lg:gap-16 items-center ${isEven ? '' : 'lg:grid-flow-dense'}`}
    >
      {/* Content */}
      <div className={isEven ? '' : 'lg:col-start-2'}>
        <motion.div
          initial={{ opacity: 0, x: isEven ? -40 : 40 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <span className="inline-block px-3 py-1 text-xs font-medium text-burgundy bg-burgundy/10 rounded-full mb-4">
            {feature.eyebrow}
          </span>
          <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-cream mb-4 leading-tight">
            {feature.title}
          </h3>
          <p className="text-grey text-lg leading-relaxed mb-8">
            {feature.description}
          </p>
          
          {/* Stats */}
          <div className="flex gap-12 mb-10">
            {feature.stats.map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl font-bold text-gold">{stat.value}</div>
                <div className="text-sm text-grey/60">{stat.label}</div>
              </div>
            ))}
          </div>

          <motion.div
            whileHover={{ scale: 1.02, x: 5 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link
              href={feature.href}
              className="inline-flex items-center gap-3 px-6 py-3 bg-burgundy text-cream font-medium rounded-xl hover:bg-burgundy-dark transition-all group"
            >
              <span>Explore {feature.eyebrow.split(' ')[0]}</span>
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Visual - Glass morphism card */}
      <motion.div
        initial={{ opacity: 0, x: isEven ? 40 : -40 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.4 }}
        className={`relative ${isEven ? '' : 'lg:col-start-1'}`}
      >
        {/* Background glow */}
        <motion.div 
          animate={{ 
            opacity: isHovered ? 1 : 0.5,
            scale: isHovered ? 1.05 : 1
          }}
          className={`absolute -inset-8 bg-gradient-to-br ${feature.gradient} rounded-3xl blur-3xl`} 
        />
        
        {/* Card */}
        <motion.div 
          animate={{ 
            y: isHovered ? -5 : 0,
            rotateX: isHovered ? 2 : 0,
            rotateY: isHovered ? (isEven ? 2 : -2) : 0
          }}
          transition={{ duration: 0.3 }}
          style={{ transformStyle: 'preserve-3d', perspective: 1000 }}
          className="relative glass rounded-2xl p-6 border border-white/10 shadow-2xl"
        >
          {/* Icon header */}
          <div className="flex items-center gap-3 mb-6">
            <motion.div 
              animate={{ rotate: isHovered ? 360 : 0 }}
              transition={{ duration: 0.6 }}
              className="w-12 h-12 rounded-xl bg-navy-light flex items-center justify-center"
            >
              {feature.icon}
            </motion.div>
            <div>
              <div className="text-sm font-medium text-cream">{feature.eyebrow}</div>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
                <span className="text-xs text-grey/60">Active</span>
              </div>
            </div>
          </div>
          
          {/* Mock UI */}
          <div className="glass rounded-xl p-4 border border-white/5">
            {feature.mockContent}
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

export function FeaturesSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })

  const backgroundY = useTransform(scrollYProgress, [0, 1], [100, -100])
  const springBackgroundY = useSpring(backgroundY, { stiffness: 40, damping: 15 })

  return (
    <section ref={containerRef} className="relative py-32 overflow-hidden">
      {/* Parallax background layers */}
      <motion.div
        style={{ y: springBackgroundY }}
        className="absolute inset-0 pointer-events-none"
      >
        <div className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] bg-burgundy/10 rounded-full blur-[180px]" />
        <div className="absolute bottom-1/4 -right-1/4 w-[500px] h-[500px] bg-gold/10 rounded-full blur-[150px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-burgundy/5 rounded-full blur-[200px]" />
      </motion.div>
      
      <div className="absolute inset-0 bg-gradient-to-b from-navy-light via-navy to-navy-light" />

      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-28"
        >
          <span className="inline-block px-4 py-1.5 text-xs font-medium text-gold bg-gold/10 rounded-full mb-4">
            The Meridian AI Suite
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-cream mb-4">
            Four AI tools.{' '}
            <span className="font-serif italic text-gold">One mission.</span>
          </h2>
          <p className="text-lg text-grey max-w-2xl mx-auto">
            Every feature designed to remove friction from your study abroad journey.
          </p>
        </motion.div>

        {/* Features */}
        <div className="space-y-40">
          {features.map((feature, index) => (
            <FeatureCard key={feature.id} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
