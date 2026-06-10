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

      <footer className="about__footer">
        <a className="page__link about__footer-item" href={`mailto:${about.email}`}>
          {about.email}
        </a>
        <p className="about__footer-item about__address">{about.address}</p>
        <p className="about__footer-item about__credit">Design and web development by volc4n</p>
        <p className="about__footer-item about__copyright">© 2026</p>
      </footer>
    </div>
  )
}
