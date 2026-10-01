import { useEffect, useRef, useState } from 'react'
import './ProjectMedia.css'

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'

type InViewVideoProps = {
  src: string
  className?: string
  /** Scroll container that defines "visible"; the nearest matching ancestor is used. */
  rootSelector?: string
  roundedVideo?: boolean
  alt?: string
  onDimensions?: (width: number, height: number) => void
}

/** Muted, looping inline video that only plays while it is in view (still frame under reduced motion). */
export function InViewVideo({
  src,
  className = '',
  rootSelector,
  roundedVideo = false,
  alt,
  onDimensions,
}: InViewVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [readySrc, setReadySrc] = useState<string | null>(null)

  useEffect(() => {
    const video = videoRef.current

    if (!video) {
      return
    }

    // iOS only allows inline autoplay when the muted *property* is set.
    video.muted = true

    if (window.matchMedia(REDUCED_MOTION_QUERY).matches) {
      // Still frame only; load enough data that `loadeddata` fires and the fade-in completes.
      video.preload = 'auto'
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          void video.play().catch(() => undefined)
        } else {
          video.pause()
        }
      },
      { root: rootSelector ? video.closest(rootSelector) : null, threshold: 0.1 },
    )

    observer.observe(video)
    return () => observer.disconnect()
  }, [rootSelector, src])

  return (
    <video
      ref={videoRef}
      className={`project-media__video${roundedVideo ? ' project-media__video--rounded' : ''}${
        readySrc === src ? '' : ' project-media__video--pending'
      } ${className}`}
      src={`${src}#t=0.1`}
      muted
      loop
      playsInline
      preload="metadata"
      disablePictureInPicture
      aria-label={alt}
      onLoadedMetadata={(event) =>
        onDimensions?.(event.currentTarget.videoWidth, event.currentTarget.videoHeight)
      }
      onLoadedData={() => setReadySrc(src)}
    />
  )
}
