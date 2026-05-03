'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'

interface LoanDetails {
  amount: number
  tenure: number
  interestRate: number
  university: string
  course: string
}

const universities = [
  { name: 'Stanford University', country: 'USA', avgCost: 85000 },
  { name: 'MIT', country: 'USA', avgCost: 78000 },
  { name: 'Carnegie Mellon', country: 'USA', avgCost: 72000 },
  { name: 'UC Berkeley', country: 'USA', avgCost: 65000 },
  { name: 'University of Toronto', country: 'Canada', avgCost: 45000 },
  { name: 'Imperial College London', country: 'UK', avgCost: 55000 },
  { name: 'TU Munich', country: 'Germany', avgCost: 25000 },
]

const courses = [
  'MS Computer Science',
  'MS Data Science',
  'MBA',
  'MS Engineering',
  'MS Business Analytics',
  'MS Finance',
]

function formatCurrency(amount: number, currency: string = 'USD') {
  if (currency === 'INR') {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount)
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount)
}

function AnimatedNumber({ value, prefix = '', suffix = '' }: { value: number; prefix?: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true })
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    if (!isInView) return

    const duration = 1500
    const start = performance.now()

    const animate = (now: number) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplayValue(Math.round(eased * value))

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [isInView, value])

  return (
    <span ref={ref}>
      {prefix}{displayValue.toLocaleString('en-IN')}{suffix}
    </span>
  )
}

function EMIBreakdownChart({ principal, interest, tenure }: { principal: number; interest: number; tenure: number }) {
  const total = principal + interest
  const principalPercent = (principal / total) * 100
  const interestPercent = (interest / total) * 100

  return (
    <div className="space-y-4">
      <div className="flex justify-between text-sm">
        <span className="text-grey">Principal</span>
        <span className="text-cream">{formatCurrency(principal, 'INR')}</span>
      </div>
      <div className="h-4 bg-navy-light rounded-full overflow-hidden flex">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${principalPercent}%` }}
          transition={{ duration: 1, delay: 0.3 }}
          className="h-full bg-burgundy"
        />
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${interestPercent}%` }}
          transition={{ duration: 1, delay: 0.5 }}
          className="h-full bg-gold"
        />
      </div>
      <div className="flex justify-between text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-burgundy" />
          <span className="text-grey">Principal ({principalPercent.toFixed(0)}%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gold" />
          <span className="text-grey">Interest ({interestPercent.toFixed(0)}%)</span>
        </div>
      </div>
    </div>
  )
}

