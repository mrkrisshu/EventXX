# EventXX - Decentralized Event Ticketing Platform

A modern, decentralized event ticketing platform built with Next.js, Web3, and Avalanche blockchain technology.

## 🚀 Features

### Core Functionality
- **Event Discovery**: Browse and search events with advanced filtering
- **Wallet Integration**: Connect with MetaMask, WalletConnect, and Coinbase Wallet
- **Ticket Purchasing**: Buy tickets using AVAX cryptocurrency
- **QR Code Generation**: Automatic QR code generation for purchased tickets
- **Ticket Verification**: QR code scanning for event entry verification
- **Organizer Dashboard**: Comprehensive event management interface

### Technical Features
- **Blockchain Integration**: Built on Avalanche Fuji testnet
- **Smart Contracts**: Secure ticket purchasing and ownership
- **Modern UI**: Beautiful, responsive design with Framer Motion animations
- **Real-time Updates**: Live ticket availability and sales tracking
- **Mobile Responsive**: Optimized for all device sizes

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **Blockchain**: Avalanche, Wagmi, RainbowKit
- **QR Codes**: qrcode library for generation and scanning
- **Icons**: Lucide React

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd EventXX
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` with your configuration:
   - Get a WalletConnect Project ID from [WalletConnect Cloud](https://cloud.walletconnect.com/)
   - Deploy your smart contract and update the contract address

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration

### Wallet Setup
1. Install MetaMask browser extension
2. Add Avalanche Fuji Testnet:
   - Network Name: Avalanche Fuji Testnet
   - RPC URL: https://api.avax-test.network/ext/bc/C/rpc
   - Chain ID: 43113
   - Currency Symbol: AVAX
   - Block Explorer: https://testnet.snowtrace.io/

3. Get test AVAX from [Avalanche Faucet](https://faucet.avax.network/)

### Smart Contract Deployment
1. Deploy the EventTicketing smart contract to Avalanche Fuji
2. Update `NEXT_PUBLIC_CONTRACT_ADDRESS` in your `.env.local`
3. Ensure the contract ABI matches the one in `lib/contracts/EventTicketing.js`

## 🎯 Usage

### For Event Attendees
1. **Browse Events**: Visit the Events page to see available events
2. **Connect Wallet**: Click "Connect Wallet" to link your MetaMask
3. **Purchase Tickets**: Select quantity and buy tickets with AVAX
4. **Get QR Codes**: Download QR codes for your purchased tickets
5. **Event Entry**: Present QR codes at the event for verification

### For Event Organizers
1. **Access Dashboard**: Navigate to the Organizer page
2. **Create Events**: Use the "Create Event" button to add new events
3. **Manage Events**: View sales, revenue, and ticket statistics
4. **Verify Tickets**: Use the "Verify Tickets" tab to scan QR codes at events
5. **Track Analytics**: Monitor event performance and sales data

### For Verification Staff
1. **Select Event**: Choose the event you're verifying tickets for
2. **Scan QR Codes**: Use the built-in scanner to verify tickets
3. **View History**: Check recent verifications and ticket status

## 🧪 Testing

### Manual Testing Checklist
- [ ] Wallet connection works with MetaMask
- [ ] Event listing displays correctly
- [ ] Event details page loads with proper information
- [ ] Ticket purchasing flow completes successfully
- [ ] QR codes generate after purchase
- [ ] Organizer dashboard displays events and statistics
- [ ] QR code scanner functions in verification tab
- [ ] Navigation between pages works smoothly
- [ ] Responsive design works on mobile devices

### Test with Fuji Testnet
1. Ensure you have test AVAX in your wallet
2. Try purchasing tickets for different events
3. Verify QR code generation and download
4. Test the verification scanner with generated QR codes
5. Check organizer dashboard functionality

## 📱 Pages Overview

- **Home (`/`)**: Landing page with hero section and features
- **Events (`/events`)**: Event listing with search and filters
- **Event Details (`/events/[id]`)**: Individual event page with ticket purchasing
- **Organizer (`/organizer`)**: Dashboard for event management
- **Verify (`/verify`)**: Ticket verification interface

## 🔐 Security Features

- **Smart Contract Integration**: Secure blockchain-based ticket ownership
- **Wallet Authentication**: Cryptographic wallet-based authentication
- **QR Code Verification**: Tamper-proof ticket verification system
- **Real-time Validation**: Live ticket status checking

## 🚀 Deployment

### Vercel Deployment
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically on push to main branch

### Environment Variables for Production
```bash
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_production_project_id
NEXT_PUBLIC_CONTRACT_ADDRESS=your_deployed_contract_address
NEXT_PUBLIC_ENVIRONMENT=production
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the documentation above
- Review the code comments
- Test on Avalanche Fuji testnet first
- Ensure all dependencies are properly installed

---

**Built with ❤️ for the decentralized future of event ticketing**