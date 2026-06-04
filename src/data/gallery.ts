import type { GalleryItem } from '../types'

const placeholders = {
  checker: '/images/placeholder.png',
  diagonal: '/images/placeholder-a.svg',
  split: '/images/placeholder-b.svg',
  frame: '/images/placeholder-c.svg',
  grid: '/images/placeholder-d.svg',
} as const

export const galleryItems: GalleryItem[] = [
  {
    id: 'great-nation',
    category: 'Editorial Desgin',
    title: 'Great Nation. Carlos Martiel',
    year: '2026',
    images: [placeholders.checker, placeholders.diagonal, placeholders.frame],
    imageAlt: 'Great Nation. Carlos Martiel',
  },
  {
    id: 'project-2',
    category: 'Editorial Design',
    title: 'Project 2',
    year: '2026',
    images: [placeholders.split, placeholders.grid],
    imageAlt: 'Project 2',
  },
  {
    id: 'project-3',
    category: 'Visual Identity',
    title: 'Project 3',
    year: '2025',
    images: [placeholders.frame, placeholders.checker, placeholders.grid],
    imageAlt: 'Project 3',
  },
  {
    id: 'project-4',
    category: 'Editorial Design',
    title: 'Project 4',
    year: '2025',
    images: [placeholders.diagonal],
    imageAlt: 'Project 4',
  },
  {
    id: 'project-5',
    category: 'Art Direction',
    title: 'Project 5',
    year: '2024',
    images: [placeholders.grid, placeholders.split],
    imageAlt: 'Project 5',
  },
  ...Array.from({ length: 25 }, (_, index) => {
    const pool = Object.values(placeholders)
    const offset = index + 5

    return {
      id: `project-${offset + 1}`,
      category: 'Category',
      title: `Project ${offset + 1}`,
      year: '2026',
      images: [pool[offset % pool.length]],
      imageAlt: `Project ${offset + 1}`,
    }
  }),
]
