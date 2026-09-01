import { useEffect, useRef, useState } from 'react'

const ACTIVITY_EVENTS = ['pointerdown', 'keydown', 'scroll', 'touchstart', 'click'] as const

export function useIdle(timeoutMs: number) {
  const [isIdle, setIsIdle] = useState(false)
  const lastActivityAtRef = useRef(Date.now())
  const timerRef = useRef(0)

  useEffect(() => {
    const clearIdleTimer = () => {
      window.clearTimeout(timerRef.current)
      timerRef.current = 0
    }

    const syncIdleState = () => {
      const elapsed = Date.now() - lastActivityAtRef.current

      if (elapsed >= timeoutMs) {
        clearIdleTimer()
        setIsIdle(true)
        return
      }

      setIsIdle(false)
      clearIdleTimer()
      timerRef.current = window.setTimeout(() => {
        setIsIdle(true)
      }, timeoutMs - elapsed)
    }

    const onActivity = () => {
      lastActivityAtRef.current = Date.now()
      syncIdleState()
    }

    const onVisibilityChange = () => {
      if (document.hidden) {
        clearIdleTimer()
        return
      }

      syncIdleState()
    }

    for (const eventName of ACTIVITY_EVENTS) {
      window.addEventListener(eventName, onActivity, { passive: true })
    }

    document.addEventListener('visibilitychange', onVisibilityChange)
    syncIdleState()

    return () => {
      clearIdleTimer()

      for (const eventName of ACTIVITY_EVENTS) {
        window.removeEventListener(eventName, onActivity)
      }

      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [timeoutMs])

  return isIdle
}
