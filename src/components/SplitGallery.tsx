import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type TouchEvent,
  type TransitionEvent,
} from 'react'
import { useSearchParams } from 'react-router-dom'
import { useContent } from '../context/ContentContext'
import { useTheme } from '../context/ThemeContext'
import { getProjectLane, isWebDesignCategory, type ProjectLane } from '../lib/projectCategory'
import { hasRichTextContent } from '../lib/richText'
import { getProjectMedia, type GalleryItem, type ProjectMedia as ProjectMediaItem } from '../types'
import { PageHeader } from './PageHeader'
import { ProjectMedia } from './ProjectMedia'
import { RichText } from './RichText'
import '../styles/page.css'
import './SplitGallery.css'

const LANE_COPY: Record<ProjectLane, string> = {
  books: 'Books',
  notBooks: 'Not books',
}

const SWIPE_THRESHOLD = 48
const SWIPE_LOCK_PX = 10
const SNAP_LOCK_MS = 620
const SLIDE_FALLBACK_MS = 520
const SLIDE_GAP_PX = 8

function trackOffsetForSlide(slideIndex: number, slideWidth: number) {
  if (slideWidth <= 0) {
    return 0
  }

  return -(slideIndex * (slideWidth + SLIDE_GAP_PX))
}

const decodedImageCache = new Map<string, Promise<void>>()
const linkPreloadIds = new Set<string>()

function preloadImageMedia(media: ProjectMediaItem | undefined | null) {
  if (!media || media.kind !== 'image') {
    return Promise.resolve()
  }

  const cached = decodedImageCache.get(media.src)
  if (cached) {
    return cached
  }

  const promise = new Promise<void>((resolve) => {
    const image = new Image()

    const finish = () => {
      if ('decode' in image) {
        void image.decode().then(resolve).catch(() => resolve())
        return
      }

      resolve()
    }

    image.onload = finish
    image.onerror = () => resolve()
    image.src = media.src

    if (image.complete) {
      finish()
    }
  })

  decodedImageCache.set(media.src, promise)
  return promise
}

function ensureLinkPreload(src: string, priority: 'high' | 'auto' = 'high') {
  if (typeof document === 'undefined' || linkPreloadIds.has(src)) {
    return
  }

  linkPreloadIds.add(src)

  const link = document.createElement('link')
  link.rel = 'preload'
  link.as = 'image'
  link.href = src
  if (priority === 'high') {
    link.fetchPriority = 'high'
  }
  document.head.appendChild(link)
}

function preloadProjectMedia(project: GalleryItem | undefined | null) {
  if (!project?.media?.length) {
    return Promise.resolve()
  }

  return Promise.all(project.media.map((item) => preloadImageMedia(item))).then(() => undefined)
}

function preloadProjectCover(project: GalleryItem | undefined) {
  if (!project) {
    return Promise.resolve()
  }

  const cover = getProjectMedia(project, 0) ?? project.media[0]
  if (cover?.kind === 'image') {
    ensureLinkPreload(cover.src, 'high')
  }
  return preloadImageMedia(cover)
}

