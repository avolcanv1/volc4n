import imageUrlBuilder from '@sanity/image-url'
import type { GalleryItem } from '../types'
import { sanityClient } from './sanity'

const builder = sanityClient ? imageUrlBuilder(sanityClient) : null

type SanityProject = {
  id: string
  title: string
  category: string
  year: string
  images: Parameters<NonNullable<typeof builder>['image']>[0][]
}

export function mapProject(doc: SanityProject): GalleryItem {
  return {
    id: doc.id,
    title: doc.title,
    category: doc.category,
    year: doc.year,
    imageAlt: doc.title,
    images: doc.images.map((image) =>
      builder!
        .image(image)
        .height(1080)
        .fit('max')
        .auto('format')
        .url(),
    ),
  }
}
