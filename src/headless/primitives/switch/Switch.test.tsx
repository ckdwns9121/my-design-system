import { act, type ReactNode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { Switch } from './Switch'

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

  return {
    container,
    rerender(nextUi: ReactNode) {
      act(() => {
        root.render(nextUi)
      })
    },
  }
}

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
})

describe('Switch', () => {
  it('exposes the switch role and checked state', () => {
    const { container } = render(<Switch aria-label="알림" />)
    const control = container.querySelector('button')

    expect(control?.getAttribute('role')).toBe('switch')
    expect(control?.getAttribute('aria-checked')).toBe('false')
    expect(control?.getAttribute('data-state')).toBe('unchecked')
  })

  it('toggles in uncontrolled mode', () => {
    const onCheckedChange = vi.fn()
    const { container } = render(<Switch aria-label="알림" onCheckedChange={onCheckedChange} />)
    const control = container.querySelector('button')

    act(() => {
      control?.click()
    })

    expect(control?.getAttribute('aria-checked')).toBe('true')
    expect(control?.getAttribute('data-state')).toBe('checked')
    expect(onCheckedChange).toHaveBeenCalledWith(true)
  })

  it('keeps the parent value in controlled mode', () => {
    const onCheckedChange = vi.fn()
    const { container } = render(
      <Switch aria-label="알림" checked={false} onCheckedChange={onCheckedChange} />,
    )
    const control = container.querySelector('button')

    act(() => {
      control?.click()
    })

    expect(control?.getAttribute('aria-checked')).toBe('false')
    expect(onCheckedChange).toHaveBeenCalledWith(true)
  })

  it('does not toggle when disabled', () => {
    const onCheckedChange = vi.fn()
    const { container } = render(
      <Switch aria-label="알림" disabled onCheckedChange={onCheckedChange} />,
    )
    const control = container.querySelector('button')

    act(() => {
      control?.click()
    })

    expect(control?.getAttribute('aria-checked')).toBe('false')
    expect(control?.hasAttribute('data-disabled')).toBe(true)
    expect(onCheckedChange).not.toHaveBeenCalled()
  })
})
