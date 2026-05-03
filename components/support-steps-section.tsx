'use client'

import { useRef, useState } from 'react'
import { motion, useScroll, useTransform, useSpring, useInView, AnimatePresence } from 'framer-motion'

// Support steps data (Yocket style - end-to-end support)
const supportSteps = [
  {
    id: 'counselling',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 32 32" stroke="currentColor" strokeWidth="1.5">
        <circle cx="16" cy="10" r="6" className="stroke-burgundy" />
        <path d="M4 28c0-6.627 5.373-12 12-12s12 5.373 12 12" className="stroke-burgundy" />
      </svg>
    ),
    title: 'Personalized Counselling',
    description: 'Receive one-on-one guidance to build a compelling profile that showcases your academics, achievements, and aspirations — helping you stand out in highly competitive applications.',
    expandedContent: 'Our expert counsellors analyze your complete profile including academic background, work experience, extracurriculars, and career goals to create a personalized roadmap for your study abroad journey.',
  },
  {
    id: 'shortlisting',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 32 32" stroke="currentColor" strokeWidth="1.5">
        <rect x="4" y="4" width="24" height="24" rx="4" className="stroke-gold" />
        <path d="M10 16l4 4 8-8" className="stroke-gold" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: 'Profile Building & Shortlisting',
    description: 'Strengthen your profile with expert insights and get a carefully curated list of programs and universities aligned with your strengths, interests, and long-term career goals.',
    expandedContent: 'We use AI-powered matching combined with counsellor expertise to analyze 12,000+ programs across 1000+ universities, finding the perfect fit based on your unique profile and aspirations.',
  },
  {
    id: 'documents',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 32 32" stroke="currentColor" strokeWidth="1.5">
        <path d="M6 4h14l6 6v18a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2z" className="stroke-burgundy" />
        <path d="M20 4v6h6M10 16h12M10 20h8" className="stroke-burgundy" strokeLinecap="round" />
      </svg>
    ),
    title: 'Document Editing & Application Support',
    description: 'Get comprehensive support to refine your Resume, SOP, and LOR, along with end-to-end application assistance designed to maximize your chances of admission.',
    expandedContent: 'Our AI-powered essay co-pilot and expert editors work together to craft compelling narratives that highlight your unique story. We review every document multiple times before submission.',
  },
  {
    id: 'scholarship',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 32 32" stroke="currentColor" strokeWidth="1.5">
        <circle cx="16" cy="16" r="12" className="stroke-gold" />
        <path d="M16 10v12M12 14h8M12 18h8" className="stroke-gold" strokeLinecap="round" />
      </svg>
    ),
    title: 'Scholarship Assistance',
    description: 'From eligibility checks to final submission, our experts guide you through the scholarship process to help you secure the best possible funding opportunities.',
    expandedContent: 'We have helped students secure over $8.6M in scholarships. Our database includes 5000+ scholarship opportunities matched to your profile for maximum funding.',
  },
  {
    id: 'visa',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 32 32" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="8" width="28" height="18" rx="2" className="stroke-burgundy" />
        <circle cx="10" cy="17" r="4" className="stroke-burgundy" />
        <path d="M18 13h8M18 17h6M18 21h4" className="stroke-burgundy" strokeLinecap="round" />
      </svg>
    ),
    title: 'Finance & Visa',
    description: 'Receive clear guidance on education loans, financial planning, and visa processes so you can move forward with confidence and peace of mind.',
    expandedContent: 'With 100% visa success rate and partnerships with 30+ lenders including Poonawalla Fincorp, we ensure smooth financial planning and visa processing for your journey.',
  },
]

