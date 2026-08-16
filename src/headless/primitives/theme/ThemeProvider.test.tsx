import { act, type ReactNode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { ThemeProvider } from './ThemeProvider'
import { useTheme } from './useTheme'

;(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT =
  true

let roots: Root[] = []
let containers: HTMLElement[] = []

function render(ui: ReactNode) {
  const container = document.createElement('div')
  document.body.append(container)

  const root = createRoot(container)
  roots.push(root)
  containers.push(container)

  act(() => {
    root.render(ui)
  })

  return container
}

type ThemeApi = ReturnType<typeof useTheme>

let api: ThemeApi

function Probe() {
  api = useTheme()

  return null
}

const KEY = 'theme-test'

beforeEach(() => {
  window.localStorage.removeItem(KEY)
  delete document.documentElement.dataset.theme
})

afterEach(() => {
  for (const root of roots) {
    act(() => {
      root.unmount()
    })
  }

  for (const container of containers) {
    container.remove()
  }

  roots = []
  containers = []
  window.localStorage.removeItem(KEY)
  delete document.documentElement.dataset.theme
})

describe('ThemeProvider', () => {
  it('reflects the resolved theme onto the document element', () => {
    render(
      <ThemeProvider defaultPreference="dark" storageKey={null}>
        <Probe />
      </ThemeProvider>,
    )

    expect(document.documentElement.dataset.theme).toBe('dark')
    expect(document.documentElement.style.colorScheme).toBe('dark')
  })

  it('resolves system to a concrete theme', () => {
    render(
      <ThemeProvider defaultPreference="system" storageKey={null}>
        <Probe />
      </ThemeProvider>,
    )

    expect(api.preference).toBe('system')
    expect(['light', 'dark']).toContain(api.resolvedTheme)
    expect(document.documentElement.dataset.theme).toBe(api.resolvedTheme)
  })

  it('toggles to the opposite of what is painted, leaving system behind', () => {
    render(
      <ThemeProvider defaultPreference="light" storageKey={null}>
        <Probe />
      </ThemeProvider>,
    )

    act(() => {
      api.toggle()
    })

    expect(api.preference).toBe('dark')
    expect(api.resolvedTheme).toBe('dark')
    expect(document.documentElement.dataset.theme).toBe('dark')
  })

  it('persists the preference and reads it back', () => {
    render(
      <ThemeProvider defaultPreference="light" storageKey={KEY}>
        <Probe />
      </ThemeProvider>,
    )

    act(() => {
      api.setPreference('dark')
    })

    expect(window.localStorage.getItem(KEY)).toBe('dark')

    render(
      <ThemeProvider defaultPreference="light" storageKey={KEY}>
        <Probe />
      </ThemeProvider>,
    )

    // The stored preference wins over the default on the next mount.
    expect(api.preference).toBe('dark')
  })

  it('ignores a stored value that is not a preference', () => {
    window.localStorage.setItem(KEY, 'chartreuse')

    render(
      <ThemeProvider defaultPreference="light" storageKey={KEY}>
        <Probe />
      </ThemeProvider>,
    )

    expect(api.preference).toBe('light')
  })

  it('writes to a scoped element when one is given', () => {
    const scope = document.createElement('div')
    document.body.append(scope)

    render(
      <ThemeProvider defaultPreference="dark" storageKey={null} target={scope}>
        <Probe />
      </ThemeProvider>,
    )

    expect(scope.dataset.theme).toBe('dark')
    expect(document.documentElement.dataset.theme).toBeUndefined()

    scope.remove()
  })

  it('throws when useTheme is used outside a provider', () => {
    expect(() => render(<Probe />)).toThrow(/ThemeProvider/)
  })
})
