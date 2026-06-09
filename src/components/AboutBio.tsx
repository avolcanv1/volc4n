import { useMemo, useState } from 'react'
import { PortableText, type PortableTextComponents } from '@portabletext/react'
import type { PortableTextBlock } from '@portabletext/types'
import { ABOUT_NAME_MARK, injectNameHighlight } from '../lib/aboutBio'
import { DvdFloater } from './DvdFloater'
import './RichText.css'

const INE_IMAGE = '/images/ine.png'

type AboutBioProps = {
  value: PortableTextBlock[]
  className?: string
}

export function AboutBio({ value, className }: AboutBioProps) {
  const [floaterActive, setFloaterActive] = useState(false)
  const processed = useMemo(() => injectNameHighlight(value), [value])

  const components = useMemo<PortableTextComponents>(
    () => ({
      block: {
        normal: ({ children }) => <p>{children}</p>,
      },
      marks: {
        em: ({ children }) => <em>{children}</em>,
        link: ({ children, value: markValue }) => {
          const href = typeof markValue?.href === 'string' ? markValue.href : '#'

          return (
            <a
              className="rich-text__link"
              href={href}
              target={href.startsWith('mailto:') ? undefined : '_blank'}
              rel={href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
            >
              {children}
            </a>
          )
        },
        [ABOUT_NAME_MARK]: ({ children }) => (
          <span
            className="about__name-trigger"
            onMouseEnter={() => setFloaterActive(true)}
            onMouseLeave={() => setFloaterActive(false)}
            onFocus={() => setFloaterActive(true)}
            onBlur={() => setFloaterActive(false)}
          >
            {children}
          </span>
        ),
      },
    }),
    [],
  )

  return (
    <>
      <div className={className ? `rich-text ${className}` : 'rich-text'}>
        <PortableText value={processed} components={components} />
      </div>
      <DvdFloater active={floaterActive} src={INE_IMAGE} />
    </>
  )
}
