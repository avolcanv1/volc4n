import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useContent } from '../context/ContentContext'
import { useTheme } from '../context/ThemeContext'
import { getProjectMedia } from '../types'
import { ProjectMedia } from './ProjectMedia'
import { PageNav } from './PageNav'
import { ThemeToggle } from './ThemeToggle'
import '../styles/page.css'
import './Index.css'

const PREVIEW_SLIDE_MS = 1000

export function Index() {
  const { isDark } = useTheme()
  const { projects } = useContent()
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [previewMediaIndex, setPreviewMediaIndex] = useState(0)
  const hoveredItem = hoveredIndex !== null ? projects[hoveredIndex] : null

  useEffect(() => {
    setPreviewMediaIndex(0)
  }, [hoveredIndex])

  useEffect(() => {
    if (hoveredIndex === null) {
      return
    }

    const mediaCount = projects[hoveredIndex]?.media.length ?? 0

    if (mediaCount <= 1) {
      return
    }

    const timer = window.setInterval(() => {
      setPreviewMediaIndex((current) => (current + 1) % mediaCount)
    }, PREVIEW_SLIDE_MS)

    return () => {
      window.clearInterval(timer)
    }
  }, [hoveredIndex, projects])

  return (
    <div className={`page index${isDark ? ' page--dark' : ''}`}>
      <header className="index__header page__bar">
        <Link to="/" className="site-logo">
          volc4n
        </Link>
        <PageNav />
        <ThemeToggle />
      </header>

      {hoveredItem && hoveredItem.media.length > 0 && (
        <div className="index__preview" aria-hidden="true">
          <figure className="index__preview-figure fit-media">
            <ProjectMedia
              key={`${hoveredItem.id}-${previewMediaIndex}`}
              media={getProjectMedia(hoveredItem, previewMediaIndex)}
              className="index__preview-image fit-media__image"
              alt=""
            />
          </figure>
        </div>
      )}

      <main className="index__list">
        {projects.map((item, itemIndex) => (
          <div
            key={item.id}
            className="index__row"
            tabIndex={0}
            onMouseEnter={() => setHoveredIndex(itemIndex)}
            onMouseLeave={() => setHoveredIndex(null)}
            onFocus={() => setHoveredIndex(itemIndex)}
            onBlur={() => setHoveredIndex(null)}
          >
            <span className="index__category">{item.category}</span>
            <span className="index__title">{item.title}</span>
            <span className="index__year">{item.year}</span>
          </div>
        ))}
      </main>
    </div>
  )
}
