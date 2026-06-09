import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
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

function useTouchPrimary() {
  const [touchPrimary, setTouchPrimary] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches,
  )

  useEffect(() => {
    const media = window.matchMedia('(hover: none)')
    const onChange = () => setTouchPrimary(media.matches)

    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  return touchPrimary
}

function AboutNameTrigger({
  active,
  onChange,
  children,
}: {
  active: boolean
  onChange: (active: boolean) => void
  children: ReactNode
}) {
  const triggerRef = useRef<HTMLSpanElement>(null)
  const touchPrimary = useTouchPrimary()

  useEffect(() => {
    if (!touchPrimary || !active) {
      return
    }

    function handlePointerDown(event: PointerEvent) {
      const target = event.target

      if (!(target instanceof Node) || triggerRef.current?.contains(target)) {
        return
      }

      onChange(false)
    }

    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [active, onChange, touchPrimary])

  return (
    <span
      ref={triggerRef}
      className="about__name-trigger"
      tabIndex={0}
      onMouseEnter={() => {
        if (!touchPrimary) {
          onChange(true)
        }
      }}
      onMouseLeave={() => {
        if (!touchPrimary) {
          onChange(false)
        }
      }}
      onClick={() => {
        if (touchPrimary) {
          onChange(!active)
        }
      }}
      onFocus={() => {
        if (!touchPrimary) {
          onChange(true)
        }
      }}
      onBlur={(event) => {
        if (
          !touchPrimary &&
          !event.currentTarget.contains(event.relatedTarget as Node | null)
        ) {
          onChange(false)
        }
      }}
    >
      {children}
    </span>
  )
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
          <AboutNameTrigger active={floaterActive} onChange={setFloaterActive}>
            {children}
          </AboutNameTrigger>
        ),
      },
    }),
    [floaterActive],
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
