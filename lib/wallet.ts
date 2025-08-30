import { ethers, BrowserProvider, JsonRpcSigner } from 'ethers'
import { AVALANCHE_CONFIG, getEventTicketsContract } from './contracts'

// Extend Window interface to include ethereum
declare global {
  interface Window {
    ethereum?: any
  }
}

// Wallet connection state
export interface WalletState {
  isConnected: boolean
  address: string | null
  balance: string | null
  chainId: number | null
  provider: BrowserProvider | null
  signer: JsonRpcSigner | null
}

// Event interface
export interface Event {
  id: number
  name: string
  description: string
  organizer: string
  price: string
  maxTickets: number
  soldTickets: number
  eventDate: number
  location: string
  isActive: boolean
}

// Ticket interface
export interface Ticket {
  tokenId: number
  eventId: number
  owner: string
  isUsed: boolean
  eventName: string
  eventDate: number
  location: string
}

class WalletService {
  private provider: BrowserProvider | null = null
  private signer: JsonRpcSigner | null = null
  private contract: ethers.Contract | null = null

  // Check if MetaMask is installed
  isMetaMaskInstalled(): boolean {
    return typeof window !== 'undefined' && typeof window.ethereum !== 'undefined'
  }

  // Connect to MetaMask wallet
  async connectWallet(): Promise<WalletState> {
    if (!this.isMetaMaskInstalled()) {
      throw new Error('MetaMask is not installed. Please install MetaMask to continue.')
    }

    try {
      // Request account access
      await window.ethereum.request({ method: 'eth_requestAccounts' })
      
      // Create provider and signer
      this.provider = new BrowserProvider(window.ethereum)
      this.signer = await this.provider.getSigner()
      
      // Get wallet info
      const address = await this.signer.getAddress()
      const balance = await this.provider.getBalance(address)
      const network = await this.provider.getNetwork()
      
      // Initialize contract
      this.contract = getEventTicketsContract(this.signer, Number(network.chainId) === 43113)
      
      return {
        isConnected: true,
        address,
        balance: ethers.formatEther(balance),
        chainId: Number(network.chainId),
        provider: this.provider,
        signer: this.signer
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error)
      throw error
    }
  }

