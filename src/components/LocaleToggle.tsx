import { useLocale } from '../context/LocaleContext'
import { siteCopy } from '../lib/siteCopy'
import './LocaleToggle.css'

type LocaleToggleProps = {
  className?: string
}

export function LocaleToggle({ className }: LocaleToggleProps) {
  const { locale, setLocale } = useLocale()
  const t = siteCopy[locale]

  return (
    <div
      className={className ? `locale-toggle ${className}` : 'locale-toggle'}
      role="group"
      aria-label={t.language}
    >
      <button
        type="button"
        className={`locale-toggle__btn${locale === 'es' ? ' locale-toggle__btn--active' : ''}`}
        onClick={() => setLocale('es')}
      >
        {t.langEs}
      </button>
      <span className="locale-toggle__sep" aria-hidden="true">
        /
      </span>
      <button
        type="button"
        className={`locale-toggle__btn${locale === 'en' ? ' locale-toggle__btn--active' : ''}`}
        onClick={() => setLocale('en')}
      >
        {t.langEn}
      </button>
    </div>
  )
}
