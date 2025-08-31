'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Shield, AlertTriangle, TrendingUp, Users, Activity } from 'lucide-react'
import FraudDetectionDashboard from '../../../components/FraudDetectionDashboard'
import { fraudDetection } from '../../../lib/fraud-detection'
import FraudAlert from '../../../components/FraudAlert'

export default function FraudDetectionPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({
    totalAlerts: 0,
    highRiskEvents: 0,
    suspiciousTransfers: 0,
    blockedAddresses: 0
  })

  useEffect(() => {
    const loadStats = async () => {
      try {
        // Simulate loading fraud detection stats
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        setStats({
          totalAlerts: 23,
          highRiskEvents: 5,
          suspiciousTransfers: 12,
          blockedAddresses: 8
        })
      } catch (error) {
        console.error('Error loading fraud detection stats:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadStats()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full"
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black pt-24">
      {/* Render alerts only on Security page */}
      <FraudAlert />

      {/* Stats Overview */}
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Alerts</p>
                <p className="text-2xl font-bold text-white">{stats.totalAlerts}</p>
              </div>
              <div className="p-3 bg-red-500/20 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-400" />
              </div>
            </div>
          </div>

          <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">High Risk Events</p>
                <p className="text-2xl font-bold text:white">{stats.highRiskEvents}</p>
              </div>
              <div className="p-3 bg-orange-500/20 rounded-lg">
                <TrendingUp className="w-6 h-6 text-orange-400" />
              </div>
            </div>
          </div>

          <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Suspicious Transfers</p>
                <p className="text-2xl font-bold text-white">{stats.suspiciousTransfers}</p>
              </div>
              <div className="p-3 bg-yellow-500/20 rounded-lg">
                <Activity className="w-6 h-6 text-yellow-400" />
              </div>
            </div>
          </div>

          <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Blocked Addresses</p>
                <p className="text-2xl font-bold text-white">{stats.blockedAddresses}</p>
              </div>
              <div className="p-3 bg-purple-500/20 rounded-lg">
                <Users className="w-6 h-6 text-purple-400" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <FraudDetectionDashboard />
        </motion.div>
      </div>
    </div>
  )
}