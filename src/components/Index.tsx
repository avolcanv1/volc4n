import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useContent } from '../context/ContentContext'
import { useTheme } from '../context/ThemeContext'
import { getProjectImage } from '../types'
import { PageNav } from './PageNav'
import { ThemeToggle } from './ThemeToggle'
import '../styles/page.css'
import './Index.css'

export function Index() {
  const { isDark } = useTheme()
  const { projects } = useContent()
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const hoveredItem = hoveredIndex !== null ? projects[hoveredIndex] : null

  return (
    <div className={`page index${isDark ? ' page--dark' : ''}`}>
      <header className="index__header page__bar">
        <Link to="/" className="site-logo">
          volc4n
        </Link>
        <PageNav />
        <ThemeToggle />
      </header>

      {hoveredItem && (
        <div className="index__preview" aria-hidden="true">
          <img
            className="index__preview-image"
            src={getProjectImage(hoveredItem)}
            alt=""
          />
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
