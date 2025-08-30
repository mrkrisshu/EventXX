import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { walletService, WalletState, Event, Ticket } from './wallet'
import { EventTicketsService, getProvider, connectWallet } from './contracts'

// Application state interface
interface AppState {
  // Wallet state
  wallet: WalletState
  isConnecting: boolean
  
  // Events state
  events: Event[]
  selectedEvent: Event | null
  isLoadingEvents: boolean
  
  // Tickets state
  userTickets: Ticket[]
  isLoadingTickets: boolean
  
  // UI state
  isCreateEventModalOpen: boolean
  isBuyTicketModalOpen: boolean
  isQRScannerOpen: boolean
  
  // Notifications
  notifications: Notification[]
  
  // Actions
  connectWallet: () => Promise<void>
  disconnectWallet: () => void
  switchNetwork: (isTestnet?: boolean) => Promise<void>
  refreshWalletState: () => Promise<void>
  
  // Event actions
  createEvent: (eventData: CreateEventData) => Promise<number>
  buyTicket: (eventId: number) => Promise<number>
  loadEvents: () => Promise<void>
  selectEvent: (event: Event | null) => void
  
  // Ticket actions
  loadUserTickets: () => Promise<void>
  useTicket: (tokenId: number) => Promise<void>
  transferTicket: (tokenId: number, to: string, price: string) => Promise<void>
  
  // UI actions
  setCreateEventModalOpen: (open: boolean) => void
  setBuyTicketModalOpen: (open: boolean) => void
  setQRScannerOpen: (open: boolean) => void
  
  // Notification actions
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void
  removeNotification: (id: string) => void
  clearNotifications: () => void
}

// Interfaces
interface CreateEventData {
  name: string
  description: string
  price: string
  maxTickets: number
  eventDate: Date
  location: string
}

interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  timestamp: number
}

// Initial wallet state
const initialWalletState: WalletState = {
  isConnected: false,
  address: null,
  balance: null,
  chainId: null,
  provider: null,
  signer: null
}

