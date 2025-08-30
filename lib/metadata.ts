import { Event, Ticket } from './wallet'

// IPFS gateway for storing metadata
const IPFS_GATEWAY = 'https://gateway.pinata.cloud/ipfs/'
const PINATA_API_KEY = process.env.NEXT_PUBLIC_PINATA_API_KEY
const PINATA_SECRET_KEY = process.env.NEXT_PUBLIC_PINATA_SECRET_KEY

export interface NFTMetadata {
  name: string
  description: string
  image: string
  external_url?: string
  attributes: NFTAttribute[]
  animation_url?: string
  background_color?: string
}

export interface NFTAttribute {
  trait_type: string
  value: string | number
  display_type?: 'number' | 'boost_percentage' | 'boost_number' | 'date'
}

export class MetadataService {
  /**
   * Generate NFT metadata for an event ticket
   */
  static generateTicketMetadata(
    event: Event,
    ticket: Ticket,
    seatNumber?: string
  ): NFTMetadata {
    const eventDate = new Date(event.eventDate * 1000)
    const ticketName = `${event.name} - Ticket #${ticket.tokenId}`
    
    const attributes: NFTAttribute[] = [
      {
        trait_type: 'Event Name',
        value: event.name
      },
      {
        trait_type: 'Event Date',
        value: eventDate.getTime(),
        display_type: 'date'
      },
      {
        trait_type: 'Venue',
        value: event.location
      },
      {
        trait_type: 'Organizer',
        value: event.organizer
      },
      {
        trait_type: 'Ticket Price',
        value: parseFloat(event.price),
        display_type: 'number'
      },
      {
        trait_type: 'Ticket ID',
        value: ticket.tokenId,
        display_type: 'number'
      },
      {
        trait_type: 'Event ID',
        value: event.id,
        display_type: 'number'
      },
      {
        trait_type: 'Status',
        value: ticket.isUsed ? 'Used' : 'Valid'
      },
      {
        trait_type: 'Transferable',
        value: ticket.isUsed ? 'No' : 'Yes'
      }
    ]

    // Add seat number if provided
    if (seatNumber) {
      attributes.push({
        trait_type: 'Seat Number',
        value: seatNumber
      })
    }

    // Add rarity based on ticket number
    const rarity = this.calculateTicketRarity(ticket.tokenId, event.maxTickets)
    attributes.push({
      trait_type: 'Rarity',
      value: rarity
    })

    return {
      name: ticketName,
      description: `Official NFT ticket for ${event.name}. This ticket grants access to the event on ${eventDate.toLocaleDateString()}. Ticket #${ticket.tokenId} of ${event.maxTickets}.`,
      image: this.generateTicketImage(event, ticket, seatNumber),
      external_url: `${process.env.NEXT_PUBLIC_APP_URL}/ticket/${ticket.tokenId}`,
      attributes,
      background_color: this.generateBackgroundColor(event.name)
    }
  }

  /**
   * Calculate ticket rarity based on position
   */
  private static calculateTicketRarity(tokenId: number, maxTickets: number): string {
    const position = (tokenId / maxTickets) * 100
    
    if (position <= 1) return 'Genesis' // First 1%
    if (position <= 5) return 'Legendary' // First 5%
    if (position <= 15) return 'Epic' // First 15%
    if (position <= 40) return 'Rare' // First 40%
    return 'Common'
  }

  /**
   * Generate a unique background color based on event name
   */
  private static generateBackgroundColor(eventName: string): string {
    let hash = 0
    for (let i = 0; i < eventName.length; i++) {
      hash = eventName.charCodeAt(i) + ((hash << 5) - hash)
    }
    
    const hue = Math.abs(hash) % 360
    return `hsl(${hue}, 70%, 85%)`
  }

  /**
   * Generate ticket image URL (placeholder for now)
   */
  private static generateTicketImage(
    event: Event,
    ticket: Ticket,
    seatNumber?: string
  ): string {
    // For now, return a placeholder. In production, this would generate
    // a dynamic image with event details, QR code, etc.
    const params = new URLSearchParams({
      eventName: event.name,
      ticketId: ticket.tokenId.toString(),
      eventDate: new Date(event.eventDate * 1000).toISOString(),
      venue: event.location,
      ...(seatNumber && { seat: seatNumber })
    })
    
    return `${process.env.NEXT_PUBLIC_APP_URL}/api/ticket-image?${params.toString()}`
  }

  /**
   * Upload metadata to IPFS
   */
  static async uploadToIPFS(metadata: NFTMetadata): Promise<string> {
    if (!PINATA_API_KEY || !PINATA_SECRET_KEY) {
      console.warn('IPFS upload not configured, using local storage')
      return this.storeLocally(metadata)
    }

    try {
      const response = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'pinata_api_key': PINATA_API_KEY,
          'pinata_secret_api_key': PINATA_SECRET_KEY
        },
        body: JSON.stringify({
          pinataContent: metadata,
          pinataMetadata: {
            name: `EventXX-${metadata.name}`,
            keyvalues: {
              type: 'ticket-metadata',
              event: metadata.attributes.find(attr => attr.trait_type === 'Event Name')?.value || 'unknown'
            }
          }
        })
      })

      if (!response.ok) {
        throw new Error(`IPFS upload failed: ${response.statusText}`)
      }

      const result = await response.json()
      return `${IPFS_GATEWAY}${result.IpfsHash}`
    } catch (error) {
      console.error('Failed to upload to IPFS:', error)
      return this.storeLocally(metadata)
    }
  }

  /**
   * Store metadata locally as fallback
   */
  private static storeLocally(metadata: NFTMetadata): string {
    const id = Date.now().toString()
    const localMetadata = {
      id,
      metadata,
      timestamp: Date.now()
    }
    
    // Store in localStorage for demo purposes
    if (typeof window !== 'undefined') {
      const existing = JSON.parse(localStorage.getItem('eventxx-metadata') || '{}')
      existing[id] = localMetadata
      localStorage.setItem('eventxx-metadata', JSON.stringify(existing))
    }
    
    return `${process.env.NEXT_PUBLIC_APP_URL}/api/metadata/${id}`
  }

  /**
   * Generate QR code data for ticket verification
   */
  static generateQRData(ticket: Ticket, event: Event): string {
    return JSON.stringify({
      ticketId: ticket.tokenId,
      eventId: event.id,
      owner: ticket.owner,
      eventName: event.name,
      eventDate: event.eventDate,
      isUsed: ticket.isUsed,
      timestamp: Date.now(),
      signature: this.generateSignature(ticket, event)
    })
  }

  /**
   * Generate a simple signature for QR code verification
   */
  private static generateSignature(ticket: Ticket, event: Event): string {
    const data = `${ticket.tokenId}-${event.id}-${ticket.owner}-${event.eventDate}`
    let hash = 0
    for (let i = 0; i < data.length; i++) {
      hash = ((hash << 5) - hash + data.charCodeAt(i)) & 0xffffffff
    }
    return Math.abs(hash).toString(16)
  }

  /**
   * Verify QR code signature
   */
  static verifyQRSignature(qrData: string): boolean {
    try {
      const data = JSON.parse(qrData)
      const expectedSignature = this.generateSignature(
        { tokenId: data.ticketId, owner: data.owner, isUsed: data.isUsed } as Ticket,
        { id: data.eventId, eventDate: data.eventDate } as Event
      )
      return data.signature === expectedSignature
    } catch {
      return false
    }
  }
}

// Export utility functions
export const {
  generateTicketMetadata,
  uploadToIPFS,
  generateQRData,
  verifyQRSignature
} = MetadataService