'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Camera, Check, X, AlertTriangle, Scan, StopCircle } from 'lucide-react'
// Temporarily disable QR scanner for build
// import QrScanner from 'qr-scanner'
import { verifyQRSignature } from '@/lib/metadata'

export function QRCodeScanner({ onScan, onError }) {
  const [isScanning, setIsScanning] = useState(false)
  const [hasPermission, setHasPermission] = useState(null)
  const [scanResult, setScanResult] = useState(null)
  const [error, setError] = useState('')
  const [hasCamera, setHasCamera] = useState(true)
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
        validSignature = verifyQRSignature(sigPayload)
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

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-900 flex items-center">
          <Scan className="w-6 h-6 mr-2 text-gray-600" />
          QR Code Scanner
        </h3>
        {isScanning ? (
          <button
            onClick={stopScanning}
            className="flex items-center px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <StopCircle className="w-4 h-4 mr-2" />
            Stop Scan
          </button>
        ) : (
          <button
            onClick={startScanning}
            className="flex items-center px-3 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <Camera className="w-4 h-4 mr-2" />
            Start Scan
          </button>
        )}
      </div>

      {error && (
        <div className="flex items-center p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
          <X className="w-5 h-5 text-red-500 mr-2" />
          <span className="text-red-700">{error}</span>
        </div>
      )}

      {hasPermission === false && (
        <div className="flex items-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg mb-4">
          <AlertTriangle className="w-5 h-5 text-yellow-500 mr-2" />
          <span className="text-yellow-700">
            Camera permission is required for QR code scanning
          </span>
        </div>
      )}

      {!hasCamera && (
        <div className="flex items-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg mb-4">
          <AlertTriangle className="w-5 h-5 text-yellow-500 mr-2" />
          <span className="text-yellow-700">No camera detected on this device</span>
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
              <div className="w-48 h-48 border-2 border-gray-500 rounded-lg">
                <motion.div
                  animate={{ y: [0, 192, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="w-full h-0.5 bg-gray-500 shadow-lg"
                />
              </div>
            </div>

            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm bg-black/50 px-3 py-1 rounded">
              Position QR code within the frame
            </div>
          </div>
        )}

        {!isScanning && (
          <div className="flex items-center justify-center h-64 bg-gray-100 rounded-xl">
            <div className="text-center">
              <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Click "Start Scan" to begin scanning tickets</p>
            </div>
          </div>
        )}
      </div>

      {scanResult && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-4 p-4 rounded-lg border ${
            scanResult.success
              ? 'bg-green-50 border-green-200'
              : 'bg-red-50 border-red-200'
          }`}
        >
          <div className="flex items-center">
            {scanResult.success ? (
              <Check className="w-5 h-5 text-green-500 mr-2" />
            ) : (
              <X className="w-5 h-5 text-red-500 mr-2" />
            )}
            <span className={scanResult.success ? 'text-green-700' : 'text-red-700'}>
              {scanResult.message}
            </span>
          </div>

          {scanResult.success && scanResult.data && (
            <div className="mt-2 text-sm text-gray-600">
              <p><strong>Ticket ID:</strong> {scanResult.data.ticketId}</p>
              <p><strong>Event ID:</strong> {scanResult.data.eventId}</p>
              {scanResult.data.owner && (
                <p><strong>Owner:</strong> {scanResult.data.owner?.slice(0, 10)}...</p>
              )}
              {scanResult.data.validSignature !== undefined && (
                <p><strong>Signature:</strong> {scanResult.data.validSignature ? 'Valid' : 'Not present/invalid'}</p>
              )}
            </div>
          )}
        </motion.div>
      )}
    </div>
  )
}

export default QRCodeScanner