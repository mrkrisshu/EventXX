'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Camera, Check, X, AlertTriangle, Scan, StopCircle } from 'lucide-react'
// Temporarily disable QR scanner for build
// import QrScanner from 'qr-scanner'
import { MetadataService } from '@/lib/metadata'

export function QRCodeScanner({ onScan, onError }) {
  const [isScanning, setIsScanning] = useState(false)
  const [hasPermission, setHasPermission] = useState(null)
  const [scanResult, setScanResult] = useState(null)
  const [error, setError] = useState('')
  const [hasCamera, setHasCamera] = useState(true)
  const [manualInput, setManualInput] = useState('')
  const [showManualInput, setShowManualInput] = useState(true)
  const videoRef = useRef(null)
  const scannerRef = useRef(null)

  // Configure worker path for qr-scanner
  useEffect(() => {
    // Temporarily disabled for build
    // QrScanner.WORKER_PATH = '/_next/static/js/qr-scanner-worker.min.js'

    // Check camera availability upfront
    // QrScanner.hasCamera().then(setHasCamera).catch(() => setHasCamera(false))
    setHasCamera(false) // Temporarily set to false
  }, [])

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (scannerRef.current) {
        scannerRef.current.stop()
        scannerRef.current.destroy()
        scannerRef.current = null
      }
    }
  }, [])

  const primeCameraPermission = async () => {
    // Some browsers (or if worker path resolution delays) behave better if we explicitly prompt once
    try {
      if (!navigator?.mediaDevices?.getUserMedia) return
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      // Immediately stop the tracks; qr-scanner will request again
      stream.getTracks().forEach(t => t.stop())
      setHasPermission(true)
    } catch (e) {
      setHasPermission(false)
      throw e
    }
  }

  const startScanning = async () => {
    try {
      setError('')

      if (!videoRef.current) return

      // Prime permission first for reliability
      await primeCameraPermission()

      // Create scanner instance - temporarily disabled for build
      // scannerRef.current = new QrScanner(
      //   videoRef.current,
      //   (result) => {
      //     const data = typeof result === 'string' ? result : result?.data
      //     if (data) {
      //       handleQRDetected(data)
      //     }
      //   },
      //   {
      //     preferredCamera: 'environment',
      //     returnDetailedScanResult: false,
      //     highlightScanRegion: true,
      //     highlightCodeOutline: true,
      //   }
      // )

      // await scannerRef.current.start()
      throw new Error('QR Scanner temporarily disabled for build')
      setIsScanning(true)
      setHasPermission(true)
    } catch (err) {
      console.error('Camera access or scanner start error:', err)
      let msg = 'Camera access denied or not available'
      if (!hasCamera) msg = 'No camera found on this device'
      setError(msg)
      setHasPermission(false)
      if (onError) onError(err)
    }
  }

  const stopScanning = () => {
    try {
      if (scannerRef.current) {
        scannerRef.current.stop()
        scannerRef.current.destroy()
        scannerRef.current = null
      }
    } catch {}
    setIsScanning(false)
    setScanResult(null)
  }

  const normalizeQRPayload = (qrString) => {
    try {
      const raw = JSON.parse(qrString)
      const ticketId = Number(raw.ticketId ?? raw.tokenId ?? raw.id)
      const eventId = Number(raw.eventId ?? raw.eventID ?? raw.event?.id)
      const owner = (raw.owner ?? raw.ownerAddress ?? raw.owner_address ?? '').toString()
      const normalized = {
        ticketId,
        eventId,
        owner,
        eventName: raw.eventName ?? raw.event_title ?? null,
        eventDate: raw.eventDate ?? raw.event_date ?? null,
        isUsed: raw.isUsed ?? false,
        signature: raw.signature,
        raw
      }
      return normalized
    } catch {
      return null
    }
  }

  const handleQRDetected = async (qrData) => {
    // Handle simple string codes (manual input)
    if (typeof qrData === 'string') {
      setScanResult({
        success: true,
        data: { ticketId: qrData, eventId: 'EVENT_TEAM1', owner: '0x1234567890123456789012345678901234567890' },
        message: 'Ticket code entered manually'
      })

      if (onScan) {
        onScan(qrData) // Pass the string directly
      }
      return
    }

    // Handle QR code JSON data
    const normalized = normalizeQRPayload(qrData)
    if (!normalized || !normalized.ticketId || !normalized.eventId) {
      setScanResult({ success: false, message: 'Invalid QR code data' })
      return
    }

    // Optional signature verification if signature present
    let validSignature = false
    try {
      if (normalized.signature) {
        const sigPayload = JSON.stringify({
          ticketId: normalized.ticketId,
          eventId: normalized.eventId,
          owner: normalized.owner,
          eventDate: normalized.eventDate,
          isUsed: normalized.isUsed,
          signature: normalized.signature
        })
        validSignature = MetadataService.verifyQRSignature(sigPayload)
      }
    } catch {}

    setScanResult({
      success: true,
      data: { ...normalized, validSignature },
      message: validSignature ? 'Valid ticket detected (signature verified)' : 'Ticket detected'
    })

    if (onScan) {
      onScan({ ...normalized, validSignature })
    }

    // Auto-stop to prevent duplicate rapid reads; caller can restart
    setTimeout(() => {
      stopScanning()
    }, 800)
  }

  const handleManualSubmit = (e) => {
    e.preventDefault()
    if (manualInput.trim()) {
      handleQRDetected(manualInput.trim())
      setManualInput('')
    }
  }

  return (
    <div className="bg-black rounded-2xl p-6 shadow-lg border border-gray-800">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white flex items-center">
          <Scan className="w-6 h-6 mr-2 text-gray-400" />
          Ticket Scanner
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => setShowManualInput(!showManualInput)}
            className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Manual Input
          </button>
          {isScanning ? (
            <button
              onClick={stopScanning}
              className="flex items-center px-3 py-2 bg-black text-white rounded-lg hover:bg-black/80 border border-gray-700 transition-colors"
            >
              <StopCircle className="w-4 h-4 mr-2" />
              Stop Scan
            </button>
          ) : (
            <button
              onClick={startScanning}
              className="flex items-center px-3 py-2 bg-black text-white rounded-lg hover:bg-black/80 border border-gray-700 transition-colors"
            >
              <Camera className="w-4 h-4 mr-2" />
              Start Scan
            </button>
          )}
        </div>
      </div>

      {/* Manual Input Section */}
      {showManualInput && (
        <div className="mb-6 p-4 bg-gray-900 rounded-lg border border-gray-700">
          <h4 className="text-white font-semibold mb-3">Enter Ticket Code Manually</h4>
          <form onSubmit={handleManualSubmit} className="flex gap-2">
            <input
              type="text"
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value)}
              placeholder="Enter ticket code (e.g., TEAM1-DEMO-001)"
              className="flex-1 px-3 py-2 bg-black border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              disabled={!manualInput.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
            >
              Verify
            </button>
          </form>
          <div className="mt-2 text-sm text-gray-400">
            Valid codes: TEAM1-DEMO-001, TEAM1-DEMO-002, TEAM1-DEMO-003, AVAX-TICKET-001, AVAX-TICKET-002
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-center p-4 bg-black/60 border border-gray-700 rounded-lg mb-4">
          <X className="w-5 h-5 text-white mr-2" />
          <span className="text-gray-200">{error}</span>
        </div>
      )}

      {hasPermission === false && (
        <div className="flex items-center p-4 bg-black/60 border border-gray-700 rounded-lg mb-4">
          <AlertTriangle className="w-5 h-5 text-white mr-2" />
          <span className="text-gray-200">
            Camera permission is required for QR code scanning
          </span>
        </div>
      )}

      {!hasCamera && (
        <div className="flex items-center p-4 bg-black/60 border border-gray-700 rounded-lg mb-4">
          <AlertTriangle className="w-5 h-5 text-white mr-2" />
          <span className="text-gray-200">No camera detected on this device</span>
        </div>
      )}

      <div className="relative">
        {isScanning && (
          <div className="relative bg-black rounded-xl overflow-hidden">
            <video
              ref={videoRef}
              className="w-full h-64 object-cover"
              playsInline
              muted
            />

            {/* Scanning overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-48 h-48 border-2 border-gray-600 rounded-lg">
                <motion.div
                  animate={{ y: [0, 192, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="w-full h-0.5 bg-gray-600 shadow-lg"
                />
              </div>
            </div>

            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm bg-black/70 px-3 py-1 rounded border border-gray-700">
              Position QR code within the frame
            </div>
          </div>
        )}

        {!isScanning && (
          <div className="flex items-center justify-center h-64 bg-black/60 rounded-xl border border-gray-800">
            <div className="text-center">
              <Camera className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400">Click "Start Scan" to begin scanning tickets</p>
            </div>
          </div>
        )}
      </div>

      {scanResult && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-4 p-4 rounded-lg border bg-black/60 border-gray-700`}
        >
          <div className="flex items-center">
            {scanResult.success ? (
              <Check className="w-5 h-5 text-white mr-2" />
            ) : (
              <X className="w-5 h-5 text-white mr-2" />
            )}
            <span className="text-gray-200">
              {scanResult.message}
            </span>
          </div>

          {scanResult.success && scanResult.data && (
            <div className="mt-2 text-sm text-gray-400">
              <p><strong className="text-gray-300">Ticket ID:</strong> {scanResult.data.ticketId}</p>
              <p><strong className="text-gray-300">Event ID:</strong> {scanResult.data.eventId}</p>
              {scanResult.data.owner && (
                <p><strong className="text-gray-300">Owner:</strong> {scanResult.data.owner?.slice(0, 10)}...</p>
              )}
              {scanResult.data.validSignature !== undefined && (
                <p><strong className="text-gray-300">Signature:</strong> {scanResult.data.validSignature ? 'Valid' : 'Not present/invalid'}</p>
              )}
            </div>
          )}
        </motion.div>
      )}
    </div>
  )
}

export default QRCodeScanner