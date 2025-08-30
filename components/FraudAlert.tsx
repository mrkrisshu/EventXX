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
  timestamp: Date
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
        timestamp: new Date(),
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

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'from-red-500 to-red-600'
      case 'high': return 'from-orange-500 to-red-500'
      case 'medium': return 'from-yellow-500 to-orange-500'
      case 'low': return 'from-blue-500 to-purple-500'
      default: return 'from-gray-500 to-gray-600'
    }
  }

  const getSeverityIcon = (type: string) => {
    switch (type) {
      case 'high_risk_event': return AlertTriangle
      case 'suspicious_transfer': return User
      case 'blacklisted_address': return Shield
      case 'rapid_transfers': return Clock
      default: return AlertTriangle
    }
  }

  const dismissAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId))
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
                          {alert.timestamp.toLocaleTimeString()}
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
                    onClick={(e) => {
                      e.stopPropagation()
                      dismissAlert(alert.id)
                    }}
                    className="p-1 hover:bg-white/20 rounded transition-colors"
                  >
                    <X className="w-4 h-4 text-white/60" />
                  </button>
                </div>
              </div>
              
              {/* Severity indicator */}
              <div className={`h-1 bg-gradient-to-r ${getSeverityColor(alert.severity)} opacity-60`} />
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}