export type GalleryItem = {
  id: string
  category: string
  title: string
  year: string
  images: string[]
  imageAlt: string
}

export type AboutContent = {
  bio: string
  email: string
  address: string
}

export function getProjectImage(item: GalleryItem, imageIndex = 0): string {
  return item.images[Math.min(imageIndex, item.images.length - 1)] ?? item.images[0]
}
