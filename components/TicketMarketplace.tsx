'use client'

import { useState, useEffect } from 'react'
import { useAppStore } from '@/lib/store'
import { Ticket, Event } from '@/lib/wallet'
import { formatEventDate, getTimeUntilEvent } from '@/lib/wallet'
import { MetadataService } from '@/lib/metadata'
import { AlertCircle, ExternalLink, Share2, Eye, ShoppingCart, Tag } from 'lucide-react'
import QRCode from 'qrcode'
import Image from 'next/image'

interface MarketplaceListing {
  ticketId: number
  eventId: number
  seller: string
  price: string
  originalPrice: string
  eventName: string
  eventDate: number
  location: string
  seatNumber?: string
  isVerified: boolean
  listingDate: number
}

export default function TicketMarketplace() {
  const { events, userTickets: tickets, wallet, buyTicket, transferTicket, addNotification, connectWallet, isConnecting, loadUserTickets, loadEvents } = useAppStore()
  const [activeTab, setActiveTab] = useState('browse')
  const [listings, setListings] = useState<MarketplaceListing[]>([])
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [resalePrice, setResalePrice] = useState('')
  const [isListingForSale, setIsListingForSale] = useState(false)
  const [qrCodeUrl, setQrCodeUrl] = useState('')
  const [showQRModal, setShowQRModal] = useState(false)
  const [selectedTicketForQR, setSelectedTicketForQR] = useState<{ticket: Ticket, event: Event} | null>(null)

  // Ensure events and user tickets are loaded
  useEffect(() => {
    loadEvents()
  }, [])

  useEffect(() => {
    if (wallet.isConnected) {
      loadUserTickets()
    }
  }, [wallet.isConnected])

  // Mock marketplace listings for demo
  useEffect(() => {
    const mockListings: MarketplaceListing[] = [
      {
        ticketId: 101,
        eventId: 1,
        seller: '0x1234...5678',
        price: '0.08',
        originalPrice: '0.1',
        eventName: 'Tech Conference 2024',
        eventDate: Date.now() + 7 * 24 * 60 * 60 * 1000,
        location: 'Convention Center',
        seatNumber: 'A-15',
        isVerified: true,
        listingDate: Date.now() - 2 * 24 * 60 * 60 * 1000
      },
      {
        ticketId: 102,
        eventId: 2,
        seller: '0x9876...4321',
        price: '0.15',
        originalPrice: '0.2',
        eventName: 'Music Festival',
        eventDate: Date.now() + 14 * 24 * 60 * 60 * 1000,
        location: 'Central Park',
        isVerified: true,
        listingDate: Date.now() - 1 * 24 * 60 * 60 * 1000
      }
    ]
    setListings(mockListings)
  }, [])

  const generateTicketQR = async (ticket: Ticket, event: Event) => {
    try {
      const qrData = {
        ticketId: ticket.tokenId,
        eventId: ticket.eventId,
        owner: ticket.owner,
        eventName: event.name,
        eventDate: event.eventDate
      }
      
      const qrString = await QRCode.toDataURL(JSON.stringify(qrData))
      setQrCodeUrl(qrString)
      setSelectedTicketForQR({ticket, event})
      setShowQRModal(true)
    } catch (error) {
      console.error('Failed to generate QR code:', error)
    }
  }

  const handleListForSale = async () => {
    if (!selectedTicket || !resalePrice) return

    setIsListingForSale(true)
    try {
      const event = (events || []).find(e => e.id === selectedTicket.eventId)
      if (!event) throw new Error('Event not found')

      const newListing: MarketplaceListing = {
        ticketId: selectedTicket.tokenId,
        eventId: selectedTicket.eventId,
        seller: wallet.address || '',
        price: resalePrice,
        originalPrice: event.price,
        eventName: event.name,
        eventDate: event.eventDate,
        location: event.location,
        isVerified: true,
        listingDate: Date.now()
      }

      setListings(prev => [newListing, ...prev])
      setSelectedTicket(null)
      setResalePrice('')
      
      addNotification({
        type: 'success',
        title: 'Ticket Listed',
        message: 'Your ticket has been listed on the marketplace!'
      })
    } catch (error: any) {
      addNotification({
        type: 'error',
        title: 'Listing Failed',
        message: error.message || 'Failed to list ticket'
      })
    } finally {
      setIsListingForSale(false)
    }
  }

  const handleBuyFromMarketplace = async (listing: MarketplaceListing) => {
    if (!wallet.isConnected) {
      addNotification({
        type: 'error',
        title: 'Wallet Not Connected',
        message: 'Please connect your wallet to purchase tickets'
      })
      return
    }

    try {
      // Mint a new ticket for this event (no on-chain marketplace yet)
      await buyTicket(listing.eventId)
      
      // Refresh user tickets to show the newly purchased ticket
      await loadUserTickets()
      
      addNotification({
        type: 'success',
        title: 'Purchase Successful',
        message: `You have purchased a ticket for ${listing.eventName}!`
      })
      
      // Remove the listing from the marketplace UI
      setListings(prev => prev.filter(l => l.ticketId !== listing.ticketId))
    } catch (error: any) {
      addNotification({
        type: 'error',
        title: 'Purchase Failed',
        message: error.message || 'Failed to purchase ticket'
      })
    }
  }

  const userTickets = (tickets || []).filter(ticket => 
    ticket.owner === wallet.address && !ticket.isUsed
  )

  return (
    <div className="min-h-screen bg-purple-gradient pt-24">
      <div className="container mx-auto px-4 py-4">
        <div className="mb-8">
          <h1 className="text-4xl font-light text-white mb-2">Ticket Marketplace</h1>
          <p className="text-gray-400 text-lg">
            Buy and sell event tickets securely on the blockchain
          </p>
        </div>

        {/* Tabs */}
        <div className="w-full">
          <div className="grid w-full grid-cols-3 glass-effect rounded-lg p-1 mb-6">
            <button
              onClick={() => setActiveTab('browse')}
              className={`py-3 px-4 rounded-md text-sm font-medium transition-all duration-300 ${
                activeTab === 'browse' ? 'bg-white/20 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              Browse Tickets
            </button>
            <button
              onClick={() => setActiveTab('my-tickets')}
              className={`py-3 px-4 rounded-md text-sm font-medium transition-all duration-300 ${
                activeTab === 'my-tickets' ? 'bg-white/20 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              My Tickets
            </button>
            <button
              onClick={() => setActiveTab('sell')}
              className={`py-3 px-4 rounded-md text-sm font-medium transition-all duration-300 ${
                activeTab === 'sell' ? 'bg-white/20 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              Sell Tickets
            </button>
          </div>
        </div>

        {/* Wallet Connection Prompt */}
        {!wallet.isConnected && (
          <div className="glass-effect rounded-lg border border-white/20 p-6 mb-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-white mb-2">Connect Your Wallet</h3>
              <p className="text-gray-400 mb-4">Connect your wallet to buy tickets from the marketplace</p>
              <button
                onClick={connectWallet}
                disabled={isConnecting}
                className="btn-primary"
              >
                {isConnecting ? 'Connecting...' : 'Connect Wallet'}
              </button>
            </div>
          </div>
        )}

        {/* Browse Tab */}
        {activeTab === 'browse' && (
          <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {listings.map((listing) => (
                <div key={listing.ticketId} className="glass-effect rounded-lg border border-white/20 overflow-hidden card-hover">
                  <div className="p-6 pb-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-semibold text-white">{listing.eventName}</h3>
                        <p className="text-sm text-gray-400 mt-2">
                          {formatEventDate(listing.eventDate)}
                        </p>
                      </div>
                      {listing.isVerified && (
                        <span className="bg-green-500/20 text-green-400 text-xs px-3 py-1 rounded-full border border-green-500/30">
                          Verified
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="p-6 pt-2 space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Location:</span>
                        <span className="text-white">{listing.location}</span>
                      </div>
                      {listing.seatNumber && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Seat:</span>
                          <span className="text-white">{listing.seatNumber}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Seller:</span>
                        <span className="font-mono text-blue-400">{listing.seller}</span>
                      </div>
                    </div>
                    
                    <div className="border-t border-white/10 pt-4">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-2xl font-bold text-white">{listing.price} AVAX</span>
                        <span className="text-sm text-gray-500 line-through">
                          {listing.originalPrice} AVAX
                        </span>
                      </div>
                      <button 
                        onClick={() => handleBuyFromMarketplace(listing)}
                        className={`w-full flex items-center justify-center py-3 px-4 rounded-md font-medium transition-all duration-300 ${
                          wallet.isConnected 
                            ? 'btn-primary hover:bg-blue-600' 
                            : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        }`}
                        disabled={!wallet.isConnected}
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        {wallet.isConnected ? 'Buy Ticket' : 'Connect Wallet to Buy'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {listings.length === 0 && (
              <div className="text-center py-16">
                <Tag className="w-16 h-16 mx-auto text-gray-600 mb-6" />
                <h3 className="text-2xl font-light text-white mb-3">No tickets available</h3>
                <p className="text-gray-400 text-lg">Check back later for new listings!</p>
              </div>
            )}
          </div>
        )}

        {/* My Tickets Tab */}
        {activeTab === 'my-tickets' && (
          <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {userTickets.map((ticket) => {
                const event = (events || []).find(e => e.id === ticket.eventId)
                if (!event) return null

                return (
                  <div key={ticket.tokenId} className="glass-effect rounded-lg border border-white/20 overflow-hidden card-hover">
                    <div className="p-6 pb-4">
                      <h3 className="text-xl font-semibold text-white">{event.name}</h3>
                      <p className="text-sm text-gray-400 mt-2">
                        {formatEventDate(event.eventDate)}
                      </p>
                    </div>
                    <div className="p-6 pt-2 space-y-4">
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Ticket ID:</span>
                          <span className="text-white font-mono">#{ticket.tokenId}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Location:</span>
                          <span className="text-white">{event.location}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Status:</span>
                          <span className={`px-3 py-1 rounded-full text-xs border ${
                            ticket.isUsed ? 'bg-gray-500/20 text-gray-400 border-gray-500/30' : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                          }`}>
                            {ticket.isUsed ? 'Used' : 'Valid'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex gap-3">
                        <button 
                          className="flex-1 glass-effect border border-white/20 text-white py-3 px-4 rounded-md hover:bg-white/10 transition-all duration-300 flex items-center justify-center text-sm"
                          onClick={() => generateTicketQR(ticket, event)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </button>
                        
                        <button 
                          className="flex-1 glass-effect border border-white/20 text-white py-3 px-4 rounded-md hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center text-sm"
                          onClick={() => setSelectedTicket(ticket)}
                          disabled={ticket.isUsed}
                        >
                          <Share2 className="w-4 h-4 mr-2" />
                          Sell
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
            
            {userTickets.length === 0 && (
              <div className="text-center py-16">
                <AlertCircle className="w-16 h-16 mx-auto text-gray-600 mb-6" />
                <h3 className="text-2xl font-light text-white mb-3">No tickets found</h3>
                <p className="text-gray-400 text-lg">Purchase tickets from events to see them here.</p>
              </div>
            )}
          </div>
        )}

        {/* Sell Tab */}
        {activeTab === 'sell' && (
          <div className="space-y-6">
            {selectedTicket ? (
              <div className="max-w-md mx-auto glass-effect rounded-lg border border-white/20">
                <div className="p-6 border-b border-white/10">
                  <h3 className="text-xl font-semibold text-white">List Ticket for Sale</h3>
                </div>
                <div className="p-6 space-y-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-400">Ticket ID</label>
                    <input 
                      value={`#${selectedTicket.tokenId}`} 
                      disabled 
                      className="w-full px-4 py-3 border border-white/20 rounded-md bg-white/5 text-gray-400 font-mono"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-400">Event</label>
                    <input 
                      value={(events || []).find(e => e.id === selectedTicket.eventId)?.name || ''} 
                      disabled 
                      className="w-full px-4 py-3 border border-white/20 rounded-md bg-white/5 text-gray-400"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="resale-price" className="block text-sm font-medium text-gray-400">Resale Price (AVAX)</label>
                    <input
                      id="resale-price"
                      type="number"
                      step="0.001"
                      placeholder="0.05"
                      value={resalePrice}
                      onChange={(e) => setResalePrice(e.target.value)}
                      className="w-full px-4 py-3 border border-white/20 rounded-md bg-white/5 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                    />
                  </div>
                  
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-md p-4">
                    <div className="flex">
                      <AlertCircle className="h-5 w-5 text-blue-400 mt-0.5 mr-3" />
                      <p className="text-sm text-blue-300">
                        A 2.5% platform fee will be deducted from the sale price.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <button 
                      onClick={() => setSelectedTicket(null)}
                      className="flex-1 glass-effect border border-white/20 text-white py-3 px-4 rounded-md hover:bg-white/10 transition-all duration-300"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleListForSale}
                      disabled={!resalePrice || isListingForSale}
                      className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isListingForSale ? 'Listing...' : 'List for Sale'}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-16">
                <Tag className="w-16 h-16 mx-auto text-gray-600 mb-6" />
                <h3 className="text-2xl font-light text-white mb-3">Select a ticket to sell</h3>
                <p className="text-gray-400 text-lg">Go to "My Tickets" tab and click "Sell" on any ticket.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* QR Code Modal */}
      {showQRModal && selectedTicketForQR && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="glass-effect border border-white/20 rounded-lg p-8 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-white">Ticket #{selectedTicketForQR.ticket.tokenId}</h3>
              <button 
                onClick={() => setShowQRModal(false)}
                className="text-gray-400 hover:text-white text-2xl transition-colors duration-300"
              >
                ×
              </button>
            </div>
            <div className="space-y-6">
              <div className="text-center bg-white rounded-lg p-4">
                {qrCodeUrl && (
                  <Image 
                    src={qrCodeUrl} 
                    alt="Ticket QR Code" 
                    width={256} 
                    height={256}
                    className="mx-auto"
                  />
                )}
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Event:</span>
                  <span className="text-white font-medium">{selectedTicketForQR.event.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Date:</span>
                  <span className="text-white">{formatEventDate(selectedTicketForQR.event.eventDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Location:</span>
                  <span className="text-white">{selectedTicketForQR.event.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Ticket ID:</span>
                  <span className="text-white font-mono">#{selectedTicketForQR.ticket.tokenId}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}