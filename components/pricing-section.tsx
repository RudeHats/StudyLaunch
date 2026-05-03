'use client'

import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

const plans = [
  {
    tier: 'Free',
    price: '0',
    description: 'Everything you need to explore and build your shortlist.',
    features: [
      { text: 'NeuroMatch (5 queries/mo)', included: true },
      { text: 'Admission Oracle (3 runs)', included: true },
      { text: 'LoanSense eligibility check', included: true },
      { text: 'StudyStreak + leaderboard', included: true },
      { text: 'Essay Co-Pilot', included: false },
      { text: 'Unlimited Oracle simulations', included: false },
    ],
    cta: 'Get started free',
    featured: false,
  },
  {
    tier: 'Premium',
    price: '999',
    period: '/mo',
    description: 'Full AI toolkit for serious applicants in active cycle.',
    features: [
      { text: 'Unlimited NeuroMatch', included: true },
      { text: 'Unlimited Oracle + simulator', included: true },
      { text: 'Essay Co-Pilot (15 revisions)', included: true },
      { text: 'LoanSense full application flow', included: true },
      { text: 'WhatsApp AI nudges', included: true },
      { text: 'Admit Insider reports', included: true },
    ],
    cta: 'Start Premium',
    featured: true,
    badge: 'Most popular',
  },
  {
    tier: 'Annual Pro',
    price: '4,999',
    period: '/yr',
    description: 'Best value. Covers your entire application cycle end-to-end.',
    features: [
      { text: 'Everything in Premium', included: true },
      { text: 'Consultant B2B dashboard', included: true },
      { text: 'Parent co-applicant module', included: true },
      { text: 'Post-admit visa checklist', included: true },
      { text: 'Priority Poonawalla processing', included: true },
      { text: 'Dedicated AI mentor', included: true },
    ],
    cta: 'Get Annual Pro',
    featured: false,
  },
]

export function PricingSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: '-100px' })
  const [hoveredPlan, setHoveredPlan] = useState<string | null>(null)

  return (
    <section ref={containerRef} className="relative py-32 overflow-hidden" id="pricing">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-navy via-navy-light to-navy" />
      
      {/* Decorative elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-burgundy/10 rounded-full blur-[150px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 text-xs font-medium text-gold bg-gold/10 rounded-full mb-4">
            Pricing
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-cream mb-4">
            Invest in your admit.{' '}
            <span className="font-serif italic text-burgundy">Not your subscription.</span>
          </h2>
          <p className="text-lg text-grey max-w-2xl mx-auto">
            Transparent pricing. Cancel anytime. No hidden consultant fees.
          </p>
        </motion.div>

        {/* Plans */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.tier}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              onMouseEnter={() => setHoveredPlan(plan.tier)}
              onMouseLeave={() => setHoveredPlan(null)}
              className={`relative rounded-2xl p-6 lg:p-8 transition-all duration-300 ${
                plan.featured 
                  ? 'glass border-2 border-gold/30 scale-105 z-10' 
                  : 'glass border border-white/10'
              } ${
                hoveredPlan === plan.tier && !plan.featured 
                  ? 'border-burgundy/30 scale-[1.02]' 
                  : ''
              }`}
            >
              {/* Featured badge */}
              {plan.featured && plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gold text-navy text-xs font-semibold rounded-full">
                  {plan.badge}
                </div>
              )}

              {/* Tier */}
              <div className="text-sm font-medium text-burgundy mb-2">{plan.tier}</div>

              {/* Price */}
              <div className="flex items-baseline gap-1 mb-3">
                <span className="text-sm text-cream">₹</span>
                <span className="text-4xl font-bold text-cream">{plan.price}</span>
                {plan.period && (
                  <span className="text-sm text-grey">{plan.period}</span>
                )}
              </div>

              {/* Description */}
              <p className="text-sm text-grey mb-6 leading-relaxed">{plan.description}</p>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, fi) => (
                  <motion.li
                    key={feature.text}
                    initial={{ opacity: 0, x: -10 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.3, delay: 0.3 + fi * 0.05 }}
                    className={`flex items-center gap-3 text-sm ${
                      feature.included ? 'text-cream' : 'text-grey/50'
                    }`}
                  >
                    {feature.included ? (
                      <svg className="w-4 h-4 text-gold flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <span className="w-4 text-center">—</span>
                    )}
                    <span>{feature.text}</span>
                  </motion.li>
                ))}
              </ul>

              {/* CTA */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full py-3 rounded-xl font-medium transition-colors ${
                  plan.featured
                    ? 'bg-gold text-navy hover:bg-gold-dim'
                    : 'bg-transparent border border-cream/20 text-cream hover:bg-cream/5'
                }`}
              >
                {plan.cta}
              </motion.button>
            </motion.div>
          ))}
        </div>

        {/* Trust note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-12"
        >
          <p className="text-sm text-grey">
            All payments secured by Razorpay. Cancel anytime with no questions asked.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
