import type { PortableTextBlock } from '@portabletext/types'

export type RichText = PortableTextBlock[]

export type ProjectMedia =
  | { kind: 'image'; src: string; caption?: string }
  | { kind: 'video'; src: string; caption?: string }

export type GalleryItem = {
  id: string
  category: string
  title: string
  year: string
  order?: number
  description?: RichText
  media: ProjectMedia[]
  imageAlt: string
}

export type AboutContent = {
  bio: RichText
  email: string
  address: string
}

export function getProjectMedia(item: GalleryItem, mediaIndex = 0): ProjectMedia | undefined {
  if (item.media.length === 0) {
    return undefined
  }

  return item.media[Math.min(Math.max(mediaIndex, 0), item.media.length - 1)]
}
