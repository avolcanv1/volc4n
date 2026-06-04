import { useCallback, useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useContent } from '../context/ContentContext'
import { useTheme } from '../context/ThemeContext'
import { getProjectImage } from '../types'
import { PageNav } from './PageNav'
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

  const projectIndex = total === 0 ? 0 : Math.min(view.project, total - 1)
  const current = projects[projectIndex]
  const imageCount = current?.images.length ?? 0
  const safeImageIndex = Math.min(view.image, Math.max(imageCount - 1, 0))

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
      if (event.key === 'ArrowLeft') goPrev()
      if (event.key === 'ArrowRight') goNext()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [goNext, goPrev])

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

      <div className="gallery__stage">
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
            className="gallery__image"
            src={getProjectImage(current, safeImageIndex)}
            alt={current.imageAlt}
            draggable={false}
          />
        </figure>
      </div>

      <footer className="page__bar page__bar--bottom">
        <p className="gallery__meta">
          <span className="gallery__counter" aria-live="polite">
            ( {String(projectIndex + 1).padStart(2, '0')} / {total} )
          </span>{' '}
          <span className="gallery__category">{current.category}</span>
        </p>
        <p className="gallery__title">{current.title}</p>
        <p className="gallery__year page__bar-end">{current.year}</p>
      </footer>
    </div>
  )
}
