import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useContent } from '../context/ContentContext'
import { useTheme } from '../context/ThemeContext'
import { isWebDesignCategory } from '../lib/projectCategory'
import { ProjectMedia } from './ProjectMedia'
import { PageNav } from './PageNav'
import { ThemeToggle } from './ThemeToggle'
import '../styles/page.css'
import './Index.css'

const PREVIEW_SLIDE_MS = 1000
const PREVIEW_EDGE_GAP = 12
const PREVIEW_ASPECT = 3 / 2

function getMaxPreviewHeight(viewportWidth: number, viewportHeight: number) {
  if (viewportWidth <= 768) {
    return Math.min(viewportHeight * 0.288, 16.2 * 16)
  }

  if (viewportWidth <= 1100) {
    return Math.min(viewportHeight * 0.342, 21.6 * 16)
  }

  return Math.min(viewportHeight * 0.396, 27 * 16)
}

export function Index() {
  const { isDark } = useTheme()
  const { projects } = useContent()
  const headerRef = useRef<HTMLElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)
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

  useLayoutEffect(() => {
    const header = headerRef.current
    const preview = previewRef.current

    if (!header || !preview) {
      return
    }

    function updatePreviewBounds() {
      const currentHeader = headerRef.current
      const currentPreview = previewRef.current

      if (!currentHeader || !currentPreview) {
        return
      }

      const about = currentHeader.querySelector<HTMLElement>('[data-nav-about]')
      const toggle = currentHeader.querySelector<HTMLElement>('.theme-toggle')

      if (!about || !toggle) {
        return
      }

      const aboutRect = about.getBoundingClientRect()
      const toggleRect = toggle.getBoundingClientRect()

      const gapLeft = aboutRect.right + PREVIEW_EDGE_GAP
      const gapRight = toggleRect.left - PREVIEW_EDGE_GAP
      const gapWidth = Math.max(0, gapRight - gapLeft)
      const gapCenter = gapLeft + gapWidth / 2
      const maxHeight = getMaxPreviewHeight(window.innerWidth, window.innerHeight)

      let width = gapWidth
      let height = width / PREVIEW_ASPECT

      if (height > maxHeight) {
        height = maxHeight
        width = height * PREVIEW_ASPECT
      }

      if (width > gapWidth) {
        width = gapWidth
        height = width / PREVIEW_ASPECT
      }

      const left = gapCenter - width / 2

      currentPreview.style.right = 'auto'
      currentPreview.style.setProperty('--index-preview-left', `${left}px`)
      currentPreview.style.setProperty('--index-preview-width', `${width}px`)
      currentPreview.style.setProperty('--index-preview-height', `${height}px`)
    }

    updatePreviewBounds()

    const resizeObserver = new ResizeObserver(updatePreviewBounds)
    resizeObserver.observe(header)

    window.addEventListener('resize', updatePreviewBounds)

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('resize', updatePreviewBounds)
    }
  }, [hoveredIndex])

  return (
    <div className={`page index${isDark ? ' page--dark' : ''}`}>
      <header ref={headerRef} className="index__header page__bar">
        <Link to="/" className="site-logo">
          volc4n
        </Link>
        <PageNav />
        <ThemeToggle />
      </header>

      {hoveredItem && hoveredItem.media.length > 0 && (
        <div ref={previewRef} className="index__preview" aria-hidden="true">
          <figure className="index__preview-figure">
            {hoveredItem.media.map((media, mediaIndex) => (
              <ProjectMedia
                key={`${hoveredItem.id}-${mediaIndex}`}
                media={media}
                className={`index__preview-image${mediaIndex === previewMediaIndex ? ' index__preview-image--active' : ''}`}
                alt=""
                roundedVideo={isWebDesignCategory(hoveredItem.category)}
              />
            ))}
          </figure>
        </div>
      )}

      <main className="index__list">
        {projects.map((item, itemIndex) => (
          <Link
            key={item.id}
            to={`/?slide=${itemIndex + 1}`}
            className="index__row"
            onMouseEnter={() => setHoveredIndex(itemIndex)}
            onMouseLeave={() => setHoveredIndex(null)}
            onFocus={() => setHoveredIndex(itemIndex)}
            onBlur={() => setHoveredIndex(null)}
          >
            <span className="index__category">{item.category}</span>
            <span className="index__title">{item.title}</span>
            <span className="index__year">{item.year}</span>
          </Link>
        ))}
      </main>
    </div>
  )
}
