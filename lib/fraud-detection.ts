import { ethers } from 'ethers'

// Risk scoring thresholds
const RISK_THRESHOLDS = {
  LOW: 0.3,
  MEDIUM: 0.6,
  HIGH: 0.8
}

// Fraud detection patterns
interface FraudPattern {
  id: string
  name: string
  weight: number
  check: (data: any) => boolean
}

// Event validation interface
interface EventValidation {
  eventId: string
  organizerAddress: string
  riskScore: number
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  flags: string[]
  recommendations: string[]
}

// Transfer analysis interface
interface TransferAnalysis {
  transferId: string
  fromAddress: string
  toAddress: string
  tokenId: string
  riskScore: number
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  flags: string[]
  isBlocked: boolean
}

// Suspicious patterns for ticket transfers
const TRANSFER_PATTERNS: FraudPattern[] = [
  {
    id: 'rapid_transfers',
    name: 'Rapid consecutive transfers',
    weight: 0.4,
    check: (data) => data.transferCount > 5 && data.timeSpan < 3600 // 5+ transfers in 1 hour
  },
  {
    id: 'price_manipulation',
    name: 'Unusual price patterns',
    weight: 0.5,
    check: (data) => data.priceDeviation > 3 // 3x standard deviation from market price
  },
  {
    id: 'new_wallet_activity',
    name: 'New wallet with high activity',
    weight: 0.3,
    check: (data) => data.walletAge < 86400 && data.transactionCount > 10 // New wallet (<1 day) with 10+ transactions
  },
  {
    id: 'circular_trading',
    name: 'Circular trading pattern',
    weight: 0.6,
    check: (data) => data.hasCircularPattern
  },
  {
    id: 'bot_behavior',
    name: 'Bot-like transaction patterns',
    weight: 0.4,
    check: (data) => data.uniformTimingPattern && data.gasOptimization
  }
]

// Suspicious patterns for fake events
const EVENT_PATTERNS: FraudPattern[] = [
  {
    id: 'duplicate_content',
    name: 'Duplicate event content',
    weight: 0.7,
    check: (data) => data.contentSimilarity > 0.9
  },
  {
    id: 'unrealistic_pricing',
    name: 'Unrealistic ticket pricing',
    weight: 0.5,
    check: (data) => data.priceToMarketRatio < 0.1 || data.priceToMarketRatio > 10
  },
  {
    id: 'new_organizer',
    name: 'New organizer with premium event',
    weight: 0.4,
    check: (data) => data.organizerAge < 604800 && data.ticketPrice > 1 // New organizer (<1 week) with expensive tickets
  },
  {
    id: 'impossible_venue',
    name: 'Impossible venue capacity',
    weight: 0.8,
    check: (data) => data.ticketCount > data.venueCapacity * 1.2
  },
  {
    id: 'suspicious_images',
    name: 'Stock or stolen images',
    weight: 0.6,
    check: (data) => data.imageReverseSearchMatch
  }
]

class FraudDetectionEngine {
  private transferHistory: Map<string, any[]> = new Map()
  private eventDatabase: Map<string, any> = new Map()
  private blacklistedAddresses: Set<string> = new Set()
  private whitelistedAddresses: Set<string> = new Set()

  constructor() {
    this.initializeBlacklist()
  }

  private initializeBlacklist() {
    // Add known fraudulent addresses (in real implementation, this would come from a database)
    const knownFraudAddresses = [
      '0x0000000000000000000000000000000000000000',
      // Add more known fraudulent addresses
    ]
    knownFraudAddresses.forEach(addr => this.blacklistedAddresses.add(addr.toLowerCase()))
  }

  // Analyze ticket transfer for suspicious activity
  async analyzeTransfer(
    transferId: string,
    fromAddress: string,
    toAddress: string,
    tokenId: string,
    price: number,
    timestamp: number
  ): Promise<TransferAnalysis> {
    const flags: string[] = []
    let riskScore = 0

    // Check blacklisted addresses
    if (this.blacklistedAddresses.has(fromAddress.toLowerCase()) || 
        this.blacklistedAddresses.has(toAddress.toLowerCase())) {
      flags.push('Blacklisted address involved')
      riskScore += 0.9
    }

    // Get transfer history for analysis
    const transferData = await this.getTransferData(fromAddress, toAddress, tokenId, timestamp)
    
    // Apply fraud patterns
    for (const pattern of TRANSFER_PATTERNS) {
      if (pattern.check(transferData)) {
        flags.push(pattern.name)
        riskScore += pattern.weight
      }
    }

    // Normalize risk score
    riskScore = Math.min(riskScore, 1)

    const riskLevel = this.calculateRiskLevel(riskScore)
    const isBlocked = riskLevel === 'CRITICAL' || riskScore > 0.9

    // Store transfer for future analysis
    this.storeTransferData(transferId, {
      fromAddress,
      toAddress,
      tokenId,
      price,
      timestamp,
      riskScore,
      flags
    })

    return {
      transferId,
      fromAddress,
      toAddress,
      tokenId,
      riskScore,
      riskLevel,
      flags,
      isBlocked
    }
  }

