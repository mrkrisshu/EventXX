import { ethers } from 'ethers'
import { fraudDetection, type EventValidation, type TransferAnalysis } from './fraud-detection'

// Avalanche Network Configuration
export const AVALANCHE_CONFIG = {
  chainId: '0xa869', // 43113 in hex for Fuji testnet
  chainName: 'Avalanche Fuji Testnet',
  nativeCurrency: {
    name: 'AVAX',
    symbol: 'AVAX',
    decimals: 18
  },
  rpcUrls: [
    'https://api.avax-test.network/ext/bc/C/rpc',
    'https://avalanche-fuji-c-chain.publicnode.com',
    'https://rpc.ankr.com/avalanche_fuji',
    'https://ava-testnet.public.blastapi.io/ext/bc/C/rpc'
  ],
  blockExplorerUrls: ['https://testnet.snowtrace.io']
}

export const AVALANCHE_MAINNET_CONFIG = {
  chainId: '0xa86a', // 43114 in hex for mainnet
  chainName: 'Avalanche Mainnet',
  nativeCurrency: {
    name: 'AVAX',
    symbol: 'AVAX',
    decimals: 18
  },
  rpcUrls: [
    'https://api.avax.network/ext/bc/C/rpc',
    'https://avalanche-c-chain.publicnode.com',
    'https://rpc.ankr.com/avalanche',
    'https://ava-mainnet.public.blastapi.io/ext/bc/C/rpc'
  ],
  blockExplorerUrls: ['https://snowtrace.io']
}

// Contract Addresses
export const CONTRACT_ADDRESSES = {
  FUJI_TESTNET: {
    EVENT_TICKETS: '0x742d35Cc6634C0532925a3b8D4C9db96C4b5Da5A', // Deployed contract address
    EVENT_FACTORY: '0x0987654321098765432109876543210987654321'  // Replace with actual address
  },
  MAINNET: {
    EVENT_TICKETS: '0x0000000000000000000000000000000000000000', // Replace with actual address
    EVENT_FACTORY: '0x0000000000000000000000000000000000000000'  // Replace with actual address
  }
}

// Event Tickets NFT Contract ABI
export const EVENT_TICKETS_ABI = [
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "symbol",
        "type": "string"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "approved",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "Approval",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "eventId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "price",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "maxTickets",
        "type": "uint256"
      }
    ],
    "name": "EventCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "eventId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "buyer",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "TicketPurchased",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "TicketUsed",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "Transfer",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "approve",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "eventId",
        "type": "uint256"
      }
    ],
    "name": "buyTicket",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "description",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "price",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "maxTickets",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "eventDate",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "location",
        "type": "string"
      }
    ],
    "name": "createEvent",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "events",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "description",
        "type": "string"
      },
      {
        "internalType": "address",
        "name": "organizer",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "price",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "maxTickets",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "soldTickets",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "eventDate",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "location",
        "type": "string"
      },
      {
        "internalType": "bool",
        "name": "isActive",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "getApproved",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "eventId",
        "type": "uint256"
      }
    ],
    "name": "getEvent",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "name",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "description",
            "type": "string"
          },
          {
            "internalType": "address",
            "name": "organizer",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "price",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "maxTickets",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "soldTickets",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "eventDate",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "location",
            "type": "string"
          },
          {
            "internalType": "bool",
            "name": "isActive",
            "type": "bool"
          }
        ],
        "internalType": "struct EventTickets.Event",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "getUserTickets",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "operator",
        "type": "address"
      }
    ],
    "name": "isApprovedForAll",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "isTicketUsed",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "name",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "ownerOf",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "safeTransferFrom",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      },
      {
        "internalType": "bytes",
        "name": "data",
        "type": "bytes"
      }
    ],
    "name": "safeTransferFrom",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "operator",
        "type": "address"
      },
      {
        "internalType": "bool",
        "name": "approved",
        "type": "bool"
      }
    ],
    "name": "setApprovalForAll",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes4",
        "name": "interfaceId",
        "type": "bytes4"
      }
    ],
    "name": "supportsInterface",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "symbol",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "tokenURI",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "transferFrom",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "useTicket",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]

// Helper function to create provider with fallback RPC URLs
export async function createProviderWithFallback(isTestnet: boolean = true, maxRetries: number = 3): Promise<ethers.JsonRpcProvider> {
  const config = isTestnet ? AVALANCHE_CONFIG : AVALANCHE_MAINNET_CONFIG
  
  for (let i = 0; i < config.rpcUrls.length; i++) {
    const rpcUrl = config.rpcUrls[i]
    
    for (let retry = 0; retry < maxRetries; retry++) {
      try {
        const provider = new ethers.JsonRpcProvider(rpcUrl)
        // Test the connection
        await provider.getBlockNumber()
        console.log(`Successfully connected to RPC: ${rpcUrl}`)
        return provider
      } catch (error) {
        console.warn(`Failed to connect to RPC ${rpcUrl} (attempt ${retry + 1}/${maxRetries}):`, error)
        if (retry < maxRetries - 1) {
          // Wait before retrying (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, retry) * 1000))
        }
      }
    }
  }
  
  throw new Error(`Failed to connect to any RPC endpoint after ${maxRetries} retries`)
}

