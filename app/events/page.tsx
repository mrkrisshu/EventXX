'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, Calendar, MapPin, Users, Star, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useAppStore } from '../../lib/store'

// Mock events data
const mockEvents = [
  {
    id: '1',
    title: 'Blockchain Summit 2024',
    description: 'Join the biggest blockchain conference of the year featuring industry leaders and innovative projects.',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=250&fit=crop',
    date: '2024-03-15',
    time: '09:00 AM',
    location: 'San Francisco Convention Center',
    price: '0.1',
    currency: 'AVAX',
    totalTickets: 1000,
    soldTickets: 750,
    category: 'Technology',
    featured: true,
    organizer: {
      name: 'Blockchain Events Inc.',
      verified: true
    }
  },
  {
    id: '2',
    title: 'NFT Art Gallery Opening',
    description: 'Exclusive opening of the first NFT art gallery featuring works from renowned digital artists.',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=250&fit=crop',
    date: '2024-03-20',
    time: '07:00 PM',
    location: 'Digital Art Museum, NYC',
    price: '0.05',
    currency: 'AVAX',
    totalTickets: 500,
    soldTickets: 320,
    category: 'Art',
    featured: false,
    organizer: {
      name: 'NFT Gallery Collective',
      verified: true
    }
  },
  {
    id: '3',
    title: 'DeFi Workshop Series',
    description: 'Learn about decentralized finance protocols, yield farming, and liquidity provision strategies.',
    image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400&h=250&fit=crop',
    date: '2024-03-25',
    time: '02:00 PM',
    location: 'Online Event',
    price: '0.02',
    currency: 'AVAX',
    totalTickets: 200,
    soldTickets: 150,
    category: 'Education',
    featured: false,
    organizer: {
      name: 'DeFi Academy',
      verified: false
    }
  },
  {
    id: '4',
    title: 'Web3 Gaming Tournament',
    description: 'Compete in the ultimate Web3 gaming tournament with NFT prizes and cryptocurrency rewards.',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=250&fit=crop',
    date: '2024-04-01',
    time: '12:00 PM',
    location: 'Gaming Arena, Los Angeles',
    price: '0.08',
    currency: 'AVAX',
    totalTickets: 800,
    soldTickets: 600,
    category: 'Gaming',
    featured: true,
    organizer: {
      name: 'Web3 Gaming League',
      verified: true
    }
  },
  {
    id: '5',
    title: 'Crypto Investment Masterclass',
    description: 'Master the art of cryptocurrency investment with expert traders and portfolio managers.',
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=250&fit=crop',
    date: '2024-04-05',
    time: '10:00 AM',
    location: 'Financial District, London',
    price: '0.15',
    currency: 'AVAX',
    totalTickets: 300,
    soldTickets: 280,
    category: 'Finance',
    featured: false,
    organizer: {
      name: 'Crypto Investment Group',
      verified: true
    }
  },
  {
    id: '6',
    title: 'Metaverse Fashion Week',
    description: 'Experience the future of fashion in virtual reality with exclusive NFT wearables and digital runway shows.',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=250&fit=crop',
    date: '2024-04-10',
    time: '06:00 PM',
    location: 'Virtual Reality Space',
    price: '0.06',
    currency: 'AVAX',
    totalTickets: 1500,
    soldTickets: 900,
    category: 'Fashion',
    featured: true,
    organizer: {
      name: 'Metaverse Fashion Collective',
      verified: true
    }
  }
]

const categories = ['All', 'Technology', 'Art', 'Education', 'Gaming', 'Finance', 'Fashion']

