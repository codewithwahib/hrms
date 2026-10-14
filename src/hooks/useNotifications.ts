// src/hooks/useNotifications.ts

'use client'

import { useEffect, useState, useCallback } from 'react'

const NOTIFICATION_KEYS = {
  leave: 'newLeaveNotification',
  siteVisit: 'newSiteVisitNotification',
} as const

// BroadcastChannel for cross-tab communication
let channel: BroadcastChannel | null = null
if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
  channel = new BroadcastChannel('hrms-notifications')
}

export function useNotifications() {
  const [hasNewLeave, setHasNewLeave] = useState(false)
  const [hasNewSiteVisit, setHasNewSiteVisit] = useState(false)

  const readAll = useCallback(() => {
    if (typeof window === 'undefined') return

    try {
      const leaveVal = localStorage.getItem(NOTIFICATION_KEYS.leave)
      const siteVisitVal = localStorage.getItem(NOTIFICATION_KEYS.siteVisit)

      setHasNewLeave(leaveVal === 'true')
      setHasNewSiteVisit(siteVisitVal === 'true')
    } catch (err) {
      console.error('Error reading notifications:', err)
    }
  }, [])

  useEffect(() => {
    // Read on mount
    readAll()

    // ✅ 1. Storage event (cross-tab)
    const onStorage = (e: StorageEvent) => {
      if (
        e.key === NOTIFICATION_KEYS.leave ||
        e.key === NOTIFICATION_KEYS.siteVisit
      ) {
        readAll()
      }
    }

    // ✅ 2. Custom event (same-tab)
    const onCustom = () => readAll()

    // ✅ 3. BroadcastChannel (cross-tab real-time)
    const onBroadcast = () => readAll()

    // ✅ 4. Polling fallback (every 500ms — very fast)
    const interval = setInterval(readAll, 500)

    // ✅ 5. Visibility change (jab user tab pe wapas aaye)
    const onVisibility = () => {
      if (document.visibilityState === 'visible') readAll()
    }

    window.addEventListener('storage', onStorage)
    window.addEventListener('notificationUpdate', onCustom)
    window.addEventListener('visibilitychange', onVisibility)

    if (channel) {
      channel.addEventListener('message', onBroadcast)
    }

    return () => {
      window.removeEventListener('storage', onStorage)
      window.removeEventListener('notificationUpdate', onCustom)
      window.removeEventListener('visibilitychange', onVisibility)
      clearInterval(interval)
      if (channel) {
        channel.removeEventListener('message', onBroadcast)
      }
    }
  }, [readAll])

  const clearLeave = useCallback(() => {
    try {
      localStorage.setItem(NOTIFICATION_KEYS.leave, 'false')
    } catch {}
    setHasNewLeave(false)
    if (channel) channel.postMessage({ type: 'update' })
    window.dispatchEvent(new Event('notificationUpdate'))
  }, [])

  const clearSiteVisit = useCallback(() => {
    try {
      localStorage.setItem(NOTIFICATION_KEYS.siteVisit, 'false')
    } catch {}
    setHasNewSiteVisit(false)
    if (channel) channel.postMessage({ type: 'update' })
    window.dispatchEvent(new Event('notificationUpdate'))
  }, [])

  return {
    hasNewLeave,
    hasNewSiteVisit,
    clearLeave,
    clearSiteVisit,
  }
}

// ✅ Global helper — call this from ANY component to trigger notification
export function triggerLeaveNotification() {
  if (typeof window === 'undefined') return
  localStorage.setItem(NOTIFICATION_KEYS.leave, 'true')
  if (channel) channel.postMessage({ type: 'update' })
  window.dispatchEvent(new Event('notificationUpdate'))
}

export function triggerSiteVisitNotification() {
  if (typeof window === 'undefined') return
  localStorage.setItem(NOTIFICATION_KEYS.siteVisit, 'true')
  if (channel) channel.postMessage({ type: 'update' })
  window.dispatchEvent(new Event('notificationUpdate'))
}