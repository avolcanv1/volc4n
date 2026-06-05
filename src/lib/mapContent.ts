import type { PortableTextBlock } from '@portabletext/types'
import imageUrlBuilder from '@sanity/image-url'
import type { GalleryItem, ProjectMedia, RichText } from '../types'
import { sanityClient } from './sanity'

const builder = sanityClient ? imageUrlBuilder(sanityClient) : null

type SanityProject = {
  id: string
  title: string
  category: string
  year: string
  description?: RichText
  images: unknown[]
}

type SanityAbout = {
  bio?: RichText
  email: string
  address: string
}

export function mapProject(doc: SanityProject): GalleryItem {
  return {
    id: doc.id,
    title: doc.title,
    category: doc.category,
    year: doc.year,
    description: normalizeRichText(doc.description),
    imageAlt: doc.title,
    media: doc.images.map(mapMediaItem).filter((item): item is ProjectMedia => item !== null),
  }
}

function mapMediaItem(item: unknown): ProjectMedia | null {
  if (!item || typeof item !== 'object') {
    return null
  }

  const record = item as Record<string, unknown>

  if (record._type === 'videoUrl' && typeof record.url === 'string' && record.url) {
    return { kind: 'video', src: record.url }
  }

  if (builder && record.asset) {
    return {
      kind: 'image',
      src: builder
        .image(item as Parameters<typeof builder.image>[0])
        .ignoreImageParams()
        .width(2400)
        .fit('max')
        .auto('format')
        .url(),
    }
  }

  return null
}

export function mapAbout(doc: SanityAbout) {
  return {
    bio: normalizeRichText(doc.bio) ?? [],
    email: doc.email,
    address: doc.address,
  }
}

function normalizeRichText(value: unknown): RichText | undefined {
  if (!Array.isArray(value) || value.length === 0) {
    return undefined
  }

  return value as PortableTextBlock[]
}
