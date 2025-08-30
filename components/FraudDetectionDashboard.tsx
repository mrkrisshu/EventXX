'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Eye, 
  TrendingUp, 
  Users, 
  Activity,
  Filter,
  Search,
  Download,
  RefreshCw
} from 'lucide-react'
import { fraudDetection, type EventValidation, type TransferAnalysis } from '../lib/fraud-detection'

interface FraudAlert {
  id: string
  type: 'event' | 'transfer'
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  title: string
  description: string
  timestamp: number
  status: 'active' | 'investigating' | 'resolved'
}

const FraudDetectionDashboard: React.FC = () => {
  const [alerts, setAlerts] = useState<FraudAlert[]>([])
  const [statistics, setStatistics] = useState<any>({})
  const [selectedTab, setSelectedTab] = useState<'overview' | 'alerts' | 'analysis' | 'settings'>('overview')
  const [filterSeverity, setFilterSeverity] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    setIsLoading(true)
    try {
      // Load fraud statistics
      const stats = fraudDetection.getFraudStatistics()
      setStatistics(stats)

      // Generate mock alerts for demonstration
      const mockAlerts: FraudAlert[] = [
        {
          id: '1',
          type: 'transfer',
          severity: 'HIGH',
          title: 'Suspicious Transfer Pattern',
          description: 'Rapid consecutive transfers detected from wallet 0x1234...5678',
          timestamp: Date.now() - 3600000,
          status: 'active'
        },
        {
          id: '2',
          type: 'event',
          severity: 'MEDIUM',
          title: 'Duplicate Event Content',
          description: 'Event "Blockchain Summit" has 95% similarity to existing event',
          timestamp: Date.now() - 7200000,
          status: 'investigating'
        },
        {
          id: '3',
          type: 'transfer',
          severity: 'CRITICAL',
          title: 'Blacklisted Address Activity',
          description: 'Transfer involving known fraudulent address detected',
          timestamp: Date.now() - 1800000,
          status: 'active'
        }
      ]
      setAlerts(mockAlerts)
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return 'text-red-500 bg-red-500/10 border-red-500/20'
      case 'HIGH': return 'text-orange-500 bg-orange-500/10 border-orange-500/20'
      case 'MEDIUM': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20'
      case 'LOW': return 'text-green-500 bg-green-500/10 border-green-500/20'
      default: return 'text-gray-500 bg-gray-500/10 border-gray-500/20'
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return <XCircle className="w-5 h-5" />
      case 'HIGH': return <AlertTriangle className="w-5 h-5" />
      case 'MEDIUM': return <Eye className="w-5 h-5" />
      case 'LOW': return <CheckCircle className="w-5 h-5" />
      default: return <Shield className="w-5 h-5" />
    }
  }

  const filteredAlerts = alerts.filter(alert => {
    const matchesSeverity = filterSeverity === 'all' || alert.severity === filterSeverity
    const matchesSearch = alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSeverity && matchesSearch
  })

  const StatCard = ({ title, value, icon, trend, color }: any) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="dark-card rounded-xl p-6 border border-gray-800"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${color}`}>
          {icon}
        </div>
        {trend && (
          <div className="flex items-center text-sm text-green-400">
            <TrendingUp className="w-4 h-4 mr-1" />
            {trend}%
          </div>
        )}
      </div>
      <h3 className="text-2xl font-bold text-white mb-1">{value}</h3>
      <p className="text-gray-400 text-sm">{title}</p>
    </motion.div>
  )

  const AlertCard = ({ alert }: { alert: FraudAlert }) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="dark-card rounded-xl p-6 mb-4 border border-gray-800"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4">
          <div className={`p-2 rounded-lg border ${getSeverityColor(alert.severity)}`}>
            {getSeverityIcon(alert.severity)}
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h4 className="text-white font-semibold">{alert.title}</h4>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(alert.severity)}`}>
                {alert.severity}
              </span>
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                {alert.type}
              </span>
            </div>
            <p className="text-gray-400 text-sm mb-3">{alert.description}</p>
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <span>{new Date(alert.timestamp).toLocaleString()}</span>
              <span className="capitalize">{alert.status}</span>
            </div>
          </div>
        </div>
        <div className="flex space-x-2">
          <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors">
            Investigate
          </button>
          <button className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white text-sm rounded-lg transition-colors">
            Dismiss
          </button>
        </div>
      </div>
    </motion.div>
  )

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Fraud Detection Dashboard</h1>
            <p className="text-gray-400">Monitor and analyze suspicious activities in real-time</p>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={loadDashboardData}
              disabled={isLoading}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white rounded-lg transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8 bg-gray-800/50 backdrop-blur-sm rounded-xl p-1">
          {[
            { id: 'overview', label: 'Overview', icon: <Activity className="w-4 h-4" /> },
            { id: 'alerts', label: 'Alerts', icon: <AlertTriangle className="w-4 h-4" /> },
            { id: 'analysis', label: 'Analysis', icon: <TrendingUp className="w-4 h-4" /> },
            { id: 'settings', label: 'Settings', icon: <Shield className="w-4 h-4" /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                selectedTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {selectedTab === 'overview' && (
          <div className="space-y-8">
            {/* Statistics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total Transfers Monitored"
                value={statistics.totalTransfers || 0}
                icon={<Activity className="w-6 h-6" />}
                trend={12}
                color="bg-blue-900/30 text-blue-400"
              />
              <StatCard
                title="Flagged Transfers"
                value={statistics.flaggedTransfers || 0}
                icon={<AlertTriangle className="w-6 h-6" />}
                color="bg-orange-900/30 text-orange-400"
              />
              <StatCard
                title="Blacklisted Addresses"
                value={statistics.blacklistedAddresses || 0}
                icon={<XCircle className="w-6 h-6" />}
                color="bg-red-900/30 text-red-400"
              />
              <StatCard
                title="Detection Accuracy"
                value="94.2%"
                icon={<Shield className="w-6 h-6" />}
                trend={2.1}
                color="bg-green-900/30 text-green-400"
              />
            </div>

            {/* Recent Alerts */}
            <div className="dark-card rounded-xl p-6 border border-gray-800">
              <h2 className="text-xl font-bold text-white mb-6">Recent Alerts</h2>
              <div className="space-y-4">
                {alerts.slice(0, 3).map((alert) => (
                  <AlertCard key={alert.id} alert={alert} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Alerts Tab */}
        {selectedTab === 'alerts' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search alerts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
              <select
                value={filterSeverity}
                onChange={(e) => setFilterSeverity(e.target.value)}
                className="px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:border-blue-500"
              >
                <option value="all">All Severities</option>
                <option value="CRITICAL">Critical</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>
            </div>

            {/* Alerts List */}
            <div>
              {filteredAlerts.length > 0 ? (
                filteredAlerts.map((alert) => (
                  <AlertCard key={alert.id} alert={alert} />
                ))
              ) : (
                <div className="text-center py-12">
                  <Shield className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">No alerts found</h3>
                  <p className="text-gray-400">No alerts match your current filters</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Analysis Tab */}
        {selectedTab === 'analysis' && (
          <div className="space-y-6">
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-6">Fraud Analysis Tools</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Address Analysis</h3>
                  <input
                    type="text"
                    placeholder="Enter wallet address..."
                    className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  />
                  <button className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                    Analyze Address
                  </button>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Event Validation</h3>
                  <input
                    type="text"
                    placeholder="Enter event ID..."
                    className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  />
                  <button className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
                    Validate Event
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {selectedTab === 'settings' && (
          <div className="space-y-6">
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-6">Detection Settings</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Risk Thresholds</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Low Risk</label>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        defaultValue="0.3"
                        className="w-full"
                      />
                      <span className="text-sm text-gray-400">0.3</span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Medium Risk</label>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        defaultValue="0.6"
                        className="w-full"
                      />
                      <span className="text-sm text-gray-400">0.6</span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">High Risk</label>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        defaultValue="0.8"
                        className="w-full"
                      />
                      <span className="text-sm text-gray-400">0.8</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Blacklist Management</h3>
                  <div className="flex space-x-4">
                    <input
                      type="text"
                      placeholder="Enter address to blacklist..."
                      className="flex-1 px-4 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                    />
                    <button className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
                      Add to Blacklist
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default FraudDetectionDashboard