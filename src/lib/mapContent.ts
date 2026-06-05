import type { PortableTextBlock } from '@portabletext/types'
import imageUrlBuilder from '@sanity/image-url'
import type { GalleryItem, RichText } from '../types'
import { sanityClient } from './sanity'

const builder = sanityClient ? imageUrlBuilder(sanityClient) : null

type SanityProject = {
  id: string
  title: string
  category: string
  year: string
  description?: RichText
  images: Parameters<NonNullable<typeof builder>['image']>[0][]
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
    images: doc.images.map((image) =>
      builder!
        .image(image)
        .ignoreImageParams()
        .width(2400)
        .fit('max')
        .auto('format')
        .url(),
    ),
  }
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
