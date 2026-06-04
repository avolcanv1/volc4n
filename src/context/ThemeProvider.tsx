import { useEffect, useState, type ReactNode } from 'react'
import { ThemeContext } from './ThemeContext'

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    document.documentElement.dataset.theme = isDark ? 'dark' : 'light'
  }, [isDark])

  return (
    <ThemeContext.Provider
      value={{
        isDark,
        toggleTheme: () => setIsDark((dark) => !dark),
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}
