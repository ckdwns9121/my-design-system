import { createContext, useContext } from 'react'

/** What the user chose. `system` follows the OS setting as it changes. */
export type ThemePreference = 'light' | 'dark' | 'system'

/** What is actually painted. `system` has been resolved by the time it lands here. */
export type ResolvedTheme = 'light' | 'dark'

export type ThemeContextValue = {
  preference: ThemePreference
  resolvedTheme: ResolvedTheme
  setPreference: (preference: ThemePreference) => void
  /** Cycles light → dark → light, leaving `system` once the user picks a side. */
  toggle: () => void
}

export const ThemeContext = createContext<ThemeContextValue | null>(null)

export function useThemeContext(componentName: string) {
  const context = useContext(ThemeContext)

  if (!context) {
    throw new Error(`${componentName} must be used within ThemeProvider`)
  }

  return context
}
