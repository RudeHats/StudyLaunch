'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useTransform, useSpring, useMotionValue, useAnimationFrame } from 'framer-motion'
import Link from 'next/link'

// Floating 3D element component for parallax depth
function FloatingElement({
  children,
  depth,
  initialX,
  initialY,
  size,
}: {
  children: React.ReactNode
  depth: number // 0 = furthest, 1 = closest
  initialX: number
  initialY: number
  size: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollY } = useScroll()
  
  // Deeper elements move slower (parallax)
  const y = useTransform(scrollY, [0, 1000], [0, (1 - depth) * 400])
  const springY = useSpring(y, { stiffness: 50, damping: 20 })
  
  // Scale based on depth
  const scale = 0.5 + depth * 0.5
  const opacity = 0.3 + depth * 0.5

  return (
    <motion.div
      ref={ref}
      style={{
        y: springY,
        scale,
        opacity,
        left: `${initialX}%`,
        top: `${initialY}%`,
        width: size,
        height: size,
      }}
      className="absolute pointer-events-none will-change-transform"
    >
      {children}
    </motion.div>
  )
}

// Animated constellation lines
function ConstellationCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const pointsRef = useRef<Array<{ x: number; y: number; vx: number; vy: number; baseX: number; baseY: number }>>([])
  
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    let W = canvas.width = window.innerWidth
    let H = canvas.height = window.innerHeight
    
    // Create constellation points
    const numPoints = 40
    pointsRef.current = Array.from({ length: numPoints }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      baseX: Math.random() * W,
      baseY: Math.random() * H,
    }))
    
    const handleResize = () => {
      W = canvas.width = window.innerWidth
      H = canvas.height = window.innerHeight
    }
    
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }
    
    window.addEventListener('resize', handleResize)
    window.addEventListener('mousemove', handleMouseMove)
    
    let frame: number
    const animate = () => {
      ctx.clearRect(0, 0, W, H)
      
      const points = pointsRef.current
      const mouse = mouseRef.current
      
      // Update and draw points
      points.forEach((p, i) => {
        // Subtle drift
        p.x += p.vx
        p.y += p.vy
        
        // Boundary wrapping
        if (p.x < 0) p.x = W
        if (p.x > W) p.x = 0
        if (p.y < 0) p.y = H
        if (p.y > H) p.y = 0
        
        // Mouse influence
        const dx = mouse.x - p.x
        const dy = mouse.y - p.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 200) {
          const force = (200 - dist) / 200
          p.x -= dx * force * 0.02
          p.y -= dy * force * 0.02
        }
        
        // Draw point
        ctx.beginPath()
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2)
        ctx.fillStyle = i % 3 === 0 ? '#FFC85C' : '#AE2448'
        ctx.globalAlpha = 0.6
        ctx.fill()
        
        // Draw connections
        points.forEach((p2, j) => {
          if (i >= j) return
          const d = Math.hypot(p.x - p2.x, p.y - p2.y)
          if (d < 150) {
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.strokeStyle = '#AE2448'
            ctx.globalAlpha = (1 - d / 150) * 0.15
            ctx.lineWidth = 1
            ctx.stroke()
          }
        })
      })
      
      ctx.globalAlpha = 1
      frame = requestAnimationFrame(animate)
    }
    
    animate()
    
    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(frame)
    }
  }, [])
  
  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />
}

// Stats with counting animation
const stats = [
  { value: '15000', suffix: '+', label: 'Students admitted' },
  { value: '100', suffix: '%', label: 'Visa success rate' },
  { value: '8.6', suffix: 'M+', label: 'In scholarships' },
  { value: '1000', suffix: '+', label: 'Partner universities' },
]

function AnimatedStat({ stat, delay }: { stat: typeof stats[0]; delay: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [count, setCount] = useState(0)
  const [hasAnimated, setHasAnimated] = useState(false)
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true)
          const target = parseFloat(stat.value.replace(/,/g, ''))
          const duration = 2000
          const start = performance.now()
          
          const animate = (now: number) => {
            const elapsed = now - start
            const progress = Math.min(elapsed / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            setCount(Math.round(eased * target * 10) / 10)
            if (progress < 1) requestAnimationFrame(animate)
          }
          
          setTimeout(() => requestAnimationFrame(animate), delay)
        }
      },
      { threshold: 0.5 }
    )
    
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [stat.value, delay, hasAnimated])
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: delay / 1000 }}
      className="text-center"
    >
      <div className="text-3xl md:text-4xl font-bold text-cream">
        {count.toLocaleString()}{stat.suffix}
      </div>
      <div className="text-sm text-grey mt-1">{stat.label}</div>
    </motion.div>
  )
}

