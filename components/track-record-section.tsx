'use client'

import { useRef, useState } from 'react'
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion'

// Acceptance rate comparison data (Yocket style)
const acceptanceRates = [
  { university: 'CMU', general: 11, meridian: 32 },
  { university: 'Cornell', general: 16, meridian: 27 },
  { university: 'Cambridge', general: 8, meridian: 27 },
  { university: 'Imperial', general: 12, meridian: 25 },
  { university: 'RWTH', general: 15, meridian: 53 },
  { university: 'TU Munich', general: 20, meridian: 40 },
  { university: 'MIT', general: 14, meridian: 37 },
]

function AcceptanceRateBar({ data, index }: { data: typeof acceptanceRates[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -30 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-cream">{data.university}</span>
        <div className="flex items-center gap-4 text-xs">
          <span className="text-grey">{data.general}%</span>
          <span className="text-gold font-semibold">{data.meridian}%</span>
        </div>
      </div>
      <div className="relative h-3 bg-navy-light rounded-full overflow-hidden">
        {/* General rate */}
        <motion.div
          initial={{ width: 0 }}
          animate={isInView ? { width: `${data.general}%` } : {}}
          transition={{ duration: 1, delay: index * 0.1 + 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-y-0 left-0 bg-grey/40 rounded-full"
        />
        {/* Meridian rate */}
        <motion.div
          initial={{ width: 0 }}
          animate={isInView ? { width: `${data.meridian}%` } : {}}
          transition={{ duration: 1.2, delay: index * 0.1 + 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-burgundy to-gold rounded-full"
        />
      </div>
    </motion.div>
  )
}

// Testimonials data (Yocket style)
const testimonials = [
  {
    name: 'Aishwarya Bhandari',
    university: 'Illinois Tech',
    program: 'MS Project Mgmt',
    gpa: '6.8 CGPA',
    image: 'AB',
    color: 'bg-burgundy',
    quote: 'I had an excellent experience with the Meridian team. They were professional and supportive, making the study abroad process smooth, stress-free, and highly recommended.',
  },
  {
    name: 'Soham Vadje',
    university: 'NYU',
    program: 'MS in MOT',
    gpa: '7.9 CGPA',
    image: 'SV',
    color: 'bg-gold',
    quote: 'Choosing Meridian made my study abroad journey smooth and stress-free. With their support, I secured multiple admits, including NYU. Highly recommended.',
  },
  {
    name: 'Dev Suthar',
    university: 'NUS Business School',
    program: 'MSc Finance',
    gpa: '8.69 CGPA',
    image: 'DS',
    color: 'bg-burgundy',
    quote: 'My experience with Meridian Premium was excellent. With dedicated guidance, I secured an offer from my top-choice university. Highly recommend for study abroad support.',
  },
  {
    name: 'Amey Joshi',
    university: 'RWTH Aachen',
    program: 'MSc Sustainability',
    gpa: '6.37 CGPA',
    image: 'AJ',
    color: 'bg-gold',
    quote: 'Meridian made my masters applications smooth and stress-free. The professional, responsive team guided me with shortlisting, SOP and CV editing, and visa support.',
  },
  {
    name: 'Santosh Kumar',
    university: 'UMich',
    program: 'MS Data Science',
    gpa: '8.7 CGPA',
    image: 'SK',
    color: 'bg-burgundy',
    quote: 'Studying in the USA requires careful planning, and Meridian made it much easier. They rebuilt my profile and helped me secure admits at NYU, CU Boulder, and Minnesota.',
  },
  {
    name: 'Muskan Garg',
    university: 'INSEAD France',
    program: 'MBA',
    gpa: '8.5 CGPA',
    image: 'MG',
    color: 'bg-gold',
    quote: 'Choosing Meridian was the best decision for my abroad applications. The team was supportive, providing expert guidance and thorough editing. Attending INSEAD is a dream come true.',
  },
]

function TestimonialCard({ testimonial, index, isActive }: { testimonial: typeof testimonials[0]; index: number; isActive: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ 
        opacity: isActive ? 1 : 0.5, 
        scale: isActive ? 1 : 0.9,
        x: isActive ? 0 : index % 2 === 0 ? -20 : 20
      }}
      transition={{ duration: 0.5 }}
      className={`glass rounded-2xl p-6 border transition-all duration-300 ${
        isActive ? 'border-gold/30 shadow-lg shadow-gold/10' : 'border-white/10'
      }`}
    >
      {/* University badge */}
      <div className="flex items-center gap-3 mb-4">
        <div className="px-3 py-1 text-xs font-medium bg-gold/20 text-gold rounded-full">
          Accepted to {testimonial.university}
        </div>
      </div>
      
      {/* Quote */}
      <p className="text-cream/80 text-sm leading-relaxed mb-6">
        &ldquo;{testimonial.quote}&rdquo;
      </p>
      
      {/* Profile */}
      <div className="flex items-center gap-3">
        <div className={`w-12 h-12 rounded-full ${testimonial.color} flex items-center justify-center text-sm font-bold text-cream`}>
          {testimonial.image}
        </div>
        <div>
          <div className="font-medium text-cream">{testimonial.name}</div>
          <div className="text-xs text-grey">{testimonial.program} | {testimonial.gpa}</div>
        </div>
      </div>
    </motion.div>
  )
}

export function TrackRecordSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeTestimonial, setActiveTestimonial] = useState(0)
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })
  
  // Parallax for background elements
  const bgY = useTransform(scrollYProgress, [0, 1], [100, -100])
  const springBgY = useSpring(bgY, { stiffness: 50, damping: 20 })
  
  // Auto-rotate testimonials
  const intervalRef = useRef<NodeJS.Timeout>()
  
  const startAutoRotate = () => {
    intervalRef.current = setInterval(() => {
      setActiveTestimonial(prev => (prev + 1) % testimonials.length)
    }, 5000)
  }
  
  const stopAutoRotate = () => {
    if (intervalRef.current) clearInterval(intervalRef.current)
  }
  
  return (
    <section ref={containerRef} className="relative py-32 overflow-hidden">
      {/* Parallax background */}
      <motion.div style={{ y: springBgY }} className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] bg-burgundy/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 -right-32 w-[400px] h-[400px] bg-gold/10 rounded-full blur-[120px]" />
      </motion.div>
      
      {/* Base background */}
      <div className="absolute inset-0 bg-gradient-to-b from-navy-light via-navy to-navy-light" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="inline-block px-4 py-1.5 text-xs font-medium text-burgundy bg-burgundy/10 rounded-full mb-4">
            Our Track Record
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-cream mb-4">
            We Don&apos;t Just Guide Students
            <br />
            <span className="font-serif italic text-gold">We Get Them Admitted</span>
          </h2>
          <p className="text-lg text-grey max-w-2xl mx-auto">
            Compare acceptance rates across colleges. Our students consistently outperform general applicants.
          </p>
        </motion.div>
        
        {/* Two column layout */}
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left - Acceptance rates comparison */}
          <div>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-6 mb-8"
            >
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-grey/40" />
                <span className="text-sm text-grey">General Acceptance Rate</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-burgundy to-gold" />
                <span className="text-sm text-gold">Meridian Acceptance Rate</span>
              </div>
            </motion.div>
            
            <div className="space-y-6">
              {acceptanceRates.map((rate, i) => (
                <AcceptanceRateBar key={rate.university} data={rate} index={i} />
              ))}
            </div>
            
            {/* Stats callout */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-10 p-6 glass rounded-2xl border border-gold/20"
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gold/20 flex items-center justify-center">
                  <svg className="w-8 h-8 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gold">2.5x</div>
                  <div className="text-sm text-grey">Higher acceptance rate on average</div>
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Right - Testimonials carousel */}
          <div 
            className="relative"
            onMouseEnter={stopAutoRotate}
            onMouseLeave={startAutoRotate}
          >
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-6"
            >
              <h3 className="text-2xl font-bold text-cream mb-2">
                They Made It. <span className="font-serif italic text-burgundy">Now It&apos;s Your Turn.</span>
              </h3>
              <p className="text-grey">Stories from students who achieved their dreams</p>
            </motion.div>
            
            {/* Active testimonial */}
            <div className="relative min-h-[320px]">
              {testimonials.map((t, i) => (
                <div
                  key={i}
                  className={`absolute inset-0 transition-all duration-500 ${
                    i === activeTestimonial ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                  }`}
                >
                  <TestimonialCard testimonial={t} index={i} isActive={i === activeTestimonial} />
                </div>
              ))}
            </div>
            
            {/* Navigation dots */}
            <div className="flex items-center justify-center gap-2 mt-8">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTestimonial(i)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    i === activeTestimonial 
                      ? 'w-8 bg-gold' 
                      : 'bg-grey/40 hover:bg-grey/60'
                  }`}
                  aria-label={`View testimonial ${i + 1}`}
                />
              ))}
            </div>
            
            {/* Arrow navigation */}
            <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between pointer-events-none px-4">
              <button
                onClick={() => setActiveTestimonial(prev => prev === 0 ? testimonials.length - 1 : prev - 1)}
                className="w-10 h-10 rounded-full glass border border-white/10 flex items-center justify-center text-cream hover:bg-white/10 transition-colors pointer-events-auto"
                aria-label="Previous testimonial"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => setActiveTestimonial(prev => (prev + 1) % testimonials.length)}
                className="w-10 h-10 rounded-full glass border border-white/10 flex items-center justify-center text-cream hover:bg-white/10 transition-colors pointer-events-auto"
                aria-label="Next testimonial"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
