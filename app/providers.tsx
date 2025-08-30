'use client'

import { ReactNode } from 'react'
import { WagmiConfig, createConfig, configureChains } from 'wagmi'
import { avalancheFuji, avalanche } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'
import { RainbowKitProvider, getDefaultWallets, connectorsForWallets } from '@rainbow-me/rainbowkit'
import { metaMaskWallet, walletConnectWallet } from '@rainbow-me/rainbowkit/wallets'
import '@rainbow-me/rainbowkit/styles.css'

const { chains, publicClient } = configureChains(
  [avalancheFuji, avalanche],
  [publicProvider()]
)

const { wallets } = getDefaultWallets({
  appName: 'EventXX',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'demo-project-id',
  chains,
})

const connectors = connectorsForWallets([
  ...wallets,
  {
    groupName: 'Other',
    wallets: [
      metaMaskWallet({ projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'demo-project-id', chains }),
      walletConnectWallet({ projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'demo-project-id', chains }),
    ],
  },
])

const wagmiConfig = createConfig({
  autoConnect: false,
  connectors,
  publicClient,
})

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider
        chains={chains}
        theme={{
          blurs: {
            modalOverlay: 'blur(4px)',
          },
          colors: {
            accentColor: '#ffffff',
            accentColorForeground: '#000000',
            actionButtonBorder: 'rgba(75, 85, 99, 0.5)',
            actionButtonBorderMobile: 'rgba(75, 85, 99, 0.5)',
            actionButtonSecondaryBackground: 'rgba(75, 85, 99, 0.3)',
            closeButton: 'rgba(156, 163, 175, 0.8)',
            closeButtonBackground: 'rgba(75, 85, 99, 0.3)',
            connectButtonBackground: '#000000',
            connectButtonBackgroundError: '#ffffff',
            connectButtonInnerBackground: 'rgba(75, 85, 99, 0.2)',
            connectButtonText: '#ffffff',
            connectButtonTextError: '#000000',
            connectionIndicator: '#ffffff',
            downloadBottomCardBackground: '#111827',
            downloadTopCardBackground: '#111827',
            error: '#ffffff',
            generalBorder: 'rgba(75, 85, 99, 0.3)',
            generalBorderDim: 'rgba(75, 85, 99, 0.2)',
            menuItemBackground: 'rgba(75, 85, 99, 0.2)',
            modalBackdrop: 'rgba(0, 0, 0, 0.8)',
            modalBackground: '#000000',
            modalBorder: 'rgba(75, 85, 99, 0.3)',
            modalText: '#ffffff',
            modalTextDim: 'rgba(156, 163, 175, 0.7)',
            modalTextSecondary: 'rgba(156, 163, 175, 0.8)',
            profileAction: 'rgba(75, 85, 99, 0.2)',
            profileActionHover: 'rgba(75, 85, 99, 0.3)',
            profileForeground: 'rgba(75, 85, 99, 0.1)',
            selectedOptionBorder: 'rgba(75, 85, 99, 0.4)',
            standby: '#9ca3af',
          },
          fonts: {
            body: 'Inter, sans-serif',
          },
          radii: {
            actionButton: '4px',
            connectButton: '4px',
            menuButton: '4px',
            modal: '8px',
            modalMobile: '8px',
          },
          shadows: {
            connectButton: '0px 2px 8px rgba(0, 0, 0, 0.3)',
            dialog: '0px 4px 16px rgba(0, 0, 0, 0.5)',
            profileDetailsAction: '0px 1px 3px rgba(0, 0, 0, 0.2)',
            selectedOption: '0px 1px 3px rgba(0, 0, 0, 0.3)',
            selectedWallet: '0px 1px 3px rgba(0, 0, 0, 0.2)',
            walletLogo: '0px 1px 8px rgba(0, 0, 0, 0.3)',
          },
        }}
      >
        {children}
      </RainbowKitProvider>
    </WagmiConfig>
  )
}