// Floating geometric shapes for parallax depth
const shapes = [
  { type: 'circle', depth: 0.2, x: 5, y: 20, size: 120 },
  { type: 'ring', depth: 0.4, x: 85, y: 15, size: 80 },
  { type: 'square', depth: 0.3, x: 10, y: 70, size: 60 },
  { type: 'triangle', depth: 0.5, x: 90, y: 60, size: 100 },
  { type: 'dot', depth: 0.6, x: 20, y: 40, size: 20 },
  { type: 'dot', depth: 0.7, x: 75, y: 35, size: 15 },
  { type: 'ring', depth: 0.35, x: 50, y: 80, size: 90 },
  { type: 'circle', depth: 0.45, x: 65, y: 25, size: 50 },
]

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })
  
  // Main content parallax
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 150])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0])
  const contentScale = useTransform(scrollYProgress, [0, 0.4], [1, 0.95])
  
  // Background layers parallax (Disco Dungeon style)
  const bgLayer1 = useTransform(scrollYProgress, [0, 1], [0, 300])
  const bgLayer2 = useTransform(scrollYProgress, [0, 1], [0, 200])
  const bgLayer3 = useTransform(scrollYProgress, [0, 1], [0, 100])
  
  const springBg1 = useSpring(bgLayer1, { stiffness: 40, damping: 15 })
  const springBg2 = useSpring(bgLayer2, { stiffness: 50, damping: 18 })
  const springBg3 = useSpring(bgLayer3, { stiffness: 60, damping: 20 })
  
  return (
    <section
      ref={containerRef}
      className="relative min-h-[120vh] flex flex-col justify-center overflow-hidden"
    >
      {/* === PARALLAX BACKGROUND LAYERS === */}
      
      {/* Layer 1 - Deepest (gradient orbs) */}
      <motion.div style={{ y: springBg1 }} className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-burgundy/20 rounded-full blur-[200px] -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gold/15 rounded-full blur-[180px] translate-x-1/3 translate-y-1/3" />
      </motion.div>
      
      {/* Layer 2 - Mid depth (geometric shapes) */}
      <motion.div style={{ y: springBg2 }} className="absolute inset-0 pointer-events-none">
        {shapes.map((shape, i) => (
          <FloatingElement
            key={i}
            depth={shape.depth}
            initialX={shape.x}
            initialY={shape.y}
            size={shape.size}
          >
            {shape.type === 'circle' && (
              <div className="w-full h-full rounded-full bg-burgundy/10" />
            )}
            {shape.type === 'ring' && (
              <div className="w-full h-full rounded-full border-2 border-gold/20" />
            )}
            {shape.type === 'square' && (
              <div className="w-full h-full rotate-45 bg-gold/10" />
            )}
            {shape.type === 'triangle' && (
              <div 
                className="w-0 h-0" 
                style={{
                  borderLeft: `${shape.size / 2}px solid transparent`,
                  borderRight: `${shape.size / 2}px solid transparent`,
                  borderBottom: `${shape.size}px solid rgba(174, 36, 72, 0.1)`,
                }}
              />
            )}
            {shape.type === 'dot' && (
              <div className="w-full h-full rounded-full bg-gold/30" />
            )}
          </FloatingElement>
        ))}
      </motion.div>
      
      {/* Layer 3 - Closest (constellation) */}
      <motion.div style={{ y: springBg3 }} className="absolute inset-0 pointer-events-none">
        <ConstellationCanvas />
      </motion.div>
      
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-navy via-navy to-navy-light" style={{ zIndex: -1 }} />
      
      {/* === MAIN CONTENT === */}
      <motion.div
        style={{ y: contentY, opacity: contentOpacity, scale: contentScale }}
        className="relative z-10 max-w-7xl mx-auto px-6 py-32 pt-40"
      >
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-wrap items-center gap-4 mb-8"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 text-sm font-medium bg-burgundy/20 text-burgundy border border-burgundy/30 rounded-full">
            <span className="w-2 h-2 bg-burgundy rounded-full animate-pulse" />
            Powered by AI
          </span>
          <span className="text-sm text-grey">
            Trusted by 1 million+ aspirants over 10+ years
          </span>
        </motion.div>
        
        {/* Main headline - Yocket style */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-cream leading-[1.05] mb-6 max-w-5xl"
        >
          <span className="block">Your Ambition,</span>
          <span className="block">Our Expertise,</span>
          <span className="block font-serif italic text-gold">Confirmed Admits.</span>
        </motion.h1>
        
        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-lg md:text-xl text-grey max-w-2xl mb-12 leading-relaxed"
        >
          Get guided by India&apos;s best study abroad consultants. 15,000+ students 
          admitted at top universities in the USA, UK, Canada, Germany & Beyond.
        </motion.p>
        
        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-wrap items-center gap-4 mb-20"
        >
          <motion.div
            whileHover={{ scale: 1.03, boxShadow: '0 0 60px rgba(255, 200, 92, 0.4)' }}
            whileTap={{ scale: 0.98 }}
            className="relative group"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-gold to-burgundy rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity" />
            <Link
              href="/navigator"
              className="relative inline-flex items-center gap-3 px-8 py-4 bg-gold text-navy font-semibold rounded-xl transition-all"
            >
              <span>Start Free Consultation</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link
              href="/oracle"
              className="inline-flex items-center gap-2 px-8 py-4 glass text-cream font-medium rounded-xl hover:bg-white/10 transition-colors border border-white/10"
            >
              <svg className="w-5 h-5 text-burgundy" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span>Check Admit Probability</span>
            </Link>
          </motion.div>
        </motion.div>
        
        {/* Stats strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 p-8 glass rounded-2xl border border-white/10"
        >
          {stats.map((stat, i) => (
            <AnimatedStat key={stat.label} stat={stat} delay={800 + i * 150} />
          ))}
        </motion.div>
      </motion.div>
      
      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-10"
      >
        <span className="text-xs text-grey/60 uppercase tracking-widest">Discover more</span>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="w-6 h-10 border-2 border-grey/40 rounded-full flex justify-center pt-2"
        >
          <motion.div 
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1.5 h-1.5 bg-gold rounded-full" 
          />
        </motion.div>
      </motion.div>
    </section>
  )
}
