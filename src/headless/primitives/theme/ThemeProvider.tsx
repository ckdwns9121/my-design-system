import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import {
  ThemeContext,
  type ResolvedTheme,
  type ThemeContextValue,
  type ThemePreference,
} from './context'

export type ThemeProviderProps = {
  children: ReactNode
  /** Preference used before anything is stored. */
  defaultPreference?: ThemePreference
  /** localStorage key. Pass null to skip persistence. */
  storageKey?: string | null
  /**
   * Element that receives `data-theme`. Defaults to the document element so the
   * generated `[data-theme='dark']` block applies to everything, including
   * portalled overlays that render outside the React tree.
   */
  target?: HTMLElement | null
}

const QUERY = '(prefers-color-scheme: dark)'

function readStored(storageKey: string | null): ThemePreference | null {
  if (!storageKey || typeof window === 'undefined') {
    return null
  }

  const stored = window.localStorage.getItem(storageKey)

  return stored === 'light' || stored === 'dark' || stored === 'system' ? stored : null
}

function readSystem(): ResolvedTheme {
  if (typeof window === 'undefined' || !window.matchMedia) {
    return 'light'
  }

  return window.matchMedia(QUERY).matches ? 'dark' : 'light'
}

/**
 * Resolves a theme preference and reflects it onto the DOM.
 *
 * Components never read the theme. Dark mode remaps the semantic tokens behind
 * the same names, so a component keeps using `bg-surface-panel` and gets the
 * right value; the only job here is deciding which value that is and telling the
 * document.
 */
export function ThemeProvider({
  children,
  defaultPreference = 'system',
  storageKey = 'design-system-theme',
  target,
}: ThemeProviderProps) {
  const [preference, setPreferenceState] = useState<ThemePreference>(
    () => readStored(storageKey) ?? defaultPreference,
  )
  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>(readSystem)

  // Track the OS setting even while the preference is explicit, so switching
  // back to `system` is correct immediately.
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return
    }

    const query = window.matchMedia(QUERY)
    const onChange = (event: MediaQueryListEvent) => {
      setSystemTheme(event.matches ? 'dark' : 'light')
    }

    query.addEventListener('change', onChange)

    return () => {
      query.removeEventListener('change', onChange)
    }
  }, [])

  const resolvedTheme = preference === 'system' ? systemTheme : preference

  useEffect(() => {
    const element = target ?? (typeof document === 'undefined' ? null : document.documentElement)

    if (!element) {
      return
    }

    element.dataset.theme = resolvedTheme
    // Lets the browser style form controls and scrollbars to match.
    element.style.colorScheme = resolvedTheme
  }, [resolvedTheme, target])

  const setPreference = useCallback(
    (next: ThemePreference) => {
      setPreferenceState(next)

      if (storageKey && typeof window !== 'undefined') {
        window.localStorage.setItem(storageKey, next)
      }
    },
    [storageKey],
  )

  const toggle = useCallback(() => {
    setPreference(resolvedTheme === 'dark' ? 'light' : 'dark')
  }, [resolvedTheme, setPreference])

  const value = useMemo<ThemeContextValue>(
    () => ({ preference, resolvedTheme, setPreference, toggle }),
    [preference, resolvedTheme, setPreference, toggle],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
