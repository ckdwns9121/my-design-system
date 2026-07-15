import { act, type ReactNode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  TooltipContent,
  TooltipPortal,
  TooltipRoot,
  TooltipTrigger,
} from './Tooltip'

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

  return { container }
}

function pointer(target: Element | null, type: string) {
  act(() => {
    target?.dispatchEvent(new PointerEvent(type, { bubbles: true }))
  })
}

afterEach(() => {
  vi.useRealTimers()

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

describe('Tooltip', () => {
  it('opens on focus with role tooltip linkage and closes on Escape', () => {
    const { container } = render(
      <TooltipRoot>
        <TooltipTrigger>Save</TooltipTrigger>
        <TooltipPortal disabled>
          <TooltipContent>Save changes</TooltipContent>
        </TooltipPortal>
      </TooltipRoot>,
    )
    const trigger = container.querySelector<HTMLButtonElement>('button')

    expect(trigger?.getAttribute('aria-describedby')).toBeNull()

    act(() => {
      trigger?.focus()
    })

    const tooltip = container.querySelector<HTMLElement>('[role="tooltip"]')

    expect(tooltip?.textContent).toBe('Save changes')
    expect(trigger?.getAttribute('aria-describedby')).toBe(tooltip?.id)

    act(() => {
      trigger?.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'Escape' }))
    })

    expect(container.querySelector('[role="tooltip"]')).toBeNull()
    expect(trigger?.getAttribute('aria-describedby')).toBeNull()
  })

  it('respects hover delay and pointer grace between trigger and content', () => {
    vi.useFakeTimers()

    const { container } = render(
      <TooltipRoot closeGraceDuration={50} delayDuration={20}>
        <TooltipTrigger>Export</TooltipTrigger>
        <TooltipPortal disabled>
          <TooltipContent>Download CSV</TooltipContent>
        </TooltipPortal>
      </TooltipRoot>,
    )
    const trigger = container.querySelector<HTMLButtonElement>('button')

    pointer(trigger, 'pointerover')

    act(() => {
      vi.advanceTimersByTime(19)
    })

    expect(container.querySelector('[role="tooltip"]')).toBeNull()

    act(() => {
      vi.advanceTimersByTime(1)
    })

    const tooltip = container.querySelector<HTMLElement>('[role="tooltip"]')
    expect(tooltip?.textContent).toBe('Download CSV')

    pointer(trigger, 'pointerout')

    act(() => {
      vi.advanceTimersByTime(40)
    })

    expect(container.querySelector('[role="tooltip"]')).not.toBeNull()

    pointer(tooltip, 'pointerover')

    act(() => {
      vi.advanceTimersByTime(60)
    })

    expect(container.querySelector('[role="tooltip"]')).not.toBeNull()

    pointer(tooltip, 'pointerout')

    act(() => {
      vi.advanceTimersByTime(50)
    })

    expect(container.querySelector('[role="tooltip"]')).toBeNull()
  })

  it('requests controlled open changes without changing displayed state', () => {
    const onOpenChange = vi.fn()
    const { container } = render(
      <TooltipRoot open={false} onOpenChange={onOpenChange}>
        <TooltipTrigger>Save</TooltipTrigger>
        <TooltipPortal disabled>
          <TooltipContent>Save changes</TooltipContent>
        </TooltipPortal>
      </TooltipRoot>,
    )
    const trigger = container.querySelector<HTMLButtonElement>('button')

    act(() => {
      trigger?.focus()
    })

    expect(onOpenChange).toHaveBeenCalledWith(true)
    expect(container.querySelector('[role="tooltip"]')).toBeNull()
    expect(trigger?.getAttribute('aria-describedby')).toBeNull()
  })
})
