import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useContent } from '../context/ContentContext'
import { useTheme } from '../context/ThemeContext'
import { resizeImageUrl } from '../lib/mapContent'
import {
  groupProjectsByLane,
  isWebDesignCategory,
  PROJECT_LANE_LABELS,
  PROJECT_LANES,
} from '../lib/projectCategory'
import { getProjectMedia, type GalleryItem } from '../types'
import { PageHeader } from './PageHeader'
import '../styles/page.css'
import './Index.css'

const THUMB_IMAGE_WIDTH = 320

function IndexThumb({ project }: { project: GalleryItem }) {
  const cover = getProjectMedia(project, 0)
  const rounded = isWebDesignCategory(project.category) ? ' index__thumb-media--rounded' : ''

  return (
    <span className="index__thumb" aria-hidden="true">
      {cover?.kind === 'image' ? (
        <img
          className={`index__thumb-media${rounded}`}
          src={resizeImageUrl(cover.src, THUMB_IMAGE_WIDTH)}
          alt=""
          draggable={false}
          loading="lazy"
          decoding="async"
        />
      ) : cover?.kind === 'video' ? (
        <video
          className={`index__thumb-media${rounded}`}
          src={`${cover.src}#t=0.1`}
          muted
          playsInline
          preload="metadata"
          disablePictureInPicture
        />
      ) : null}
    </span>
  )
}

export function Index() {
  const { isDark } = useTheme()
  const { projects } = useContent()
  const lanes = useMemo(() => groupProjectsByLane(projects), [projects])

  return (
    <div className={`page index${isDark ? ' page--dark' : ''}`}>
      <PageHeader className="index__header" />

      <main className="index__columns">
        {PROJECT_LANES.map((lane) => (
          <section
            key={lane}
            className={`index__lane index__lane--${lane}`}
            aria-label={PROJECT_LANE_LABELS[lane]}
          >
            <h2 className="index__lane-label">{PROJECT_LANE_LABELS[lane]}</h2>
            <div className="index__list">
              {lanes[lane].length === 0 ? (
                <p className="index__empty">No projects yet.</p>
              ) : (
                lanes[lane].map((item) => (
                  <Link key={item.id} to={`/?project=${item.id}`} className="index__row">
                    <IndexThumb project={item} />
                    <span className="index__text">
                      <span className="index__title">{item.title}</span>
                      {lane === 'notBooks' ? (
                        <span className="index__category">{item.category}</span>
                      ) : null}
                      <span className="index__year">{item.year}</span>
                    </span>
                  </Link>
                ))
              )}
            </div>
          </section>
        ))}
      </main>
    </div>
  )
}
