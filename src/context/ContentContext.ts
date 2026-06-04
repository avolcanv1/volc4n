import { createContext, useContext } from 'react'
import type { AboutContent, GalleryItem } from '../types'

export type ContentContextValue = {
  projects: GalleryItem[]
  about: AboutContent
  isLoading: boolean
  usesSanity: boolean
}

export const ContentContext = createContext<ContentContextValue | null>(null)

export function useContent() {
  const context = useContext(ContentContext)
  if (!context) {
    throw new Error('useContent must be used within ContentProvider')
  }
  return context
}
