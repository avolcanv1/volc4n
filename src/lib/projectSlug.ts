import type { GalleryItem } from '../types'

export function slugify(title: string): string {
  return title
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Collisions get -2, -3… in id order (not display order), so a project's slug
 * does not change when the gallery is re-sorted.
 */
export function withProjectSlugs(projects: GalleryItem[]): GalleryItem[] {
  const slugById = new Map<string, string>()
  const used = new Set<string>()

  const byId = [...projects].sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0))
  for (const project of byId) {
    const base = slugify(project.title) || slugify(project.id) || 'project'
    let slug = base
    for (let n = 2; used.has(slug); n += 1) {
      slug = `${base}-${n}`
    }
    used.add(slug)
    slugById.set(project.id, slug)
  }

  return projects.map((project) => ({ ...project, slug: slugById.get(project.id) }))
}

export function projectPath(project: GalleryItem): string {
  return `/project/${project.slug ?? encodeURIComponent(project.id)}`
}
