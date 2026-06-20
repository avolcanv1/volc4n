import type { GalleryItem, ProjectMedia } from '../types'

const image = (src: string): ProjectMedia => ({ kind: 'image', src })

const images = (...paths: string[]): ProjectMedia[] => paths.map(image)

export const galleryItems: GalleryItem[] = [
  {
    id: 'cristina-flores-pescoran',
    category: 'Editorial Design',
    title: 'Cristina Flores Pescorán',
    year: '2026',
    media: images(
      '/images/projects/cfp/cfp-1.png',
      '/images/projects/cfp/cfp-2.png',
      '/images/projects/cfp/cfp-3.png',
      '/images/projects/cfp/cfp-4.png',
    ),
    imageAlt: 'Cristina Flores Pescorán',
  },
  {
    id: 'oleajes',
    category: 'Editorial Design',
    title: 'Oleajes. Los gestos del mar',
    year: '2025',
    media: images(
      '/images/projects/oleajes/oleajes.png',
      '/images/projects/oleajes/oleajes-1.png',
      '/images/projects/oleajes/oleajes-2.png',
    ),
    imageAlt: 'Oleajes. Los gestos del mar',
  },
  {
    id: 'guerra',
    category: 'Editorial Design',
    title: 'Una película de amor y guerra',
    year: '2024',
    media: images(
      '/images/projects/guerra/guerra-1.png',
      '/images/projects/guerra/guerra-2.png',
      '/images/projects/guerra/guerra-3.png',
      '/images/projects/guerra/guerra-4.png',
    ),
    imageAlt: 'Una película de amor y guerra',
  },
  {
    id: 'ficunam',
    category: 'Editorial Design',
    title: 'FICUNAM',
    year: '2024',
    media: images(
      '/images/projects/ficunam/ficunam-1.png',
      '/images/projects/ficunam/ficunam-2.png',
      '/images/projects/ficunam/ficunam-3.png',
      '/images/projects/ficunam/ficunam-4.png',
      '/images/projects/ficunam/ficunam-5.png',
      '/images/projects/ficunam/ficunam-6.png',
      '/images/projects/ficunam/ficunam-7.png',
      '/images/projects/ficunam/ficunam-8.png',
      '/images/projects/ficunam/ficunam-9.png',
    ),
    imageAlt: 'FICUNAM',
  },
  {
    id: 'el-cine-probablemente',
    category: 'Editorial Design',
    title: 'El cine probablemente',
    year: '2021',
    media: images(
      '/images/projects/ecp/ecp-1.png',
      '/images/projects/ecp/ecp-2.png',
      '/images/projects/ecp/ecp-3.png',
      '/images/projects/ecp/ecp-4.png',
      '/images/projects/ecp/ecp-5.png',
      '/images/projects/ecp/ecp-6.png',
    ),
    imageAlt: 'El cine probablemente',
  },
]
