'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Play, Sparkles, Users, Calendar, Shield, Zap } from 'lucide-react'
import Link from 'next/link'
import { ClientOnlyConnectButtonCustom } from './ClientOnlyConnectButton'

const floatingElements = [
  { id: 1, x: '10%', y: '20%', delay: 0 },
  { id: 2, x: '80%', y: '10%', delay: 0.5 },
  { id: 3, x: '70%', y: '70%', delay: 1 },
  { id: 4, x: '20%', y: '80%', delay: 1.5 },
  { id: 5, x: '90%', y: '50%', delay: 2 },
]

export function HeroSection() {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)

  return (
    <section className="relative min-h-screen bg-purple-gradient overflow-hidden flex items-center pt-24">
      {/* Minimal Background */}
      <div className="absolute inset-0">
        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='20' cy='20' r='0.5'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-center lg:text-left"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="inline-flex items-center px-4 py-2 rounded-full glass-effect border border-white/20 mb-8"
            >
              <Zap className="w-4 h-4 text-yellow-400 mr-2" />
              <span className="text-white/90 text-sm font-medium">Powered by Avalanche</span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="text-5xl md:text-6xl lg:text-7xl font-light text-white mb-6 leading-tight tracking-tight"
            >
              Secure Event
              <br />
              <span className="text-white">
                Ticketing
              </span>
              <br />
              on Blockchain
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="text-lg md:text-xl text-gray-400 mb-8 max-w-2xl font-light"
            >
              Buy, sell, and verify event tickets as NFTs. No fraud, no counterfeits, just pure blockchain security.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1 }}
              className="flex flex-col sm:flex-row gap-4 mb-12"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center"
              >
                <ClientOnlyConnectButtonCustom>
                  {({ account, chain, openAccountModal, openChainModal, openConnectModal, mounted }) => {
                    const ready = mounted
                    const connected = ready && account && chain

                    return (
                      <div
                        {...(!ready && {
                          'aria-hidden': true,
                          'style': {
                            opacity: 0,
                            pointerEvents: 'none',
                            userSelect: 'none',
                          },
                        })}
                      >
                        {(() => {
                          if (!connected) {
                            return (
                              <button onClick={openConnectModal} className="btn-primary group flex items-center justify-center">
                                Connect Wallet
                                <Zap className="w-5 h-5 ml-2 group-hover:scale-110 transition-transform" />
                              </button>
                            )
                          }

                          if (chain.unsupported) {
                            return (
                              <button onClick={openChainModal} className="btn-secondary group flex items-center justify-center">
                                Wrong network
                              </button>
                            )
                          }

                          return (
                            <div className="flex gap-3">
                              <button
                                onClick={openChainModal}
                                className="btn-secondary flex items-center justify-center"
                              >
                                {chain.hasIcon && (
                                  <div
                                    style={{
                                      background: chain.iconBackground,
                                      width: 20,
                                      height: 20,
                                      borderRadius: 999,
                                      overflow: 'hidden',
                                      marginRight: 8,
                                    }}
                                  >
                                    {chain.iconUrl && (
                                      <img
                                        alt={chain.name ?? 'Chain icon'}
                                        src={chain.iconUrl}
                                        style={{ width: 20, height: 20 }}
                                      />
                                    )}
                                  </div>
                                )}
                                {chain.name}
                              </button>

                              <button onClick={openAccountModal} className="btn-primary flex items-center justify-center">
                                {account.displayName}
                                {account.displayBalance
                                  ? ` (${account.displayBalance})`
                                  : ''}
                              </button>
                            </div>
                          )
                        })()}
                      </div>
                    )
                  }}
                </ClientOnlyConnectButtonCustom>
              </motion.div>
              
              <Link href="/events">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-secondary group flex items-center justify-center"
                >
                  Explore Events
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.2 }}
              className="grid grid-cols-3 gap-8 text-center lg:text-left"
            >
              <div>
                <div className="text-3xl font-bold text-white mb-1">10K+</div>
                <div className="text-white/60 text-sm">Events Created</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white mb-1">500K+</div>
                <div className="text-white/60 text-sm">Tickets Sold</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white mb-1">99.9%</div>
                <div className="text-white/60 text-sm">Uptime</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content - 3D Visual */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="relative flex items-center justify-center"
          >
            {/* Main Card */}
            <motion.div
              animate={{
                rotateY: [0, 5, 0, -5, 0],
                rotateX: [0, 2, 0, -2, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="relative"
            >
              <div className="w-80 h-96 glass-effect rounded-3xl border border-white/20 p-8 shadow-2xl">
                {/* Ticket Preview */}
                <div className="bg-gradient-to-br from-blue-500/20 to-gray-600/20 rounded-2xl p-6 mb-6 border border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <Sparkles className="w-6 h-6 text-blue-400" />
                    <span className="text-white/60 text-sm">#NFT001</span>
                  </div>
                  <h3 className="text-white font-bold text-lg mb-2">Blockchain Summit 2024</h3>
                  <p className="text-white/60 text-sm mb-4">San Francisco, CA</p>
                  <div className="flex justify-between items-center">
                    <span className="text-white font-semibold">0.5 AVAX</span>
                    <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-gray-600 rounded" />
                    </div>
                  </div>
                </div>
                
                {/* Features List */}
                <div className="space-y-3">
                  <div className="flex items-center text-white/80">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-3" />
                    <span className="text-sm">Blockchain Verified</span>
                  </div>
                  <div className="flex items-center text-white/80">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mr-3" />
                    <span className="text-sm">Instant Transfer</span>
                  </div>
                  <div className="flex items-center text-white/80">
                    <div className="w-2 h-2 bg-gray-400 rounded-full mr-3" />
                    <span className="text-sm">QR Code Entry</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Floating Cards */}
            <motion.div
              animate={{
                y: [0, -10, 0],
                rotate: [0, 2, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: 1,
              }}
              className="absolute -top-8 -left-8 w-24 h-32 glass-effect rounded-xl border border-white/20 p-3"
            >
              <div className="w-full h-full bg-gradient-to-br from-green-400/20 to-emerald-600/20 rounded-lg" />
            </motion.div>

            <motion.div
              animate={{
                y: [0, 10, 0],
                rotate: [0, -2, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                delay: 2,
              }}
              className="absolute -bottom-8 -right-8 w-24 h-32 glass-effect rounded-xl border border-white/20 p-3"
            >
              <div className="w-full h-full bg-gradient-to-br from-pink-400/20 to-rose-600/20 rounded-lg" />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-3 bg-white/60 rounded-full mt-2"
          />
        </motion.div>
      </motion.div>
    </section>
  )
}