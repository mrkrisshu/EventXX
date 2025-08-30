'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Calendar, Users, DollarSign, TrendingUp, Eye, Edit, Trash2, QrCode, Download, BarChart3 } from 'lucide-react'
import { useAccount } from 'wagmi'
import { QRCodeScanner } from '../../components/QRCodeScanner'
import { useAppStore } from '../../lib/store'
import { ClientOnlyConnectButton } from '../../components/ClientOnlyConnectButton'

// Mock organizer data
const mockOrganizerEvents = [
  {
    id: '1',
    title: 'Blockchain Summit 2024',
    date: '2024-03-15',
    time: '09:00 AM',
    location: 'San Francisco Convention Center',
    price: '0.1',
    currency: 'AVAX',
    totalTickets: 1000,
    soldTickets: 750,
    revenue: '75.0',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=300&h=200&fit=crop'
  },
  {
    id: '2',
    title: 'NFT Art Gallery Opening',
    date: '2024-03-20',
    time: '07:00 PM',
    location: 'Digital Art Museum, NYC',
    price: '0.05',
    currency: 'AVAX',
    totalTickets: 500,
    soldTickets: 320,
    revenue: '16.0',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop'
  },
  {
    id: '3',
    title: 'Web3 Gaming Tournament',
    date: '2024-02-28',
    time: '12:00 PM',
    location: 'Gaming Arena, Los Angeles',
    price: '0.08',
    currency: 'AVAX',
    totalTickets: 800,
    soldTickets: 800,
    revenue: '64.0',
    status: 'completed',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=300&h=200&fit=crop'
  }
]

const mockStats = {
  totalEvents: 3,
  totalRevenue: '155.0',
  totalTicketsSold: 1870,
  averageTicketPrice: '0.083'
}

export default function OrganizerPage() {
  const { address, isConnected } = useAccount()
  const [activeTab, setActiveTab] = useState('overview')
  // Temporarily disable modal state for build
  // const { isCreateEventModalOpen, setIsCreateEventModalOpen } = useAppStore()
  const [isCreateEventModalOpen, setIsCreateEventModalOpen] = useState(false)

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-purple-gradient flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="text-6xl mb-6 text-white"><QrCode size={64} /></div>
          <h1 className="text-3xl font-bold text-white mb-4">Organizer Dashboard</h1>
          <p className="text-white/70 mb-8 max-w-md">
            Connect your wallet to access the organizer dashboard and manage your events.
          </p>
          <ClientOnlyConnectButton />
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-purple-gradient pt-24">
      {/* Content starts below the navigation bar */}
      <div className="container mx-auto px-4">
        <div className="flex space-x-1 bg-white/5 backdrop-blur-md rounded-xl p-1 mb-8 max-w-2xl">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'events', label: 'Events', icon: Calendar },
            { id: 'analytics', label: 'Analytics', icon: TrendingUp },
            { id: 'verify', label: 'Verify Tickets', icon: QrCode }
          ].map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors flex-1 justify-center ${
                  activeTab === tab.id
                    ? 'bg-gray-800 text-white'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* Content */}
        {activeTab === 'overview' && <OverviewTab stats={mockStats} events={mockOrganizerEvents} />}
        {activeTab === 'events' && <EventsTab events={mockOrganizerEvents} />}
        {activeTab === 'analytics' && <AnalyticsTab events={mockOrganizerEvents} />}
        {activeTab === 'verify' && <VerifyTab events={mockOrganizerEvents} />}
      </div>

      {/* Create Event Modal */}
      {isCreateEventModalOpen && (
        <CreateEventModal onClose={() => setIsCreateEventModalOpen(false)} />
      )}
    </div>
  )
}

function OverviewTab({ stats, events }: { stats: any; events: any[] }) {
  const activeEvents = events.filter(event => event.status === 'active')
  const completedEvents = events.filter(event => event.status === 'completed')

  return (
    <div className="space-y-8">
      {/* Centered Title Section */}
      <div className="text-center py-8">
        <h1 className="text-4xl font-bold text-white mb-4">Organizer Dashboard</h1>
        <p className="text-white/70 text-lg mb-8">Manage your events and track performance</p>
        
      </div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Calendar className="w-6 h-6 text-blue-400" />
            </div>
            <span className="text-2xl font-bold text-white">{stats.totalEvents}</span>
          </div>
          <h3 className="text-white/70 text-sm">Total Events</h3>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-400" />
            </div>
            <span className="text-2xl font-bold text-white">{stats.totalRevenue} AVAX</span>
          </div>
          <h3 className="text-white/70 text-sm">Total Revenue</h3>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-gray-800/20 rounded-lg">
              <Users className="w-6 h-6 text-gray-400" />
            </div>
            <span className="text-2xl font-bold text-white">{stats.totalTicketsSold}</span>
          </div>
          <h3 className="text-white/70 text-sm">Tickets Sold</h3>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-yellow-500/20 rounded-lg">
              <TrendingUp className="w-6 h-6 text-yellow-400" />
            </div>
            <span className="text-2xl font-bold text-white">{stats.averageTicketPrice} AVAX</span>
          </div>
          <h3 className="text-white/70 text-sm">Avg. Ticket Price</h3>
        </motion.div>
      </div>

      {/* Recent Events */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-6">Recent Events</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {events.slice(0, 4).map((event, index) => (
            <EventCard key={event.id} event={event} index={index} />
          ))}
        </div>
      </div>
    </div>
  )
}

