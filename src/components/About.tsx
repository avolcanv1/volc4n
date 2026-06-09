import { Link } from 'react-router-dom'
import { useContent } from '../context/ContentContext'
import { useTheme } from '../context/ThemeContext'
import { AboutBio } from './AboutBio'
import { PageNav } from './PageNav'
import { ThemeToggle } from './ThemeToggle'
import '../styles/page.css'
import './About.css'

export function About() {
  const { isDark } = useTheme()
  const { about } = useContent()

  return (
    <div className={`page about${isDark ? ' page--dark' : ''}`}>
      <header className="page__bar">
        <Link to="/" className="site-logo">
          volc4n
        </Link>
        <PageNav />
        <ThemeToggle />
      </header>

      <main className="about__main">
        <AboutBio value={about.bio} className="about__text" />
      </main>

      <footer className="page__bar page__bar--bottom">
        <a className="page__link" href={`mailto:${about.email}`}>
          {about.email}
        </a>
        <span aria-hidden="true" />
        <p className="about__address page__bar-end">{about.address}</p>
      </footer>
    </div>
  )
}
