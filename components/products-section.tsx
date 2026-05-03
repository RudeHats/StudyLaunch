'use client'

import { useRef, useState } from 'react'
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion'
import Link from 'next/link'

// Product cards data (Yocket style - platform offerings)
const products = [
  {
    id: 'premium',
    badge: 'Most Popular',
    title: 'Meridian Premium',
    tagline: 'Expert-Guided Admits',
    description: 'Expert guidance on profile building, SOPs, and visa preparation to turn MS, MBA, Bachelors, and PhD dreams into admits.',
    features: [
      '1-on-1 Expert Counselling',
      'University Shortlisting',
      'SOP & LOR Editing',
      'Visa Interview Prep',
    ],
    href: '/premium',
    gradient: 'from-burgundy/30 to-burgundy/5',
    accentColor: 'burgundy',
    icon: (
      <svg className="w-10 h-10" fill="none" viewBox="0 0 40 40" stroke="currentColor" strokeWidth="1.5">
        <circle cx="20" cy="20" r="16" className="stroke-burgundy" />
        <path d="M20 12l2.5 5.5L28 18l-4.5 4 1.5 6L20 25l-5 3 1.5-6L12 18l5.5-.5L20 12z" className="stroke-gold fill-gold/20" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: 'prep',
    title: 'Meridian Prep',
    tagline: 'Test Preparation',
    description: 'Ace GRE, GMAT, IELTS & TOEFL with personalised study plans, high-quality exam material, and dynamic practice tests.',
    features: [
      'LIVE Classes',
      'Adaptive Mock Tests',
      '40+ Sectional Tests',
      'Personal Study Plans',
    ],
    href: '/prep',
    gradient: 'from-gold/30 to-gold/5',
    accentColor: 'gold',
    icon: (
      <svg className="w-10 h-10" fill="none" viewBox="0 0 40 40" stroke="currentColor" strokeWidth="1.5">
        <rect x="8" y="6" width="24" height="28" rx="2" className="stroke-gold" />
        <path d="M14 14h12M14 20h8M14 26h10" className="stroke-gold" strokeLinecap="round" />
        <circle cx="28" cy="28" r="6" className="stroke-burgundy fill-burgundy/20" />
        <path d="M26 28l1.5 1.5 3-3" className="stroke-burgundy" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: 'finance',
    title: 'Meridian Finance',
    tagline: 'Education Loans',
    description: 'Choose from 30+ lenders and get pre-approved education loans of up to 1.5 Cr for studying abroad with competitive rates.',
    features: [
      '30+ Lending Partners',
      'Up to 1.5 Cr Loans',
      'Minimal Documentation',
      'Quick Pre-approval',
    ],
    href: '/loansense',
    gradient: 'from-grey/20 to-grey/5',
    accentColor: 'grey',
    icon: (
      <svg className="w-10 h-10" fill="none" viewBox="0 0 40 40" stroke="currentColor" strokeWidth="1.5">
        <rect x="4" y="10" width="32" height="22" rx="2" className="stroke-grey" />
        <path d="M4 18h32" className="stroke-burgundy" strokeWidth="2" />
        <circle cx="30" cy="24" r="3" className="stroke-gold fill-gold/20" />
        <path d="M10 26h8" className="stroke-grey" strokeLinecap="round" />
      </svg>
    ),
  },
]

function ProductCard({ product, index }: { product: typeof products[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const [isHovered, setIsHovered] = useState(false)
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative group"
    >
      {/* Background glow on hover */}
      <motion.div
        animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.8 }}
        className={`absolute -inset-4 bg-gradient-to-br ${product.gradient} rounded-3xl blur-2xl pointer-events-none`}
      />
      
      <motion.div
        animate={{ 
          y: isHovered ? -8 : 0,
          boxShadow: isHovered 
            ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)' 
            : '0 0 0 0 rgba(0, 0, 0, 0)'
        }}
        transition={{ duration: 0.3 }}
        className={`relative glass rounded-2xl p-8 border border-white/10 h-full ${
          product.badge ? 'ring-2 ring-gold/30' : ''
        }`}
      >
        {/* Badge */}
        {product.badge && (
          <div className="absolute -top-3 left-6 px-4 py-1 bg-gold text-navy text-xs font-bold rounded-full">
            {product.badge}
          </div>
        )}
        
        {/* Icon */}
        <div className="mb-6">
          <div className={`w-16 h-16 rounded-2xl bg-${product.accentColor}/10 flex items-center justify-center`}>
            {product.icon}
          </div>
        </div>
        
        {/* Title */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-cream mb-1">{product.title}</h3>
          <p className={`text-sm text-${product.accentColor}`}>{product.tagline}</p>
        </div>
        
        {/* Description */}
        <p className="text-grey text-sm leading-relaxed mb-6">
          {product.description}
        </p>
        
        {/* Features */}
        <ul className="space-y-3 mb-8">
          {product.features.map((feature, i) => (
            <motion.li
              key={feature}
              initial={{ opacity: 0, x: -10 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.3, delay: 0.3 + index * 0.1 + i * 0.05 }}
              className="flex items-center gap-3 text-sm text-cream/80"
            >
              <svg className={`w-4 h-4 text-${product.accentColor} flex-shrink-0`} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>{feature}</span>
            </motion.li>
          ))}
        </ul>
        
        {/* CTA */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Link
            href={product.href}
            className={`block w-full py-4 text-center rounded-xl font-semibold transition-all ${
              product.badge
                ? 'bg-gold text-navy hover:bg-gold-dim'
                : `bg-${product.accentColor}/20 text-cream hover:bg-${product.accentColor}/30 border border-${product.accentColor}/30`
            }`}
          >
            Learn More
          </Link>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

export function ProductsSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })
  
  const bgY = useTransform(scrollYProgress, [0, 1], [80, -80])
  const springBgY = useSpring(bgY, { stiffness: 40, damping: 15 })
  
  return (
    <section ref={containerRef} className="relative py-32 overflow-hidden">
      {/* Parallax background */}
      <motion.div style={{ y: springBgY }} className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 -left-1/4 w-[700px] h-[700px] bg-gold/8 rounded-full blur-[200px]" />
        <div className="absolute bottom-1/3 -right-1/4 w-[600px] h-[600px] bg-burgundy/10 rounded-full blur-[180px]" />
      </motion.div>
      
      <div className="absolute inset-0 bg-gradient-to-b from-navy via-navy-light to-navy" />
      
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
            Our Platform
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-cream mb-4">
            Your All-in-One Platform
            <br />
            <span className="font-serif italic text-gold">for Studying Abroad</span>
          </h2>
          <p className="text-lg text-grey max-w-2xl mx-auto">
            Learn, Plan, and Apply with Meridian. Everything you need in one place.
          </p>
        </motion.div>
        
        {/* Products grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
