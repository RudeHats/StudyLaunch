'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import Link from 'next/link'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'

interface Message {
  id: string
  type: 'user' | 'ai' | 'options' | 'results'
  content: string
  options?: string[]
  results?: UniversityMatch[]
}

interface UniversityMatch {
  name: string
  program: string
  location: string
  match: number
  tuition: string
  deadline: string
  highlights: string[]
}

const sampleMatches: UniversityMatch[] = [
  {
    name: 'Stanford University',
    program: 'MS Computer Science',
    location: 'California, USA',
    match: 94,
    tuition: '$58,000/yr',
    deadline: 'Dec 5, 2025',
    highlights: ['AI/ML Focus', 'Strong Research', 'Silicon Valley Network'],
  },
  {
    name: 'Carnegie Mellon University',
    program: 'MS Human-Computer Interaction',
    location: 'Pittsburgh, USA',
    match: 89,
    tuition: '$52,000/yr',
    deadline: 'Dec 15, 2025',
    highlights: ['Top HCI Program', 'Industry Connections', 'Design Focus'],
  },
  {
    name: 'MIT',
    program: 'MS Media Lab',
    location: 'Massachusetts, USA',
    match: 82,
    tuition: '$55,000/yr',
    deadline: 'Dec 1, 2025',
    highlights: ['Interdisciplinary', 'Innovation Focus', 'Research Heavy'],
  },
  {
    name: 'UC Berkeley',
    program: 'MS EECS',
    location: 'California, USA',
    match: 78,
    tuition: '$44,000/yr',
    deadline: 'Dec 8, 2025',
    highlights: ['Bay Area Access', 'Research Excellence', 'Lower Cost'],
  },
]

const conversationFlow = [
  {
    question: "Welcome to NeuroMatch Navigator. What degree are you pursuing?",
    options: ["Master's (MS/MA)", "MBA", "PhD", "Undergraduate"],
  },
  {
    question: "What field are you most interested in?",
    options: ["Computer Science", "Data Science", "Business Analytics", "Engineering", "Design", "Finance"],
  },
  {
    question: "What's your GRE/GMAT score range?",
    options: ["320+ GRE", "310-319 GRE", "700+ GMAT", "650-699 GMAT", "Not taken yet"],
  },
  {
    question: "What's your budget range for total program cost?",
    options: ["< $50,000", "$50,000 - $80,000", "$80,000 - $120,000", "No budget constraint"],
  },
  {
    question: "Which regions are you most interested in?",
    options: ["USA", "UK", "Canada", "Germany", "Australia", "Multiple regions"],
  },
]

