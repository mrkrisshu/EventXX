'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Shield, Users, Clock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react'
import { QRCodeScanner } from '../../components/QRCodeScanner'
import { useAccount } from 'wagmi'

// Mock verification database
const mockVerifiedTickets = new Set()
const mockEventData = {
  'EVENT_123': {
    id: 'EVENT_123',
    title: 'Blockchain Summit 2024',
    date: '2024-03-15',
    location: 'San Francisco Convention Center',
    totalTickets: 1000,
    checkedIn: 0
  }
}

export default function VerifyPage() {
  const { address, isConnected } = useAccount()
  const [verificationHistory, setVerificationHistory] = useState<any[]>([])
  const [currentEvent, setCurrentEvent] = useState('EVENT_123')
  const [stats, setStats] = useState({
    totalScanned: 0,
    validTickets: 0,
    invalidTickets: 0,
    duplicateAttempts: 0
  })

  const handleTicketScan = (ticketData: any) => {
    const timestamp = new Date().toLocaleTimeString()
    const ticketKey = `${ticketData.ticketId}_${ticketData.eventId}`
    
    let verification = {
      id: Date.now(),
      timestamp,
      ticketId: ticketData.ticketId,
      eventId: ticketData.eventId,
      ownerAddress: ticketData.owner || ticketData.ownerAddress,
      status: 'valid',
      message: 'Ticket verified successfully'
    }

    // Check if ticket was already scanned
    if (mockVerifiedTickets.has(ticketKey)) {
      verification = {
        ...verification,
        status: 'duplicate',
        message: 'Ticket already used'
      }
      setStats(prev => ({ ...prev, totalScanned: prev.totalScanned + 1, duplicateAttempts: prev.duplicateAttempts + 1 }))
    }
    // Check if ticket belongs to current event
    else if (String(ticketData.eventId) !== String(currentEvent)) {
      verification = {
        ...verification,
        status: 'invalid',
        message: 'Ticket not valid for this event'
      }
      setStats(prev => ({ ...prev, totalScanned: prev.totalScanned + 1, invalidTickets: prev.invalidTickets + 1 }))
    }
    // Valid ticket
    else {
      mockVerifiedTickets.add(ticketKey)
      setStats(prev => ({ 
        ...prev, 
        totalScanned: prev.totalScanned + 1, 
        validTickets: prev.validTickets + 1 
      }))
    }

    setVerificationHistory(prev => [verification, ...prev.slice(0, 9)]) // Keep last 10 entries
  }

  const handleScanError = (error: any) => {
    console.error('Scan error:', error)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'valid':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'invalid':
        return <XCircle className="w-5 h-5 text-red-500" />
      case 'duplicate':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />
      default:
        return <AlertTriangle className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'valid':
        return 'bg-green-50 border-green-200 text-green-800'
      case 'invalid':
        return 'bg-red-50 border-red-200 text-red-800'
      case 'duplicate':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800'
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800'
    }
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-purple-gradient flex items-center justify-center pt-24">
        <div className="text-center text-white">
          <Shield className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h1 className="text-2xl font-bold mb-2">Access Restricted</h1>
          <p className="text-white/70 mb-6">Please connect your wallet to access the verification system</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-purple-gradient pt-24">
      <div className="container mx-auto px-4 py-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center">
            <Shield className="w-10 h-10 mr-3 text-gray-400" />
            Ticket Verification
          </h1>
          <p className="text-white/70 text-lg">
            Scan QR codes to verify event tickets
          </p>
        </motion.div>

        {/* Current Event Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-8 border border-white/20"
        >
          <h2 className="text-xl font-bold text-white mb-2">Current Event</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-white/80">
            <div>
              <p className="font-semibold">{mockEventData[currentEvent]?.title}</p>
              <p className="text-sm">{mockEventData[currentEvent]?.location}</p>
            </div>
            <div>
              <p className="text-sm">Date</p>
              <p className="font-semibold">{mockEventData[currentEvent]?.date}</p>
            </div>
            <div>
              <p className="text-sm">Capacity</p>
              <p className="font-semibold">{mockEventData[currentEvent]?.totalTickets} tickets</p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Scanner Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <QRCodeScanner onScan={handleTicketScan} onError={handleScanError} />
          </motion.div>

          {/* Stats and History */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            {/* Stats */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Users className="w-6 h-6 mr-2 text-gray-600" />
                Verification Stats
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{stats.totalScanned}</div>
                  <div className="text-sm text-blue-800">Total Scanned</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{stats.validTickets}</div>
                  <div className="text-sm text-green-800">Valid Tickets</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{stats.invalidTickets}</div>
                  <div className="text-sm text-red-800">Invalid Tickets</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">{stats.duplicateAttempts}</div>
                  <div className="text-sm text-yellow-800">Duplicates</div>
                </div>
              </div>
            </div>

            {/* Recent Verifications */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Clock className="w-6 h-6 mr-2 text-gray-600" />
                Recent Verifications
              </h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {verificationHistory.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No tickets scanned yet</p>
                ) : (
                  verificationHistory.map((verification) => (
                    <motion.div
                      key={verification.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-3 rounded-lg border ${getStatusColor(verification.status)}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          {getStatusIcon(verification.status)}
                          <div className="ml-3">
                            <p className="font-medium text-sm">{verification.ticketId}</p>
                            <p className="text-xs opacity-75">{verification.message}</p>
                          </div>
                        </div>
                        <div className="text-xs opacity-75">
                          {verification.timestamp}
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}