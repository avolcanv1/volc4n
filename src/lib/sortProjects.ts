import type { GalleryItem } from '../types'

function projectYearValue(year: string) {
  const parsed = Number.parseInt(year, 10)
  return Number.isFinite(parsed) ? parsed : 0
}

export function sortProjectsChronologically(projects: GalleryItem[]): GalleryItem[] {
  return [...projects].sort((left, right) => {
    const leftOrder = left.order ?? Number.MAX_SAFE_INTEGER
    const rightOrder = right.order ?? Number.MAX_SAFE_INTEGER
    const orderDiff = leftOrder - rightOrder

    if (orderDiff !== 0) {
      return orderDiff
    }

    const yearDiff = projectYearValue(right.year) - projectYearValue(left.year)

    if (yearDiff !== 0) {
      return yearDiff
    }

    return left.title.localeCompare(right.title, undefined, { sensitivity: 'base' })
  })
}
