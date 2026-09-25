import { useCallback, useEffect, useMemo, useRef, useState, type TouchEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useContent } from '../context/ContentContext'
import { useTheme } from '../context/ThemeContext'
import { getProjectLane, isWebDesignCategory, type ProjectLane } from '../lib/projectCategory'
import { hasRichTextContent } from '../lib/richText'
import { getProjectMedia, type GalleryItem, type ProjectMedia as ProjectMediaItem } from '../types'
import { PageNav } from './PageNav'
import { ProjectMedia } from './ProjectMedia'
import { RichText } from './RichText'
import { ThemeToggle } from './ThemeToggle'
import '../styles/page.css'
import './SplitGallery.css'

const LANE_COPY: Record<ProjectLane, string> = {
  editorial: 'Editorial',
  digital: 'Digital',
}

const SWIPE_THRESHOLD = 48
const SWIPE_LOCK_PX = 10
const SNAP_LOCK_MS = 620

function preloadImageMedia(media: ProjectMediaItem | undefined) {
  if (!media || media.kind !== 'image') {
    return
  }

  const image = new Image()
  image.src = media.src
}

function ProjectPane({ project }: { project: GalleryItem }) {
  const [imageIndex, setImageIndex] = useState(0)
  const [infoOpen, setInfoOpen] = useState(false)
  const touchStartRef = useRef<{ x: number; y: number } | null>(null)
  const mediaCount = project.media.length
  const safeIndex = Math.min(imageIndex, Math.max(mediaCount - 1, 0))
  const currentMedia = getProjectMedia(project, safeIndex)
  const description = project.description
  const hasDescription = hasRichTextContent(description)

  const cycle = useCallback(
    (direction: -1 | 1) => {
      if (mediaCount <= 1) {
        return
      }

      setImageIndex((current) => (current + direction + mediaCount) % mediaCount)
    },
    [mediaCount],
  )

  useEffect(() => {
    setInfoOpen(false)
  }, [safeIndex, project.id])

  useEffect(() => {
    preloadImageMedia(getProjectMedia(project, safeIndex - 1))
    preloadImageMedia(getProjectMedia(project, safeIndex + 1))
  }, [project, safeIndex])

  function handleTouchStart(event: TouchEvent<HTMLDivElement>) {
    if (event.touches.length !== 1) {
      touchStartRef.current = null
      return
    }

    const touch = event.touches[0]
    touchStartRef.current = { x: touch.clientX, y: touch.clientY }
  }

  function handleTouchEnd(event: TouchEvent<HTMLDivElement>) {
    const start = touchStartRef.current
    touchStartRef.current = null

    if (!start || mediaCount <= 1 || event.changedTouches.length !== 1) {
      return
    }

    const touch = event.changedTouches[0]
    const deltaX = touch.clientX - start.x
    const deltaY = touch.clientY - start.y

    if (Math.abs(deltaX) < SWIPE_THRESHOLD || Math.abs(deltaX) < Math.abs(deltaY) + SWIPE_LOCK_PX) {
      return
    }

    cycle(deltaX < 0 ? 1 : -1)
  }

  if (!currentMedia) {
    return null
  }

  return (
    <article className="split__project" data-project-id={project.id}>
      <div
        className="split__stage fit-media"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {mediaCount > 1 ? (
          <>
            <button
              type="button"
              className="split__nav split__nav--prev"
              aria-label="Previous image"
              onPointerDown={(event) => event.preventDefault()}
              onClick={() => cycle(-1)}
            />
            <button
              type="button"
              className="split__nav split__nav--next"
              aria-label="Next image"
              onPointerDown={(event) => event.preventDefault()}
              onClick={() => cycle(1)}
            />
          </>
        ) : null}

        <figure className="split__figure">
          <div className="split__media-wrap">
            <ProjectMedia
              key={`${project.id}-${safeIndex}-${currentMedia.src}`}
              media={currentMedia}
              className="split__media fit-media__image"
              alt={currentMedia.caption || project.imageAlt}
              roundedVideo={isWebDesignCategory(project.category)}
            />
            {currentMedia.caption ? (
              <div className="split__caption-rail">
                <p className="split__caption">{currentMedia.caption}</p>
              </div>
            ) : null}
          </div>
        </figure>
      </div>

      <footer
        className={`split__footer${hasDescription ? ' split__footer--expandable' : ''}${
          infoOpen ? ' split__footer--open' : ''
        }`}
        aria-expanded={hasDescription ? infoOpen : undefined}
        onClick={hasDescription ? () => setInfoOpen((open) => !open) : undefined}
        onKeyDown={
          hasDescription
            ? (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  setInfoOpen((open) => !open)
                }
              }
            : undefined
        }
        role={hasDescription ? 'button' : undefined}
        tabIndex={hasDescription ? 0 : undefined}
      >
        <p className="split__meta-line">
          {mediaCount > 1 ? (
            <span className="split__counter">
              ( {String(safeIndex + 1).padStart(2, '0')} / {String(mediaCount).padStart(2, '0')} )
            </span>
          ) : null}{' '}
          <span className="split__category">{project.category}</span>
        </p>
        <p className="split__title">
          <span className="split__title-text">{project.title}</span>
          {hasDescription ? (
            <span className="split__expand" aria-hidden="true">
              {infoOpen ? '—' : '+'}
            </span>
          ) : null}
        </p>
        <p className="split__year">{project.year}</p>
        {hasDescription && description ? (
          <div className="split__description-wrap">
            <RichText value={description} className="split__description" />
          </div>
        ) : null}
      </footer>
    </article>
  )
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
  const lockRef = useRef(false)
  const unlockTimerRef = useRef(0)

  const unlockSoon = useCallback(() => {
    window.clearTimeout(unlockTimerRef.current)
    unlockTimerRef.current = window.setTimeout(() => {
      lockRef.current = false
    }, SNAP_LOCK_MS)
  }, [])

  const snapBy = useCallback(
    (direction: -1 | 1) => {
      const scroller = scrollerRef.current

      if (!scroller || lockRef.current || projects.length === 0) {
        return
      }

      const pane = scroller.clientHeight
      const maxTop = scroller.scrollHeight - pane
      const nextTop = Math.min(maxTop, Math.max(0, scroller.scrollTop + direction * pane))

      if (Math.abs(nextTop - scroller.scrollTop) < 2) {
        return
      }

      lockRef.current = true
      scroller.scrollTo({ top: nextTop, behavior: 'smooth' })
      unlockSoon()
    },
    [projects.length, unlockSoon],
  )

  useEffect(() => {
    const scroller = scrollerRef.current

    if (!scroller) {
      return
    }

    const onWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaY) < Math.abs(event.deltaX)) {
        return
      }

      if (Math.abs(event.deltaY) < 8) {
        return
      }

      event.preventDefault()
      snapBy(event.deltaY > 0 ? 1 : -1)
    }

    const onScrollEnd = () => {
      lockRef.current = false
      window.clearTimeout(unlockTimerRef.current)
    }

    scroller.addEventListener('wheel', onWheel, { passive: false })
    scroller.addEventListener('scrollend', onScrollEnd)

    return () => {
      scroller.removeEventListener('wheel', onWheel)
      scroller.removeEventListener('scrollend', onScrollEnd)
      window.clearTimeout(unlockTimerRef.current)
    }
  }, [snapBy])

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
    <section className={`split__lane split__lane--${lane}`} aria-label={LANE_COPY[lane]}>
      <h2 className="split__lane-label">{LANE_COPY[lane]}</h2>
      <div ref={scrollerRef} className="split__scroller">
        {projects.length === 0 ? (
          <p className="split__empty">No projects yet.</p>
        ) : (
          projects.map((project) => <ProjectPane key={project.id} project={project} />)
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
