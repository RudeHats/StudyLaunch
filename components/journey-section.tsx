'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'

const steps = [
  {
    num: '01',
    title: 'Tell us your dream',
    description: 'Share your academic profile, test scores, budget, and preferences with our AI.',
  },
  {
    num: '02',
    title: 'Get your shortlist',
    description: 'AI shortlists programs with admit probability and funding options.',
  },
  {
    num: '03',
    title: 'Check the Oracle',
    description: 'See your gaps and simulate profile improvements for better chances.',
  },
  {
    num: '04',
    title: 'Polish your essays',
    description: 'AI co-pilot drafts, critiques, and uniquifies your SOP and essays.',
  },
  {
    num: '05',
    title: 'Get funded',
    description: 'LoanSense pre-fills your Poonawalla Fincorp loan application instantly.',
  },
]

function StepCard({ step, index }: { step: typeof steps[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -30 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      className="relative"
    >
      {/* Connector line */}
      {index < steps.length - 1 && (
        <div className="absolute left-[23px] top-14 w-0.5 h-full bg-gradient-to-b from-burgundy/50 to-transparent" />
      )}

      <div className="flex gap-6">
        {/* Number */}
        <motion.div
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : {}}
          transition={{ duration: 0.5, delay: index * 0.15 + 0.2, type: 'spring' }}
          className="relative flex-shrink-0"
        >
          <div className="w-12 h-12 rounded-full bg-burgundy/20 border border-burgundy/40 flex items-center justify-center">
            <span className="text-sm font-bold text-burgundy">{step.num}</span>
          </div>
          {/* Pulse effect for active step */}
          <div className="absolute inset-0 rounded-full bg-burgundy/20 animate-ping" style={{ animationDuration: '2s' }} />
        </motion.div>

        {/* Content */}
        <div className="pb-12">
          <h4 className="text-xl font-semibold text-cream mb-2">{step.title}</h4>
          <p className="text-grey leading-relaxed">{step.description}</p>
        </div>
      </div>
    </motion.div>
  )
}

export function JourneySection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], [100, -100])

  return (
    <section ref={containerRef} className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-navy" />
      
      {/* Floating accent */}
      <motion.div
        style={{ y }}
        className="absolute top-20 right-10 w-80 h-80 bg-gold/10 rounded-full blur-[120px]"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left - Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:sticky lg:top-32"
          >
            <span className="inline-block px-4 py-1.5 text-xs font-medium text-gold bg-gold/10 rounded-full mb-4">
              How it works
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-cream mb-6 leading-tight">
              From dream to{' '}
              <span className="font-serif italic text-burgundy">admit letter</span>
              <br />
              in five steps.
            </h2>
            <p className="text-lg text-grey leading-relaxed mb-8">
              No consultant fees. No confusion. Just AI-powered clarity at every stage of your journey.
            </p>

            {/* Visual element */}
            <div className="hidden lg:block relative">
              <div className="glass rounded-2xl p-6 border border-white/10">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-cream">Average time to shortlist</div>
                    <div className="text-xs text-grey">From profile to university matches</div>
                  </div>
                </div>
                <div className="text-4xl font-bold text-gold mb-1">Under 2 minutes</div>
                <div className="text-sm text-grey">vs. 2-3 weeks with traditional consultants</div>
              </div>
            </div>
          </motion.div>

          {/* Right - Steps */}
          <div className="space-y-2">
            {steps.map((step, index) => (
              <StepCard key={step.num} step={step} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
