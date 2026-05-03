'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'

interface BlogPost {
  id: string
  title: string
  excerpt: string
  category: string
  readTime: string
  date: string
  image: string
  author: { name: string; avatar: string }
  featured?: boolean
}

interface Essay {
  id: string
  title: string
  university: string
  program: string
  status: 'draft' | 'review' | 'final'
  lastEdited: string
  wordCount: number
  aiScore: number
}

const categories = ['All', 'SOP Guide', 'University Insights', 'Visa Tips', 'Success Stories', 'Funding']

const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'How to Write a Winning SOP for Top US Universities',
    excerpt: 'A comprehensive guide to crafting your Statement of Purpose that stands out from thousands of applications.',
    category: 'SOP Guide',
    readTime: '8 min read',
    date: 'Jan 15, 2025',
    image: '/blog/sop-guide.jpg',
    author: { name: 'Dr. Priya Sharma', avatar: 'PS' },
    featured: true,
  },
  {
    id: '2',
    title: 'Stanford vs MIT: Which is Right for Your CS Career?',
    excerpt: 'An in-depth comparison of two tech giants for computer science aspirants.',
    category: 'University Insights',
    readTime: '12 min read',
    date: 'Jan 12, 2025',
    image: '/blog/stanford-mit.jpg',
    author: { name: 'Arjun Patel', avatar: 'AP' },
  },
  {
    id: '3',
    title: 'F-1 Visa Interview: 50 Questions You Must Prepare For',
    excerpt: 'Complete preparation guide with sample answers for your US student visa interview.',
    category: 'Visa Tips',
    readTime: '15 min read',
    date: 'Jan 10, 2025',
    image: '/blog/visa-tips.jpg',
    author: { name: 'Sneha Nair', avatar: 'SN' },
    featured: true,
  },
  {
    id: '4',
    title: 'From IIT to Stanford: My Journey to a Full Scholarship',
    excerpt: 'How I secured a fully-funded PhD position at Stanford after being rejected twice.',
    category: 'Success Stories',
    readTime: '10 min read',
    date: 'Jan 8, 2025',
    image: '/blog/success.jpg',
    author: { name: 'Rohan Mehta', avatar: 'RM' },
  },
  {
    id: '5',
    title: 'Education Loans in 2025: Complete Guide for Indian Students',
    excerpt: 'Everything you need to know about securing education loans for abroad studies.',
    category: 'Funding',
    readTime: '14 min read',
    date: 'Jan 5, 2025',
    image: '/blog/funding.jpg',
    author: { name: 'Vikram Shah', avatar: 'VS' },
  },
  {
    id: '6',
    title: 'Common SOP Mistakes That Get Your Application Rejected',
    excerpt: 'Learn from the mistakes of others to ensure your SOP makes it through.',
    category: 'SOP Guide',
    readTime: '6 min read',
    date: 'Jan 3, 2025',
    image: '/blog/mistakes.jpg',
    author: { name: 'Dr. Priya Sharma', avatar: 'PS' },
  },
]

const sampleEssays: Essay[] = [
  {
    id: '1',
    title: 'Statement of Purpose',
    university: 'Stanford University',
    program: 'MS Computer Science',
    status: 'review',
    lastEdited: '2 hours ago',
    wordCount: 892,
    aiScore: 87,
  },
  {
    id: '2',
    title: 'Personal Statement',
    university: 'MIT',
    program: 'MS Media Lab',
    status: 'draft',
    lastEdited: 'Yesterday',
    wordCount: 654,
    aiScore: 72,
  },
  {
    id: '3',
    title: 'Statement of Purpose',
    university: 'Carnegie Mellon',
    program: 'MHCI',
    status: 'final',
    lastEdited: '3 days ago',
    wordCount: 1024,
    aiScore: 94,
  },
]

function BlogCard({ post, index }: { post: BlogPost; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`glass rounded-2xl border border-white/10 overflow-hidden group hover:border-burgundy/30 transition-all cursor-pointer ${
        post.featured ? 'md:col-span-2 md:row-span-2' : ''
      }`}
    >
      {/* Image placeholder */}
      <div className={`relative bg-gradient-to-br from-burgundy/20 to-gold/10 ${post.featured ? 'h-64' : 'h-40'}`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-4xl text-cream/10 font-serif">{post.category.charAt(0)}</span>
        </div>
        <div className="absolute top-3 left-3">
          <span className="px-3 py-1 text-xs font-medium bg-burgundy/80 text-cream rounded-full">
            {post.category}
          </span>
        </div>
      </div>

      <div className="p-5">
        <h3 className={`font-semibold text-cream mb-2 group-hover:text-gold transition-colors ${
          post.featured ? 'text-xl' : 'text-base'
        }`}>
          {post.title}
        </h3>
        <p className="text-sm text-grey line-clamp-2 mb-4">{post.excerpt}</p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-burgundy flex items-center justify-center text-xs text-cream font-medium">
              {post.author.avatar}
            </div>
            <span className="text-xs text-grey">{post.author.name}</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-grey">
            <span>{post.readTime}</span>
            <span>{post.date}</span>
          </div>
        </div>
      </div>
    </motion.article>
  )
}

