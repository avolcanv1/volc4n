import { useState } from 'react'
import type { ProjectMedia as ProjectMediaItem } from '../types'
import './ProjectMedia.css'

type ProjectMediaProps = {
  media: ProjectMediaItem
  className?: string
  alt?: string
  roundedVideo?: boolean
  decoding?: 'async' | 'sync' | 'auto'
  fetchPriority?: 'high' | 'low' | 'auto'
  loading?: 'eager' | 'lazy'
}

function ProjectVideo({
  src,
  className,
  alt,
  roundedVideo,
}: {
  src: string
  className: string
  alt: string
  roundedVideo: boolean
}) {
  const [readySrc, setReadySrc] = useState<string | null>(null)
  const ready = readySrc === src

  return (
    <video
      className={`project-media__video${roundedVideo ? ' project-media__video--rounded' : ''}${
        ready ? '' : ' project-media__video--pending'
      } ${className}`}
      src={src}
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
      disablePictureInPicture
      aria-label={alt}
      onLoadedData={() => setReadySrc(src)}
      onPlaying={() => setReadySrc(src)}
    />
  )
}

export function ProjectMedia({
  media,
  className = 'fit-media__image',
  alt = '',
  roundedVideo = false,
  decoding = 'async',
  fetchPriority,
  loading,
}: ProjectMediaProps) {
  if (media.kind === 'video') {
    return (
      <ProjectVideo
        key={media.src}
        src={media.src}
        className={className}
        alt={alt}
        roundedVideo={roundedVideo}
      />
    )
  }

  return (
    <img
      className={className}
      src={media.src}
      alt={alt}
      draggable={false}
      decoding={decoding}
      fetchPriority={fetchPriority}
      loading={loading}
    />
  )
}
