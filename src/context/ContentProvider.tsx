import { useEffect, useState, type ReactNode } from 'react'
import { defaultAbout } from '../data/defaultAbout'
import { galleryItems as fallbackProjects } from '../data/gallery'
import { mapAbout, mapProject } from '../lib/mapContent'
import { aboutQuery, projectsQuery } from '../lib/queries'
import { sortProjectsChronologically } from '../lib/sortProjects'
import { isSanityConfigured, sanityClient } from '../lib/sanity'
import type { AboutContent, GalleryItem } from '../types'
import { ContentContext } from './ContentContext'

const FETCH_TIMEOUT_MS = 8000

const fallbackDescriptions = new Map(
  fallbackProjects
    .filter((project) => project.description?.length)
    .map((project) => [project.title.trim().toLowerCase(), project.description!]),
)

function withFallbackDescriptions(projects: GalleryItem[]): GalleryItem[] {
  return projects.map((project) => {
    if (project.description?.length) {
      return project
    }

    const fallbackDescription = fallbackDescriptions.get(project.title.trim().toLowerCase())

    return fallbackDescription ? { ...project, description: fallbackDescription } : project
  })
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = window.setTimeout(() => {
      reject(new Error('Sanity request timed out'))
    }, ms)

    promise
      .then((value) => {
        window.clearTimeout(timer)
        resolve(value)
      })
      .catch((error: unknown) => {
        window.clearTimeout(timer)
        reject(error)
      })
  })
}

export function ContentProvider({ children }: { children: ReactNode }) {
  const usesSanity = isSanityConfigured
  const [projects, setProjects] = useState<GalleryItem[]>(() =>
    sortProjectsChronologically(fallbackProjects),
  )
  const [about, setAbout] = useState<AboutContent>(defaultAbout)
  const [isLoading, setIsLoading] = useState(usesSanity)

  useEffect(() => {
    if (!usesSanity || !sanityClient) {
      return
    }

    let cancelled = false

    withTimeout(
      Promise.all([
        sanityClient.fetch(projectsQuery),
        sanityClient.fetch(aboutQuery),
      ]),
      FETCH_TIMEOUT_MS,
    )
      .then(([rawProjects, rawAbout]) => {
        if (cancelled) return

        const mappedProjects = Array.isArray(rawProjects)
          ? sortProjectsChronologically(withFallbackDescriptions(rawProjects.map(mapProject)))
          : []
        setProjects(mappedProjects.length > 0 ? mappedProjects : sortProjectsChronologically(fallbackProjects))

        if (rawAbout) {
          setAbout(mapAbout(rawAbout))
        }
      })
      .catch(() => {
        if (cancelled) return

        setProjects(sortProjectsChronologically(fallbackProjects))
        setAbout(defaultAbout)
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [usesSanity])

  return (
    <ContentContext.Provider
      value={{
        projects,
        about,
        isLoading,
        usesSanity,
      }}
    >
      {children}
    </ContentContext.Provider>
  )
}
