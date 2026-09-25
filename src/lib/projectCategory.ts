function normalizeProjectCategory(category: string) {
  return category
    .trim()
    .toLowerCase()
    .replace(/[+&]/g, ' and ')
    .replace(/\s+/g, ' ')
    .trim()
}

export type ProjectLane = 'editorial' | 'digital'

export function isWebDesignCategory(category: string) {
  const normalized = normalizeProjectCategory(category)

  return normalized === 'web design and development' || normalized === 'web design'
}

export function isDigitalCategory(category: string) {
  const normalized = normalizeProjectCategory(category)

  return normalized.includes('web') || normalized.includes('digital')
}

export function isEditorialCategory(category: string) {
  const normalized = normalizeProjectCategory(category)

  return normalized.includes('editorial')
}

export function getProjectLane(category: string): ProjectLane {
  if (isDigitalCategory(category)) {
    return 'digital'
  }

  return 'editorial'
}