function EventsTab({ events }: { events: any[] }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">All Events</h2>
        <div className="flex space-x-2">
          <button className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors">
            All
          </button>
          <button className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors">
            Active
          </button>
          <button className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors">
            Completed
          </button>
        </div>
      </div>

      <div className="grid gap-6">
        {events.map((event, index) => (
          <EventCard key={event.id} event={event} index={index} detailed />
        ))}
      </div>
    </div>
  )
}

function AnalyticsTab({ events }: { events: any[] }) {
  const totalRevenue = events.reduce((sum, event) => sum + parseFloat(event.revenue), 0)
  const totalTickets = events.reduce((sum, event) => sum + event.soldTickets, 0)

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-white">Analytics & Insights</h2>
      
      {/* Revenue Chart Placeholder */}
      <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
        <h3 className="text-xl font-bold text-white mb-4">Revenue Over Time</h3>
        <div className="h-64 bg-white/5 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <BarChart3 className="w-16 h-16 text-white/30 mx-auto mb-4" />
            <p className="text-white/50">Chart visualization would go here</p>
            <p className="text-white/30 text-sm">Integration with charting library needed</p>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
          <h3 className="text-xl font-bold text-white mb-4">Top Performing Events</h3>
          <div className="space-y-3">
            {events
              .sort((a, b) => parseFloat(b.revenue) - parseFloat(a.revenue))
              .slice(0, 3)
              .map((event, index) => (
                <div key={event.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div>
                    <div className="font-medium text-white">{event.title}</div>
                    <div className="text-sm text-white/70">{event.soldTickets} tickets sold</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-green-400">{event.revenue} AVAX</div>
                    <div className="text-sm text-white/70">#{index + 1}</div>
                  </div>
                </div>
              ))
            }
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
          <h3 className="text-xl font-bold text-white mb-4">Quick Stats</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-white/70">Total Revenue</span>
              <span className="font-bold text-white">{totalRevenue.toFixed(2)} AVAX</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/70">Total Tickets Sold</span>
              <span className="font-bold text-white">{totalTickets}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/70">Average Event Size</span>
              <span className="font-bold text-white">{Math.round(totalTickets / events.length)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/70">Success Rate</span>
              <span className="font-bold text-green-400">95%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function VerifyTab({ events }: { events: any[] }) {
  const [selectedEvent, setSelectedEvent] = useState<any>(null)
  const [verificationHistory, setVerificationHistory] = useState<any[]>([])
  const [scannerActive, setScannerActive] = useState(false)
  const [isCreateEventModalOpen, setIsCreateEventModalOpen] = useState(false)
  // Temporarily disable store usage for build
  // const { setIsCreateEventModalOpen } = useAppStore()

  const handleTicketVerification = (result: any) => {
    const verification = {
      id: Date.now(),
      ticketData: result,
      timestamp: new Date().toISOString(),
      status: 'verified',
      eventId: selectedEvent?.id
    }
    setVerificationHistory(prev => [verification, ...prev])
  }

  return (
    <div className="space-y-8">
      {/* Create Event Section */}
      <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-md rounded-2xl p-6 border border-blue-400/30">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Event Management</h2>
            <p className="text-white/70">Create new events or verify tickets for existing ones</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsCreateEventModalOpen(true)}
            className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg"
          >
            <Plus className="w-5 h-5" />
            <span>Create Event</span>
          </motion.button>
        </div>
      </div>
      {/* Event Selection */}
      <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
        <h2 className="text-2xl font-bold text-white mb-4">Select Event for Verification</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.filter(event => event.status === 'active').map((event) => (
            <motion.button
              key={event.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedEvent(event)}
              className={`p-4 rounded-lg border transition-colors text-left ${
                selectedEvent?.id === event.id
                  ? 'border-gray-500 bg-gray-800/20'
                  : 'border-white/20 bg-white/5 hover:border-white/40'
              }`}
            >
              <h3 className="font-semibold text-white mb-2">{event.title}</h3>
              <p className="text-white/70 text-sm">{event.date} at {event.time}</p>
              <p className="text-white/60 text-sm">{event.location}</p>
            </motion.button>
          ))}
        </div>
      </div>

      {/* QR Scanner */}
      {selectedEvent && (
        <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">Scan Tickets</h2>
            <div className="text-white/70">
              Event: <span className="text-white font-medium">{selectedEvent.title}</span>
            </div>
          </div>
          
          <QRCodeScanner
            onScan={handleTicketVerification}
            onError={(error) => console.error('Scan error:', error)}
          />
        </div>
      )}

      {/* Verification History */}
      {verificationHistory.length > 0 && (
        <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
          <h2 className="text-2xl font-bold text-white mb-4">Recent Verifications</h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {verificationHistory.map((verification) => (
              <motion.div
                key={verification.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10"
              >
                <div>
                  <p className="text-white font-medium">
                    Ticket #{verification.ticketData?.ticketNumber || 'Unknown'}
                  </p>
                  <p className="text-white/70 text-sm">
                    {new Date(verification.timestamp).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-sm">
                    ✓ Verified
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Instructions */}
      {!selectedEvent && (
        <div className="text-center py-12">
          <QrCode className="w-16 h-16 text-white/40 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Ticket Verification</h3>
          <p className="text-white/70 max-w-md mx-auto">
            Select an active event above to start scanning and verifying tickets for entry.
          </p>
        </div>
      )}
    </div>
  )
}

function EventCard({ event, index, detailed = false }: { event: any; index: number; detailed?: boolean }) {
  const soldPercentage = (event.soldTickets / event.totalTickets) * 100
  const statusColor = event.status === 'active' ? 'text-green-400' : 'text-blue-400'
  const statusBg = event.status === 'active' ? 'bg-green-500/20' : 'bg-blue-500/20'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10 hover:border-gray-500/50 transition-colors"
    >
      <div className={`flex ${detailed ? 'flex-col lg:flex-row' : 'flex-col'} gap-4`}>
        {/* Event Image */}
        <div className={`${detailed ? 'lg:w-48' : 'w-full'} aspect-video rounded-lg overflow-hidden`}>
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Event Details */}
        <div className="flex-1 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-bold text-white mb-2">{event.title}</h3>
              <div className="flex items-center space-x-4 text-sm text-white/70">
                <span>{event.date} at {event.time}</span>
                <span className={`px-2 py-1 rounded-full text-xs ${statusBg} ${statusColor}`}>
                  {event.status}
                </span>
              </div>
            </div>
            
            {detailed && (
              <div className="flex space-x-2">
                <button className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                  <Eye className="w-4 h-4 text-white" />
                </button>
                <button className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                  <Edit className="w-4 h-4 text-white" />
                </button>
                <button className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                  <QrCode className="w-4 h-4 text-white" />
                </button>
                <button className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                  <Download className="w-4 h-4 text-white" />
                </button>
              </div>
            )}
          </div>

          {/* Progress and Stats */}
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-white/70">Tickets Sold</span>
              <span className="text-white">{event.soldTickets} / {event.totalTickets}</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <div
                className="bg-gray-600 h-2 rounded-full"
                style={{ width: `${soldPercentage}%` }}
              />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-white/70">{soldPercentage.toFixed(0)}% sold</span>
              <span className="font-bold text-green-400">{event.revenue} AVAX revenue</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function CreateEventModal({ onClose }: { onClose: () => void }) {
  const { createEvent } = useAppStore()
  const { isConnected } = useAccount()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    price: '',
    totalTickets: '',
    category: 'Technology'
  })
  const [isCreating, setIsCreating] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isConnected) {
      alert('Please connect your wallet first')
      return
    }
    
    setIsCreating(true)
    try {
      // Combine date and time
      const eventDateTime = new Date(`${formData.date}T${formData.time}`)
      
      await createEvent({
        name: formData.title,
        description: formData.description,
        price: formData.price,
        maxTickets: parseInt(formData.totalTickets),
        eventDate: eventDateTime,
        location: formData.location
      })
      
      onClose()
    } catch (error) {
      console.error('Failed to create event:', error)
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-slate-900 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-white/10"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Create New Event</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <Trash2 className="w-5 h-5 text-white/70" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white/70 mb-2">Event Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-gray-500"
                placeholder="Enter event title"
                required
              />
            </div>
            <div>
              <label className="block text-white/70 mb-2">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                <option value="Technology">Technology</option>
                <option value="Art">Art</option>
                <option value="Education">Education</option>
                <option value="Gaming">Gaming</option>
                <option value="Finance">Finance</option>
                <option value="Fashion">Fashion</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-white/70 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-gray-500 h-24 resize-none"
              placeholder="Describe your event"
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white/70 mb-2">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
                required
              />
            </div>
            <div>
              <label className="block text-white/70 mb-2">Time</label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-white/70 mb-2">Location</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-gray-500"
              placeholder="Event location or 'Online Event'"
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white/70 mb-2">Ticket Price (AVAX)</label>
              <input
                type="number"
                step="0.001"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="0.1"
                required
              />
            </div>
            <div>
              <label className="block text-white/70 mb-2">Total Tickets</label>
              <input
                type="number"
                value={formData.totalTickets}
                onChange={(e) => setFormData({ ...formData, totalTickets: e.target.value })}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="1000"
                required
              />
            </div>
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-6 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreating}
              className="flex-1 py-3 px-6 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCreating ? 'Creating...' : 'Create Event'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}