import { act, type ReactNode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  PopoverClose,
  PopoverContent,
  PopoverPortal,
  PopoverRoot,
  PopoverTrigger,
} from './Popover'

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

  for (const portal of document.querySelectorAll('[data-headless-portal]')) {
    portal.remove()
  }

  roots = []
  containers = []
})

describe('Popover', () => {
  it('opens uncontrolled content with trigger dialog linkage and closes from Close', () => {
    const onOpenChange = vi.fn()
    const { container } = render(
      <PopoverRoot onOpenChange={onOpenChange}>
        <PopoverTrigger>Details</PopoverTrigger>
        <PopoverPortal disabled>
          <PopoverContent>
            <p>Popover content</p>
            <PopoverClose>Done</PopoverClose>
          </PopoverContent>
        </PopoverPortal>
      </PopoverRoot>,
    )
    const trigger = container.querySelector<HTMLButtonElement>('button')

    expect(trigger?.getAttribute('aria-expanded')).toBe('false')
    expect(container.querySelector('[role="dialog"]')).toBeNull()

    act(() => {
      trigger?.click()
    })

    const content = container.querySelector<HTMLElement>('[role="dialog"]')
    const close = container.querySelectorAll<HTMLButtonElement>('button')[1]

    expect(trigger?.getAttribute('aria-expanded')).toBe('true')
    expect(trigger?.getAttribute('aria-haspopup')).toBe('dialog')
    expect(trigger?.getAttribute('aria-controls')).toBe(content?.id)
    expect(content?.getAttribute('aria-labelledby')).toBe(trigger?.id)
    expect(content?.getAttribute('data-state')).toBe('open')
    expect(onOpenChange).toHaveBeenCalledWith(true)

    act(() => {
      close?.click()
    })

    expect(trigger?.getAttribute('aria-expanded')).toBe('false')
    expect(container.querySelector('[role="dialog"]')).toBeNull()
    expect(document.activeElement).toBe(trigger)
    expect(onOpenChange).toHaveBeenLastCalledWith(false)
  })

  it('requests controlled state changes without changing displayed state', () => {
    const onOpenChange = vi.fn()
    const { container, rerender } = render(
      <PopoverRoot open={false} onOpenChange={onOpenChange}>
        <PopoverTrigger>Details</PopoverTrigger>
        <PopoverPortal disabled>
          <PopoverContent>Controlled content</PopoverContent>
        </PopoverPortal>
      </PopoverRoot>,
    )
    const trigger = container.querySelector<HTMLButtonElement>('button')

    act(() => {
      trigger?.click()
    })

    expect(onOpenChange).toHaveBeenCalledWith(true)
    expect(trigger?.getAttribute('aria-expanded')).toBe('false')
    expect(container.querySelector('[role="dialog"]')).toBeNull()

    rerender(
      <PopoverRoot open>
        <PopoverTrigger>Details</PopoverTrigger>
        <PopoverPortal disabled>
          <PopoverContent>Controlled content</PopoverContent>
        </PopoverPortal>
      </PopoverRoot>,
    )

    expect(trigger?.getAttribute('aria-expanded')).toBe('true')
    expect(container.querySelector('[role="dialog"]')).not.toBeNull()
  })

  it('dismisses on Escape and outside pointer down while returning focus', () => {
    const { container } = render(
      <PopoverRoot defaultOpen>
        <PopoverTrigger>Details</PopoverTrigger>
        <PopoverPortal disabled>
          <PopoverContent>Dismissable content</PopoverContent>
        </PopoverPortal>
      </PopoverRoot>,
    )
    const trigger = container.querySelector<HTMLButtonElement>('button')
    const outside = document.createElement('button')
    document.body.append(outside)

    trigger?.focus()

    act(() => {
      document.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'Escape' }))
    })

    expect(container.querySelector('[role="dialog"]')).toBeNull()
    expect(document.activeElement).toBe(trigger)

    act(() => {
      trigger?.click()
    })

    expect(container.querySelector('[role="dialog"]')).not.toBeNull()

    act(() => {
      outside.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }))
    })

    expect(container.querySelector('[role="dialog"]')).toBeNull()
    outside.remove()
  })
})
