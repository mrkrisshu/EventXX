'use client'

import React, { useRef, useEffect, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { TrendingUp, Users, Calendar, Shield } from 'lucide-react'

// StatItem interface removed for JSX compatibility

const stats = [
  {
    icon: Calendar,
    value: 10000,
    suffix: '+',
    label: 'Events Created',
    color: 'text-gray-400'
  },
  {
    icon: Users,
    value: 500000,
    suffix: '+',
    label: 'Tickets Sold',
    color: 'text-gray-400'
  },
  {
    icon: TrendingUp,
    value: 99.9,
    suffix: '%',
    label: 'Uptime',
    color: 'text-gray-400'
  },
  {
    icon: Shield,
    value: 0,
    suffix: '',
    label: 'Security Breaches',
    color: 'text-gray-400'
  }
]

function AnimatedCounter({ value, suffix, duration = 2 }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (isInView) {
      let startTime
      let animationFrame

      const animate = (timestamp) => {
        if (!startTime) startTime = timestamp
        const progress = Math.min((timestamp - startTime) / (duration * 1000), 1)
        
        const easeOutQuart = 1 - Math.pow(1 - progress, 4)
        setCount(Math.floor(easeOutQuart * value))

        if (progress < 1) {
          animationFrame = requestAnimationFrame(animate)
        }
      }

      animationFrame = requestAnimationFrame(animate)
      return () => cancelAnimationFrame(animationFrame)
    }
  }, [isInView, value, duration])

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    } else if (num >= 1000) {
      return (num / 1000).toFixed(0) + 'K'
    }
    return num.toString()
  }

  return (
    <span ref={ref}>
      {value === 99.9 ? count.toFixed(1) : formatNumber(count)}{suffix}
    </span>
  )
}

export function StatsSection() {
  return (
    <section className="py-20 px-4 relative overflow-hidden bg-black">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-gray-800/20 rounded-full blur-2xl" />
        <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-gray-800/20 rounded-full blur-2xl" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-light text-white mb-6 tracking-tight">
            Trusted by <span className="text-white">Thousands</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto font-light">
            Join the revolution in event ticketing with blockchain technology
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group relative"
              >
                <div className="bg-gray-900/50 rounded-lg p-8 border border-gray-800 hover:border-gray-700 transition-all duration-300 text-center">
                  {/* Icon */}
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                    className="relative mb-6 mx-auto"
                  >
                    <div className="w-16 h-16 bg-gray-800 rounded flex items-center justify-center mx-auto">
                      <Icon className={`w-8 h-8 ${stat.color}`} />
                    </div>
                    
                  </motion.div>

                  {/* Value */}
                  <div className="text-4xl md:text-5xl font-light text-white mb-2">
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                  </div>

                  {/* Label */}
                  <div className="text-gray-400 font-light">
                    {stat.label}
                  </div>

                  {/* Decorative Line */}
                  <motion.div
                    className="absolute bottom-0 left-0 h-px bg-gray-700 rounded-b-lg"
                    initial={{ width: 0 }}
                    whileInView={{ width: '100%' }}
                    transition={{ duration: 0.8, delay: index * 0.1 + 0.5 }}
                    viewport={{ once: true }}
                  />
                </div>

                {/* Hover Glow */}
                <motion.div
                  className="absolute inset-0 rounded-lg bg-gray-800/20 opacity-0 group-hover:opacity-50 -z-10 blur-sm transition-opacity duration-300"
                />
              </motion.div>
            )
          })}
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-gray-900/50 rounded-lg p-8 border border-gray-800 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-2xl font-light text-white mb-2">24/7</div>
                <div className="text-gray-400">Customer Support</div>
              </div>
              <div>
                <div className="text-2xl font-light text-white mb-2">{'< 1s'}</div>
                <div className="text-gray-400">Transaction Speed</div>
              </div>
              <div>
                <div className="text-2xl font-light text-white mb-2">$0.01</div>
                <div className="text-gray-400">Average Gas Fee</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}