// Helper function to get contract instance
export function getEventTicketsContract(provider: any, isTestnet: boolean = true) {
  const contractAddress = isTestnet 
    ? CONTRACT_ADDRESSES.FUJI_TESTNET.EVENT_TICKETS 
    : CONTRACT_ADDRESSES.MAINNET.EVENT_TICKETS
  
  return new ethers.Contract(contractAddress, EVENT_TICKETS_ABI, provider)
}

// Helper function to format AVAX amount
export function formatAVAX(amount: string | number): string {
  return ethers.formatEther(amount.toString())
}

// Helper function to parse AVAX amount
export function parseAVAX(amount: string): bigint {
  return ethers.parseEther(amount)
}

// Blockchain interaction functions
export class EventTicketsService {
  private contract: any
  private provider: any
  private signer: any

  constructor(provider: any, signer?: any, isTestnet: boolean = true) {
    if (!provider) {
      throw new Error('Provider is required for EventTicketsService')
    }
    
    this.provider = provider
    this.signer = signer
    this.contract = getEventTicketsContract(provider, isTestnet)
    
    // If we have a signer, connect it to the contract for write operations
    if (signer) {
      this.contract = this.contract.connect(signer)
    }
  }

  // Create a new event
  async createEvent(eventData: {
    name: string
    description: string
    price: string // in AVAX
    maxTickets: number
    eventDate: Date
    location: string
  }) {
    if (!this.signer) throw new Error('Signer required for creating events')
    
    // Validate event with fraud detection
    const organizerAddress = await this.signer.getAddress()
    const validation: EventValidation = await fraudDetection.validateEvent(
      `event_${Date.now()}`,
      organizerAddress,
      {
        name: eventData.name,
        description: eventData.description,
        price: parseFloat(eventData.price),
        maxTickets: eventData.maxTickets,
        eventDate: eventData.eventDate,
        location: eventData.location
      }
    )
    
    if (validation.riskLevel === 'CRITICAL') {
      throw new Error(`Event validation failed: ${validation.flags.join(', ')}`)
    }
    
    if (validation.riskScore > 0.7) {
      throw new Error(`Event has high fraud risk (${(validation.riskScore * 100).toFixed(1)}%). Please review and try again.`)
    }
    
    const priceInWei = parseAVAX(eventData.price)
    const eventDateTimestamp = Math.floor(eventData.eventDate.getTime() / 1000)
    
    const tx = await this.contract.createEvent(
      eventData.name,
      eventData.description,
      priceInWei,
      eventData.maxTickets,
      eventDateTimestamp,
      eventData.location
    )
    
    const receipt = await tx.wait()
    const eventCreatedLog = receipt.logs.find((log: any) => 
      log.topics[0] === ethers.id('EventCreated(uint256,string,uint256,uint256)')
    )
    
    if (eventCreatedLog) {
      const eventId = parseInt(eventCreatedLog.topics[1], 16)
      return { eventId, transactionHash: receipt.hash, validation }
    }
    
    throw new Error('Event creation failed')
  }

  // Get event details
  async getEvent(eventId: number) {
    try {
      if (!this.contract) {
        throw new Error('Contract not initialized')
      }
      
      if (!eventId || eventId < 0) {
        throw new Error('Invalid event ID')
      }
      
      const event = await this.contract.getEvent(eventId)
      
      if (!event) {
        throw new Error('Event not found')
      }
      
      // Validate event data before processing
      if (!event.price || !event.eventDate) {
        throw new Error('Invalid event data received from contract')
      }
      
      return {
        id: Number(event.id),
        name: event.name || '',
        description: event.description || '',
        organizer: event.organizer || '',
        price: formatAVAX(event.price),
        maxTickets: Number(event.maxTickets) || 0,
        soldTickets: Number(event.soldTickets) || 0,
        eventDate: new Date(Number(event.eventDate) * 1000),
        location: event.location || '',
        isActive: Boolean(event.isActive)
      }
    } catch (error) {
      console.error('Error fetching event:', eventId, error)
      return null
    }
  }

  // Get all events (by querying event creation logs)
  async getAllEvents(maxRetries: number = 3) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        if (!this.contract) {
          throw new Error('Contract not initialized')
        }
        
