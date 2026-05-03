'use client'

import { useRef, useState } from 'react'
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion'

// FAQ data (Yocket style)
const faqs = [
  {
    question: 'What is Meridian?',
    answer: 'Meridian is a comprehensive and easy to use online platform that provides free resources and end-to-end premium study abroad services to aspiring students aiming at international education. With over 1 million users, Meridian is India\'s most loved study abroad consultancy, powered by AI for smarter university matching and admission predictions.',
  },
  {
    question: 'Does Meridian provide paid study abroad counselling?',
    answer: 'Yes, Meridian provides full-fledged study abroad counselling services, including our premium counselling product, exclusive GRE/GMAT assistance, and support for students looking to study in the US, UK, Canada, Germany, and all other top study abroad destinations. Our team of expert counsellors with 20+ years of experience is dedicated to helping students achieve their dreams.',
  },
  {
    question: 'What is Meridian Premium?',
    answer: 'Meridian Premium is our end-to-end service product for students who want to fast-track their study abroad journey with expert assistance at every step. Premium members get personalized counselling, priority support, quick turnaround time for query resolution, and access to our AI-powered tools including NeuroMatch Navigator and Admission Oracle.',
  },
  {
    question: 'Does Meridian help with student loans?',
    answer: 'Yes, we have a dedicated LoanSense team that helps students get the best possible interest rates and offers according to their profile. We partner with 30+ lenders including Poonawalla Fincorp for education loans up to ₹1.5 Cr. Our experts have helped students secure scholarships worth more than $8.6 Million to date!',
  },
  {
    question: 'Does Meridian help with GRE/GMAT preparation?',
    answer: 'Absolutely! Since GRE/GMAT is such an important part of the journey, we have launched Meridian Prep - your one-stop destination for test preparation. You get LIVE classes, recorded lectures, 40+ sectional tests, and full-length adaptive mock tests that encapsulate everything you need before the actual test.',
  },
  {
    question: 'What AI tools does Meridian offer?',
    answer: 'Meridian offers several AI-powered tools: NeuroMatch Navigator for intelligent university matching across 12,000+ programs, Admission Oracle for predicting your admit probability with 89% accuracy, Essay Co-Pilot for SOP drafting and refinement, and StudyStreak for gamified learning motivation.',
  },
  {
    question: 'Why does Meridian charge for premium counselling?',
    answer: 'We\'ve assembled a team of experts who focus exclusively on your targets by providing all necessary resources at your disposal to help you achieve top-tier admits that you deserve, not the ones that come easy. Our premium services include unlimited access to AI tools, dedicated counsellor support, and guaranteed application assistance.',
  },
  {
    question: 'Does Meridian help with visa applications?',
    answer: 'Yes, we provide comprehensive visa guidance as part of our Premium service. With a 100% visa success rate across countries, our experts guide you through the entire visa process including documentation, interview preparation, and financial proof requirements.',
  },
]

function FAQItem({ faq, index, isOpen, onClick }: {
  faq: typeof faqs[0]
  index: number
  isOpen: boolean
  onClick: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="border-b border-white/10 last:border-b-0"
    >
      <button
        onClick={onClick}
        className="w-full py-6 flex items-start justify-between gap-4 text-left group"
      >
        <h3 className={`text-lg font-medium transition-colors ${
          isOpen ? 'text-gold' : 'text-cream group-hover:text-gold'
        }`}>
          {faq.question}
        </h3>
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2 }}
          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
            isOpen ? 'bg-gold/20' : 'bg-white/5 group-hover:bg-white/10'
          }`}
        >
          <svg className={`w-4 h-4 transition-colors ${isOpen ? 'text-gold' : 'text-grey'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </motion.div>
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <p className="pb-6 text-grey leading-relaxed">
              {faq.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export function FAQSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [openIndex, setOpenIndex] = useState<number | null>(0)
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })
  
  const bgY = useTransform(scrollYProgress, [0, 1], [60, -60])
  const springBgY = useSpring(bgY, { stiffness: 50, damping: 20 })
  
  return (
    <section ref={containerRef} className="relative py-32 overflow-hidden">
      {/* Parallax background */}
      <motion.div style={{ y: springBgY }} className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-burgundy/5 rounded-full blur-[200px]" />
      </motion.div>
      
      <div className="absolute inset-0 bg-navy" />
      
      <div className="relative z-10 max-w-4xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 text-xs font-medium text-gold bg-gold/10 rounded-full mb-4">
            FAQ
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-cream mb-4">
            Frequently Asked{' '}
            <span className="font-serif italic text-burgundy">Questions</span>
          </h2>
          <p className="text-lg text-grey">
            Everything you need to know about Meridian and studying abroad.
          </p>
        </motion.div>
        
        {/* FAQ accordion */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass rounded-2xl border border-white/10 px-8"
        >
          {faqs.map((faq, i) => (
            <FAQItem
              key={i}
              faq={faq}
              index={i}
              isOpen={openIndex === i}
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </motion.div>
        
        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <p className="text-grey mb-6">
            Still have questions? Connect 1:1 with an expert today.
          </p>
          <motion.button
            whileHover={{ scale: 1.02, boxShadow: '0 0 40px rgba(174, 36, 72, 0.3)' }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-2 px-8 py-4 bg-burgundy text-cream font-semibold rounded-xl hover:bg-burgundy-dark transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span>Chat with Expert</span>
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}