function EssayCard({ essay }: { essay: Essay }) {
  const statusColors = {
    draft: 'bg-grey/20 text-grey',
    review: 'bg-gold/20 text-gold',
    final: 'bg-burgundy/20 text-burgundy',
  }

  const scoreColors = {
    high: 'text-gold',
    medium: 'text-burgundy',
    low: 'text-grey',
  }

  const getScoreColor = (score: number) => {
    if (score >= 85) return scoreColors.high
    if (score >= 70) return scoreColors.medium
    return scoreColors.low
  }

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className="glass rounded-xl border border-white/10 p-4 hover:border-burgundy/30 transition-all cursor-pointer"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-medium text-cream">{essay.title}</h4>
          <p className="text-sm text-grey">{essay.university} - {essay.program}</p>
        </div>
        <span className={`px-2 py-1 text-xs rounded capitalize ${statusColors[essay.status]}`}>
          {essay.status}
        </span>
      </div>

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-4">
          <span className="text-grey">{essay.wordCount} words</span>
          <span className="text-grey">{essay.lastEdited}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-grey">AI Score:</span>
          <span className={`font-semibold ${getScoreColor(essay.aiScore)}`}>{essay.aiScore}</span>
        </div>
      </div>
    </motion.div>
  )
}

export default function EssaysPage() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [activeTab, setActiveTab] = useState<'blog' | 'my-essays'>('blog')

  const filteredPosts = activeCategory === 'All' 
    ? blogPosts 
    : blogPosts.filter(post => post.category === activeCategory)

  return (
    <main className="relative min-h-screen bg-navy">
      <Navigation />
      
      {/* Hero */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-burgundy/5 via-transparent to-transparent" />
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-burgundy/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gold/10 rounded-full blur-[120px]" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 text-xs font-medium text-burgundy bg-burgundy/10 rounded-full mb-4">
              Essay Co-Pilot & Resources
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-cream mb-4">
              SOPs that{' '}
              <span className="font-serif italic text-gold">actually get read.</span>
            </h1>
            <p className="text-lg text-grey max-w-2xl mx-auto">
              AI-powered essay assistance, guides, and insights to help you craft compelling applications.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Tabs */}
      <section className="relative pb-8">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex justify-center gap-4 mb-8">
            {[
              { id: 'blog', label: 'Resources & Blog' },
              { id: 'my-essays', label: 'My Essays' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'blog' | 'my-essays')}
                className={`px-6 py-3 rounded-xl font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-burgundy text-cream'
                    : 'glass text-grey hover:text-cream'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <AnimatePresence mode="wait">
        {activeTab === 'blog' ? (
          <motion.section
            key="blog"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="relative pb-32"
          >
            <div className="max-w-6xl mx-auto px-6">
              {/* Categories */}
              <div className="flex flex-wrap justify-center gap-2 mb-12">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm transition-all ${
                      activeCategory === category
                        ? 'bg-gold text-navy font-medium'
                        : 'bg-navy-light/50 text-grey hover:text-cream'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              {/* Blog Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPosts.map((post, i) => (
                  <BlogCard key={post.id} post={post} index={i} />
                ))}
              </div>

              {/* Load More */}
              <div className="text-center mt-12">
                <button className="px-8 py-3 glass text-cream font-medium rounded-xl hover:bg-white/5 transition-colors">
                  Load More Articles
                </button>
              </div>
            </div>
          </motion.section>
        ) : (
          <motion.section
            key="my-essays"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="relative pb-32"
          >
            <div className="max-w-4xl mx-auto px-6">
              {/* Essay Co-Pilot Header */}
              <div className="glass rounded-2xl border border-white/10 p-6 mb-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-semibold text-cream">Essay Co-Pilot</h3>
                    <p className="text-sm text-grey">AI-assisted essay writing and review</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-5 py-2.5 bg-burgundy text-cream font-medium rounded-xl flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    New Essay
                  </motion.button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: 'Total Essays', value: '3' },
                    { label: 'Avg. AI Score', value: '84' },
                    { label: 'Words Written', value: '2,570' },
                  ].map((stat) => (
                    <div key={stat.label} className="text-center p-4 bg-navy-light/30 rounded-xl">
                      <div className="text-2xl font-bold text-cream">{stat.value}</div>
                      <div className="text-xs text-grey">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Essay List */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-cream">Your Essays</h4>
                {sampleEssays.map((essay) => (
                  <EssayCard key={essay.id} essay={essay} />
                ))}
              </div>

              {/* AI Writing Assistant Preview */}
              <div className="mt-12 glass rounded-2xl border border-gold/20 p-6">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gold/20 flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-cream mb-1">AI Writing Assistant</h4>
                    <p className="text-sm text-grey">
                      Get real-time suggestions, improve clarity, and ensure your essay stands out with our AI co-pilot.
                    </p>
                  </div>
                </div>

                {/* Sample AI feedback */}
                <div className="bg-navy-light/30 rounded-xl p-4 mb-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-burgundy/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs text-burgundy font-medium">AI</span>
                    </div>
                    <div className="text-sm text-cream/80 leading-relaxed">
                      Your opening paragraph effectively establishes your technical background, but consider adding a specific anecdote about your first encounter with machine learning to make it more memorable. Strong SOPs often start with a hook...
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <span className="px-3 py-1.5 text-xs bg-gold/20 text-gold rounded-lg cursor-pointer hover:bg-gold/30 transition-colors">
                    Apply suggestion
                  </span>
                  <span className="px-3 py-1.5 text-xs bg-cream/10 text-cream/60 rounded-lg cursor-pointer hover:bg-cream/20 transition-colors">
                    Explain more
                  </span>
                  <span className="px-3 py-1.5 text-xs bg-cream/10 text-cream/60 rounded-lg cursor-pointer hover:bg-cream/20 transition-colors">
                    Ignore
                  </span>
                </div>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      <Footer />
    </main>
  )
}
