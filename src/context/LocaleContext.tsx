import { createContext, useContext } from 'react'
import type { QuoteLocale } from '../lib/quoteCopy'

export type LocaleContextValue = {
  locale: QuoteLocale
  setLocale: (locale: QuoteLocale) => void
}

export const LocaleContext = createContext<LocaleContextValue | null>(null)

export function useLocale() {
  const context = useContext(LocaleContext)

  if (!context) {
    throw new Error('useLocale must be used within LocaleProvider')
  }

  return context
}
