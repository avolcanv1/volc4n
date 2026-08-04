import { useEffect, useState, type ReactNode } from 'react'
import type { QuoteLocale } from '../lib/quoteCopy'
import { LocaleContext } from './LocaleContext'

const STORAGE_KEY = 'volc4n-locale'

function readStoredLocale(): QuoteLocale {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'es' || stored === 'en') return stored
  } catch {
    // ignore
  }
  return 'es'
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<QuoteLocale>(() =>
    typeof window === 'undefined' ? 'es' : readStoredLocale(),
  )

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, locale)
    } catch {
      // ignore
    }
    document.documentElement.lang = locale
  }, [locale])

  function setLocale(next: QuoteLocale) {
    setLocaleState(next)
  }

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>{children}</LocaleContext.Provider>
  )
}
