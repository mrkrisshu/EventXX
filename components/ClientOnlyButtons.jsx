'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Menu, X } from 'lucide-react'
import { useAppStore } from '../lib/store'
import { ConnectButton } from '@rainbow-me/rainbowkit'

// Client-only Create Event Button
export function ClientOnlyCreateEventButton() {
  const [hasMounted, setHasMounted] = useState(false)
  const { setIsCreateEventModalOpen } = useAppStore()

  useEffect(() => {
    setHasMounted(true)
  }, [])

  if (!hasMounted) {
    return null
  }

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => setIsCreateEventModalOpen(true)}
      className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-xl hover:shadow-2xl border-2 border-blue-400/50 hover:border-blue-300 backdrop-blur-sm"
    >
      <Plus className="w-4 h-4" />
      <span>Create Event</span>
    </motion.button>
  )
}

// Client-only Desktop Buttons Container
export function ClientOnlyDesktopButtons() {
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  if (!hasMounted) {
    return null
  }

  return (
    <div className="hidden lg:flex items-center space-x-4">
      <ConnectButton />
    </div>
  )
}

// Client-only Mobile Menu Button
export function ClientOnlyMobileMenuButton({ isOpen, setIsOpen }) {
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  if (!hasMounted) {
    return null
  }

  return (
    <button
      onClick={() => setIsOpen(!isOpen)}
      className="lg:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-all duration-200 touch:active:scale-95 touch:active:bg-white/20"
      aria-label={isOpen ? 'Close menu' : 'Open menu'}
    >
      <motion.div
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={{ duration: 0.2 }}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </motion.div>
    </button>
  )
}

// Client-only Mobile Create Event Button
export function ClientOnlyMobileCreateEventButton({ setIsOpen }) {
  const [hasMounted, setHasMounted] = useState(false)
  const { setIsCreateEventModalOpen } = useAppStore()

  useEffect(() => {
    setHasMounted(true)
  }, [])

  if (!hasMounted) {
    return null
  }

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => {
        setIsCreateEventModalOpen(true)
        setIsOpen(false)
      }}
      className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-3 rounded-lg font-semibold transition-all duration-200 shadow-xl hover:shadow-2xl border-2 border-blue-400/50 hover:border-blue-300 backdrop-blur-sm"
    >
      <Plus className="w-5 h-5" />
      <span>Create Event</span>
    </motion.button>
  )
}