function MatchCard({ match, index }: { match: UniversityMatch; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="glass rounded-xl border border-white/10 overflow-hidden hover:border-burgundy/30 transition-all group"
    >
      <div 
        className="p-5 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <h4 className="text-lg font-semibold text-cream mb-1">{match.name}</h4>
            <p className="text-sm text-grey">{match.program}</p>
            <p className="text-xs text-grey/60">{match.location}</p>
          </div>
          <div className="text-right">
            <div className={`text-2xl font-bold ${
              match.match >= 90 ? 'text-gold' : 
              match.match >= 80 ? 'text-burgundy' : 
              'text-grey'
            }`}>
              {match.match}%
            </div>
            <div className="text-xs text-grey">match</div>
          </div>
        </div>

        {/* Match bar */}
        <div className="h-2 bg-navy-light rounded-full overflow-hidden mb-4">
          <motion.div
            initial={{ width: 0 }}
            animate={isInView ? { width: `${match.match}%` } : {}}
            transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
            className={`h-full rounded-full ${
              match.match >= 90 ? 'bg-gradient-to-r from-gold to-gold-dim' : 
              match.match >= 80 ? 'bg-gradient-to-r from-burgundy to-burgundy-dark' : 
              'bg-grey'
            }`}
          />
        </div>

        {/* Highlights */}
        <div className="flex flex-wrap gap-2 mb-3">
          {match.highlights.map((highlight) => (
            <span 
              key={highlight}
              className="px-2 py-1 text-xs bg-burgundy/10 text-burgundy rounded"
            >
              {highlight}
            </span>
          ))}
        </div>

        {/* Quick info */}
        <div className="flex justify-between text-sm">
          <span className="text-grey">Tuition: <span className="text-cream">{match.tuition}</span></span>
          <span className="text-grey">Deadline: <span className="text-gold">{match.deadline}</span></span>
        </div>
      </div>

      {/* Expanded content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-white/10"
          >
            <div className="p-5 space-y-4">
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 py-2.5 bg-burgundy text-cream rounded-lg font-medium text-sm"
                >
                  Add to Shortlist
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 py-2.5 border border-cream/20 text-cream rounded-lg font-medium text-sm"
                >
                  View Details
                </motion.button>
              </div>
              <Link 
                href="/oracle"
                className="block w-full py-2.5 text-center bg-gold/10 text-gold rounded-lg font-medium text-sm hover:bg-gold/20 transition-colors"
              >
                Check Admit Probability in Oracle
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function NavigatorPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: conversationFlow[0].question,
      options: conversationFlow[0].options,
    },
  ])
  const [currentStep, setCurrentStep] = useState(0)
  const [isTyping, setIsTyping] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleOptionSelect = async (option: string) => {
    // Add user message
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      type: 'user',
      content: option,
    }])

    setIsTyping(true)

    // Simulate AI thinking
    await new Promise(resolve => setTimeout(resolve, 800))

    const nextStep = currentStep + 1

    if (nextStep < conversationFlow.length) {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: conversationFlow[nextStep].question,
        options: conversationFlow[nextStep].options,
      }])
      setCurrentStep(nextStep)
    } else {
      // Show analyzing message
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: "Analyzing your profile against 12,000+ programs...",
      }])

      // Simulate analysis
      await new Promise(resolve => setTimeout(resolve, 2000))

      setMessages(prev => [...prev, {
        id: (Date.now() + 2).toString(),
        type: 'ai',
        content: "I've found your top matches based on your profile. Here are the universities with the highest probability of admission:",
      }])

      setShowResults(true)
    }

    setIsTyping(false)
  }

  return (
    <main className="relative min-h-screen bg-navy">
      <Navigation />
      
      {/* Hero */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-burgundy/10 via-transparent to-transparent" />
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-burgundy/20 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gold/10 rounded-full blur-[120px]" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 text-xs font-medium text-burgundy bg-burgundy/10 rounded-full mb-4">
              NeuroMatch Navigator
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-cream mb-4">
              Find your perfect{' '}
              <span className="font-serif italic text-gold">university match.</span>
            </h1>
            <p className="text-lg text-grey max-w-2xl mx-auto">
              Answer a few questions and our AI will match you with programs tailored to your profile, goals, and constraints.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Chat Interface */}
      <section className="relative pb-32">
        <div className="max-w-3xl mx-auto px-6">
          <div className="glass rounded-2xl border border-white/10 overflow-hidden">
            {/* Chat header */}
            <div className="flex items-center gap-3 px-6 py-4 border-b border-white/10 bg-navy-light/30">
              <div className="w-10 h-10 rounded-full bg-burgundy/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-burgundy" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-medium text-cream">NeuroMatch AI</h3>
                <div className="flex items-center gap-2 text-xs text-grey">
                  <span className="w-2 h-2 bg-gold rounded-full animate-pulse" />
                  Online - Ready to match
                </div>
              </div>
            </div>

            {/* Chat messages */}
            <div className="p-6 space-y-6 max-h-[500px] overflow-y-auto">
              {messages.map((message, i) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.type === 'user' ? (
                    <div className="max-w-[80%] px-4 py-3 bg-burgundy text-cream rounded-2xl rounded-br-sm">
                      {message.content}
                    </div>
                  ) : (
                    <div className="max-w-[80%] space-y-3">
                      <div className="px-4 py-3 bg-navy-light/50 text-cream rounded-2xl rounded-bl-sm">
                        {message.content}
                      </div>
                      {message.options && (
                        <div className="flex flex-wrap gap-2">
                          {message.options.map((option) => (
                            <motion.button
                              key={option}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => handleOptionSelect(option)}
                              className="px-4 py-2 bg-burgundy/10 text-burgundy border border-burgundy/30 rounded-full text-sm hover:bg-burgundy/20 transition-colors"
                            >
                              {option}
                            </motion.button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-1 px-4 py-3 bg-navy-light/50 rounded-2xl rounded-bl-sm w-fit"
                >
                  <span className="w-2 h-2 bg-grey rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-grey rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-grey rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </motion.div>
              )}

              <div ref={chatEndRef} />
            </div>
          </div>

          {/* Results */}
          <AnimatePresence>
            {showResults && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mt-8 space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-cream">Your Top Matches</h3>
                  <span className="text-sm text-grey">{sampleMatches.length} programs found</span>
                </div>
                
                <div className="grid gap-4">
                  {sampleMatches.map((match, i) => (
                    <MatchCard key={match.name} match={match} index={i} />
                  ))}
                </div>

                <div className="flex gap-4">
                  <button className="flex-1 py-3 bg-gold text-navy font-semibold rounded-xl hover:bg-gold-dim transition-colors">
                    Save All to Shortlist
                  </button>
                  <button 
                    onClick={() => {
                      setMessages([{
                        id: '1',
                        type: 'ai',
                        content: conversationFlow[0].question,
                        options: conversationFlow[0].options,
                      }])
                      setCurrentStep(0)
                      setShowResults(false)
                    }}
                    className="px-6 py-3 border border-cream/20 text-cream font-medium rounded-xl hover:bg-cream/5 transition-colors"
                  >
                    Start Over
                  </button>
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
