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
      <video
        className={`project-media__video${roundedVideo ? ' project-media__video--rounded' : ''} ${className}`}
        src={media.src}
        autoPlay
        loop
        muted
        playsInline
        disablePictureInPicture
        aria-label={alt}
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
