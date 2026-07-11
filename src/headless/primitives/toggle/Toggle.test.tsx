import { act } from 'react'
import type { ReactNode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { Toggle } from './Toggle'

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

describe('Toggle', () => {
  it('toggles aria-pressed and data-state in uncontrolled mode', () => {
    const onPressedChange = vi.fn()
    const { container } = render(
      <Toggle defaultPressed={false} onPressedChange={onPressedChange}>
        Bold
      </Toggle>,
    )
    const button = container.querySelector('button')

    expect(button?.getAttribute('aria-pressed')).toBe('false')
    expect(button?.getAttribute('data-state')).toBe('off')

    act(() => {
      button?.click()
    })

    expect(button?.getAttribute('aria-pressed')).toBe('true')
    expect(button?.getAttribute('data-state')).toBe('on')
    expect(onPressedChange).toHaveBeenCalledWith(true)
  })

  it('calls onPressedChange without changing displayed state in controlled mode', () => {
    const onPressedChange = vi.fn()
    const { container } = render(
      <Toggle pressed={false} onPressedChange={onPressedChange}>
        Bold
      </Toggle>,
    )
    const button = container.querySelector('button')

    act(() => {
      button?.click()
    })

    expect(button?.getAttribute('aria-pressed')).toBe('false')
    expect(button?.getAttribute('data-state')).toBe('off')
    expect(onPressedChange).toHaveBeenCalledWith(true)
  })

  it('reflects controlled pressed updates from the parent', () => {
    const { container, rerender } = render(<Toggle pressed={false}>Bold</Toggle>)
    const button = container.querySelector('button')

    expect(button?.getAttribute('aria-pressed')).toBe('false')

    rerender(<Toggle pressed>Bold</Toggle>)

    expect(button?.getAttribute('aria-pressed')).toBe('true')
  })

  it('does not toggle when disabled', () => {
    const onPressedChange = vi.fn()
    const { container } = render(
      <Toggle disabled onPressedChange={onPressedChange}>
        Bold
      </Toggle>,
    )
    const button = container.querySelector('button')

    act(() => {
      button?.click()
    })

    expect(button?.getAttribute('aria-pressed')).toBe('false')
    expect(button?.hasAttribute('data-disabled')).toBe(true)
    expect(onPressedChange).not.toHaveBeenCalled()
  })
})
