function normalizeProjectCategory(category: string) {
  return category
    .trim()
    .toLowerCase()
    .replace(/[+&]/g, ' and ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function isWebDesignCategory(category: string) {
  const normalized = normalizeProjectCategory(category)

  return normalized === 'web design and development' || normalized === 'web design'
}
