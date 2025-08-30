'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Calendar, MapPin, Users, Clock, Star, Share2, Heart, Ticket } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAccount } from 'wagmi'
import { QRCodeGenerator } from '../../../components/QRCodeGenerator'
import { useAppStore } from '../../../lib/store'
import { ClientOnlyConnectButtonCustom } from '../../../components/ClientOnlyConnectButton'

// Mock event data - in a real app, this would come from an API or database
const mockEvent = {
  id: '1',
  title: 'Blockchain Summit 2024',
  description: 'Join the biggest blockchain conference of the year featuring industry leaders, innovative projects, and networking opportunities.',
  longDescription: `
    The Blockchain Summit 2024 is the premier event for blockchain enthusiasts, developers, and industry professionals. 
    
    This two-day conference will feature:
    - Keynote speeches from blockchain pioneers
    - Technical workshops and hands-on sessions
    - Networking opportunities with industry leaders
    - Exhibition of the latest blockchain projects
    - Panel discussions on the future of Web3
    
    Don't miss this opportunity to be part of the blockchain revolution!
  `,
  image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop',
  date: '2024-03-15',
  time: '09:00 AM',
  location: 'San Francisco Convention Center',
  price: '0.1',
  currency: 'AVAX',
  totalTickets: 1000,
  soldTickets: 750,
  category: 'Technology',
  organizer: {
    name: 'Blockchain Events Inc.',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    verified: true
  },
  features: [
    'NFT Ticket with exclusive artwork',
    'Access to VIP networking area',
    'Complimentary lunch and refreshments',
    'Digital swag bag with exclusive content',
    'Certificate of attendance as NFT'
  ]
}

