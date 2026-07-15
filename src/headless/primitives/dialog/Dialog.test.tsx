import { act, type ReactNode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from './Dialog'

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

function dispatchKey(key: string) {
  act(() => {
    document.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key }))
  })
}

function dispatchPointerDown(target: Element) {
  act(() => {
    target.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }))
  })
}

async function flushFrame() {
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

  document.body.style.overflow = ''
  roots = []
  containers = []
})

function DialogFixture({
  defaultOpen,
  onOpenChange,
  open,
}: {
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  open?: boolean
}) {
  return (
    <DialogRoot defaultOpen={defaultOpen} onOpenChange={onOpenChange} open={open}>
      <DialogTrigger>Open settings</DialogTrigger>
      <DialogPortal>
        <DialogOverlay data-testid="overlay" />
        <DialogContent>
          <DialogTitle>Account settings</DialogTitle>
          <DialogDescription>Update your account preferences.</DialogDescription>
          <button>First action</button>
          <DialogClose>Close</DialogClose>
        </DialogContent>
      </DialogPortal>
    </DialogRoot>
  )
}

describe('headless Dialog', () => {
  it('opens in uncontrolled mode and links trigger, title, and description', async () => {
    const onOpenChange = vi.fn()
    const { container } = render(<DialogFixture onOpenChange={onOpenChange} />)
    const trigger = container.querySelector<HTMLButtonElement>('button')

    expect(trigger?.getAttribute('aria-expanded')).toBe('false')
    expect(document.querySelector('[role="dialog"]')).toBeNull()

    act(() => {
      trigger?.click()
    })
    await flushFrame()

    const dialog = document.querySelector<HTMLElement>('[role="dialog"]')
    const title = document.querySelector<HTMLHeadingElement>('h2')
    const description = document.querySelector<HTMLParagraphElement>('p')

    expect(trigger?.getAttribute('aria-expanded')).toBe('true')
    expect(trigger?.getAttribute('aria-controls')).toBe(dialog?.id)
    expect(dialog?.getAttribute('aria-modal')).toBe('true')
    expect(dialog?.getAttribute('aria-labelledby')).toBe(title?.id)
    expect(dialog?.getAttribute('aria-describedby')).toBe(description?.id)
    expect(document.activeElement?.textContent).toBe('First action')
    expect(onOpenChange).toHaveBeenCalledWith(true)
  })

  it('calls onOpenChange without changing displayed state in controlled mode', () => {
    const onOpenChange = vi.fn()
    const { container, rerender } = render(
      <DialogFixture onOpenChange={onOpenChange} open={false} />,
    )
    const trigger = container.querySelector<HTMLButtonElement>('button')

    act(() => {
      trigger?.click()
    })

    expect(document.querySelector('[role="dialog"]')).toBeNull()
    expect(onOpenChange).toHaveBeenCalledWith(true)

    rerender(<DialogFixture open />)

    expect(document.querySelector('[role="dialog"]')).not.toBeNull()
    expect(trigger?.getAttribute('aria-expanded')).toBe('true')
  })

  it('dismisses on close button, Escape, and outside pointer down', async () => {
    const { container } = render(<DialogFixture defaultOpen />)
    await flushFrame()

    const trigger = container.querySelector<HTMLButtonElement>('button')
    const close = document.querySelectorAll<HTMLButtonElement>('button')[2]

    act(() => {
      close.click()
    })

    expect(document.querySelector('[role="dialog"]')).toBeNull()
    expect(document.activeElement).toBe(trigger)

    act(() => {
      trigger?.click()
    })
    await flushFrame()
    dispatchKey('Escape')

    expect(document.querySelector('[role="dialog"]')).toBeNull()

    act(() => {
      trigger?.click()
    })
    await flushFrame()
    dispatchPointerDown(document.body)

    expect(document.querySelector('[role="dialog"]')).toBeNull()
  })

  it('traps focus, locks body scroll, and inerts background while open', async () => {
    const before = document.createElement('button')
    before.textContent = 'Background'
    document.body.append(before)

    render(<DialogFixture defaultOpen />)
    await flushFrame()

    const dialog = document.querySelector<HTMLElement>('[role="dialog"]')
    const buttons = dialog?.querySelectorAll<HTMLButtonElement>('button')
    const first = buttons?.[0]
    const last = buttons?.[1]

    if (!first || !last) {
      throw new Error('Expected dialog action buttons to render')
    }

    expect(document.body.style.overflow).toBe('hidden')
    expect(before.inert).toBe(true)

    act(() => {
      last.focus()
    })
    dispatchKey('Tab')
    expect(document.activeElement).toBe(first)

    act(() => {
      first.focus()
    })
    act(() => {
      document.dispatchEvent(
        new KeyboardEvent('keydown', { bubbles: true, key: 'Tab', shiftKey: true }),
      )
    })
    expect(document.activeElement).toBe(last)

    act(() => {
      before.dispatchEvent(new FocusEvent('focusin', { bubbles: true }))
    })
    expect(dialog?.contains(document.activeElement)).toBe(true)

    before.remove()
  })

  it('allows aria-label fallback when no visible title is provided', () => {
    render(
      <DialogRoot defaultOpen>
        <DialogTrigger>Open</DialogTrigger>
        <DialogPortal>
          <DialogContent aria-label="Preferences">
            <DialogClose>Close</DialogClose>
          </DialogContent>
        </DialogPortal>
      </DialogRoot>,
    )

    const dialog = document.querySelector<HTMLElement>('[role="dialog"]')

    expect(dialog?.getAttribute('aria-label')).toBe('Preferences')
    expect(dialog?.hasAttribute('aria-labelledby')).toBe(false)
  })

  it('keeps force-mounted closed layers hidden and non-modal', () => {
    render(
      <DialogRoot>
        <DialogTrigger>Open</DialogTrigger>
        <DialogPortal disabled forceMount>
          <DialogOverlay data-testid="overlay" forceMount />
          <DialogContent aria-label="Preferences" forceMount>
            <DialogClose>Close</DialogClose>
          </DialogContent>
        </DialogPortal>
      </DialogRoot>,
    )

    const dialog = document.querySelector<HTMLElement>('[role="dialog"]')
    const overlay = document.querySelector<HTMLElement>('[data-testid="overlay"]')

    expect(dialog?.hidden).toBe(true)
    expect(overlay?.hidden).toBe(true)
    expect(document.body.style.overflow).toBe('')
  })
})
