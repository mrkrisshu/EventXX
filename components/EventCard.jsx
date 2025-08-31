'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, MapPin, Users, Clock, ArrowRight, Heart, Share2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

// Event card component for displaying event information

export function EventCard({ event, index }) {
  const [isLiked, setIsLiked] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return {
      day: date.getDate(),
      month: date.toLocaleDateString('en-US', { month: 'short' }),
      year: date.getFullYear()
    }
  }

  const formattedDate = formatDate(event.date)
  const urgencyLevel = event.ticketsLeft < 20 ? 'high' : event.ticketsLeft < 50 ? 'medium' : 'low'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
      whileTap={{ scale: 0.98 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="dark-card group relative touch:active:scale-95 transition-transform"
    >
      <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800 hover:border-gray-700 transition-all duration-300 shadow-lg hover:shadow-xl">
        {/* Image Section */}
        <div className="relative h-40 sm:h-48 overflow-hidden">
          <Image
            src={event.image}
            alt={event.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105 grayscale"
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/40" />
          
          {/* Category Badge */}
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
            <span className="px-2 py-1 sm:px-3 sm:py-1 bg-black/60 backdrop-blur-sm rounded text-white text-xs font-medium border border-gray-700">
              {event.category}
            </span>
          </div>
          
          {/* Action Buttons */}
          <div className="absolute top-3 right-3 sm:top-4 sm:right-4 flex space-x-1.5 sm:space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsLiked(!isLiked)}
              className="w-7 h-7 sm:w-8 sm:h-8 bg-black/60 backdrop-blur-sm rounded flex items-center justify-center border border-gray-700 hover:bg-black/80 transition-colors touch:active:bg-black/90"
            >
              <Heart 
                className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors ${
                  isLiked ? 'text-white fill-white' : 'text-gray-400'
                }`} 
              />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-7 h-7 sm:w-8 sm:h-8 bg-black/60 backdrop-blur-sm rounded flex items-center justify-center border border-gray-700 hover:bg-black/80 transition-colors touch:active:bg-black/90"
            >
              <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" />
            </motion.button>
          </div>
          
          {/* Date Badge */}
          <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4">
            <div className="bg-black/80 backdrop-blur-sm rounded p-1.5 sm:p-2 text-center min-w-[50px] sm:min-w-[60px] border border-gray-700">
              <div className="text-base sm:text-lg font-medium text-white">{formattedDate.day}</div>
              <div className="text-xs text-gray-400 uppercase">{formattedDate.month}</div>
            </div>
          </div>
          
          {/* Urgency Indicator */}
          {urgencyLevel === 'high' && (
            <div className="absolute bottom-4 right-4">
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="px-2 py-1 bg-black/80 backdrop-blur-sm rounded text-white text-xs font-medium border border-gray-700"
              >
                Almost Sold Out!
              </motion.div>
            </div>
          )}
        </div>
        
        {/* Content Section */}
        <div className="p-4 sm:p-6">
          {/* Title */}
          <h3 className="text-lg sm:text-xl font-light text-white mb-2 line-clamp-2 group-hover:text-gray-300 transition-colors">
            {event.title}
          </h3>
          
          {/* Description */}
          <p className="text-gray-400 text-sm mb-3 sm:mb-4 line-clamp-2">
            {event.description}
          </p>
          
          {/* Event Details */}
          <div className="space-y-1.5 sm:space-y-2 mb-3 sm:mb-4">
            <div className="flex items-center text-gray-500 text-sm">
              <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2 text-gray-400 flex-shrink-0" />
              <span className="truncate">{event.location}</span>
            </div>
            
            <div className="flex items-center text-gray-500 text-sm">
              <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2 text-gray-400 flex-shrink-0" />
              <span>{event.attendees.toLocaleString()} attendees</span>
            </div>
            
            <div className="flex items-center text-gray-500 text-sm">
              <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2 text-gray-400 flex-shrink-0" />
              <span>{event.ticketsLeft} tickets left</span>
            </div>
          </div>
          
          {/* Organizer */}
          <div className="flex items-center mb-3 sm:mb-4">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-700 rounded flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0">
              <span className="text-white text-xs font-medium">
                {event.organizer.charAt(0)}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-gray-300 text-sm font-light truncate">{event.organizer}</div>
              <div className="text-gray-500 text-xs">Organizer</div>
            </div>
          </div>
          
          {/* Price and CTA */}
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="text-xl sm:text-2xl font-light text-white">
                {event.price} <span className="text-base sm:text-lg text-gray-400">{event.currency}</span>
              </div>
              <div className="text-gray-500 text-xs">per ticket</div>
            </div>
            
            <Link href={`/event/${event.id}`} className="flex-shrink-0">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-black text-white font-medium py-2 px-3 sm:px-4 rounded transition-all duration-300 flex items-center group/btn hover:bg-black/80 border border-gray-700 text-sm sm:text-base touch:active:bg-black"
              >
                <span className="hidden sm:inline">Buy Ticket</span>
                <span className="sm:hidden">Buy</span>
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-1 sm:ml-2 group-hover/btn:translate-x-1 transition-transform" />
              </motion.button>
            </Link>
          </div>
        </div>
        
        {/* Progress Bar for Tickets */}
        <div className="px-4 sm:px-6 pb-3 sm:pb-4">
          <div className="w-full bg-gray-800 rounded h-1">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${((event.attendees - event.ticketsLeft) / event.attendees) * 100}%` }}
              transition={{ duration: 1, delay: index * 0.1 + 0.5 }}
              viewport={{ once: true }}
              className={`h-1 rounded ${
                urgencyLevel === 'high' 
                  ? 'bg-gray-200'
                  : urgencyLevel === 'medium'
                  ? 'bg-gray-400'
                  : 'bg-gray-600'
              }`}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Sold: {((event.attendees - event.ticketsLeft) / event.attendees * 100).toFixed(0)}%</span>
            <span>{event.ticketsLeft} left</span>
          </div>
        </div>
      </div>
      
      {/* Hover Glow Effect */}
      <motion.div
        className="absolute inset-0 rounded-lg bg-gray-800/20 -z-10 blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  )
}