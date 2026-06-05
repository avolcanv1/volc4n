import type { ProjectMedia as ProjectMediaItem } from '../types'

type ProjectMediaProps = {
  media: ProjectMediaItem
  className?: string
  alt?: string
}

export function ProjectMedia({ media, className = 'fit-media__image', alt = '' }: ProjectMediaProps) {
  if (media.kind === 'video') {
    return (
      <video
        className={className}
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
