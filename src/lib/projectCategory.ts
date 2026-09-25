function normalizeProjectCategory(category: string) {
  return category
    .trim()
    .toLowerCase()
    .replace(/[+&]/g, ' and ')
    .replace(/\s+/g, ' ')
    .trim()
}

export type ProjectLane = 'books' | 'notBooks'

export function isWebDesignCategory(category: string) {
  const normalized = normalizeProjectCategory(category)

  return normalized === 'web design and development' || normalized === 'web design'
}

export function isBookCategory(category: string) {
  const normalized = normalizeProjectCategory(category)

  return (
    normalized.includes('editorial') ||
    normalized.includes('book') ||
    normalized.includes('libro')
  )
}

export function isEditorialCategory(category: string) {
  return isBookCategory(category)
}

export function getProjectLane(category: string): ProjectLane {
  if (isBookCategory(category)) {
    return 'books'
  }

  return 'notBooks'
}