  // Validate event for potential fraud
  async validateEvent(
    eventId: string,
    organizerAddress: string,
    eventData: any
  ): Promise<EventValidation> {
    const flags: string[] = []
    let riskScore = 0
    const recommendations: string[] = []

    // Check organizer reputation
    if (this.blacklistedAddresses.has(organizerAddress.toLowerCase())) {
      flags.push('Blacklisted organizer')
      riskScore += 0.9
      recommendations.push('Block event creation')
    }

    // Prepare event analysis data
    const analysisData = await this.prepareEventAnalysisData(eventData, organizerAddress)

    // Apply fraud patterns
    for (const pattern of EVENT_PATTERNS) {
      if (pattern.check(analysisData)) {
        flags.push(pattern.name)
        riskScore += pattern.weight
      }
    }

    // Additional checks
    if (analysisData.hasIncompleteInformation) {
      flags.push('Incomplete event information')
      riskScore += 0.2
      recommendations.push('Request additional verification documents')
    }

    if (analysisData.suspiciousContactInfo) {
      flags.push('Suspicious contact information')
      riskScore += 0.3
      recommendations.push('Verify organizer identity')
    }

    // Normalize risk score
    riskScore = Math.min(riskScore, 1)
    const riskLevel = this.calculateRiskLevel(riskScore)

    // Generate recommendations based on risk level
    if (riskLevel === 'HIGH' || riskLevel === 'CRITICAL') {
      recommendations.push('Require manual review before approval')
      recommendations.push('Request additional verification')
    } else if (riskLevel === 'MEDIUM') {
      recommendations.push('Monitor event closely')
      recommendations.push('Enable enhanced fraud detection')
    }

    return {
      eventId,
      organizerAddress,
      riskScore,
      riskLevel,
      flags,
      recommendations
    }
  }

  // Get comprehensive transfer data for analysis
  private async getTransferData(
    fromAddress: string,
    toAddress: string,
    tokenId: string,
    timestamp: number
  ): Promise<any> {
    const recentTransfers = this.getRecentTransfers(fromAddress, 3600) // Last hour
    const walletAge = await this.getWalletAge(fromAddress)
    const transactionCount = await this.getTransactionCount(fromAddress)
    
    return {
      transferCount: recentTransfers.length,
      timeSpan: timestamp - (recentTransfers[0]?.timestamp || timestamp),
      priceDeviation: this.calculatePriceDeviation(tokenId, recentTransfers),
      walletAge,
      transactionCount,
      hasCircularPattern: this.detectCircularPattern(fromAddress, toAddress),
      uniformTimingPattern: this.detectUniformTiming(recentTransfers),
      gasOptimization: this.detectGasOptimization(recentTransfers)
    }
  }

  // Prepare event data for fraud analysis
  private async prepareEventAnalysisData(eventData: any, organizerAddress: string): Promise<any> {
    const organizerAge = await this.getWalletAge(organizerAddress)
    const contentSimilarity = await this.checkContentSimilarity(eventData)
    const priceToMarketRatio = this.calculatePriceToMarketRatio(eventData)
    
    return {
      organizerAge,
      contentSimilarity,
      priceToMarketRatio,
      ticketCount: eventData.totalTickets,
      venueCapacity: await this.getVenueCapacity(eventData.location),
      ticketPrice: parseFloat(eventData.price),
      imageReverseSearchMatch: await this.checkImageOriginality(eventData.image),
      hasIncompleteInformation: this.checkInformationCompleteness(eventData),
      suspiciousContactInfo: this.validateContactInformation(eventData)
    }
  }

