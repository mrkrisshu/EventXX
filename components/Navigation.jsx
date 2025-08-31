'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Home, Calendar, Settings, User, QrCode, Shield } from 'lucide-react'
import Link from 'next/link'
import { useAppStore } from '../lib/store'
import { ClientOnlyConnectButton } from './ClientOnlyConnectButton'
import { ClientOnlyMobileMenuButton, ClientOnlyDesktopButtons } from './ClientOnlyButtons'
import ClientOnly from './ClientOnly'

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [isMounted, setIsMounted] = useState(false)
  
  useEffect(() => {
    setIsMounted(true)
    
    const controlNavbar = () => {
      const currentScrollY = window.scrollY
      
      // Show navbar when scrolling up or at the top
      if (currentScrollY < lastScrollY || currentScrollY < 10) {
        setIsVisible(true)
      } 
      // Hide navbar when scrolling down and not at the top
      else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false)
        setIsOpen(false) // Close mobile menu when hiding
      }
      
      setLastScrollY(currentScrollY)
    }

    const handleMouseMove = (e) => {
      // Show navbar when mouse is near the top of the screen
      if (e.clientY < 100) {
        setIsVisible(true)
      }
    }

    window.addEventListener('scroll', controlNavbar)
    window.addEventListener('mousemove', handleMouseMove)
    
    return () => {
      window.removeEventListener('scroll', controlNavbar)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [lastScrollY])

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/events', label: 'Events', icon: Calendar },
    { href: '/marketplace', label: 'Marketplace', icon: User },
    { href: '/organizer', label: 'Organizer', icon: Settings },
    { href: '/verify', label: 'Verify', icon: QrCode },
    { href: '/admin/fraud-detection', label: 'Security', icon: Shield },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-gray-900" suppressHydrationWarning>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8" suppressHydrationWarning>
        <div className="flex items-center justify-between h-14 sm:h-16" suppressHydrationWarning>
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 touch:active:scale-95 transition-transform">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xs sm:text-sm">EX</span>
            </div>
            <span className="text-white font-bold text-lg sm:text-xl">EventXX</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center space-x-2 text-white/70 hover:text-white transition-all duration-200 hover:scale-105 px-3 py-2 rounded-lg hover:bg-white/10"
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              )
            })}
          </div>

          {/* Desktop Connect Button (Create Event removed) */}
          <ClientOnlyDesktopButtons />

          {/* Mobile Menu Button */}
          <ClientOnlyMobileMenuButton isOpen={isOpen} setIsOpen={setIsOpen} />
        </div>

        {/* Wrap dynamic content in ClientOnly to prevent hydration errors */}
        <ClientOnly>
          {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="lg:hidden overflow-hidden bg-black/30 backdrop-blur-sm border-t border-gray-900"
          >
            <div className="py-4 px-2 space-y-2">
              {navItems.map((item, index) => {
                const Icon = item.icon
                return (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center space-x-3 text-white/80 hover:text-white transition-all duration-200 py-3 px-4 rounded-lg hover:bg-white/10 touch:active:scale-95 touch:active:bg-white/20"
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  </motion.div>
                )
              })}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: navItems.length * 0.1 }}
                className="pt-4 px-4 border-t border-white/10 space-y-3"
              >
                {/* Create Event button removed on mobile */}
                <ClientOnlyConnectButton />
              </motion.div>
            </div>
          </motion.div>
        )}
        </ClientOnly>
      </div>
    </nav>
  )
}