import { Link, useLocation } from 'react-router-dom'
import { useLocale } from '../context/LocaleContext'
import { siteCopy } from '../lib/siteCopy'

export function PageNav() {
  const { pathname } = useLocation()
  const { locale } = useLocale()
  const t = siteCopy[locale]
  const isGallery = pathname === '/'
  const isIndex = pathname === '/index'
  const isAbout = pathname === '/about'

  return (
    <nav className="page__nav-group" aria-label={t.navAria}>
      <Link
        to="/"
        className={`page__nav-link${isGallery ? ' page__nav--current' : ''}`}
      >
        {t.gallery}
      </Link>
      <Link
        to="/index"
        className={`page__nav-link${isIndex ? ' page__nav--current' : ''}`}
      >
        {t.index}
      </Link>
      <Link
        to="/about"
        data-nav-about=""
        className={`page__nav-link${isAbout ? ' page__nav--current' : ''}`}
      >
        {t.about}
      </Link>
    </nav>
  )
}