export default function EventsPage() {
  const { events, loadEvents } = useAppStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [sortBy, setSortBy] = useState('date')

  useEffect(() => {
    loadEvents()
  }, [])

  // Use real events from blockchain, fallback to mock data if no events
  const eventsToShow = events.length > 0 ? events : mockEvents
  
  // Filter and sort events
  const filteredEvents = eventsToShow
    .filter(event => {
      const eventTitle = (event as any).title || (event as any).name || ''
      const eventCategory = (event as any).category || 'Technology'
      const matchesSearch = eventTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           event.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === 'All' || eventCategory === selectedCategory
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date((a as any).date || (a as any).eventDate).getTime() - new Date((b as any).date || (b as any).eventDate).getTime()
        case 'price':
          return parseFloat((a as any).price || '0') - parseFloat((b as any).price || '0')
        case 'popularity':
          return (b.soldTickets / ((b as any).totalTickets || (b as any).maxTickets || 1000)) - (a.soldTickets / ((a as any).totalTickets || (a as any).maxTickets || 1000))
        default:
          return 0
      }
    })

  const featuredEvents = filteredEvents.filter(event => (event as any).featured || false)
  const regularEvents = filteredEvents.filter(event => !(event as any).featured)

  return (
    <div className="min-h-screen bg-purple-gradient pt-24">
      {/* Header */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-12"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6">
            Discover Amazing
            <span className="text-white block">
              Events
            </span>
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-white/70 max-w-2xl mx-auto px-4">
            Find and purchase tickets for the most exciting blockchain and Web3 events worldwide
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8 sm:mb-12"
        >
          <div className="flex flex-col gap-4 sm:gap-6">
            {/* Search */}
            <div className="relative w-full max-w-md mx-auto sm:mx-0">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4 sm:w-5 sm:h-5" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 sm:pl-10 pr-4 py-2.5 sm:py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-gray-500 text-sm sm:text-base"
              />
            </div>

            {/* Filters Row */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center justify-between">
              {/* Category Filter */}
              <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg transition-all duration-200 text-sm sm:text-base touch:active:scale-95 ${
                      selectedCategory === category
                        ? 'bg-gray-800 text-white shadow-lg'
                        : 'bg-white/10 text-white/70 hover:bg-white/20'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              {/* Sort */}
              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-white/70 flex-shrink-0" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-gray-500 text-sm sm:text-base w-full sm:w-auto"
                >
                  <option value="date">Sort by Date</option>
                  <option value="price">Sort by Price</option>
                  <option value="popularity">Sort by Popularity</option>
                </select>
              </div>
            </div>
          </div>
        </motion.div>



        {/* Featured Events */}
        {featuredEvents.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-12 sm:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 sm:mb-8 flex items-center">
              <Star className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-400 mr-2 sm:mr-3 fill-current" />
              Featured Events
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {featuredEvents.map((event, index) => (
                <EventCard key={event.id} event={event} index={index} featured />
              ))}
            </div>
          </motion.div>
        )}

        {/* All Events */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h2 className="text-xl xs:text-2xl sm:text-3xl font-bold text-white mb-4 xs:mb-6 sm:mb-8">
            {selectedCategory === 'All' ? 'All Events' : `${selectedCategory} Events`}
          </h2>
          
          {regularEvents.length > 0 ? (
            <div className="grid grid-cols-1 xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 xs:gap-6 sm:gap-8">
              {regularEvents.map((event, index) => (
                <EventCard key={event.id} event={event} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 xs:py-16">
              <div className="text-4xl xs:text-5xl sm:text-6xl mb-3 xs:mb-4 text-white flex justify-center"><Calendar size={48} className="xs:w-16 xs:h-16 sm:w-16 sm:h-16" /></div>
              <h3 className="text-lg xs:text-xl sm:text-2xl font-bold text-white mb-2">No events found</h3>
              <p className="text-sm xs:text-base text-white/70 px-4">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

interface EventCardProps {
  event: any
  index: number
  featured?: boolean
}

function EventCard({ event, index, featured = false }: EventCardProps) {
  const soldPercentage = (event.soldTickets / event.totalTickets) * 100
  const isAlmostSoldOut = soldPercentage > 90
  const availableTickets = event.totalTickets - event.soldTickets

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className={`group relative overflow-hidden rounded-2xl dark-card border border-gray-800 hover:border-gray-700 transition-all duration-300 ${
        featured ? 'ring-2 ring-yellow-500/30' : ''
      }`}
    >
      {/* Featured Badge */}
      {featured && (
        <div className="absolute top-4 left-4 z-10 flex items-center space-x-1 bg-yellow-400/20 backdrop-blur-md px-3 py-1 rounded-full">
          <Star className="w-4 h-4 text-yellow-400 fill-current" />
          <span className="text-yellow-400 text-sm font-medium">Featured</span>
        </div>
      )}

      {/* Almost Sold Out Badge */}
      {isAlmostSoldOut && (
        <div className="absolute top-4 right-4 z-10 bg-red-500/20 backdrop-blur-md px-3 py-1 rounded-full">
          <span className="text-red-400 text-sm font-medium">Almost Sold Out</span>
        </div>
      )}

      {/* Event Image */}
      <div className="aspect-video overflow-hidden">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Event Content */}
      <div className="p-6">
        {/* Category */}
        <div className="inline-flex items-center px-2 py-1 rounded-full bg-gray-800/20 text-gray-300 text-xs font-medium mb-3">
          {event.category}
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-gray-300 transition-colors">
          {event.title}
        </h3>

        {/* Description */}
        <p className="text-white/70 text-sm mb-4 line-clamp-2">
          {event.description}
        </p>

        {/* Event Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-white/60 text-sm">
            <Calendar className="w-4 h-4 mr-2 text-gray-400" />
            {event.date} at {event.time}
          </div>
          <div className="flex items-center text-white/60 text-sm">
            <MapPin className="w-4 h-4 mr-2 text-gray-400" />
            {event.location}
          </div>
          <div className="flex items-center text-white/60 text-sm">
            <Users className="w-4 h-4 mr-2 text-gray-400" />
            {availableTickets} tickets available
          </div>
        </div>

        {/* Organizer */}
        <div className="flex items-center space-x-2 mb-4">
          <div className="text-sm text-white/70">
            by <span className="text-white">{event.organizer.name}</span>
            {event.organizer.verified && (
              <Star className="w-3 h-3 text-yellow-400 fill-current inline ml-1" />
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-white/60 mb-1">
            <span>Sold: {event.soldTickets}</span>
            <span>{soldPercentage.toFixed(0)}%</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-1.5">
            <div
              className="bg-gray-600 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${soldPercentage}%` }}
            />
          </div>
        </div>

        {/* Price and CTA */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-white">
              {event.price} {event.currency}
            </span>
            <div className="text-xs text-white/60">per ticket</div>
          </div>
          
          <Link href={`/events/${event.id}`}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary flex items-center space-x-2"
            >
              <span>View Event</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </Link>
        </div>
      </div>
    </motion.div>
  )
}