import type { GalleryItem } from '../types'

function projectYearValue(year: string) {
  const parsed = Number.parseInt(year, 10)
  return Number.isFinite(parsed) ? parsed : 0
}

export function sortProjectsChronologically(projects: GalleryItem[]): GalleryItem[] {
  return [...projects].sort((left, right) => {
    const yearDiff = projectYearValue(right.year) - projectYearValue(left.year)

    if (yearDiff !== 0) {
      return yearDiff
    }

    return left.title.localeCompare(right.title, undefined, { sensitivity: 'base' })
  })
}
