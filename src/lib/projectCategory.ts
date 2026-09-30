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

export const PROJECT_LANES: readonly ProjectLane[] = ['books', 'notBooks']

export const PROJECT_LANE_LABELS: Record<ProjectLane, string> = {
  books: 'Books',
  notBooks: 'Not books',
}

export function groupProjectsByLane<T extends { category: string }>(
  projects: readonly T[],
): Record<ProjectLane, T[]> {
  const lanes: Record<ProjectLane, T[]> = { books: [], notBooks: [] }

  for (const project of projects) {
    lanes[getProjectLane(project.category)].push(project)
  }

  return lanes
}