        const filter = this.contract.filters.EventCreated()
        
        // Ensure provider is available
        const provider = this.contract.provider || this.provider
        
        if (!provider) {
          throw new Error('Provider not available in getAllEvents')
        }
        
        // Get current block number and query only recent blocks to avoid "too many blocks" error
        const currentBlock = await provider.getBlockNumber()
        const fromBlock = Math.max(0, currentBlock - 2000) // Query last 2000 blocks
        
        console.log(`Fetching events from block ${fromBlock} to latest (attempt ${attempt}/${maxRetries})`)
        
        const logs = await provider.getLogs({
          ...filter,
          fromBlock,
          toBlock: 'latest'
        })
        
        console.log(`Found ${logs.length} event creation logs`)
        
        const events = await Promise.allSettled(
          logs.map(async (log: any) => {
            try {
              if (!log.topics || !log.topics[1]) {
                throw new Error('Invalid log format')
              }
              const eventId = parseInt(log.topics[1], 16)
              if (isNaN(eventId)) {
                throw new Error('Invalid event ID in log')
              }
              return await this.getEvent(eventId)
            } catch (error) {
              console.warn('Failed to process event log:', error)
              return null
            }
          })
        )
        
        const validEvents = events
          .filter((result): result is PromiseFulfilledResult<any> => result.status === 'fulfilled')
          .map(result => result.value)
          .filter(event => event !== null)
        
        console.log(`Successfully loaded ${validEvents.length} events`)
        return validEvents
        
      } catch (error) {
        console.error(`Error fetching events (attempt ${attempt}/${maxRetries}):`, error)
        
        if (attempt === maxRetries) {
          console.error('All attempts to fetch events failed, returning empty array')
          return []
        }
        
        // Wait before retrying (exponential backoff)
        const delay = Math.pow(2, attempt - 1) * 1000
        console.log(`Retrying in ${delay}ms...`)
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
    
    return []
  }

  // Buy a ticket
  async buyTicket(eventId: number, priceInAVAX: string) {
    if (!this.signer) throw new Error('Signer required for buying tickets')
    
    const priceInWei = parseAVAX(priceInAVAX)
    console.log('Buying ticket - EventID:', eventId, 'Price in AVAX:', priceInAVAX, 'Price in Wei:', priceInWei.toString())
    
    // Check wallet balance before transaction
    const signerAddress = await this.signer.getAddress()
    const balance = await this.signer.provider.getBalance(signerAddress)
    console.log('Wallet balance before transaction:', formatAVAX(balance), 'AVAX')
    
    const tx = await this.contract.buyTicket(eventId, {
      value: priceInWei
    })
    console.log('Transaction sent:', tx.hash)
    
    const receipt = await tx.wait()
    console.log('Transaction confirmed:', receipt.hash)
    
    // Check wallet balance after transaction
    const newBalance = await this.signer.provider.getBalance(signerAddress)
    console.log('Wallet balance after transaction:', formatAVAX(newBalance), 'AVAX')
    
    const ticketPurchasedLog = receipt.logs.find((log: any) => 
      log.topics[0] === ethers.id('TicketPurchased(uint256,address,uint256)')
    )
    
    if (ticketPurchasedLog) {
      const tokenId = parseInt(ticketPurchasedLog.data.slice(0, 66), 16)
      return { tokenId, transactionHash: receipt.hash }
    }
    
    throw new Error('Ticket purchase failed')
  }

  // Get user's tickets
  async getUserTickets(userAddress: string) {
    try {
      const tokenIds = await this.contract.getUserTickets(userAddress)
      
      const tickets = await Promise.all(
        tokenIds.map(async (tokenId: bigint) => {
          const tokenIdNum = Number(tokenId)
          const isUsed = await this.contract.isTicketUsed(tokenIdNum)
          const tokenURI = await this.contract.tokenURI(tokenIdNum)
          
          // Get eventId by parsing TicketPurchased events
          let eventId = 0
          let eventName = ''
          let eventDate = new Date()
          let location = ''
          
          try {
            // Query TicketPurchased events to find the eventId for this tokenId
            const filter = this.contract.filters.TicketPurchased()
            const logs = await this.contract.queryFilter(filter)
            
            const ticketLog = logs.find((log: any) => {
               try {
                 const parsedLog = this.contract.interface.parseLog(log)
                 return parsedLog && parsedLog.name === 'TicketPurchased' && Number(parsedLog.args.tokenId) === tokenIdNum
               } catch {
                 return false
               }
             })
             
             if (ticketLog) {
               const parsedLog = this.contract.interface.parseLog(ticketLog)
               eventId = Number(parsedLog.args.eventId)
              
              // Get event details
              const event = await this.getEvent(eventId)
              if (event) {
                eventName = event.name
                eventDate = event.eventDate
                location = event.location
              }
            }
          } catch (eventError) {
            console.warn('Could not fetch event details for ticket:', tokenIdNum, eventError)
          }
          
          return {
            tokenId: tokenIdNum,
            eventId,
            isUsed,
            tokenURI,
            owner: userAddress,
            eventName,
            eventDate: Math.floor(eventDate.getTime() / 1000),
            location
          }
        })
      )
      
      return tickets
    } catch (error) {
      console.error('Error fetching user tickets:', error)
      return []
    }
  }

  // Use/validate a ticket
  async useTicket(tokenId: number) {
    if (!this.signer) throw new Error('Signer required for using tickets')
    
    const tx = await this.contract.useTicket(tokenId)
    const receipt = await tx.wait()
    
    return { transactionHash: receipt.hash }
  }

  // Transfer a ticket (marketplace purchase)
  async transferTicket(tokenId: number, to: string, price: string) {
    if (!this.signer) throw new Error('Signer required for transferring tickets')
    
    // Analyze transfer with fraud detection
    const fromAddress = await this.signer.getAddress()
    const analysis: TransferAnalysis = await fraudDetection.analyzeTransfer(
      `marketplace_${tokenId}_${Date.now()}`,
      fromAddress,
      to,
      tokenId.toString(),
      parseFloat(price),
      Date.now()
    )
    
    if (analysis.riskScore > 0.8) {
      throw new Error(`Transfer blocked due to high fraud risk (${(analysis.riskScore * 100).toFixed(1)}%). Reasons: ${analysis.flags.join(', ')}`)
    }
    
    const priceInWei = parseAVAX(price)
    const tx = await this.contract.transferTicket(tokenId, to, priceInWei, {
      value: priceInWei
    })
    const receipt = await tx.wait()
    
    return { transactionHash: receipt.hash, analysis }
  }

  // Basic NFT transfer (free)
  async transferFrom(from: string, to: string, tokenId: number) {
    if (!this.signer) throw new Error('Signer required for transferring tickets')
    
    // Analyze transfer with fraud detection
    const analysis: TransferAnalysis = await fraudDetection.analyzeTransfer(
      `transfer_${tokenId}_${Date.now()}`,
      from,
      to,
      tokenId.toString(),
      0,
      Date.now()
    )
    
    if (analysis.riskScore > 0.8) {
      throw new Error(`Transfer blocked due to high fraud risk (${(analysis.riskScore * 100).toFixed(1)}%). Reasons: ${analysis.flags.join(', ')}`)
    }
    
    const tx = await this.contract.transferFrom(from, to, tokenId)
    const receipt = await tx.wait()
    
    return { transactionHash: receipt.hash, analysis }
  }

  // Check if ticket is used
  async isTicketUsed(tokenId: number): Promise<boolean> {
    try {
      return await this.contract.isTicketUsed(tokenId)
    } catch (error) {
      console.error('Error checking ticket status:', error)
      return false
    }
  }

  // Get ticket owner
  async getTicketOwner(tokenId: number): Promise<string | null> {
    try {
      return await this.contract.ownerOf(tokenId)
    } catch (error) {
      console.error('Error getting ticket owner:', error)
      return null
    }
  }
}

