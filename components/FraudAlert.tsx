'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, X, Shield, Clock, User } from 'lucide-react'
import { fraudDetection } from '../lib/fraud-detection'

interface FraudAlert {
  id: string
  type: 'high_risk_event' | 'suspicious_transfer' | 'blacklisted_address' | 'rapid_transfers'
  severity: 'low' | 'medium' | 'high' | 'critical'
  title: string
  description: string
  // store as unix seconds for consistency
  timestamp: number
  data?: any
}

interface FraudAlertProps {
  onAlertClick?: (alert: FraudAlert) => void
}

export default function FraudAlert({ onAlertClick }: FraudAlertProps) {
  const [alerts, setAlerts] = useState<FraudAlert[]>([])
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Simulate real-time fraud alerts
    const generateMockAlert = (): FraudAlert => {
      const types = ['high_risk_event', 'suspicious_transfer', 'blacklisted_address', 'rapid_transfers'] as const
      const severities = ['low', 'medium', 'high', 'critical'] as const
      const type = types[Math.floor(Math.random() * types.length)]
      const severity = severities[Math.floor(Math.random() * severities.length)]
      
      const alertTemplates = {
        high_risk_event: {
          title: 'High Risk Event Detected',
          description: 'Event "Summer Music Festival" flagged for suspicious pricing patterns'
        },
        suspicious_transfer: {
          title: 'Suspicious Transfer Activity',
          description: 'Multiple rapid transfers detected from address 0x1234...5678'
        },
        blacklisted_address: {
          title: 'Blacklisted Address Activity',
          description: 'Known fraudulent address 0xabcd...ef01 attempted transaction'
        },
        rapid_transfers: {
          title: 'Rapid Transfer Pattern',
          description: 'Unusual transfer velocity detected - 15 transfers in 2 minutes'
        }
      }

      return {
        id: Math.random().toString(36).substr(2, 9),
        type,
        severity,
        ...alertTemplates[type],
        timestamp: Math.floor(Date.now() / 1000),
        data: {
          riskScore: Math.random() * 0.4 + 0.6, // 0.6 - 1.0
          address: '0x' + Math.random().toString(16).substr(2, 8) + '...' + Math.random().toString(16).substr(2, 4)
        }
      }
    }

    // Generate initial alerts
    const initialAlerts = Array.from({ length: 3 }, generateMockAlert)
    setAlerts(initialAlerts)
    setIsVisible(true)

    // Simulate new alerts coming in
    const interval = setInterval(() => {
      if (Math.random() < 0.3) { // 30% chance every 10 seconds
        const newAlert = generateMockAlert()
        setAlerts(prev => [newAlert, ...prev.slice(0, 4)]) // Keep only 5 most recent
      }
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  const getSeverityColor = (severity: FraudAlert['severity']) => {
    switch (severity) {
      case 'low': return 'from-green-500/20 to-green-600/30'
      case 'medium': return 'from-yellow-500/20 to-yellow-600/30'
      case 'high': return 'from-orange-500/20 to-orange-600/30'
      case 'critical': return 'from-red-500/20 to-red-600/30'
      default: return 'from-gray-500/20 to-gray-600/30'
    }
  }

  const getSeverityIcon = (type: FraudAlert['type']) => {
    switch (type) {
      case 'high_risk_event': return Shield
      case 'suspicious_transfer': return AlertTriangle
      case 'blacklisted_address': return User
      case 'rapid_transfers': return Clock
      default: return AlertTriangle
    }
  }

  if (!isVisible || alerts.length === 0) return null

  return (
    <div className="fixed top-20 right-4 z-40 w-80 max-w-sm">
      <AnimatePresence>
        {alerts.map((alert, index) => {
          const Icon = getSeverityIcon(alert.type)
          return (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: 300, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 300, scale: 0.8 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={`mb-3 bg-gradient-to-r ${getSeverityColor(alert.severity)} rounded-lg shadow-lg border border-white/20 overflow-hidden cursor-pointer hover:scale-105 transition-transform`}
              onClick={() => onAlertClick?.(alert)}
            >
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white font-semibold text-sm">{alert.title}</h4>
                      <p className="text-white/80 text-xs mt-1 line-clamp-2">{alert.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-white/60 text-xs">
                          {new Intl.DateTimeFormat('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                            hour12: true,
                            timeZone: 'UTC',
                            timeZoneName: 'short'
                          }).format(new Date(alert.timestamp * 1000))}
                        </span>
                        {alert.data?.riskScore && (
                          <span className="text-white/80 text-xs bg-white/20 px-2 py-1 rounded">
                            Risk: {(alert.data.riskScore * 100).toFixed(0)}%
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    className="text-white/70 hover:text-white"
                    onClick={(e) => {
                      e.stopPropagation()
                      setAlerts(prev => prev.filter(a => a.id !== alert.id))
                    }}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}