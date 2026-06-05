import type { PortableTextBlock } from '@portabletext/types'

export type RichText = PortableTextBlock[]

export type GalleryItem = {
  id: string
  category: string
  title: string
  year: string
  description?: RichText
  images: string[]
  imageAlt: string
}

export type AboutContent = {
  bio: RichText
  email: string
  address: string
}

export function getProjectImage(item: GalleryItem, imageIndex = 0): string {
  return item.images[Math.min(imageIndex, item.images.length - 1)] ?? item.images[0]
}
