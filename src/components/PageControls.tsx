import { LocaleToggle } from './LocaleToggle'
import { ThemeToggle } from './ThemeToggle'

export function PageControls() {
  return (
    <div className="page__controls">
      <LocaleToggle />
      <ThemeToggle />
    </div>
  )
}
