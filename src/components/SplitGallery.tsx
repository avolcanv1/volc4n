import { useEffect, useMemo, useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useContent } from '../context/ContentContext'
import { useTheme } from '../context/ThemeContext'
import { getProjectLane, isWebDesignCategory, type ProjectLane } from '../lib/projectCategory'
import type { GalleryItem } from '../types'
import { PageNav } from './PageNav'
import { ProjectMedia } from './ProjectMedia'
import { ThemeToggle } from './ThemeToggle'
import '../styles/page.css'
import './SplitGallery.css'

const LANE_COPY: Record<ProjectLane, string> = {
  editorial: 'Editorial',
  digital: 'Digital',
}

function LaneColumn({
  lane,
  projects,
  focusId,
}: {
  lane: ProjectLane
  projects: GalleryItem[]
  focusId: string | null
}) {
  const scrollerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!focusId || !scrollerRef.current) {
      return
    }

    const target = scrollerRef.current.querySelector<HTMLElement>(
      `[data-project-id="${CSS.escape(focusId)}"]`,
    )

    target?.scrollIntoView({ block: 'start', behavior: 'smooth' })
  }, [focusId])

  return (
    <section
      className={`split__lane split__lane--${lane}`}
      aria-label={LANE_COPY[lane]}
    >
      <div ref={scrollerRef} className="split__scroller">
        <h2 className="split__lane-label">{LANE_COPY[lane]}</h2>

        {projects.length === 0 ? (
          <p className="split__empty">No projects yet.</p>
        ) : (
          projects.map((project) => (
            <article
              key={project.id}
              className="split__project"
              data-project-id={project.id}
            >
              <div className="split__media-stack">
                {project.media.map((media, mediaIndex) => (
                  <figure key={`${project.id}-${mediaIndex}`} className="split__figure">
                    <ProjectMedia
                      media={media}
                      className="split__media"
                      alt={media.caption || project.imageAlt}
                      roundedVideo={isWebDesignCategory(project.category)}
                    />
                    {media.caption ? (
                      <figcaption className="split__caption">{media.caption}</figcaption>
                    ) : null}
                  </figure>
                ))}
              </div>
              <p className="split__meta">
                <span className="split__title">{project.title}</span>
                <span className="split__year">{project.year}</span>
              </p>
            </article>
          ))
        )}
      </div>
    </section>
  )
}

export function SplitGallery() {
  const { isDark } = useTheme()
  const { projects } = useContent()
  const [searchParams] = useSearchParams()
  const focusId = searchParams.get('project')

  const lanes = useMemo(() => {
    const editorial: GalleryItem[] = []
    const digital: GalleryItem[] = []

    for (const project of projects) {
      if (getProjectLane(project.category) === 'digital') {
        digital.push(project)
      } else {
        editorial.push(project)
      }
    }

    return { editorial, digital }
  }, [projects])

  const focusLane = useMemo(() => {
    if (!focusId) {
      return null
    }

    const match = projects.find((project) => project.id === focusId)
    return match ? getProjectLane(match.category) : null
  }, [focusId, projects])

  return (
    <div className={`page split${isDark ? ' page--dark' : ''}`}>
      <header className="split__header page__bar">
        <Link to="/" className="site-logo">
          volc4n
        </Link>
        <PageNav />
        <ThemeToggle />
      </header>

      <div className="split__columns">
        <LaneColumn
          lane="editorial"
          projects={lanes.editorial}
          focusId={focusLane === 'editorial' ? focusId : null}
        />
        <LaneColumn
          lane="digital"
          projects={lanes.digital}
          focusId={focusLane === 'digital' ? focusId : null}
        />
      </div>
    </div>
  )
}