function SupportStep({ step, index, isActive, onClick }: { 
  step: typeof supportSteps[0]
  index: number
  isActive: boolean
  onClick: () => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      onClick={onClick}
      className={`relative cursor-pointer group ${isActive ? 'z-10' : ''}`}
    >
      {/* Connector line */}
      {index < supportSteps.length - 1 && (
        <div className="absolute left-6 top-16 w-0.5 h-[calc(100%+2rem)] bg-gradient-to-b from-burgundy/50 via-gold/30 to-transparent hidden lg:block" />
      )}
      
      <motion.div
        animate={{ 
          scale: isActive ? 1.02 : 1,
          borderColor: isActive ? 'rgba(255, 200, 92, 0.3)' : 'rgba(255, 255, 255, 0.1)'
        }}
        className={`glass rounded-2xl p-6 border transition-all duration-300 ${
          isActive ? 'shadow-lg shadow-gold/10' : 'hover:border-burgundy/30'
        }`}
      >
        <div className="flex items-start gap-4">
          {/* Step number */}
          <div className={`relative flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
            isActive ? 'bg-gold/20' : 'bg-burgundy/10'
          }`}>
            {step.icon}
            {/* Pulse effect when active */}
            {isActive && (
              <motion.div
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 rounded-full bg-gold/20"
              />
            )}
          </div>
          
          <div className="flex-1">
            <h3 className={`text-lg font-semibold mb-2 transition-colors ${
              isActive ? 'text-gold' : 'text-cream'
            }`}>
              {step.title}
            </h3>
            <p className="text-grey text-sm leading-relaxed">
              {step.description}
            </p>
            
            {/* Expanded content */}
            <AnimatePresence>
              {isActive && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <p className="mt-4 pt-4 border-t border-white/10 text-sm text-cream/70 leading-relaxed">
                    {step.expandedContent}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Expand indicator */}
          <motion.div
            animate={{ rotate: isActive ? 180 : 0 }}
            className="flex-shrink-0 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center"
          >
            <svg className="w-4 h-4 text-grey" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export function SupportStepsSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeStep, setActiveStep] = useState<string | null>('counselling')
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })
  
  const bgY = useTransform(scrollYProgress, [0, 1], [50, -50])
  const springBgY = useSpring(bgY, { stiffness: 50, damping: 20 })
  
  return (
    <section ref={containerRef} className="relative py-32 overflow-hidden">
      {/* Parallax background */}
      <motion.div style={{ y: springBgY }} className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-burgundy/10 rounded-full blur-[180px]" />
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-gold/8 rounded-full blur-[150px]" />
      </motion.div>
      
      <div className="absolute inset-0 bg-navy" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="inline-block px-4 py-1.5 text-xs font-medium text-gold bg-gold/10 rounded-full mb-4">
            End-to-End Support
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-cream mb-4">
            One Team, From Start
            <br />
            <span className="font-serif italic text-burgundy">to Success</span>
          </h2>
          <p className="text-lg text-grey max-w-2xl mx-auto">
            Every step of your journey is guided by experts who genuinely care about your success.
          </p>
        </motion.div>
        
        {/* Steps grid */}
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
          <div className="space-y-6">
            {supportSteps.slice(0, 3).map((step, i) => (
              <SupportStep
                key={step.id}
                step={step}
                index={i}
                isActive={activeStep === step.id}
                onClick={() => setActiveStep(activeStep === step.id ? null : step.id)}
              />
            ))}
          </div>
          <div className="space-y-6">
            {supportSteps.slice(3).map((step, i) => (
              <SupportStep
                key={step.id}
                step={step}
                index={i + 3}
                isActive={activeStep === step.id}
                onClick={() => setActiveStep(activeStep === step.id ? null : step.id)}
              />
            ))}
            
            {/* CTA card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="p-8 bg-gradient-to-br from-burgundy/20 to-gold/10 rounded-2xl border border-gold/20"
            >
              <h3 className="text-xl font-bold text-cream mb-3">
                Ready to start your journey?
              </h3>
              <p className="text-grey text-sm mb-6">
                Book a free 1-on-1 consultation with our expert counsellors today.
              </p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 bg-gold text-navy font-semibold rounded-xl hover:bg-gold-dim transition-colors"
              >
                Book Free Consultation
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
