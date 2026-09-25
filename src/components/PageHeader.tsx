import { forwardRef } from 'react'
import { Link } from 'react-router-dom'
import { PageNav } from './PageNav'
import { ThemeToggle } from './ThemeToggle'

type PageHeaderProps = {
  className?: string
}

export const PageHeader = forwardRef<HTMLElement, PageHeaderProps>(function PageHeader(
  { className = '' },
  ref,
) {
  const classes = ['page__header', 'page__bar', className].filter(Boolean).join(' ')

  return (
    <header ref={ref} className={classes}>
      <Link to="/" className="site-logo">
        volc4n
      </Link>
      <PageNav />
      <ThemeToggle />
    </header>
  )
})
