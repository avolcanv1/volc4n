import { Link, useLocation } from 'react-router-dom'

export function PageNav() {
  const { pathname } = useLocation()
  const isGallery = pathname === '/'
  const isIndex = pathname === '/index'
  const isGrid = pathname === '/grid'
  const isAbout = pathname === '/about'

  return (
    <nav className="page__nav-group" aria-label="Site sections">
      <Link
        to="/"
        className={`page__nav-link${isGallery ? ' page__nav--current' : ''}`}
      >
        Gallery
      </Link>
      <Link
        to="/index"
        className={`page__nav-link${isIndex ? ' page__nav--current' : ''}`}
      >
        Index
      </Link>
      <Link
        to="/grid"
        className={`page__nav-link${isGrid ? ' page__nav--current' : ''}`}
      >
        Grid
      </Link>
      <Link
        to="/about"
        data-nav-about=""
        className={`page__nav-link${isAbout ? ' page__nav--current' : ''}`}
      >
        About
      </Link>
    </nav>
  )
}