// Helper function to get provider
export async function getProvider(isTestnet: boolean = true) {
  const rpcUrl = isTestnet 
    ? AVALANCHE_CONFIG.rpcUrls[0] 
    : AVALANCHE_MAINNET_CONFIG.rpcUrls[0]
  
  console.log('Attempting to connect to RPC:', rpcUrl)
  
  const provider = new ethers.JsonRpcProvider(rpcUrl)
  
  // Ensure provider is connected by testing it
  try {
    const network = await provider.getNetwork()
    console.log('Successfully connected to network:', network.name, 'Chain ID:', network.chainId)
    return provider
  } catch (error) {
    console.error('Provider connection failed:', error)
    
    // For development, return a provider anyway but log the issue
    console.warn('Returning provider despite connection test failure for development purposes')
    return provider
  }
}

// Helper function to connect to wallet and get signer
export async function connectWallet() {
  if (typeof window !== 'undefined' && window.ethereum) {
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' })
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      
      // Check if we're on the correct network
      const network = await provider.getNetwork()
      const expectedChainId = parseInt(AVALANCHE_CONFIG.chainId, 16)
      
      if (Number(network.chainId) !== expectedChainId) {
        // Request network switch
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: AVALANCHE_CONFIG.chainId }]
        })
      }
      
      return { provider, signer }
    } catch (error) {
      console.error('Error connecting wallet:', error)
      throw error
    }
  } else {
    throw new Error('MetaMask not found')
  }
}