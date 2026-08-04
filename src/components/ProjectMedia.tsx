import type { ProjectMedia as ProjectMediaItem } from '../types'
import './ProjectMedia.css'

type ProjectMediaProps = {
  media: ProjectMediaItem
  className?: string
  alt?: string
  roundedVideo?: boolean
}

export function ProjectMedia({
  media,
  className = 'fit-media__image',
  alt = '',
  roundedVideo = false,
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

  return <img className={className} src={media.src} alt={alt} draggable={false} />
}
