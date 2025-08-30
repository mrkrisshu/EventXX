import { NextApiRequest, NextApiResponse } from 'next'
import { createCanvas, loadImage, registerFont } from 'canvas'
import QRCode from 'qrcode'
import path from 'path'

// Register fonts (you may need to add font files to public/fonts/)
try {
  registerFont(path.join(process.cwd(), 'public/fonts/Inter-Bold.ttf'), { family: 'Inter', weight: 'bold' })
  registerFont(path.join(process.cwd(), 'public/fonts/Inter-Regular.ttf'), { family: 'Inter', weight: 'normal' })
} catch (error) {
  console.warn('Custom fonts not found, using default fonts')
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const {
      eventName,
      ticketId,
      eventDate,
      venue,
      seat
    } = req.query

    if (!eventName || !ticketId || !eventDate || !venue) {
      return res.status(400).json({ error: 'Missing required parameters' })
    }

    // Create canvas
    const width = 800
    const height = 400
    const canvas = createCanvas(width, height)
    const ctx = canvas.getContext('2d')

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, width, height)
    gradient.addColorStop(0, '#667eea')
    gradient.addColorStop(1, '#764ba2')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)

    // Add some geometric patterns
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)'
    for (let i = 0; i < 20; i++) {
      const x = Math.random() * width
      const y = Math.random() * height
      const radius = Math.random() * 30 + 10
      ctx.beginPath()
      ctx.arc(x, y, radius, 0, Math.PI * 2)
      ctx.fill()
    }

    // Main content area
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)'
    ctx.roundRect(40, 40, width - 80, height - 80, 20)
    ctx.fill()

    // Event name
    ctx.fillStyle = '#2d3748'
    ctx.font = 'bold 32px Inter, Arial, sans-serif'
    ctx.textAlign = 'left'
    const eventNameText = String(eventName)
    const maxEventNameWidth = 450
    const eventNameFontSize = Math.min(32, (maxEventNameWidth / ctx.measureText(eventNameText).width) * 32)
    ctx.font = `bold ${eventNameFontSize}px Inter, Arial, sans-serif`
    ctx.fillText(eventNameText, 60, 100)

    // Ticket ID
    ctx.fillStyle = '#4a5568'
    ctx.font = 'normal 18px Inter, Arial, sans-serif'
    ctx.fillText(`Ticket #${ticketId}`, 60, 130)

    // Event details
    const eventDateObj = new Date(String(eventDate))
    const formattedDate = eventDateObj.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
    const formattedTime = eventDateObj.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })

    ctx.fillStyle = '#2d3748'
    ctx.font = 'normal 16px Inter, Arial, sans-serif'
    ctx.fillText(`📅 ${formattedDate}`, 60, 170)
    ctx.fillText(`🕐 ${formattedTime}`, 60, 195)
    ctx.fillText(`📍 ${venue}`, 60, 220)

    if (seat) {
      ctx.fillText(`💺 Seat: ${seat}`, 60, 245)
    }

    // Generate QR code
    const qrData = JSON.stringify({
      ticketId: String(ticketId),
      eventName: String(eventName),
      eventDate: String(eventDate),
      venue: String(venue),
      timestamp: Date.now(),
      type: 'EventXX_Ticket'
    })

    const qrCodeDataUrl = await QRCode.toDataURL(qrData, {
      width: 120,
      margin: 1,
      color: {
        dark: '#2d3748',
        light: '#ffffff'
      }
    })

    // Load and draw QR code
    const qrImage = await loadImage(qrCodeDataUrl)
    ctx.drawImage(qrImage, width - 180, 60, 120, 120)

    // QR code label
    ctx.fillStyle = '#4a5568'
    ctx.font = 'normal 12px Inter, Arial, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('Scan for verification', width - 120, 200)

    // EventXX branding
    ctx.fillStyle = '#667eea'
    ctx.font = 'bold 24px Inter, Arial, sans-serif'
    ctx.textAlign = 'right'
    ctx.fillText('EventXX', width - 60, height - 60)

    // Decorative border
    ctx.strokeStyle = '#667eea'
    ctx.lineWidth = 3
    ctx.roundRect(40, 40, width - 80, height - 80, 20)
    ctx.stroke()

    // Add perforated edge effect
    ctx.fillStyle = '#667eea'
    for (let i = 0; i < height; i += 20) {
      ctx.beginPath()
      ctx.arc(width - 20, i, 3, 0, Math.PI * 2)
      ctx.fill()
    }

    // Set response headers
    res.setHeader('Content-Type', 'image/png')
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')
    
    // Send the image
    const buffer = canvas.toBuffer('image/png')
    res.send(buffer)

  } catch (error) {
    console.error('Error generating ticket image:', error)
    res.status(500).json({ error: 'Failed to generate ticket image' })
  }
}

// Helper function to draw rounded rectangles
CanvasRenderingContext2D.prototype.roundRect = function(
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  this.beginPath()
  this.moveTo(x + radius, y)
  this.lineTo(x + width - radius, y)
  this.quadraticCurveTo(x + width, y, x + width, y + radius)
  this.lineTo(x + width, y + height - radius)
  this.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
  this.lineTo(x + radius, y + height)
  this.quadraticCurveTo(x, y + height, x, y + height - radius)
  this.lineTo(x, y + radius)
  this.quadraticCurveTo(x, y, x + radius, y)
  this.closePath()
}

// Extend the CanvasRenderingContext2D interface
declare global {
  interface CanvasRenderingContext2D {
    roundRect(x: number, y: number, width: number, height: number, radius: number): void
  }
}