function ProjectPane({
  project,
  showCategory,
}: {
  project: GalleryItem
  showCategory: boolean
}) {
  const [imageIndex, setImageIndex] = useState(0)
  const [visualIndex, setVisualIndex] = useState(1)
  const [infoOpen, setInfoOpen] = useState(false)
  const [slideWidth, setSlideWidth] = useState(0)
  const [trackOffset, setTrackOffset] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const touchStartRef = useRef<{ x: number; y: number } | null>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const isAnimatingRef = useRef(false)
  const pendingVisualRef = useRef<number | null>(null)
  const mediaCount = project.media.length
  const safeIndex = Math.min(imageIndex, Math.max(mediaCount - 1, 0))
  const currentMedia = getProjectMedia(project, safeIndex)
  const description = project.description
  const hasDescription = hasRichTextContent(description)
  const hasCategory = showCategory && Boolean(project.category?.trim())
  const canOpenInfo = hasDescription || hasCategory
  const looped = mediaCount > 1
  const trackSlides = useMemo(() => {
    if (!looped) {
      return project.media
    }

    return [project.media[mediaCount - 1], ...project.media, project.media[0]]
  }, [looped, mediaCount, project.media])
  const activeVisualIndex = looped ? visualIndex : 0
  const restingOffset =
    slideWidth > 0 && (looped || mediaCount > 0)
      ? trackOffsetForSlide(activeVisualIndex, slideWidth)
      : 0

  useLayoutEffect(() => {
    const viewport = viewportRef.current

    if (!viewport) {
      return
    }

    const updateWidth = () => {
      const width = viewport.clientWidth
      setSlideWidth(width)

      if (!isAnimatingRef.current) {
        const index = looped ? visualIndex : 0
        setTrackOffset(width > 0 ? trackOffsetForSlide(index, width) : 0)
      }
    }

    updateWidth()
    const observer = new ResizeObserver(updateWidth)
    observer.observe(viewport)

    return () => observer.disconnect()
  }, [project.id, infoOpen, looped, mediaCount, visualIndex])

  useEffect(() => {
    setInfoOpen(false)
    setImageIndex(0)
    setVisualIndex(1)
    isAnimatingRef.current = false
    pendingVisualRef.current = null
    setIsAnimating(false)
    setTrackOffset(0)
  }, [project.id])

  useEffect(() => {
    setInfoOpen(false)
  }, [safeIndex])

  useEffect(() => {
    void preloadProjectMedia(project)
  }, [project])

  useEffect(() => {
    const nextMedia = looped
      ? getProjectMedia(project, (safeIndex + 1) % mediaCount)
      : null
    const prevMedia = looped
      ? getProjectMedia(project, (safeIndex - 1 + mediaCount) % mediaCount)
      : null

    void preloadImageMedia(currentMedia)
    void preloadImageMedia(nextMedia)
    void preloadImageMedia(prevMedia)

    if (currentMedia?.kind === 'image') {
      ensureLinkPreload(currentMedia.src, 'high')
    }
    if (nextMedia?.kind === 'image') {
      ensureLinkPreload(nextMedia.src, 'high')
    }
    if (prevMedia?.kind === 'image') {
      ensureLinkPreload(prevMedia.src, 'high')
    }
  }, [currentMedia, looped, mediaCount, project, safeIndex])

  const settleAfterSlide = useCallback(() => {
    const pending = pendingVisualRef.current
    pendingVisualRef.current = null

    let nextVisual = pending
    let nextReal = safeIndex

    if (pending != null && looped) {
      if (pending === 0) {
        nextVisual = mediaCount
        nextReal = mediaCount - 1
      } else if (pending === mediaCount + 1) {
        nextVisual = 1
        nextReal = 0
      } else {
        nextVisual = pending
        nextReal = pending - 1
      }
    }

    isAnimatingRef.current = false
    setIsAnimating(false)

    if (nextVisual != null) {
      setVisualIndex(nextVisual)
      setImageIndex(nextReal)
      setTrackOffset(slideWidth > 0 ? trackOffsetForSlide(nextVisual, slideWidth) : 0)
    }
  }, [looped, mediaCount, safeIndex, slideWidth])

  const navigateWithSlide = useCallback(
    (direction: -1 | 1) => {
      if (!looped || isAnimatingRef.current || infoOpen) {
        return
      }

      const width = viewportRef.current?.clientWidth ?? slideWidth
      const targetReal = (safeIndex + direction + mediaCount) % mediaCount
      const targetMedia = getProjectMedia(project, targetReal)

      if (width <= 0) {
        setImageIndex(targetReal)
        setVisualIndex(targetReal + 1)
        return
      }

      const run = async () => {
        if (targetMedia?.kind === 'image') {
          ensureLinkPreload(targetMedia.src, 'high')
        }
        await preloadImageMedia(targetMedia)

        if (isAnimatingRef.current) {
          return
        }

        const nextVisual = visualIndex + direction
        isAnimatingRef.current = true
        pendingVisualRef.current = nextVisual
        setIsAnimating(true)
        setTrackOffset(trackOffsetForSlide(nextVisual, width))
      }

      void run()
    },
    [infoOpen, looped, mediaCount, project, safeIndex, slideWidth, visualIndex],
  )

  function handleTrackTransitionEnd(event: TransitionEvent<HTMLDivElement>) {
    if (event.target !== trackRef.current || event.propertyName !== 'transform') {
      return
    }

    if (!isAnimatingRef.current) {
      return
    }

    settleAfterSlide()
  }

  useEffect(() => {
    if (!isAnimating) {
      return
    }

    const timer = window.setTimeout(() => {
      if (isAnimatingRef.current) {
        settleAfterSlide()
      }
    }, SLIDE_FALLBACK_MS)

    return () => window.clearTimeout(timer)
  }, [isAnimating, settleAfterSlide])

  function handleTouchStart(event: TouchEvent<HTMLDivElement>) {
    if (event.touches.length !== 1 || isAnimatingRef.current) {
      touchStartRef.current = null
      return
    }

    const touch = event.touches[0]
    touchStartRef.current = { x: touch.clientX, y: touch.clientY }
  }

  function handleTouchEnd(event: TouchEvent<HTMLDivElement>) {
    const start = touchStartRef.current
    touchStartRef.current = null

    if (
      !start ||
      !looped ||
      isAnimatingRef.current ||
      event.changedTouches.length !== 1
    ) {
      return
    }

    const touch = event.changedTouches[0]
    const deltaX = touch.clientX - start.x
    const deltaY = touch.clientY - start.y

    if (Math.abs(deltaX) < SWIPE_THRESHOLD || Math.abs(deltaX) < Math.abs(deltaY) + SWIPE_LOCK_PX) {
      return
    }

    navigateWithSlide(deltaX < 0 ? 1 : -1)
  }

  const toggleInfo = useCallback(() => {
    if (!canOpenInfo) {
      return
    }

    setInfoOpen((open) => !open)
  }, [canOpenInfo])

  if (!currentMedia) {
    return null
  }

  return (
    <article
      className={`split__project${infoOpen ? ' split__project--info' : ''}`}
      data-project-id={project.id}
    >
      <p className="split__project-counter" aria-live="polite">
        {String(safeIndex + 1).padStart(2, '0')} / {String(mediaCount).padStart(2, '0')}
      </p>

      <div
        className="split__stage"
        onTouchStart={infoOpen ? undefined : handleTouchStart}
        onTouchEnd={infoOpen ? undefined : handleTouchEnd}
      >
        {infoOpen && canOpenInfo ? (
          <div className="split__info" role="region" aria-label="Project description">
            {hasCategory ? (
              <p className="split__info-category">{project.category}</p>
            ) : null}
            {hasDescription ? (
              <RichText value={description} className="split__description" />
            ) : null}
          </div>
        ) : (
          <>
            {looped ? (
              <>
                <button
                  type="button"
                  className="split__nav split__nav--prev"
                  aria-label="Previous image"
                  onPointerDown={(event) => event.preventDefault()}
                  onClick={() => navigateWithSlide(-1)}
                />
                <button
                  type="button"
                  className="split__nav split__nav--next"
                  aria-label="Next image"
                  onPointerDown={(event) => event.preventDefault()}
                  onClick={() => navigateWithSlide(1)}
                />
              </>
            ) : null}

            <figure className="split__figure">
              <div ref={viewportRef} className="split__viewport">
                <div className="split__clip">
                  <div
                    ref={trackRef}
                    className={`split__track${isAnimating ? ' split__track--animating' : ''}`}
                    style={{
                      transform: `translate3d(${isAnimating ? trackOffset : restingOffset}px, 0, 0)`,
                    }}
                    onTransitionEnd={handleTrackTransitionEnd}
                  >
                    {trackSlides.map((media, slideIndex) => {
                      const isActive = slideIndex === activeVisualIndex
                      const isNeighbor =
                        slideIndex === activeVisualIndex - 1 || slideIndex === activeVisualIndex + 1

                      return (
                        <div
                          key={`${project.id}-track-${slideIndex}-${media.src}`}
                          className="split__slide"
                          aria-hidden={!isActive}
                        >
                          <div className="split__media-wrap">
                            <ProjectMedia
                              media={media}
                              className="split__media"
                              alt={isActive ? media.caption || project.imageAlt : ''}
                              roundedVideo={isWebDesignCategory(project.category)}
                              decoding="async"
                              fetchPriority={isActive || isNeighbor ? 'high' : 'auto'}
                              loading="eager"
                            />
                            {isActive && media.caption ? (
                              <div className="split__caption-rail">
                                <p className="split__caption">{media.caption}</p>
                              </div>
                            ) : null}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </figure>
          </>
        )}
      </div>

      <footer
        className={`split__footer${canOpenInfo ? ' split__footer--expandable' : ''}${
          infoOpen ? ' split__footer--open' : ''
        }`}
        aria-expanded={canOpenInfo ? infoOpen : undefined}
        onClick={canOpenInfo ? toggleInfo : undefined}
        onKeyDown={
          canOpenInfo
            ? (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  toggleInfo()
                }
              }
            : undefined
        }
        role={canOpenInfo ? 'button' : undefined}
        tabIndex={canOpenInfo ? 0 : undefined}
      >
        <span className="split__expand" aria-hidden="true">
          {canOpenInfo ? (infoOpen ? '—' : '+') : ''}
        </span>
        <p className="split__title">
          <span className="split__title-text">{project.title}</span>
        </p>
        <p className="split__year">{project.year}</p>
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

      const nextIndex = Math.round(nextTop / Math.max(pane, 1))
      void preloadProjectMedia(projects[nextIndex])
      void preloadProjectMedia(projects[nextIndex + direction])
      void preloadProjectCover(projects[nextIndex + direction * 2])

      lockRef.current = true
      scroller.scrollTo({ top: nextTop, behavior: 'smooth' })
      unlockSoon()
    },
    [projects, unlockSoon],
  )

  useEffect(() => {
    void preloadProjectMedia(projects[0])
    void preloadProjectCover(projects[1])
    void preloadProjectCover(projects[2])
  }, [projects])

  useEffect(() => {
    const scroller = scrollerRef.current

    if (!scroller || projects.length === 0) {
      return
    }

    const warmNearbyProjects = () => {
      const pane = Math.max(scroller.clientHeight, 1)
      const index = Math.round(scroller.scrollTop / pane)
      void preloadProjectMedia(projects[index])
      void preloadProjectMedia(projects[index + 1])
      void preloadProjectMedia(projects[index - 1])
      void preloadProjectCover(projects[index + 2])
      void preloadProjectCover(projects[index - 2])
    }

    warmNearbyProjects()
    scroller.addEventListener('scroll', warmNearbyProjects, { passive: true })

    return () => {
      scroller.removeEventListener('scroll', warmNearbyProjects)
    }
  }, [projects])

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

      const info = (event.target as Element | null)?.closest?.('.split__info')

      if (info instanceof HTMLElement) {
        const atTop = info.scrollTop <= 0
        const atBottom = info.scrollTop + info.clientHeight >= info.scrollHeight - 1
        const scrollingUp = event.deltaY < 0
        const scrollingDown = event.deltaY > 0

        if ((scrollingDown && !atBottom) || (scrollingUp && !atTop)) {
          return
        }
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
          projects.map((project) => (
            <ProjectPane
              key={project.id}
              project={project}
              showCategory={lane !== 'books'}
            />
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
    const books: GalleryItem[] = []
    const notBooks: GalleryItem[] = []

    for (const project of projects) {
      if (getProjectLane(project.category) === 'books') {
        books.push(project)
      } else {
        notBooks.push(project)
      }
    }

    return { books, notBooks }
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
      <PageHeader className="split__header" />

      <div className="split__columns">
        <LaneColumn
          lane="books"
          projects={lanes.books}
          focusId={focusLane === 'books' ? focusId : null}
        />
        <LaneColumn
          lane="notBooks"
          projects={lanes.notBooks}
          focusId={focusLane === 'notBooks' ? focusId : null}
        />
      </div>
    </div>
  )
}
