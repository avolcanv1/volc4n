import { useCallback, useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useContent } from '../context/ContentContext'
import { useTheme } from '../context/ThemeContext'
import { getProjectImage } from '../types'
import { plainTextToBlocks } from '../lib/richText'
import { PageNav } from './PageNav'
import { RichText } from './RichText'
import { ThemeToggle } from './ThemeToggle'
import '../styles/page.css'
import './Gallery.css'

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

export function Gallery() {
  const { isDark } = useTheme()
  const { projects } = useContent()
  const [searchParams, setSearchParams] = useSearchParams()
  const slide = Number(searchParams.get('slide'))
  const total = projects.length
  const hasSlideParam = searchParams.has('slide') && slide >= 1 && slide <= total
  const [view, setView] = useState(() => getInitialView(slide, hasSlideParam, total))
  const [infoOpen, setInfoOpen] = useState(false)

  const projectIndex = total === 0 ? 0 : Math.min(view.project, total - 1)
  const current = projects[projectIndex]
  const description =
    current?.description && current.description.length > 0
      ? current.description
      : plainTextToBlocks('Lorem ipsum dolor sit amet')
  const imageCount = current?.images.length ?? 0
  const safeImageIndex = Math.min(view.image, Math.max(imageCount - 1, 0))
  const totalImages = projects.reduce((sum, project) => sum + project.images.length, 0)
  const currentImageNumber =
    projects
      .slice(0, projectIndex)
      .reduce((sum, project) => sum + project.images.length, 0) + safeImageIndex + 1

  const goTo = useCallback(
    (nextProjectIndex: number, nextImageIndex: number) => {
      if (total === 0) return

      const wrappedProject = (nextProjectIndex + total) % total
      const nextProject = projects[wrappedProject]
      const clampedImage = Math.max(0, Math.min(nextImageIndex, nextProject.images.length - 1))

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
    goTo(prevProjectIndex, prevProject.images.length - 1)
  }, [goTo, projectIndex, projects, safeImageIndex, total])

  const goNext = useCallback(() => {
    if (total === 0) return

    if (safeImageIndex < imageCount - 1) {
      setView((currentView) => ({ ...currentView, image: safeImageIndex + 1 }))
      return
    }

    goTo(projectIndex + 1, 0)
  }, [goTo, imageCount, projectIndex, safeImageIndex, total])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setInfoOpen(false)
        return
      }

      if (event.key === 'ArrowLeft') goPrev()
      if (event.key === 'ArrowRight') goNext()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [goNext, goPrev])

  useEffect(() => {
    setInfoOpen(false)
  }, [projectIndex, safeImageIndex])

  if (total === 0 || !current) {
    return null
  }

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
          onClick={goPrev}
        />
        <button
          type="button"
          className="gallery__nav gallery__nav--next"
          aria-label="Next image"
          onClick={goNext}
        />
        <figure className="gallery__figure">
          <img
            key={`${current.id}-${safeImageIndex}`}
            className="gallery__image fit-media__image"
            src={getProjectImage(current, safeImageIndex)}
            alt={current.imageAlt}
            draggable={false}
          />
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
