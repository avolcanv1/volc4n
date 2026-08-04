import { Link } from 'react-router-dom'
import { useContent } from '../context/ContentContext'
import { useLocale } from '../context/LocaleContext'
import { useTheme } from '../context/ThemeContext'
import { siteCopy } from '../lib/siteCopy'
import { AboutBio } from './AboutBio'
import { PageControls } from './PageControls'
import { PageNav } from './PageNav'
import '../styles/page.css'
import './About.css'

export function About() {
  const { isDark } = useTheme()
  const { locale } = useLocale()
  const { about } = useContent()
  const t = siteCopy[locale]

  return (
    <div className={`page about${isDark ? ' page--dark' : ''}`}>
      <header className="page__bar">
        <Link to="/" className="site-logo">
          volc4n
        </Link>
        <PageNav />
        <PageControls />
      </header>

      <main className="about__main">
        <AboutBio value={t.aboutBio} className="about__text" />
      </main>

      <footer className="about__footer">
        <a className="page__link about__footer-item" href={`mailto:${about.email}`}>
          {about.email}
        </a>
        <p className="about__footer-item about__address">{about.address}</p>
        <p className="about__footer-item about__credit">{t.designCredit}</p>
        <p className="about__footer-item about__copyright">© 2026</p>
      </footer>
    </div>
  )
}
