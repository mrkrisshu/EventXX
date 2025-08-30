'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'
import { useState } from 'react'

export function FeatureCard({ feature, index }) {
  const [isHovered, setIsHovered] = useState(false)
  const { icon: Icon, title, description, color } = feature

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="dark-card rounded-xl p-6 border border-gray-800 hover:border-gray-700 transition-all duration-300 hover:shadow-xl hover:shadow-purple-900/20 group"
    >
      <div className="dark-glass rounded-2xl p-8 border border-gray-800 hover:border-gray-700 transition-all duration-300 shadow-xl hover:shadow-2xl h-full">
        {/* Icon Container */}
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ duration: 0.3 }}
          className="relative mb-6"
        >
          <div className={`w-16 h-16 bg-gradient-to-r ${color} rounded-2xl flex items-center justify-center shadow-lg`}>
            <Icon className="w-8 h-8 text-white" />
          </div>
          
          {/* Glow Effect */}
          <motion.div
            className={`absolute inset-0 bg-gradient-to-r ${color} rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-300`}
            animate={{
              scale: isHovered ? [1, 1.2, 1] : 1,
            }}
            transition={{
              duration: 2,
              repeat: isHovered ? Infinity : 0,
            }}
          />
        </motion.div>
        
        {/* Content */}
        <div className="relative z-10">
          <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
            {title}
          </h3>
          
          <p className="text-white/70 leading-relaxed">
            {description}
          </p>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <Icon className="w-12 h-12 text-white" />
        </div>
        
        {/* Bottom Accent Line */}
        <motion.div
          className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${color} rounded-b-2xl`}
          initial={{ width: 0 }}
          whileInView={{ width: '100%' }}
          transition={{ duration: 0.8, delay: index * 0.1 + 0.3 }}
          viewport={{ once: true }}
        />
      </div>
      
      {/* Hover Glow Effect */}
      <motion.div
        className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${color} opacity-0 group-hover:opacity-10 -z-10 blur-xl transition-opacity duration-300`}
        animate={{
          scale: isHovered ? [1, 1.05, 1] : 1,
        }}
        transition={{
          duration: 3,
          repeat: isHovered ? Infinity : 0,
        }}
      />
    </motion.div>
  )
}