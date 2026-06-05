import type { GalleryItem, ProjectMedia } from '../types'

const image = (src: string): ProjectMedia => ({ kind: 'image', src })
import { plainTextToBlocks } from '../lib/richText'

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
    description: plainTextToBlocks('Lorem ipsum dolor sit amet'),
    media: [image(placeholders.checker), image(placeholders.diagonal), image(placeholders.frame)],
    imageAlt: 'Great Nation. Carlos Martiel',
  },
  {
    id: 'project-2',
    category: 'Editorial Design',
    title: 'Project 2',
    year: '2026',
    media: [image(placeholders.split), image(placeholders.grid)],
    imageAlt: 'Project 2',
  },
  {
    id: 'project-3',
    category: 'Visual Identity',
    title: 'Project 3',
    year: '2025',
    media: [image(placeholders.frame), image(placeholders.checker), image(placeholders.grid)],
    imageAlt: 'Project 3',
  },
  {
    id: 'project-4',
    category: 'Editorial Design',
    title: 'Project 4',
    year: '2025',
    media: [image(placeholders.diagonal)],
    imageAlt: 'Project 4',
  },
  {
    id: 'project-5',
    category: 'Art Direction',
    title: 'Project 5',
    year: '2024',
    media: [image(placeholders.grid), image(placeholders.split)],
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
      media: [image(pool[offset % pool.length])],
      imageAlt: `Project ${offset + 1}`,
    }
  }),
]
