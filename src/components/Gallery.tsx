import { useCallback, useEffect, useLayoutEffect, useRef, useState, type TouchEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useContent } from '../context/ContentContext'
import { useTheme } from '../context/ThemeContext'
import { getProjectMedia, type GalleryItem, type ProjectMedia as ProjectMediaItem } from '../types'
import { ProjectMedia } from './ProjectMedia'
import { plainTextToBlocks } from '../lib/richText'
import { PageNav } from './PageNav'
import { RichText } from './RichText'
import { ThemeToggle } from './ThemeToggle'
import '../styles/page.css'
import './Gallery.css'

function preloadImageMedia(media: ProjectMediaItem) {
  if (media.kind !== 'image') {
    return Promise.resolve()
  }

  return new Promise<void>((resolve) => {
    const image = new Image()
    image.onload = () => resolve()
    image.onerror = () => resolve()
    image.src = media.src
  })
}

function getAdjacentMedia(
  projects: GalleryItem[],
  projectIndex: number,
  imageIndex: number,
): [ProjectMediaItem, ProjectMediaItem] {
  const total = projects.length
  const current = projects[projectIndex]
  const adjacent: ProjectMediaItem[] = []

  if (imageIndex > 0) {
    adjacent.push(getProjectMedia(current, imageIndex - 1))
  } else {
    const prevProject = projects[(projectIndex - 1 + total) % total]
    adjacent.push(getProjectMedia(prevProject, prevProject.media.length - 1))
  }

  if (imageIndex < current.media.length - 1) {
    adjacent.push(getProjectMedia(current, imageIndex + 1))
  } else {
    const nextProject = projects[(projectIndex + 1) % total]
    adjacent.push(getProjectMedia(nextProject, 0))
  }

  return [adjacent[0], adjacent[1]]
}

function getInitialView(
  slide: number,
  hasSlideParam: boolean,
  total: number,
) {
  if (hasSlideParam && slide >= 1 && slide <= total) {
    return { project: slide - 1, image: 0 }
  }

  return { project: 0, image: 0 }
}

const SWIPE_THRESHOLD = 48
const SWIPE_LOCK_PX = 10

type SlideDirection = 'prev' | 'next'

