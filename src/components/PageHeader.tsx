import { forwardRef, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { PageNav } from './PageNav'
import { ThemeToggle } from './ThemeToggle'

type PageHeaderProps = {
  className?: string
  /** Replaces the default ThemeToggle in the right column (e.g. lang + theme on Quote). */
  end?: ReactNode
}

export const PageHeader = forwardRef<HTMLElement, PageHeaderProps>(function PageHeader(
  { className = '', end },
  ref,
) {
  const classes = ['page__header', 'page__bar', className].filter(Boolean).join(' ')

  return (
    <header ref={ref} className={classes}>
      <Link to="/" className="site-logo">
        volc4n
      </Link>
      <PageNav />
      {end ?? <ThemeToggle />}
    </header>
  )
})