  // Switch to Avalanche network
  async switchToAvalanche(): Promise<boolean> {
    try {
      if (!window.ethereum) throw new Error('MetaMask not found')
      
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: AVALANCHE_CONFIG.chainId }],
      })
      
      return true
    } catch (error: any) {
      // If the chain hasn't been added to MetaMask, add it
      if (error.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [AVALANCHE_CONFIG],
          })
          return true
        } catch (addError) {
          console.error('Failed to add Avalanche network:', addError)
          return false
        }
      }
      console.error('Failed to switch to Avalanche network:', error)
      return false
    }
  }

  // Get current wallet state
  async getWalletState(): Promise<WalletState> {
    if (!this.provider || !this.signer) {
      return {
        isConnected: false,
        address: null,
        balance: null,
        chainId: null,
        provider: null,
        signer: null
      }
    }

    try {
      const address = await this.signer.getAddress()
      const balance = await this.provider.getBalance(address)
      const network = await this.provider.getNetwork()
      
      return {
        isConnected: true,
        address,
        balance: ethers.formatEther(balance),
        chainId: Number(network.chainId),
        provider: this.provider,
        signer: this.signer
      }
    } catch (error) {
      console.error('Failed to get wallet state:', error)
      return {
        isConnected: false,
        address: null,
        balance: null,
        chainId: null,
        provider: null,
        signer: null
      }
    }
  }

  // Create a new event
  async createEvent(
    name: string,
    description: string,
    price: string,
    maxTickets: number,
    eventDate: Date,
    location: string
  ): Promise<number> {
    if (!this.contract || !this.signer) {
      throw new Error('Contract not initialized or wallet not connected')
    }

    try {
      const priceInWei = ethers.parseEther(price)
      const eventTimestamp = Math.floor(eventDate.getTime() / 1000)
      
      const tx = await this.contract.createEvent(
        name,
        description,
        priceInWei,
        maxTickets,
        eventTimestamp,
        location
      )
      
      const receipt = await tx.wait()
      
      // Extract event ID from the EventCreated event
      const eventCreatedLog = receipt?.logs?.find(
        (log: any) => {
          try {
            const parsed = this.contract?.interface.parseLog(log)
            return parsed?.name === 'EventCreated'
          } catch {
            return false
          }
        }
      )
      
      if (eventCreatedLog) {
        const parsed = this.contract?.interface.parseLog(eventCreatedLog)
        return Number(parsed?.args.eventId)
      }
      
      throw new Error('Event creation failed - no event ID returned')
    } catch (error) {
      console.error('Failed to create event:', error)
      throw error
    }
  }

  // Buy a ticket for an event
  async buyTicket(eventId: number): Promise<number> {
    if (!this.contract || !this.signer) {
      throw new Error('Contract not initialized or wallet not connected')
    }

    try {
      // Get event details to determine price
      const event = await this.contract.getEvent(eventId.toString()) as any
      
      const tx = await this.contract.buyTicket(eventId, {
        value: event.price
      })
      
      const receipt = await tx.wait()
      
      // Extract token ID from the TicketPurchased event
      const ticketPurchasedLog = receipt?.logs?.find(
        (log: any) => {
          try {
            const parsed = this.contract?.interface.parseLog(log)
            return parsed?.name === 'TicketPurchased'
          } catch {
            return false
          }
        }
      )
      
      if (ticketPurchasedLog) {
        const parsed = this.contract?.interface.parseLog(ticketPurchasedLog)
        return Number(parsed?.args.tokenId)
      }
      
      throw new Error('Ticket purchase failed - no token ID returned')
    } catch (error) {
      console.error('Failed to buy ticket:', error)
      throw error
    }
  }

  // Get event details
  async getEvent(eventId: number): Promise<Event> {
    if (!this.contract) {
      throw new Error('Contract not initialized')
    }

    try {
      const eventData = await this.contract.getEvent(eventId.toString()) as any
      
      return {
        id: Number(eventData.id),
        name: eventData.name,
        description: eventData.description,
        organizer: eventData.organizer,
        price: ethers.formatEther(eventData.price),
        maxTickets: Number(eventData.maxTickets),
        soldTickets: Number(eventData.soldTickets),
        eventDate: Number(eventData.eventDate),
        location: eventData.location,
        isActive: eventData.isActive
      }
    } catch (error) {
      console.error('Failed to get event:', error)
      throw error
    }
  }

  // Get user's tickets
  async getUserTickets(address?: string): Promise<Ticket[]> {
    if (!this.contract) {
      throw new Error('Contract not initialized')
    }

    try {
      const userAddress = address || await this.signer?.getAddress()
      if (!userAddress) {
        throw new Error('No address provided and wallet not connected')
      }
      
      const tokenIds = await this.contract.getUserTickets(userAddress)
      const tickets: Ticket[] = []
      
      for (const tokenId of tokenIds) {
        const isUsed = await this.contract.isTicketUsed(tokenId)
        // Note: You'll need to implement a way to get eventId from tokenId
        // This might require additional contract methods or event parsing
        
        tickets.push({
          tokenId: Number(tokenId),
          eventId: 0, // TODO: Implement eventId retrieval
          owner: userAddress,
          isUsed,
          eventName: '', // TODO: Get from event details
          eventDate: 0, // TODO: Get from event details
          location: '' // TODO: Get from event details
        })
      }
      
      return tickets
    } catch (error) {
      console.error('Failed to get user tickets:', error)
      throw error
    }
  }

  // Use a ticket (mark as used)
  async useTicket(tokenId: number): Promise<void> {
    if (!this.contract || !this.signer) {
      throw new Error('Contract not initialized or wallet not connected')
    }

    try {
      const tx = await this.contract.useTicket(tokenId)
      await tx.wait()
    } catch (error) {
      console.error('Failed to use ticket:', error)
      throw error
    }
  }

  // Check if ticket is used
  async isTicketUsed(tokenId: number): Promise<boolean> {
    if (!this.contract) {
      throw new Error('Contract not initialized')
    }

    try {
      return await this.contract.isTicketUsed(tokenId)
    } catch (error) {
      console.error('Failed to check ticket status:', error)
      throw error
    }
  }

  // Disconnect wallet
  disconnect(): void {
    this.provider = null
    this.signer = null
    this.contract = null
  }
}

// Create singleton instance
export const walletService = new WalletService()

// Helper function to format date
export function formatEventDate(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Helper function to get time until event
export function getTimeUntilEvent(timestamp: number): string {
  const now = Date.now()
  const eventTime = timestamp * 1000
  const diff = eventTime - now
  
  if (diff <= 0) {
    return 'Event has started'
  }
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  
  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m`
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`
  } else {
    return `${minutes}m`
  }
}

// Helper function to generate QR code data for ticket
export function generateTicketQRData(tokenId: number, eventId: number, owner: string): string {
  return JSON.stringify({
    tokenId,
    eventId,
    owner,
    timestamp: Date.now(),
    type: 'EventXX_Ticket'
  })
}