export function Gallery() {
  const { isDark } = useTheme()
  const { projects } = useContent()
  const [searchParams, setSearchParams] = useSearchParams()
  const slide = Number(searchParams.get('slide'))
  const total = projects.length
  const hasSlideParam = searchParams.has('slide') && slide >= 1 && slide <= total
  const [view, setView] = useState(() => getInitialView(slide, hasSlideParam, total))
  const [infoOpen, setInfoOpen] = useState(false)
  const [displayedMedia, setDisplayedMedia] = useState<ProjectMediaItem | null>(null)
  const [slideWidth, setSlideWidth] = useState(0)
  const [dragOffset, setDragOffset] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  const viewportRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const touchStartRef = useRef<{ x: number; y: number } | null>(null)
  const dragOffsetRef = useRef(0)
  const isDraggingRef = useRef(false)
  const isAnimatingRef = useRef(false)

  const projectIndex = total === 0 ? 0 : Math.min(view.project, total - 1)
  const current = projects[projectIndex]
  const description =
    current?.description && current.description.length > 0
      ? current.description
      : plainTextToBlocks('Lorem ipsum dolor sit amet')
  const mediaCount = current?.media.length ?? 0
  const safeImageIndex = Math.min(view.image, Math.max(mediaCount - 1, 0))
  const totalImages = projects.reduce((sum, project) => sum + project.media.length, 0)
  const currentImageNumber =
    projects
      .slice(0, projectIndex)
      .reduce((sum, project) => sum + project.media.length, 0) + safeImageIndex + 1
  const currentMedia = current ? getProjectMedia(current, safeImageIndex) : null
  const currentCaption = currentMedia?.caption
  const [prevMedia, nextMedia] = getAdjacentMedia(projects, projectIndex, safeImageIndex)
  const centerMedia = displayedMedia ?? currentMedia

  const goTo = useCallback(
    (nextProjectIndex: number, nextImageIndex: number) => {
      if (total === 0) return

      const wrappedProject = (nextProjectIndex + total) % total
      const nextProject = projects[wrappedProject]
      const clampedImage = Math.max(0, Math.min(nextImageIndex, nextProject.media.length - 1))

      setView({ project: wrappedProject, image: clampedImage })

      if (searchParams.has('slide')) {
        setSearchParams({ slide: String(wrappedProject + 1) }, { replace: true })
      }
    },
    [projects, searchParams, setSearchParams, total],
  )

  const goPrev = useCallback(() => {
    if (total === 0) return

    if (safeImageIndex > 0) {
      setView((currentView) => ({ ...currentView, image: safeImageIndex - 1 }))
      return
    }

    const prevProjectIndex = (projectIndex - 1 + total) % total
    const prevProject = projects[prevProjectIndex]
    goTo(prevProjectIndex, prevProject.media.length - 1)
  }, [goTo, projectIndex, projects, safeImageIndex, total])

  const goNext = useCallback(() => {
    if (total === 0) return

    if (safeImageIndex < mediaCount - 1) {
      setView((currentView) => ({ ...currentView, image: safeImageIndex + 1 }))
      return
    }

    goTo(projectIndex + 1, 0)
  }, [goTo, mediaCount, projectIndex, safeImageIndex, total])

  useLayoutEffect(() => {
    const viewport = viewportRef.current

    if (!viewport) {
      return
    }

    const updateWidth = () => setSlideWidth(viewport.clientWidth)
    updateWidth()

    const observer = new ResizeObserver(updateWidth)
    observer.observe(viewport)

    return () => observer.disconnect()
  }, [])

  const waitForTrackTransition = useCallback((onComplete: () => void) => {
    const track = trackRef.current

    if (!track) {
      onComplete()
      return
    }

    let completed = false

    const finish = () => {
      if (completed) {
        return
      }

      completed = true
      window.clearTimeout(fallbackTimer)
      track.removeEventListener('transitionend', onTransitionEnd)
      onComplete()
    }

    const onTransitionEnd = (event: TransitionEvent) => {
      if (event.target !== track || event.propertyName !== 'transform') {
        return
      }

      finish()
    }

    const fallbackTimer = window.setTimeout(finish, 650)
    track.addEventListener('transitionend', onTransitionEnd)
  }, [])

  const snapToOffset = useCallback(
    (offset: number, onComplete?: () => void) => {
      if (slideWidth === 0) {
        onComplete?.()
        return
      }

      if (offset === dragOffsetRef.current) {
        onComplete?.()
        return
      }

      isAnimatingRef.current = true
      setIsAnimating(true)
      dragOffsetRef.current = offset
      setDragOffset(offset)

      waitForTrackTransition(() => {
        isAnimatingRef.current = false
        setIsAnimating(false)
        onComplete?.()
      })
    },
    [slideWidth, waitForTrackTransition],
  )

  const navigateWithAnimation = useCallback(
    (direction: SlideDirection) => {
      if (isAnimatingRef.current || isDraggingRef.current) {
        return
      }

      if (slideWidth === 0) {
        direction === 'next' ? goNext() : goPrev()
        return
      }

      snapToOffset(direction === 'next' ? -slideWidth : slideWidth, () => {
        direction === 'next' ? goNext() : goPrev()
        dragOffsetRef.current = 0
        setDragOffset(0)
      })
    },
    [goNext, goPrev, slideWidth, snapToOffset],
  )

  const handleTouchStart = useCallback((event: TouchEvent<HTMLDivElement>) => {
    if (isAnimatingRef.current || event.touches.length !== 1) {
      touchStartRef.current = null
      return
    }

    const touch = event.touches[0]
    touchStartRef.current = { x: touch.clientX, y: touch.clientY }
    isDraggingRef.current = false
    setIsDragging(false)
  }, [])

  const handleTouchMove = useCallback((event: TouchEvent<HTMLDivElement>) => {
    const start = touchStartRef.current

    if (!start || isAnimatingRef.current || event.touches.length !== 1) {
      return
    }

    const touch = event.touches[0]
    const deltaX = touch.clientX - start.x
    const deltaY = touch.clientY - start.y

    if (!isDraggingRef.current) {
      if (Math.abs(deltaX) < SWIPE_LOCK_PX || Math.abs(deltaX) < Math.abs(deltaY)) {
        return
      }

      isDraggingRef.current = true
      setIsDragging(true)
    }

    if (event.cancelable) {
      event.preventDefault()
    }

    dragOffsetRef.current = deltaX
    setDragOffset(deltaX)
  }, [])

  const resetTouch = useCallback(() => {
    touchStartRef.current = null
    isDraggingRef.current = false
    setIsDragging(false)
  }, [])

  const handleTouchEnd = useCallback(() => {
    if (!isDraggingRef.current) {
      touchStartRef.current = null
      return
    }

    const deltaX = dragOffsetRef.current
    resetTouch()

    if (Math.abs(deltaX) >= SWIPE_THRESHOLD) {
      navigateWithAnimation(deltaX < 0 ? 'next' : 'prev')
      return
    }

    snapToOffset(0)
  }, [navigateWithAnimation, resetTouch, snapToOffset])

  const handleTouchCancel = useCallback(() => {
    if (!isDraggingRef.current) {
      touchStartRef.current = null
      return
    }

    resetTouch()
    snapToOffset(0)
  }, [resetTouch, snapToOffset])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setInfoOpen(false)
        return
      }

      if (event.key === 'ArrowLeft') navigateWithAnimation('prev')
      if (event.key === 'ArrowRight') navigateWithAnimation('next')
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [navigateWithAnimation])

  useEffect(() => {
    setInfoOpen(false)
  }, [projectIndex, safeImageIndex])

  useEffect(() => {
    if (!currentMedia) {
      setDisplayedMedia(null)
      return
    }

    if (displayedMedia?.src === currentMedia.src && displayedMedia.kind === currentMedia.kind) {
      return
    }

    if (currentMedia.kind === 'video') {
      setDisplayedMedia(currentMedia)
      return
    }

    if (!displayedMedia) {
      setDisplayedMedia(currentMedia)
      return
    }

    let cancelled = false

    preloadImageMedia(currentMedia).then(() => {
      if (!cancelled) {
        setDisplayedMedia(currentMedia)
      }
    })

    return () => {
      cancelled = true
    }
  }, [currentMedia, displayedMedia?.kind, displayedMedia?.src])

  useEffect(() => {
    void preloadImageMedia(prevMedia)
    void preloadImageMedia(nextMedia)
  }, [nextMedia, prevMedia])

  if (total === 0 || !current || !centerMedia) {
    return null
  }

  const trackOffset = slideWidth > 0 ? -slideWidth + dragOffset : dragOffset

  return (
    <div className={`page gallery${isDark ? ' page--dark' : ''}`}>
      <header className="page__bar">
        <Link to="/" className="site-logo">
          volc4n
        </Link>
        <PageNav />
        <ThemeToggle />
      </header>

      <div className="gallery__stage fit-media">
        <button
          type="button"
          className="gallery__nav gallery__nav--prev"
          aria-label="Previous image"
          onPointerDown={(event) => event.preventDefault()}
          onClick={() => navigateWithAnimation('prev')}
        />
        <button
          type="button"
          className="gallery__nav gallery__nav--next"
          aria-label="Next image"
          onPointerDown={(event) => event.preventDefault()}
          onClick={() => navigateWithAnimation('next')}
        />
        <figure className="gallery__figure">
          <div
            ref={viewportRef}
            className="gallery__viewport"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleTouchCancel}
          >
            <div
              ref={trackRef}
              className={`gallery__track${isAnimating ? ' gallery__track--animating' : ''}${isDragging ? ' gallery__track--dragging' : ''}`}
              style={{ transform: `translate3d(${trackOffset}px, 0, 0)` }}
            >
              <div className="gallery__slide" aria-hidden="true">
                <div className="gallery__media-wrap">
                  <ProjectMedia
                    media={prevMedia}
                    className="gallery__image fit-media__image"
                    alt=""
                  />
                </div>
              </div>
              <div className="gallery__slide">
                <div className="gallery__media-wrap">
                  <ProjectMedia
                    key={
                      centerMedia.kind === 'video'
                        ? `${current.id}-${safeImageIndex}`
                        : centerMedia.src
                    }
                    media={centerMedia}
                    className="gallery__image fit-media__image"
                    alt={currentCaption ?? current.imageAlt}
                  />
                  {currentCaption && (
                    <div className="gallery__caption-rail">
                      <p className="gallery__caption">{currentCaption}</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="gallery__slide" aria-hidden="true">
                <div className="gallery__media-wrap">
                  <ProjectMedia
                    media={nextMedia}
                    className="gallery__image fit-media__image"
                    alt=""
                  />
                </div>
              </div>
            </div>
          </div>
        </figure>
      </div>

      <footer
        className={`gallery__footer page__bar page__bar--bottom gallery__footer--expandable${infoOpen ? ' gallery__footer--open' : ''}`}
        aria-expanded={infoOpen}
        onClick={() => setInfoOpen((open) => !open)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            setInfoOpen((open) => !open)
          }
        }}
        role="button"
        tabIndex={0}
      >
        <p className="gallery__meta">
          <span className="gallery__counter" aria-live="polite">
            ( {String(currentImageNumber).padStart(2, '0')} / {totalImages} )
          </span>{' '}
          <span className="gallery__category">{current.category}</span>
        </p>
        <p className="gallery__title">
          <span className="gallery__title-text">{current.title}</span>
          <span className="gallery__expand-icon" aria-hidden="true">
            {infoOpen ? '—' : '+'}
          </span>
        </p>
        <p className="gallery__year page__bar-end">{current.year}</p>
        <div className="gallery__description-wrap">
          <RichText value={description} className="gallery__description" />
        </div>
      </footer>
    </div>
  )
}
