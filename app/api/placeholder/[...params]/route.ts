import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest, { params }: { params: { params: string[] } }) {
  const [width = '400', height = '250'] = params.params || []
  
  // Create a simple SVG placeholder
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#1f2937"/>
      <rect x="10" y="10" width="${parseInt(width) - 20}" height="${parseInt(height) - 20}" fill="none" stroke="#374151" stroke-width="2" stroke-dasharray="5,5"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="16" fill="#9ca3af" text-anchor="middle" dominant-baseline="middle">
        Event Image
      </text>
      <text x="50%" y="${parseInt(height) / 2 + 20}" font-family="Arial, sans-serif" font-size="12" fill="#6b7280" text-anchor="middle" dominant-baseline="middle">
        ${width} × ${height}
      </text>
    </svg>
  `

  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })
}