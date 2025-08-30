'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar, MapPin, Users, Shield, Zap, QrCode, Coins, ArrowRight, Sparkles } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { EventCard } from '@/components/EventCard.jsx'
import { FeatureCard } from '@/components/FeatureCard.jsx'
import { HeroSection } from '@/components/HeroSection.jsx'
import { StatsSection } from '@/components/StatsSection.jsx'

const mockEvents = [
  {
    id: 1,
    title: 'Blockchain Summit 2024',
    description: 'The biggest blockchain conference of the year featuring industry leaders and innovators.',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500&h=300&fit=crop',
    date: '2024-03-15',
    location: 'San Francisco, CA',
    price: '0.5',
    currency: 'AVAX',
    attendees: 1200,
    category: 'Technology',
    organizer: 'Blockchain Foundation',
    ticketsLeft: 45
  },
  {
    id: 2,
    title: 'NFT Art Gallery Opening',
    description: 'Exclusive opening of the first NFT art gallery featuring digital masterpieces.',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=300&fit=crop',
    date: '2024-03-20',
    location: 'New York, NY',
    price: '0.2',
    currency: 'AVAX',
    attendees: 300,
    category: 'Art',
    organizer: 'Digital Arts Collective',
    ticketsLeft: 12
  },
  {
    id: 3,
    title: 'DeFi Workshop Series',
    description: 'Learn about decentralized finance from experts in the field.',
    image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=500&h=300&fit=crop',
    date: '2024-03-25',
    location: 'Austin, TX',
    price: '0.1',
    currency: 'AVAX',
    attendees: 150,
    category: 'Education',
    organizer: 'DeFi Academy',
    ticketsLeft: 28
  },
  {
    id: 4,
    title: 'Metaverse Gaming Convention',
    description: 'Explore the future of gaming in virtual worlds and blockchain integration.',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&h=300&fit=crop',
    date: '2024-04-01',
    location: 'Los Angeles, CA',
    price: '0.3',
    currency: 'AVAX',
    attendees: 800,
    category: 'Gaming',
    organizer: 'Metaverse Studios',
    ticketsLeft: 67
  }
]

const features = [
  {
    icon: Shield,
    title: 'Fraud-Proof Security',
    description: 'Blockchain verification ensures authentic tickets every time, eliminating counterfeits and fraud.',
    color: 'from-gray-800 to-gray-900'
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Powered by Avalanche for instant transactions with minimal fees.',
    color: 'from-gray-800 to-gray-900'
  },
  {
    icon: QrCode,
    title: 'QR Verification',
    description: 'Instant ticket validation at event entrances with secure QR codes.',
    color: 'from-gray-800 to-gray-900'
  },
  {
    icon: Coins,
    title: 'NFT Marketplace',
    description: 'Trade tickets safely with built-in royalties for organizers.',
    color: 'from-gray-800 to-gray-900'
  }
]

export default function HomePage() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <div className="min-h-screen bg-purple-gradient">
      {/* Hero Section */}
      <HeroSection />

      {/* Stats Section */}
      <StatsSection />

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Why Choose <span className="bg-gradient-to-r from-blue-400 to-gray-600 bg-clip-text text-transparent">EventXX</span>?
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              Experience the future of event ticketing with blockchain technology
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <FeatureCard key={index} feature={feature} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section id="events" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Upcoming <span className="bg-gradient-to-r from-blue-400 to-gray-600 bg-clip-text text-transparent">Events</span>
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              Discover amazing events and secure your tickets on the blockchain
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {mockEvents.map((event, index) => (
              <EventCard key={event.id} event={event} index={index} />
            ))}
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <button className="btn-primary group">
              View All Events
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="glass-effect rounded-3xl p-12 border border-white/10"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Create Your Event?
            </h2>
            <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto">
              Join thousands of organizers who trust EventXX for secure, transparent event ticketing
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/organizer" className="btn-primary">
                Create Event
              </Link>
              <button className="btn-secondary">
                Learn More
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-gray-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">EventXX</span>
              </div>
              <p className="text-white/60">
                The future of event ticketing on blockchain
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Platform</h4>
              <div className="space-y-2">
                <a href="#" className="block text-white/60 hover:text-white transition-colors">How it Works</a>
                <a href="#" className="block text-white/60 hover:text-white transition-colors">Security</a>
                <a href="#" className="block text-white/60 hover:text-white transition-colors">Fees</a>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <div className="space-y-2">
                <a href="#" className="block text-white/60 hover:text-white transition-colors">Help Center</a>
                <a href="#" className="block text-white/60 hover:text-white transition-colors">Contact</a>
                <a href="#" className="block text-white/60 hover:text-white transition-colors">API</a>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Community</h4>
              <div className="space-y-2">
                <a href="#" className="block text-white/60 hover:text-white transition-colors">Discord</a>
                <a href="#" className="block text-white/60 hover:text-white transition-colors">Twitter</a>
                <a href="#" className="block text-white/60 hover:text-white transition-colors">GitHub</a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-white/10 mt-12 pt-8 text-center">
            <p className="text-white/60">
              © 2024 EventXX. All rights reserved. Built on Avalanche.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}