// Create the store
export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      wallet: initialWalletState,
      isConnecting: false,
      events: [],
      selectedEvent: null,
      isLoadingEvents: false,
      userTickets: [],
      isLoadingTickets: false,
      isCreateEventModalOpen: false,
      isBuyTicketModalOpen: false,
      isQRScannerOpen: false,
      notifications: [],

      // Wallet actions
      connectWallet: async () => {
        set({ isConnecting: true })
        try {
          const walletState = await walletService.connectWallet()
          set({ wallet: walletState, isConnecting: false })
          
          get().addNotification({
            type: 'success',
            title: 'Wallet Connected',
            message: `Connected to ${walletState.address?.slice(0, 6)}...${walletState.address?.slice(-4)}`
          })
          
          // Load user tickets after connecting
          get().loadUserTickets()
        } catch (error: any) {
          set({ isConnecting: false })
          get().addNotification({
            type: 'error',
            title: 'Connection Failed',
            message: error.message || 'Failed to connect wallet'
          })
          throw error;
        }
      },

      disconnectWallet: () => {
        walletService.disconnect()
        set({ 
          wallet: initialWalletState,
          userTickets: [],
          selectedEvent: null
        })
        
        get().addNotification({
          type: 'info',
          title: 'Wallet Disconnected',
          message: 'Your wallet has been disconnected'
        })
      },

      switchNetwork: async (isTestnet = true) => {
        try {
          const success = await walletService.switchToAvalanche()
          if (success) {
            await get().refreshWalletState()
            
            get().addNotification({
              type: 'success',
              title: 'Network Switched',
              message: 'Switched to Avalanche Fuji Testnet'
            })
          } else {
            throw new Error('Failed to switch network')
          }
        } catch (error: any) {
          get().addNotification({
            type: 'error',
            title: 'Network Switch Failed',
            message: error.message || 'Failed to switch network'
          })
          throw error
        }
      },

      refreshWalletState: async () => {
        try {
          const walletState = await walletService.getWalletState()
          set({ wallet: walletState })
        } catch (error: any) {
          console.error('Failed to refresh wallet state:', error)
        }
      },

      // Event actions
      createEvent: async (eventData: CreateEventData) => {
        try {
          if (!get().wallet.isConnected) {
            throw new Error('Please connect your wallet first')
          }
          
          // Get signer from wallet connection without overwriting wallet state
          const { signer } = await connectWallet()
          const provider = await getProvider(true) // Use Fuji testnet
          const eventService = new EventTicketsService(provider, signer)
          
          const result = await eventService.createEvent({
            name: eventData.name,
            description: eventData.description,
            price: eventData.price,
            maxTickets: eventData.maxTickets,
            eventDate: eventData.eventDate,
            location: eventData.location
          })
          
          const eventId = result.eventId
          
          get().addNotification({
            type: 'success',
            title: 'Event Created',
            message: `Event "${eventData.name}" has been created successfully on the blockchain!`
          })
          
          // Refresh wallet balance and events list
          get().refreshWalletState()
          get().loadEvents()
          
          return eventId
        } catch (error: any) {
          get().addNotification({
            type: 'error',
            title: 'Failed to Create Event',
            message: error.message || 'Failed to create event on blockchain'
          })
          throw error;
        }
      },

      buyTicket: async (eventId: number) => {
        const { wallet } = get()
        if (!wallet.isConnected || !wallet.address) {
          throw new Error('Wallet not connected')
        }

        try {
          console.log('Starting ticket purchase for event:', eventId)
          const provider = await getProvider(true) // Use Fuji testnet
          // Get signer from wallet connection without overwriting wallet state
          const { signer } = await connectWallet()
          console.log('Wallet connected, signer address:', await signer.getAddress())
          const eventService = new EventTicketsService(provider, signer)
          
          // Get event details to determine price
          const event = await eventService.getEvent(eventId)
          if (!event) {
            throw new Error('Event not found')
          }
          console.log('Event details:', event)
          console.log('Attempting to buy ticket with price:', event.price, 'AVAX')
          
          const result = await eventService.buyTicket(eventId, event.price)
          console.log('Purchase successful, result:', result)
          const tokenId = result.tokenId
          
          get().addNotification({
            type: 'success',
            title: 'Ticket Purchased',
            message: 'Your NFT ticket has been minted successfully on the blockchain!'
          })
          
          // Refresh wallet balance, events and tickets
          get().refreshWalletState()
          get().loadEvents()
          get().loadUserTickets()
          
          return tokenId
        } catch (error: any) {
          get().addNotification({
            type: 'error',
            title: 'Failed to Purchase Ticket',
            message: error.message || 'Failed to purchase ticket on blockchain'
          })
          throw error;
        }
      },

      loadEvents: async () => {
        set({ isLoadingEvents: true })
        try {
          // Try blockchain first, fallback to mock data if it fails
          let blockchainEvents: any[] = []
          
          try {
            console.log('Attempting blockchain connection...')
            const provider = await getProvider(true)
            console.log('Provider received:', provider ? 'Available' : 'Undefined')
            
            if (provider) {
              console.log('Creating EventTicketsService...')
              const eventService = new EventTicketsService(provider)
              console.log('Fetching events from blockchain...')
              blockchainEvents = await eventService.getAllEvents()
              console.log('Successfully loaded events from blockchain:', blockchainEvents.length)
            } else {
              throw new Error('Provider unavailable')
            }
          } catch (blockchainError) {
            console.warn('Blockchain connection failed, using mock data:', blockchainError.message)
            
            // Fallback to mock data for development/demo purposes
            blockchainEvents = [
              {
                id: 1,
                name: "Tech Conference 2024",
                description: "Annual technology conference featuring the latest in AI, blockchain, and web development. Join industry leaders and innovators for networking and learning.",
                organizer: "0x1234567890123456789012345678901234567890",
                price: "0.1",
                maxTickets: 100,
                soldTickets: 25,
                eventDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                location: "San Francisco Convention Center",
                isActive: true
              },
              {
                id: 2,
                name: "Summer Music Festival",
                description: "Three-day outdoor music festival featuring top artists from around the world. Food trucks, art installations, and camping available.",
                organizer: "0x2345678901234567890123456789012345678901",
                price: "0.05",
                maxTickets: 500,
                soldTickets: 150,
                eventDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
                location: "Golden Gate Park, San Francisco",
                isActive: true
              },
              {
                id: 3,
                name: "Blockchain Workshop",
                description: "Hands-on workshop covering smart contract development, DeFi protocols, and NFT creation. Perfect for developers and entrepreneurs.",
                organizer: "0x3456789012345678901234567890123456789012",
                price: "0.08",
                maxTickets: 50,
                soldTickets: 12,
                eventDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
                location: "Tech Hub Downtown",
                isActive: true
              },
              {
                id: 4,
                name: "Art Gallery Opening",
                description: "Exclusive opening of contemporary digital art gallery featuring NFT artists and interactive installations. Wine and networking included.",
                organizer: "0x4567890123456789012345678901234567890123",
                price: "0.03",
                maxTickets: 200,
                soldTickets: 45,
                eventDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
                location: "Modern Art Museum",
                isActive: true
              }
            ]
          }
          
          // Convert blockchain events to our Event interface
          const events: Event[] = blockchainEvents.map(event => ({
            id: event.id,
            name: event.name,
            description: event.description,
            organizer: event.organizer,
            price: event.price,
            maxTickets: event.maxTickets,
            soldTickets: event.soldTickets,
            eventDate: Math.floor(event.eventDate.getTime() / 1000),
            location: event.location,
            isActive: event.isActive
          }))
          
          set({ events, isLoadingEvents: false })
        } catch (error: any) {
          set({ isLoadingEvents: false })
          
          // Fallback to mock data if blockchain fails
          const mockEvents: Event[] = [
            {
              id: 1,
              name: 'Blockchain Conference 2024',
              description: 'The biggest blockchain conference of the year',
              organizer: '0x1234567890123456789012345678901234567890',
              price: '0.1',
              maxTickets: 1000,
              soldTickets: 750,
              eventDate: Math.floor(Date.now() / 1000) + 86400 * 30,
              location: 'San Francisco, CA',
              isActive: true
            },
            {
              id: 2,
              name: 'DeFi Summit',
              description: 'Exploring the future of decentralized finance',
              organizer: '0x0987654321098765432109876543210987654321',
              price: '0.05',
              maxTickets: 500,
              soldTickets: 200,
              eventDate: Math.floor(Date.now() / 1000) + 86400 * 15,
              location: 'New York, NY',
              isActive: true
            }
          ]
          
          set({ events: mockEvents })
          
          get().addNotification({
            type: 'warning',
            title: 'Using Mock Data',
            message: 'Could not load events from blockchain, using demo data'
          })
        }
      },

      selectEvent: (event: Event | null) => {
        set({ selectedEvent: event })
      },

      // Ticket actions
      loadUserTickets: async () => {
        const { wallet } = get()
        if (!wallet.isConnected || !wallet.address) return
        
        set({ isLoadingTickets: true })
        try {
          const provider = await getProvider(true) // Use Fuji testnet
          const eventService = new EventTicketsService(provider)
          
          const blockchainTickets = await eventService.getUserTickets(wallet.address)
          
          // Convert blockchain tickets to our Ticket interface
          const tickets: Ticket[] = blockchainTickets.map(ticket => ({
            tokenId: ticket.tokenId,
            eventId: ticket.eventId,
            owner: ticket.owner,
            isUsed: ticket.isUsed,
            eventName: ticket.eventName,
            eventDate: Math.floor(ticket.eventDate.getTime() / 1000),
            location: ticket.location
          }))
          
          set({ userTickets: tickets, isLoadingTickets: false })
        } catch (error: any) {
          set({ isLoadingTickets: false })
          
          // Fallback to empty array if blockchain fails
          set({ userTickets: [] })
          
          get().addNotification({
            type: 'warning',
            title: 'Could Not Load Tickets',
            message: 'Unable to load tickets from blockchain'
          })
        }
      },

      useTicket: async (tokenId: number) => {
        try {
          if (!get().wallet.isConnected) {
            throw new Error('Please connect your wallet first')
          }
          
          // Get signer from wallet connection without overwriting wallet state
          const { signer } = await connectWallet()
          
          const provider = await getProvider(true) // Use Fuji testnet
          const eventService = new EventTicketsService(provider, signer)
          
          await eventService.useTicket(tokenId)
          
          get().addNotification({
            type: 'success',
            title: 'Ticket Used',
            message: 'Ticket has been marked as used on the blockchain!'
          })
          
          // Refresh wallet balance and tickets
          get().refreshWalletState()
          get().loadUserTickets()
        } catch (error: any) {
          get().addNotification({
            type: 'error',
            title: 'Failed to Use Ticket',
            message: error.message || 'Failed to use ticket on blockchain'
          })
          throw error;
        }
      },

      transferTicket: async (tokenId: number, to: string, price: string) => {
        const { wallet } = get()
        if (!wallet.isConnected || !wallet.address) {
          throw new Error('Wallet not connected')
        }

        try {
          const provider = await getProvider(true) // Use Fuji testnet
          const { signer } = await connectWallet()
          const eventService = new EventTicketsService(provider, signer)
          
          await eventService.transferTicket(tokenId, to, price)
          
          get().addNotification({
            type: 'success',
            title: 'Ticket Transferred',
            message: 'Ticket has been successfully transferred on the blockchain!'
          })
          
          // Refresh wallet balance and tickets for both buyer and seller
          get().refreshWalletState()
          get().loadUserTickets()
        } catch (error: any) {
          get().addNotification({
            type: 'error',
            title: 'Failed to Transfer Ticket',
            message: error.message || 'Failed to transfer ticket on blockchain'
          })
          throw error;
        }
      },

      // UI actions
      setCreateEventModalOpen: (open: boolean) => {
        set({ isCreateEventModalOpen: open })
      },

      setBuyTicketModalOpen: (open: boolean) => {
        set({ isBuyTicketModalOpen: open })
      },

      setQRScannerOpen: (open: boolean) => {
        set({ isQRScannerOpen: open })
      },

      // Notification actions
      addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => {
        const id = Math.random().toString(36).substr(2, 9)
        const newNotification: Notification = {
          ...notification,
          id,
          timestamp: Date.now()
        }
        
        set(state => ({
          notifications: [...state.notifications, newNotification]
        }))
        
        // Auto-remove notification after 5 seconds
        setTimeout(() => {
          get().removeNotification(id)
        }, 5000)
      },

      removeNotification: (id: string) => {
        set(state => ({
          notifications: state.notifications.filter(n => n.id !== id)
        }))
      },

      clearNotifications: () => {
        set({ notifications: [] })
      }
    }),
    {
      name: 'eventxx-store',
      partialize: (state) => ({
        // Only persist non-sensitive data
        events: state.events,
        selectedEvent: state.selectedEvent
      })
    }
  ))

// Selectors for better performance
export const useWallet = () => useAppStore(state => state.wallet)
export const useEvents = () => useAppStore(state => state.events)
export const useUserTickets = () => useAppStore(state => state.userTickets)
export const useNotifications = () => useAppStore(state => state.notifications)

// Helper hooks
export const useIsConnected = () => useAppStore(state => state.wallet.isConnected)
export const useIsCorrectNetwork = () => {
  const chainId = useAppStore(state => state.wallet.chainId)
  return chainId === 43113 || chainId === 43114 // Avalanche Fuji or Mainnet
}

export const useEventById = (eventId: number) => {
  return useAppStore(state => state.events.find(event => event.id === eventId))
}

export const useUserTicketsByEvent = (eventId: number) => {
  return useAppStore(state => 
    state.userTickets.filter(ticket => ticket.eventId === eventId)
  )
}