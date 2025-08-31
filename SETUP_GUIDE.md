# EventXX Setup Guide

This guide will help you set up all the necessary API keys and environment variables to enable the full event creation and ticketing workflow.

## 🔧 Required Setup Steps

### 1. Wallet Setup for Blockchain Transactions

**Get a Private Key for Development:**
- Create a new MetaMask wallet specifically for development (never use your main wallet)
- Export the private key from MetaMask:
  1. Click on account menu → Account Details → Export Private Key
  2. Enter your password and copy the private key
  3. Add it to `.env.local` as `PRIVATE_KEY=your_actual_private_key`

**Get Testnet AVAX:**
- Visit [Avalanche Fuji Faucet](https://faucet.avax.network/)
- Connect your wallet and request testnet AVAX
- You'll need AVAX for gas fees when creating events and minting tickets

### 2. Pinata IPFS Setup (Required for NFT Metadata)

**Sign up for Pinata:**
1. Go to [pinata.cloud](https://pinata.cloud/)
2. Create a free account
3. Navigate to API Keys in your dashboard
4. Create a new API key with the following permissions:
   - `pinFileToIPFS`
   - `pinJSONToIPFS`
   - `unpin`
5. Copy both the API Key and Secret Key
6. Update `.env.local`:
   ```
   NEXT_PUBLIC_PINATA_API_KEY=your_actual_api_key
   NEXT_PUBLIC_PINATA_SECRET_KEY=your_actual_secret_key
   ```

### 3. Snowtrace API Key (Optional - for Contract Verification)

**Get Snowtrace API Key:**
1. Go to [snowtrace.io/apis](https://snowtrace.io/apis)
2. Create a free account
3. Generate an API key
4. Add to `.env.local`: `SNOWTRACE_API_KEY=your_api_key`

### 4. WalletConnect Project ID (Already Configured)

✅ Your WalletConnect Project ID is already set up and working.

## 🚀 Testing the Full Workflow

Once you have all API keys configured:

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Connect your wallet:**
   - Make sure you're on Avalanche Fuji testnet
   - Connect using the wallet button in the app

3. **Create an event:**
   - Go to `/organizer` page
   - Fill out the event creation form
   - This will deploy metadata to IPFS and create the event on-chain

4. **Buy tickets:**
   - Navigate to the event page
   - Purchase tickets (requires testnet AVAX)

5. **Verify tickets:**
   - Use the `/verify` page to scan QR codes
   - Test the fraud detection system

## 🔍 Troubleshooting

**Common Issues:**

- **"Insufficient funds" error:** Get more testnet AVAX from the faucet
- **IPFS upload fails:** Check your Pinata API keys are correct
- **Wallet connection issues:** Ensure you're on Avalanche Fuji testnet
- **Contract interaction fails:** Verify the contract address is correct

**Network Configuration:**
- Network Name: Avalanche Fuji C-Chain
- RPC URL: https://api.avax-test.network/ext/bc/C/rpc
- Chain ID: 43113
- Symbol: AVAX
- Explorer: https://testnet.snowtrace.io/

## 📝 Environment Variables Summary

Your `.env.local` should have these variables configured:

```env
# Wallet & Blockchain
PRIVATE_KEY=your_wallet_private_key
NEXT_PUBLIC_CONTRACT_ADDRESS=0x742d35Cc6634C0532925a3b8D4C9db96C4b5Da5A

# IPFS Storage
NEXT_PUBLIC_PINATA_API_KEY=your_pinata_api_key
NEXT_PUBLIC_PINATA_SECRET_KEY=your_pinata_secret_key

# Optional
SNOWTRACE_API_KEY=your_snowtrace_api_key
```

## 🎯 What Each Service Enables

- **Private Key:** Allows creating events, minting tickets, and all blockchain transactions
- **Pinata IPFS:** Stores event images and NFT metadata in a decentralized way
- **Snowtrace API:** Enables contract verification and better debugging
- **WalletConnect:** Provides wallet connection functionality for users

Once configured, you'll have a fully functional decentralized event ticketing platform!