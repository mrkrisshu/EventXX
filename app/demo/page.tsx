'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { QrCode, Calendar, MapPin, Users, Ticket, CheckCircle, Copy, Download } from 'lucide-react'
import { QRCodeGenerator } from '../../components/QRCodeGenerator'
import Link from 'next/link'

// Demo ticket data for Team1 Avalanche event
const demoTicketData = {
  id: 'TEAM1-DEMO-001',
  ticketId: 'TEAM1-DEMO-001',
  eventId: 'EVENT_TEAM1',
  eventTitle: 'Team1 Avalanche',
  eventName: 'Team1 Avalanche',
  eventDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  location: 'Avalanche Innovation Center',
  price: '0.02',
  ownerAddress: '0x5678901234567890123456789012345678901234',
  purchaser: '0x5678901234567890123456789012345678901234',
  owner: '0x5678901234567890123456789012345678901234',
  purchaseDate: Date.now(),
  ticketNumber: 1
}

// Demo verification codes
const demoVerificationCodes = [
  'TEAM1-DEMO-001',
  'TEAM1-DEMO-002', 
  'TEAM1-DEMO-003',
  'AVAX-TICKET-001',
  'AVAX-TICKET-002'
]

export default function DemoPage() {
  const [copiedCode, setCopiedCode] = useState('')
  const [qrGenerated, setQrGenerated] = useState(false)

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedCode(text)
    setTimeout(() => setCopiedCode(''), 2000)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      {/* Header */}
      <div className="container mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            Team1 Avalanche Demo
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Demonstrating EventXX's NFT ticketing system with blockchain verification
          </p>
        </motion.div>

        {/* Event Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-gray-700"
        >
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <Calendar className="w-6 h-6 mr-3 text-blue-400" />
            Event Details
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center">
              <Ticket className="w-5 h-5 mr-3 text-green-400" />
              <div>
                <p className="text-sm text-gray-400">Event Name</p>
                <p className="font-semibold">{demoTicketData.eventTitle}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <Calendar className="w-5 h-5 mr-3 text-blue-400" />
              <div>
                <p className="text-sm text-gray-400">Date</p>
                <p className="font-semibold">{formatDate(demoTicketData.eventDate)}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <MapPin className="w-5 h-5 mr-3 text-purple-400" />
              <div>
                <p className="text-sm text-gray-400">Location</p>
                <p className="font-semibold">{demoTicketData.location}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Demo Ticket and QR Code */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Ticket Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700"
          >
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <Ticket className="w-6 h-6 mr-3 text-green-400" />
              Demo Ticket
            </h3>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-400">Ticket ID</p>
                <div className="flex items-center justify-between bg-gray-900/50 rounded-lg p-3">
                  <code className="text-green-400 font-mono">{demoTicketData.ticketId}</code>
                  <button
                    onClick={() => copyToClipboard(demoTicketData.ticketId)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {copiedCode === demoTicketData.ticketId ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-400">Owner Address</p>
                <div className="flex items-center justify-between bg-gray-900/50 rounded-lg p-3">
                  <code className="text-blue-400 font-mono text-sm">
                    {demoTicketData.ownerAddress.slice(0, 10)}...{demoTicketData.ownerAddress.slice(-8)}
                  </code>
                  <button
                    onClick={() => copyToClipboard(demoTicketData.ownerAddress)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {copiedCode === demoTicketData.ownerAddress ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-400">Price</p>
                <p className="text-lg font-semibold text-purple-400">{demoTicketData.price} AVAX</p>
              </div>
            </div>
          </motion.div>

          {/* QR Code Generator */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <QRCodeGenerator 
              ticketData={demoTicketData}
              onGenerated={() => setQrGenerated(true)}
            />
          </motion.div>
        </div>

        {/* Demo Verification Codes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 mb-8"
        >
          <h3 className="text-xl font-bold mb-4 flex items-center">
            <QrCode className="w-6 h-6 mr-3 text-yellow-400" />
            Valid Verification Codes
          </h3>
          
          <p className="text-gray-400 mb-4">
            These codes are pre-registered in the verification system for demo purposes:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {demoVerificationCodes.map((code, index) => (
              <div key={code} className="bg-gray-900/50 rounded-lg p-3 flex items-center justify-between">
                <code className="text-green-400 font-mono text-sm">{code}</code>
                <button
                  onClick={() => copyToClipboard(code)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {copiedCode === code ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Demo Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/30"
        >
          <h3 className="text-xl font-bold mb-4 flex items-center">
            <Users className="w-6 h-6 mr-3 text-blue-400" />
            Demo Flow Instructions
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2 text-blue-300">1. Event Creation</h4>
              <p className="text-gray-300 text-sm mb-4">
                The Team1 Avalanche event has been created with 150 total tickets, 25 sold, priced at 0.02 AVAX.
              </p>
              
              <h4 className="font-semibold mb-2 text-green-300">2. Ticket Generation</h4>
              <p className="text-gray-300 text-sm">
                QR codes are generated with blockchain verification data including ticket ID, event ID, and owner address.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2 text-purple-300">3. Verification Process</h4>
              <p className="text-gray-300 text-sm mb-4">
                Use the verification codes above or scan the QR code at the verification page to test the system.
              </p>
              
              <Link 
                href="/verify"
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                <QrCode className="w-4 h-4 mr-2" />
                Test Verification
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}