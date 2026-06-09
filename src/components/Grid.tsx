import { Link } from 'react-router-dom'
import { useContent } from '../context/ContentContext'
import { useTheme } from '../context/ThemeContext'
import { ProjectMedia } from './ProjectMedia'
import { PageNav } from './PageNav'
import { ThemeToggle } from './ThemeToggle'
import '../styles/page.css'
import './Grid.css'

export function Grid() {
  const { isDark } = useTheme()
  const { projects } = useContent()

  const cells = projects.flatMap((project, projectIndex) =>
    project.media.map((media, mediaIndex) => ({
      key: `${project.id}-${mediaIndex}`,
      projectIndex,
      mediaIndex,
      project,
      media,
    })),
  )

  return (
    <div className={`page grid${isDark ? ' page--dark' : ''}`}>
      <header className="grid__header page__bar">
        <Link to="/" className="site-logo">
          volc4n
        </Link>
        <PageNav />
        <ThemeToggle />
      </header>

      <main className="grid__main">
        {cells.map(({ key, projectIndex, mediaIndex, project, media }) => (
          <Link
            key={key}
            to={`/?slide=${projectIndex + 1}&image=${mediaIndex}`}
            className="grid__cell"
          >
            <figure className="grid__figure fit-media">
              <ProjectMedia
                media={media}
                className="grid__image fit-media__image"
                alt={project.imageAlt}
              />
            </figure>
            <span className="grid__label">{project.title}</span>
          </Link>
        ))}
      </main>
    </div>
  )
}