export default function LoanSensePage() {
  const [loan, setLoan] = useState<LoanDetails>({
    amount: 50000,
    tenure: 10,
    interestRate: 10.5,
    university: universities[0].name,
    course: courses[0],
  })
  const [showPreApproval, setShowPreApproval] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [currency, setCurrency] = useState<'USD' | 'INR'>('USD')

  const exchangeRate = 83 // INR per USD
  const loanInINR = loan.amount * exchangeRate

  // EMI Calculation
  const monthlyRate = loan.interestRate / 12 / 100
  const months = loan.tenure * 12
  const emi = (loanInINR * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1)
  const totalPayment = emi * months
  const totalInterest = totalPayment - loanInINR

  const handlePreApproval = () => {
    setIsProcessing(true)
    setTimeout(() => {
      setIsProcessing(false)
      setShowPreApproval(true)
    }, 2500)
  }

  return (
    <main className="relative min-h-screen bg-navy">
      <Navigation />
      
      {/* Hero */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-grey/5 via-transparent to-transparent" />
        <div className="absolute top-20 left-1/3 w-96 h-96 bg-grey/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/3 w-80 h-80 bg-gold/10 rounded-full blur-[120px]" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 text-xs font-medium text-grey bg-grey/10 rounded-full mb-4">
              LoanSense Engine
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-cream mb-4">
              Education funding,{' '}
              <span className="font-serif italic text-gold">demystified.</span>
            </h1>
            <p className="text-lg text-grey max-w-2xl mx-auto">
              Calculate your EMI, check eligibility, and get pre-approved in under 5 minutes with Poonawalla Fincorp.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Calculator Section */}
      <section className="relative pb-32">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Loan Calculator */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="glass rounded-2xl border border-white/10 p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-cream">Loan Calculator</h3>
                <div className="flex bg-navy-light rounded-lg p-1">
                  <button
                    onClick={() => setCurrency('USD')}
                    className={`px-3 py-1 text-sm rounded-md transition-colors ${
                      currency === 'USD' ? 'bg-burgundy text-cream' : 'text-grey'
                    }`}
                  >
                    USD
                  </button>
                  <button
                    onClick={() => setCurrency('INR')}
                    className={`px-3 py-1 text-sm rounded-md transition-colors ${
                      currency === 'INR' ? 'bg-burgundy text-cream' : 'text-grey'
                    }`}
                  >
                    INR
                  </button>
                </div>
              </div>
              
              <div className="space-y-6">
                {/* University */}
                <div className="space-y-2">
                  <label className="text-sm text-grey">Target University</label>
                  <select
                    value={loan.university}
                    onChange={(e) => {
                      const uni = universities.find(u => u.name === e.target.value)
                      setLoan({ 
                        ...loan, 
                        university: e.target.value,
                        amount: uni?.avgCost || loan.amount
                      })
                    }}
                    className="w-full px-4 py-3 bg-navy-light border border-white/10 rounded-xl text-cream focus:outline-none focus:border-burgundy/50"
                  >
                    {universities.map((uni) => (
                      <option key={uni.name} value={uni.name}>
                        {uni.name} ({uni.country})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Course */}
                <div className="space-y-2">
                  <label className="text-sm text-grey">Course</label>
                  <select
                    value={loan.course}
                    onChange={(e) => setLoan({ ...loan, course: e.target.value })}
                    className="w-full px-4 py-3 bg-navy-light border border-white/10 rounded-xl text-cream focus:outline-none focus:border-burgundy/50"
                  >
                    {courses.map((course) => (
                      <option key={course} value={course}>{course}</option>
                    ))}
                  </select>
                </div>

                {/* Loan Amount */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-grey">Loan Amount</span>
                    <span className="text-cream font-medium">
                      {currency === 'USD' 
                        ? formatCurrency(loan.amount, 'USD')
                        : formatCurrency(loanInINR, 'INR')
                      }
                    </span>
                  </div>
                  <input
                    type="range"
                    min={20000}
                    max={150000}
                    step={5000}
                    value={loan.amount}
                    onChange={(e) => setLoan({ ...loan, amount: Number(e.target.value) })}
                    className="w-full h-2 bg-navy-light rounded-full appearance-none cursor-pointer accent-burgundy"
                  />
                  <div className="flex justify-between text-xs text-grey">
                    <span>$20,000</span>
                    <span>$150,000</span>
                  </div>
                </div>

                {/* Tenure */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-grey">Loan Tenure</span>
                    <span className="text-cream font-medium">{loan.tenure} years</span>
                  </div>
                  <input
                    type="range"
                    min={5}
                    max={15}
                    value={loan.tenure}
                    onChange={(e) => setLoan({ ...loan, tenure: Number(e.target.value) })}
                    className="w-full h-2 bg-navy-light rounded-full appearance-none cursor-pointer accent-burgundy"
                  />
                  <div className="flex justify-between text-xs text-grey">
                    <span>5 years</span>
                    <span>15 years</span>
                  </div>
                </div>

                {/* Interest Rate */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-grey">Interest Rate (p.a.)</span>
                    <span className="text-cream font-medium">{loan.interestRate}%</span>
                  </div>
                  <input
                    type="range"
                    min={8}
                    max={14}
                    step={0.5}
                    value={loan.interestRate}
                    onChange={(e) => setLoan({ ...loan, interestRate: Number(e.target.value) })}
                    className="w-full h-2 bg-navy-light rounded-full appearance-none cursor-pointer accent-gold"
                  />
                  <div className="flex justify-between text-xs text-grey">
                    <span>8%</span>
                    <span>14%</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Results */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              {/* EMI Card */}
              <div className="glass rounded-2xl border border-white/10 p-6">
                <h3 className="text-lg font-semibold text-cream mb-6 text-center">Monthly EMI</h3>
                <div className="text-center mb-6">
                  <div className="text-5xl font-bold text-gold">
                    <AnimatedNumber value={Math.round(emi)} prefix="₹" />
                  </div>
                  <p className="text-sm text-grey mt-2">per month for {loan.tenure} years</p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-4 bg-navy-light/30 rounded-xl text-center">
                    <div className="text-xs text-grey mb-1">Total Amount</div>
                    <div className="text-lg font-semibold text-cream">
                      {formatCurrency(Math.round(totalPayment), 'INR')}
                    </div>
                  </div>
                  <div className="p-4 bg-navy-light/30 rounded-xl text-center">
                    <div className="text-xs text-grey mb-1">Total Interest</div>
                    <div className="text-lg font-semibold text-burgundy">
                      {formatCurrency(Math.round(totalInterest), 'INR')}
                    </div>
                  </div>
                </div>

                <EMIBreakdownChart 
                  principal={loanInINR} 
                  interest={totalInterest} 
                  tenure={loan.tenure}
                />
              </div>

              {/* Pre-approval CTA */}
              <div className="glass rounded-2xl border border-gold/30 p-6 bg-gradient-to-br from-gold/5 to-burgundy/5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gold/20 flex items-center justify-center">
                    <span className="text-lg font-bold text-gold">PF</span>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-cream">Poonawalla Fincorp</div>
                    <div className="text-xs text-grey">RBI Regulated - LSP Compliant</div>
                  </div>
                </div>
                
                <ul className="space-y-2 mb-6">
                  {[
                    'Instant pre-approval in 5 minutes',
                    'No collateral required up to ₹40L',
                    'Competitive interest rates from 10.5%',
                    'Flexible repayment options',
                  ].map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-grey">
                      <svg className="w-4 h-4 text-gold flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handlePreApproval}
                  disabled={isProcessing}
                  className="w-full py-4 bg-gold text-navy font-semibold rounded-xl hover:bg-gold-dim transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Checking eligibility...
                    </>
                  ) : (
                    'Check Pre-Approval Instantly'
                  )}
                </motion.button>
              </div>
            </motion.div>
          </div>

          {/* Pre-approval Result */}
          <AnimatePresence>
            {showPreApproval && (
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 30, scale: 0.95 }}
                transition={{ duration: 0.5 }}
                className="mt-8"
              >
                <div className="glass rounded-2xl border-2 border-gold/30 p-8 text-center relative overflow-hidden">
                  {/* Confetti-like decorations */}
                  <div className="absolute top-4 left-4 w-3 h-3 bg-gold/30 rounded-full" />
                  <div className="absolute top-8 right-8 w-2 h-2 bg-burgundy/30 rounded-full" />
                  <div className="absolute bottom-6 left-8 w-4 h-4 bg-gold/20 rounded-full" />
                  
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: 0.2 }}
                    className="w-20 h-20 mx-auto mb-6 rounded-full bg-gold/20 flex items-center justify-center"
                  >
                    <svg className="w-10 h-10 text-gold" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </motion.div>

                  <h3 className="text-2xl font-bold text-cream mb-2">Congratulations! You&apos;re Pre-Approved</h3>
                  <p className="text-grey mb-6">Based on your profile, you qualify for an education loan with Poonawalla Fincorp.</p>

                  <div className="grid md:grid-cols-3 gap-4 mb-8">
                    <div className="p-4 bg-navy-light/30 rounded-xl">
                      <div className="text-xs text-grey mb-1">Approved Amount</div>
                      <div className="text-xl font-bold text-gold">Up to {formatCurrency(loanInINR * 1.2, 'INR')}</div>
                    </div>
                    <div className="p-4 bg-navy-light/30 rounded-xl">
                      <div className="text-xs text-grey mb-1">Interest Rate</div>
                      <div className="text-xl font-bold text-cream">10.5% p.a.</div>
                    </div>
                    <div className="p-4 bg-navy-light/30 rounded-xl">
                      <div className="text-xs text-grey mb-1">Processing Fee</div>
                      <div className="text-xl font-bold text-cream">0.5%</div>
                    </div>
                  </div>

                  <div className="flex gap-4 justify-center">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-8 py-3 bg-burgundy text-cream font-semibold rounded-xl"
                    >
                      Complete Application
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-8 py-3 border border-cream/20 text-cream font-medium rounded-xl"
                    >
                      Download Offer Letter
                    </motion.button>
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
