'use client'
import './globals.css'
import { Inter } from 'next/font/google'
import { Providers } from './providers'
import { Toaster } from 'react-hot-toast'
import { Navigation } from '../components/Navigation'
import { useEffect } from 'react'

const inter = Inter({ subsets: ['latin'] })

// Metadata is handled in the head section below

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    // Register service worker for PWA functionality
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration);
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
        });
    }
  }, []);

  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <head>
        <title>EventXX - Blockchain Event Ticketing</title>
        <meta name="description" content="Secure event ticketing platform powered by Avalanche blockchain" />
        <meta name="keywords" content="blockchain, NFT, tickets, events, Avalanche" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#3b82f6" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="EventXX" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body className={`${inter.className} bg-black text-white`}>
        <Providers>
          <Navigation />
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#4ade80',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 4000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </Providers>
      </body>
    </html>
  )
}