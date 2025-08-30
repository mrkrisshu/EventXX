'use client'

import { useEffect, useState } from 'react'

/**
 * ClientOnly component to prevent hydration mismatches
 * Only renders its children on the client-side after hydration
 */
export default function ClientOnly({ children, fallback = null }) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return fallback
  }

  return children
}