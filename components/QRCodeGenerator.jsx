'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { QrCode, Download, Check, X, Smartphone } from 'lucide-react'
import QRCode from 'qrcode'
import { generateQRData } from '@/lib/metadata'

export function QRCodeGenerator({ ticketData, onGenerated }) {
  const [qrCodeUrl, setQrCodeUrl] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState('')

  const toNumberSafe = (val) => {
    if (typeof val === 'number') return val
    if (!val) return NaN
    // remove non-digits to support ids like "1699999999999-0"
    const onlyDigits = String(val).replace(/\D/g, '')
    return onlyDigits ? Number(onlyDigits) : NaN
  }

  const toUnixSeconds = (val) => {
    if (!val) return Math.floor(Date.now() / 1000)
    if (typeof val === 'number') {
      // heuristics: if it's too big, it's probably ms
      return val > 2_000_000_000 ? Math.floor(val / 1000) : val
    }
    // parse ISO/date strings
    const t = Date.parse(String(val))
    return Number.isNaN(t) ? Math.floor(Date.now() / 1000) : Math.floor(t / 1000)
  }

  const generateQRCode = async () => {
    if (!ticketData) return

    setIsGenerating(true)
    setError('')

    try {
      // Build Ticket and Event-like objects expected by metadata service
      const tokenId = toNumberSafe(ticketData.id)
      const eventId = toNumberSafe(ticketData.eventId)
      const owner = ticketData.ownerAddress || ticketData.owner || ticketData.purchaser || ''
      const eventName = ticketData.eventTitle || ticketData.eventName || 'Event Ticket'
      const eventDate = toUnixSeconds(ticketData.eventDate)
      const location = ticketData.location || ''

      const ticket = {
        tokenId: Number.isNaN(tokenId) ? Date.now() : tokenId,
        eventId: Number.isNaN(eventId) ? 0 : eventId,
        owner,
        isUsed: false,
        eventName,
        eventDate,
        location
      }

      const event = {
        id: Number.isNaN(eventId) ? 0 : eventId,
        name: eventName,
        description: '',
        organizer: '',
        price: String(ticketData.price ?? ''),
        maxTickets: 0,
        soldTickets: 0,
        eventDate,
        location,
        isActive: true
      }

      // Create signed verification payload via metadata service
      const qrDataString = generateQRData(ticket, event)

      // Generate QR code with verification data
      const qrCodeDataUrl = await QRCode.toDataURL(qrDataString, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      })

      setQrCodeUrl(qrCodeDataUrl)
      if (onGenerated) {
        onGenerated(qrCodeDataUrl, JSON.parse(qrDataString))
      }
    } catch (err) {
      setError('Failed to generate QR code')
      console.error('QR Code generation error:', err)
    } finally {
      setIsGenerating(false)
    }
  }

  const downloadQRCode = () => {
    if (!qrCodeUrl) return

    const link = document.createElement('a')
    link.href = qrCodeUrl
    link.download = `ticket-${ticketData.id}-qr.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  useEffect(() => {
    if (ticketData) {
      generateQRCode()
    }
  }, [ticketData])

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-900 flex items-center">
          <QrCode className="w-6 h-6 mr-2 text-white" />
          Ticket QR Code
        </h3>
        {qrCodeUrl && (
          <button
            onClick={downloadQRCode}
            className="flex items-center px-3 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </button>
        )}
      </div>

      {isGenerating && (
        <div className="flex items-center justify-center py-8">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 border-4 border-gray-600 border-t-transparent rounded-full"
          />
          <span className="ml-3 text-gray-600">Generating QR Code...</span>
        </div>
      )}

      {error && (
        <div className="flex items-center p-4 bg-red-50 border border-red-200 rounded-lg">
          <X className="w-5 h-5 text-red-500 mr-2" />
          <span className="text-red-700">{error}</span>
        </div>
      )}

      {qrCodeUrl && !isGenerating && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="bg-gray-50 rounded-xl p-4 mb-4">
            <img
              src={qrCodeUrl}
              alt="Ticket QR Code"
              className="mx-auto rounded-lg shadow-sm"
            />
          </div>
          
          <div className="flex items-center justify-center text-green-600 mb-2">
            <Check className="w-5 h-5 mr-2" />
            <span className="font-medium">QR Code Generated Successfully</span>
          </div>
          
          <div className="flex items-center justify-center text-gray-500 text-sm">
            <Smartphone className="w-4 h-4 mr-2" />
            <span>Scan this code at the event entrance</span>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default QRCodeGenerator