  // Helper methods
  private calculateRiskLevel(riskScore: number): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' {
    if (riskScore >= 0.9) return 'CRITICAL'
    if (riskScore >= RISK_THRESHOLDS.HIGH) return 'HIGH'
    if (riskScore >= RISK_THRESHOLDS.MEDIUM) return 'MEDIUM'
    return 'LOW'
  }

  private getRecentTransfers(address: string, timeWindow: number): any[] {
    const history = this.transferHistory.get(address.toLowerCase()) || []
    const cutoff = Date.now() / 1000 - timeWindow
    return history.filter(transfer => transfer.timestamp > cutoff)
  }

  private async getWalletAge(address: string): Promise<number> {
    // In real implementation, query blockchain for first transaction
    // For now, return mock data
    return Math.random() * 31536000 // Random age up to 1 year
  }

  private async getTransactionCount(address: string): Promise<number> {
    // In real implementation, query blockchain for transaction count
    return Math.floor(Math.random() * 1000)
  }

  private calculatePriceDeviation(tokenId: string, transfers: any[]): number {
    if (transfers.length < 2) return 0
    const prices = transfers.map(t => t.price)
    const mean = prices.reduce((a, b) => a + b, 0) / prices.length
    const variance = prices.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / prices.length
    const stdDev = Math.sqrt(variance)
    return stdDev / mean
  }

  private detectCircularPattern(fromAddress: string, toAddress: string): boolean {
    const fromHistory = this.transferHistory.get(fromAddress.toLowerCase()) || []
    return fromHistory.some(transfer => 
      transfer.toAddress.toLowerCase() === toAddress.toLowerCase() &&
      transfer.fromAddress.toLowerCase() === fromAddress.toLowerCase()
    )
  }

  private detectUniformTiming(transfers: any[]): boolean {
    if (transfers.length < 3) return false
    const intervals: number[] = []
    for (let i = 1; i < transfers.length; i++) {
      intervals.push(transfers[i].timestamp - transfers[i-1].timestamp)
    }
    const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length
    return intervals.every(interval => Math.abs(interval - avgInterval) < avgInterval * 0.1)
  }

  private detectGasOptimization(transfers: any[]): boolean {
    // Check if gas prices are consistently optimized (indicating bot behavior)
    return transfers.length > 5 && transfers.every(t => t.gasPrice && t.gasPrice % 1000000000 === 0)
  }

  private async checkContentSimilarity(eventData: any): Promise<number> {
    // In real implementation, use ML models to check content similarity
    // For now, return mock similarity score
    return Math.random()
  }

  private calculatePriceToMarketRatio(eventData: any): number {
    // Compare event price to market average for similar events
    const marketAverage = 0.1 // Mock market average price in AVAX
    return parseFloat(eventData.price) / marketAverage
  }

  private async getVenueCapacity(location: string): Promise<number> {
    // In real implementation, query venue database
    // For now, return estimated capacity based on location type
    if (location.toLowerCase().includes('stadium')) return 50000
    if (location.toLowerCase().includes('arena')) return 20000
    if (location.toLowerCase().includes('theater')) return 2000
    if (location.toLowerCase().includes('club')) return 500
    return 1000 // Default capacity
  }

  private async checkImageOriginality(imageUrl: string): Promise<boolean> {
    // In real implementation, use reverse image search APIs
    // For now, return mock result
    return Math.random() > 0.8
  }

  private checkInformationCompleteness(eventData: any): boolean {
    const requiredFields = ['title', 'description', 'date', 'time', 'location', 'price']
    return !requiredFields.every(field => eventData[field] && eventData[field].trim().length > 0)
  }

  private validateContactInformation(eventData: any): boolean {
    // Check for suspicious contact patterns
    const email = eventData.organizerEmail || ''
    const phone = eventData.organizerPhone || ''
    
    // Check for temporary email services
    const tempEmailDomains = ['10minutemail.com', 'tempmail.org', 'guerrillamail.com']
    const hasTempEmail = tempEmailDomains.some(domain => email.includes(domain))
    
    // Check for invalid phone patterns
    const hasInvalidPhone = phone.length > 0 && !/^[+]?[1-9][\d\s\-\(\)]{7,15}$/.test(phone)
    
    return hasTempEmail || hasInvalidPhone
  }

  private storeTransferData(transferId: string, data: any): void {
    const address = data.fromAddress.toLowerCase()
    if (!this.transferHistory.has(address)) {
      this.transferHistory.set(address, [])
    }
    this.transferHistory.get(address)!.push(data)
    
    // Keep only last 100 transfers per address to manage memory
    const history = this.transferHistory.get(address)!
    if (history.length > 100) {
      this.transferHistory.set(address, history.slice(-100))
    }
  }

  // Public methods for managing blacklists
  addToBlacklist(address: string): void {
    this.blacklistedAddresses.add(address.toLowerCase())
  }

  removeFromBlacklist(address: string): void {
    this.blacklistedAddresses.delete(address.toLowerCase())
  }

  addToWhitelist(address: string): void {
    this.whitelistedAddresses.add(address.toLowerCase())
  }

  isWhitelisted(address: string): boolean {
    return this.whitelistedAddresses.has(address.toLowerCase())
  }

  // Get fraud statistics
  getFraudStatistics(): any {
    const totalTransfers = Array.from(this.transferHistory.values())
      .reduce((total, history) => total + history.length, 0)
    
    const flaggedTransfers = Array.from(this.transferHistory.values())
      .flat()
      .filter(transfer => transfer.flags && transfer.flags.length > 0)
    
    return {
      totalTransfers,
      flaggedTransfers: flaggedTransfers.length,
      flaggedPercentage: totalTransfers > 0 ? (flaggedTransfers.length / totalTransfers) * 100 : 0,
      blacklistedAddresses: this.blacklistedAddresses.size,
      whitelistedAddresses: this.whitelistedAddresses.size
    }
  }
}

// Export singleton instance
export const fraudDetection = new FraudDetectionEngine()
export type { EventValidation, TransferAnalysis }