export default function EventDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { address, isConnected } = useAccount()
  const { events, buyTicket, loadEvents } = useAppStore()
  const [quantity, setQuantity] = useState(1)
  const [isLiked, setIsLiked] = useState(false)
  const [purchasedTickets, setPurchasedTickets] = useState<any[]>([])
  const [isPurchasing, setIsPurchasing] = useState(false)

  // Load events on component mount
  React.useEffect(() => {
    loadEvents()
  }, [])

  // Find the current event from loaded events, fallback to mock data
  const numericId = Number(params.id)
  const currentEvent = events.find(event => event.id === numericId) || mockEvent

  const totalPrice = parseFloat(currentEvent.price) * quantity

  // Handle ticket purchase using store function
  const handlePurchase = async () => {
    if (!isConnected) {
      alert('Please connect your wallet first')
      return
    }
    
    setIsPurchasing(true)
    try {
      await buyTicket(numericId)
      
      // Create ticket data for purchased tickets
      const newTickets = Array.from({ length: quantity }, (_, index) => ({
        id: `${Date.now()}-${index}`,
        eventId: numericId,
        eventTitle: (currentEvent as any).name || (currentEvent as any).title,
        ticketNumber: `TKT-${Date.now()}-${index + 1}`,
        purchaser: address,
        quantity: 1,
        price: currentEvent.price,
        currency: (currentEvent as any).currency || 'AVAX',
        purchaseDate: new Date().toISOString(),
        eventDate: (currentEvent as any).date || (currentEvent as any).eventDate,
        eventTime: (currentEvent as any).time || '',
        location: currentEvent.location
      }))
      
      setPurchasedTickets(prev => [...prev, ...newTickets])
      alert(`Successfully purchased ${quantity} ticket(s)!`)
    } catch (error) {
      console.error('Purchase failed:', error)
      alert('Purchase failed. Please try again.')
    } finally {
      setIsPurchasing(false)
    }
  }

  const availableTickets = ((currentEvent as any).maxTickets || (currentEvent as any).totalTickets || 1000) - currentEvent.soldTickets
  const soldPercentage = (currentEvent.soldTickets / ((currentEvent as any).maxTickets || (currentEvent as any).totalTickets || 1000)) * 100

  return (
    <div className="min-h-screen bg-purple-gradient pt-16">
      {/* Header */}
      <div className="container mx-auto px-4 py-6">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => router.back()}
          className="flex items-center text-white/70 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Events
        </motion.button>
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Event Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="aspect-video rounded-2xl overflow-hidden bg-gray-800 p-1">
              <img
                src={(currentEvent as any).image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop'}
                alt={(currentEvent as any).title || (currentEvent as any).name || 'Event'}
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
            
            {/* Floating Action Buttons */}
            <div className="absolute top-4 right-4 flex gap-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsLiked(!isLiked)}
                className={`p-3 rounded-full backdrop-blur-md transition-colors ${
                  isLiked ? 'bg-red-500/20 text-red-400' : 'bg-white/10 text-white'
                }`}
              >
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-3 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-colors"
              >
                <Share2 className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>

          {/* Event Details */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Category Badge */}
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-gray-800/20 text-gray-300 text-sm font-medium">
              {(currentEvent as any).category || 'Technology'}
            </div>

            {/* Title */}
            <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
              {(currentEvent as any).title || (currentEvent as any).name || 'Event'}
            </h1>

            {/* Event Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center text-white/70">
                <Calendar className="w-5 h-5 mr-3 text-gray-400" />
                <div>
                  <div className="font-medium text-white">{(currentEvent as any).date || new Date((currentEvent as any).eventDate * 1000).toLocaleDateString()}</div>
                  <div className="text-sm">{(currentEvent as any).time || new Date((currentEvent as any).eventDate * 1000).toLocaleTimeString()}</div>
                </div>
              </div>
              
              <div className="flex items-center text-white/70">
                <MapPin className="w-5 h-5 mr-3 text-gray-400" />
                <div>
                  <div className="font-medium text-white">Venue</div>
                  <div className="text-sm">{currentEvent.location}</div>
                </div>
              </div>
            </div>

            {/* Organizer */}
            <div className="flex items-center space-x-3 p-4 rounded-xl bg-white/5 backdrop-blur-sm">
              <img
                src={(currentEvent as any).organizer?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'}
                alt={(currentEvent as any).organizer?.name || 'Event Organizer'}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-white">{(currentEvent as any).organizer?.name || currentEvent.organizer || 'Event Organizer'}</span>
                  {(currentEvent as any).organizer?.verified && (
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  )}
                </div>
                <div className="text-sm text-white/70">Event Organizer</div>
              </div>
            </div>

            {/* Ticket Sales Progress */}
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-white/70">Tickets Sold</span>
                <span className="text-white">{currentEvent.soldTickets} / {(currentEvent as any).totalTickets || (currentEvent as any).maxTickets}</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${soldPercentage}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="bg-gray-600 h-2 rounded-full"
                />
              </div>
              <div className="text-sm text-white/70">
                {availableTickets} tickets remaining
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Purchase Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="container mx-auto px-4 py-12"
      >
        <div className="max-w-md mx-auto lg:mx-0 lg:max-w-none">
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
            <h3 className="text-2xl font-bold text-white mb-6">Purchase Tickets</h3>
            
            {/* Price */}
            <div className="flex items-center justify-between mb-6">
              <span className="text-white/70">Price per ticket</span>
              <span className="text-2xl font-bold text-white">
                {currentEvent.price} {(currentEvent as any).currency || 'AVAX'}
              </span>
            </div>

            {/* Quantity Selector */}
            <div className="mb-6">
              <label className="block text-white/70 mb-3">Quantity</label>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors flex items-center justify-center"
                >
                  -
                </button>
                <span className="text-xl font-bold text-white w-8 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(10, quantity + 1))}
                  className="w-10 h-10 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors flex items-center justify-center"
                >
                  +
                </button>
              </div>
            </div>

            {/* Total */}
            <div className="flex items-center justify-between mb-6 p-4 rounded-xl bg-gray-800/20">
              <span className="text-white font-medium">Total</span>
              <span className="text-2xl font-bold text-white">
                {totalPrice.toFixed(3)} {(currentEvent as any).currency || 'AVAX'}
              </span>
            </div>

            {/* Purchase Button */}
            {isConnected ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handlePurchase}
                disabled={isPurchasing || availableTickets === 0}
                className="w-full btn-primary flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPurchasing ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                    Processing...
                  </div>
                ) : availableTickets === 0 ? (
                  'Sold Out'
                ) : (
                  <>
                    <Ticket className="w-5 h-5 mr-2" />
                    Purchase Tickets
                  </>
                )}
              </motion.button>
            ) : (
              <ClientOnlyConnectButtonCustom>
                {({ openConnectModal }) => (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={openConnectModal}
                    className="w-full btn-primary flex items-center justify-center"
                  >
                    Connect Wallet to Purchase
                  </motion.button>
                )}
              </ClientOnlyConnectButtonCustom>
            )}
          </div>
        </div>
      </motion.div>

      {/* Event Description */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="container mx-auto px-4 py-12"
      >
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-6">About This Event</h2>
          <div className="prose prose-invert max-w-none">
            <p className="text-white/70 leading-relaxed whitespace-pre-line">
              {(currentEvent as any).longDescription || currentEvent.description}
            </p>
          </div>

          {/* Features */}
          <div className="mt-8">
            <h3 className="text-2xl font-bold text-white mb-4">What's Included</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {((currentEvent as any).features || []).map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
                  className="flex items-center space-x-3 p-3 rounded-lg bg-white/5"
                >
                  <div className="w-2 h-2 rounded-full bg-gray-400" />
                  <span className="text-white/80">{feature}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Purchased Tickets QR Codes */}
      {purchasedTickets.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="container mx-auto px-4 py-12"
        >
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-6">Your Tickets</h2>
            <p className="text-white/70 mb-8">
              Your tickets have been successfully purchased! Use the QR codes below for event entry.
            </p>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {purchasedTickets.map((ticket, index) => (
                <motion.div
                  key={ticket.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
                >
                  <div className="text-center mb-4">
                    <h3 className="text-lg font-semibold text-white mb-2">
                      Ticket #{ticket.ticketNumber}
                    </h3>
                    <p className="text-white/60 text-sm">
                      Purchased: {new Date(ticket.purchaseDate).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <QRCodeGenerator 
                    ticketData={ticket}
                    onGenerated={() => {}}
                  />
                  
                  <div className="mt-4 text-center">
                    <p className="text-white/80 text-sm">
                      {ticket.price} {ticket.currency}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}