import { useTheme } from '../context/ThemeContext'
import { useLocale } from '../context/LocaleContext'
import { siteCopy } from '../lib/siteCopy'
import './ThemeToggle.css'

export function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme()
  const { locale } = useLocale()
  const t = siteCopy[locale]

  return (
    <button
      type="button"
      className={`theme-toggle${isDark ? ' theme-toggle--on' : ''}`}
      aria-pressed={isDark}
      aria-label={isDark ? t.switchToLight : t.switchToDark}
      onClick={toggleTheme}
    >
      <span className="theme-toggle__track" aria-hidden="true">
        <span className="theme-toggle__thumb" />
      </span>
    </button>
  )
}
