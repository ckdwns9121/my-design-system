import { act, type ReactNode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRoot,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './DropdownMenu'

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

function pressKey(element: Element, key: string) {
  act(() => {
    element.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key }))
  })
}

function expectFocused(element: Element | null | undefined) {
  expect(document.activeElement).toBe(element)
}

async function waitFrame() {
  await act(async () => {
    await new Promise((resolve) => requestAnimationFrame(resolve))
  })
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

  document.querySelectorAll('[data-headless-portal]').forEach((portal) => portal.remove())
  roots = []
  containers = []
})

function DropdownFixture({
  onOpenChange,
  onSelect = vi.fn(),
  open,
}: {
  onOpenChange?: (open: boolean) => void
  onSelect?: () => void
  open?: boolean
}) {
  return (
    <DropdownMenuRoot onOpenChange={onOpenChange} open={open}>
      <DropdownMenuTrigger>Actions</DropdownMenuTrigger>
      <DropdownMenuPortal>
        <DropdownMenuContent>
          <DropdownMenuLabel>Project</DropdownMenuLabel>
          <DropdownMenuItem onSelect={onSelect}>Archive</DropdownMenuItem>
          <DropdownMenuItem disabled>Delete</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Rename</DropdownMenuItem>
          <DropdownMenuItem>Share</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </DropdownMenuRoot>
  )
}

describe('headless DropdownMenu', () => {
  it('opens from the trigger with menu-button aria and focuses the first item', async () => {
    render(<DropdownFixture />)
    const trigger = document.querySelector<HTMLButtonElement>('button[aria-haspopup="menu"]')

    expect(trigger?.getAttribute('aria-expanded')).toBe('false')
    expect(trigger?.getAttribute('aria-controls')).toBeTruthy()

    act(() => {
      trigger?.click()
    })
    await waitFrame()

    const menu = document.querySelector<HTMLElement>('[role="menu"]')
    const archive = document.querySelector<HTMLButtonElement>('[role="menuitem"]')

    expect(trigger?.getAttribute('aria-expanded')).toBe('true')
    expect(menu?.getAttribute('aria-labelledby')).toBe(trigger?.id)
    expectFocused(archive)
  })

  it('supports roving focus, wrapping, Home and End with disabled items focusable', async () => {
    render(<DropdownFixture />)
    const trigger = document.querySelector<HTMLButtonElement>('button[aria-haspopup="menu"]')

    pressKey(trigger!, 'ArrowUp')
    await waitFrame()

    const items = document.querySelectorAll<HTMLButtonElement>('[role="menuitem"]')
    expectFocused(items[3])

    pressKey(items[3], 'ArrowDown')
    expectFocused(items[0])

    pressKey(items[0], 'ArrowDown')
    expectFocused(items[1])
    expect(items[1].getAttribute('aria-disabled')).toBe('true')

    pressKey(items[1], 'Enter')
    expect(document.querySelector('[role="menu"]')).not.toBeNull()

    pressKey(items[1], 'ArrowDown')
    expectFocused(items[2])

    pressKey(items[2], 'Home')
    expectFocused(items[0])

    pressKey(items[0], 'End')
    expectFocused(items[3])
  })

  it('moves focus with printable typeahead and selects with Enter', async () => {
    render(<DropdownFixture />)
    const trigger = document.querySelector<HTMLButtonElement>('button[aria-haspopup="menu"]')

    pressKey(trigger!, 'ArrowDown')
    await waitFrame()

    const items = document.querySelectorAll<HTMLButtonElement>('[role="menuitem"]')
    pressKey(items[0], 'r')
    expectFocused(items[2])

    pressKey(items[2], 'Enter')
    await waitFrame()

    expect(document.querySelector('[role="menu"]')).toBeNull()
    expectFocused(trigger)
  })

  it('closes on Escape and outside pointer down with trigger focus return', async () => {
    render(<DropdownFixture />)
    const trigger = document.querySelector<HTMLButtonElement>('button[aria-haspopup="menu"]')

    act(() => {
      trigger?.click()
    })
    await waitFrame()

    act(() => {
      document.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'Escape' }))
    })
    await waitFrame()

    expect(document.querySelector('[role="menu"]')).toBeNull()
    expectFocused(trigger)

    act(() => {
      trigger?.click()
    })
    await waitFrame()

    act(() => {
      document.body.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }))
    })
    await waitFrame()

    expect(document.querySelector('[role="menu"]')).toBeNull()
    expectFocused(trigger)
  })

  it('closes on Tab without returning focus to the trigger', async () => {
    render(<DropdownFixture />)
    const trigger = document.querySelector<HTMLButtonElement>('button[aria-haspopup="menu"]')

    act(() => {
      trigger?.click()
    })
    await waitFrame()

    const item = document.querySelector<HTMLButtonElement>('[role="menuitem"]')
    pressKey(item!, 'Tab')
    await waitFrame()

    expect(document.querySelector('[role="menu"]')).toBeNull()
    expect(document.activeElement).not.toBe(trigger)
  })

  it('calls onOpenChange without changing displayed state in controlled mode', () => {
    const onOpenChange = vi.fn()
    render(<DropdownFixture onOpenChange={onOpenChange} open={false} />)
    const trigger = document.querySelector<HTMLButtonElement>('button[aria-haspopup="menu"]')

    act(() => {
      trigger?.click()
    })

    expect(onOpenChange).toHaveBeenCalledWith(true)
    expect(trigger?.getAttribute('aria-expanded')).toBe('false')
    expect(document.querySelector('[role="menu"]')).toBeNull()
  })

  it('waits for a controlled parent to close before returning focus', async () => {
    const onOpenChange = vi.fn()
    const { rerender } = render(
      <DropdownFixture onOpenChange={onOpenChange} open />,
    )
    await waitFrame()
    const trigger = document.querySelector<HTMLButtonElement>('button[aria-haspopup="menu"]')
    const item = document.querySelector<HTMLButtonElement>('[role="menuitem"]')

    pressKey(item!, 'Enter')
    await waitFrame()

    expect(onOpenChange).toHaveBeenCalledWith(false)
    expect(document.querySelector('[role="menu"]')).not.toBeNull()
    expectFocused(item)

    rerender(<DropdownFixture onOpenChange={onOpenChange} open={false} />)
    await waitFrame()

    expect(document.querySelector('[role="menu"]')).toBeNull()
    expectFocused(trigger)
  })

  it('keeps generated trigger and menu IDs authoritative', async () => {
    const unsafeTriggerProps = { id: 'custom-trigger' }
    const unsafeContentProps = { id: 'custom-menu' }
    render(
      <DropdownMenuRoot>
        <DropdownMenuTrigger {...unsafeTriggerProps}>Actions</DropdownMenuTrigger>
        <DropdownMenuPortal>
          <DropdownMenuContent {...unsafeContentProps}>
            <DropdownMenuItem>Archive</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenuPortal>
      </DropdownMenuRoot>,
    )
    const trigger = document.querySelector<HTMLButtonElement>('button[aria-haspopup="menu"]')

    act(() => trigger?.click())
    await waitFrame()

    const menu = document.querySelector<HTMLElement>('[role="menu"]')
    expect(trigger?.id).not.toBe('custom-trigger')
    expect(menu?.id).not.toBe('custom-menu')
    expect(trigger?.getAttribute('aria-controls')).toBe(menu?.id)
    expect(menu?.getAttribute('aria-labelledby')).toBe(trigger?.id)
  })
})
