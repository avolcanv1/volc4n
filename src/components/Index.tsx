import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useContent } from '../context/ContentContext'
import { useTheme } from '../context/ThemeContext'
import { resizeImageUrl } from '../lib/mapContent'
import { aspectFromSrc, isPortraitRatio } from '../lib/mediaAspect'
import {
  groupProjectsByLane,
  isWebDesignCategory,
  PROJECT_LANE_LABELS,
  PROJECT_LANES,
} from '../lib/projectCategory'
import { useIsMobile } from '../lib/useIsMobile'
import { getProjectMedia, type GalleryItem } from '../types'
import { InViewVideo } from './InViewVideo'
import { PageHeader } from './PageHeader'
import '../styles/page.css'
import './Index.css'

const THUMB_IMAGE_WIDTH = 480

function IndexThumb({ project }: { project: GalleryItem }) {
  const cover = getProjectMedia(project, 0)
  const [measured, setMeasured] = useState<{ src: string; ratio: number } | null>(null)
  const rounded = isWebDesignCategory(project.category) ? ' index__thumb-media--rounded' : ''
  const ratio = cover
    ? (aspectFromSrc(cover.src) ?? (measured?.src === cover.src ? measured.ratio : null))
    : null

  const measure = (width: number, height: number) => {
    if (cover && width > 0 && height > 0) {
      setMeasured({ src: cover.src, ratio: height / width })
    }
  }

  return (
    <span
      className={`index__thumb${isPortraitRatio(ratio) ? ' index__thumb--portrait' : ''}`}
      aria-hidden="true"
    >
      {cover?.kind === 'image' ? (
        <img
          className={`index__thumb-media${rounded}`}
          src={resizeImageUrl(cover.src, THUMB_IMAGE_WIDTH)}
          alt=""
          draggable={false}
          loading="lazy"
          decoding="async"
          onLoad={(event) =>
            measure(event.currentTarget.naturalWidth, event.currentTarget.naturalHeight)
          }
        />
      ) : cover?.kind === 'video' ? (
        <InViewVideo
          src={cover.src}
          className={`index__thumb-media${rounded}`}
          rootSelector=".index__list"
          onDimensions={measure}
        />
      ) : null}
    </span>
  )
}

export function Index() {
  const { isDark } = useTheme()
  const { projects } = useContent()
  const lanes = useMemo(() => groupProjectsByLane(projects), [projects])
  const showThumbs = !useIsMobile()
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
            <div className="index__list">
              <div className="index__lane-head">
                <h2 className="index__lane-label">{PROJECT_LANE_LABELS[lane]}</h2>
                <span
                  className="index__lane-count page__counter"
                  aria-label={`${lanes[lane].length} projects`}
                >
                  {String(lanes[lane].length).padStart(2, '0')}
                </span>
              </div>
              {lanes[lane].length === 0 ? (
                <p className="index__empty">No projects yet.</p>
              ) : (
                lanes[lane].map((item) => (
                  <Link key={item.id} to={`/?project=${item.id}`} className="index__row">
                    {showThumbs ? <IndexThumb project={item} /> : null}
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
