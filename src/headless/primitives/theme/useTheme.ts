import { useThemeContext } from './context'

/** Reads and changes the theme from anywhere under a ThemeProvider. */
export function useTheme() {
  return useThemeContext('useTheme')
}
