import { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'

// In-memory storage for demo purposes
// In production, this would be stored in a database
const metadataStorage: { [key: string]: any } = {}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { id } = req.query

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid metadata ID' })
  }

  try {
    // Try to get from in-memory storage first
    if (metadataStorage[id]) {
      res.setHeader('Content-Type', 'application/json')
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')
      return res.json(metadataStorage[id].metadata)
    }

    // Try to get from localStorage simulation (server-side file storage)
    const metadataPath = path.join(process.cwd(), '.next', 'metadata', `${id}.json`)
    
    if (fs.existsSync(metadataPath)) {
      const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'))
      res.setHeader('Content-Type', 'application/json')
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')
      return res.json(metadata)
    }

    // Generate default metadata if not found
    const defaultMetadata = {
      name: `EventXX Ticket #${id}`,
      description: 'Official EventXX NFT Ticket',
      image: `${process.env.NEXT_PUBLIC_APP_URL}/api/ticket-image?ticketId=${id}&eventName=Sample%20Event&eventDate=${new Date().toISOString()}&venue=Sample%20Venue`,
      attributes: [
        {
          trait_type: 'Ticket ID',
          value: id,
          display_type: 'number'
        },
        {
          trait_type: 'Status',
          value: 'Valid'
        },
        {
          trait_type: 'Platform',
          value: 'EventXX'
        }
      ]
    }

    res.setHeader('Content-Type', 'application/json')
    res.setHeader('Cache-Control', 'public, max-age=3600') // Cache for 1 hour for default metadata
    return res.json(defaultMetadata)

  } catch (error) {
    console.error('Error serving metadata:', error)
    res.status(500).json({ error: 'Failed to retrieve metadata' })
  }
}

// Helper function to store metadata (called from other parts of the app)
export function storeMetadata(id: string, metadata: any) {
  try {
    // Store in memory
    metadataStorage[id] = {
      metadata,
      timestamp: Date.now()
    }

    // Also store in file system for persistence
    const metadataDir = path.join(process.cwd(), '.next', 'metadata')
    if (!fs.existsSync(metadataDir)) {
      fs.mkdirSync(metadataDir, { recursive: true })
    }

    const metadataPath = path.join(metadataDir, `${id}.json`)
    fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2))

    return true
  } catch (error) {
    console.error('Error storing metadata:', error)
    return false
  }
}