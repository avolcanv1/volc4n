import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { QUESTION_HELP, type QuestionHelpKey, type QuoteLocale } from '../lib/quoteCopy'

type QuestionHelpProps = {
  helpKey: QuestionHelpKey
  locale: QuoteLocale
}

export function QuestionHelp({ helpKey, locale }: QuestionHelpProps) {
  const [open, setOpen] = useState(false)
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(null)
  const rootRef = useRef<HTMLSpanElement>(null)
  const tipRef = useRef<HTMLSpanElement>(null)
  const tipId = useId()
  const text = QUESTION_HELP[locale][helpKey]
  const moreInfoLabel = locale === 'en' ? 'More information' : 'Más información'

  useLayoutEffect(() => {
    if (!open || !rootRef.current) {
      setCoords(null)
      return
    }

    function updatePosition() {
      const button = rootRef.current?.querySelector('button')
      if (!button) return
      const rect = button.getBoundingClientRect()
      setCoords({
        top: rect.bottom + 8,
        left: rect.left,
      })
    }

    updatePosition()
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [open])

  useEffect(() => {
    if (!open) return

    function onPointerDown(event: PointerEvent) {
      const target = event.target as Node
      if (rootRef.current?.contains(target) || tipRef.current?.contains(target)) return
      setOpen(false)
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  return (
    <span className="quote__help" ref={rootRef}>
      <button
        type="button"
        className="quote__help-btn"
        aria-expanded={open}
        aria-controls={tipId}
        aria-label={moreInfoLabel}
        onClick={() => setOpen((current) => !current)}
      >
        ?
      </button>
      {open && coords
        ? createPortal(
            <span
              className="quote__help-tip"
              id={tipId}
              role="tooltip"
              ref={tipRef}
              style={{ top: coords.top, left: coords.left }}
            >
              {text}
            </span>,
            document.body,
          )
        : null}
    </span>
  )
}
