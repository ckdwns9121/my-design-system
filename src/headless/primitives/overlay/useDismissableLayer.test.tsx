import { act, useRef, useState, type ReactNode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, describe, expect, it } from 'vitest'
import { Portal } from './Portal'
import { useDismissableLayer } from './useDismissableLayer'

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
      act(() => root.render(nextUi))
    },
  }
}

function TestLayer({ modal = false }: { modal?: boolean }) {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useDismissableLayer({
    open,
    contentRef,
    triggerRef,
    modal,
    onDismiss: () => setOpen(false),
  })

  return (
    <>
      <button onClick={() => setOpen(true)} ref={triggerRef} type="button">
        Open
      </button>
      {open ? (
        <Portal>
          <div ref={contentRef} tabIndex={-1}>
            <button type="button">First</button>
            <button type="button">Last</button>
          </div>
        </Portal>
      ) : null}
    </>
  )
}

function ControlledModal({ name, open }: { name: string; open: boolean }) {
  const triggerRef = useRef<HTMLButtonElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useDismissableLayer({
    open,
    contentRef,
    triggerRef,
    modal: true,
    onDismiss: () => undefined,
  })

  return (
    <>
      <button ref={triggerRef} type="button">
        {name} trigger
      </button>
      {open ? (
        <Portal>
          <div data-modal={name} ref={contentRef} tabIndex={-1}>
            <button type="button">{name} action</button>
          </div>
        </Portal>
      ) : null}
    </>
  )
}

function ModalStack({ firstOpen, secondOpen }: { firstOpen: boolean; secondOpen: boolean }) {
  return (
    <>
      <ControlledModal name="first" open={firstOpen} />
      <ControlledModal name="second" open={secondOpen} />
    </>
  )
}

async function nextFrame() {
  await act(async () => {
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))
  })
}

afterEach(() => {
  for (const root of roots) {
    act(() => root.unmount())
  }

  for (const container of containers) {
    container.remove()
  }

  for (const portal of document.querySelectorAll('[data-headless-portal]')) {
    portal.remove()
  }

  document.body.style.overflow = ''
  roots = []
  containers = []
})

describe('useDismissableLayer', () => {
  it('moves focus inside a modal, traps Tab, and restores focus and scroll state', async () => {
    const { container } = render(<TestLayer modal />)
    const trigger = container.querySelector('button')

    act(() => trigger?.click())
    await nextFrame()

    const first = document.querySelector<HTMLButtonElement>('[data-headless-portal] button:first-child')
    const last = document.querySelector<HTMLButtonElement>('[data-headless-portal] button:last-child')

    expect(document.activeElement).toBe(first)
    expect(document.body.style.overflow).toBe('hidden')

    act(() => {
      last?.focus()
      last?.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'Tab' }))
    })

    expect(document.activeElement).toBe(first)

    act(() => {
      first?.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'Escape' }))
    })

    expect(document.querySelector('[data-headless-portal]')).toBeNull()
    expect(document.activeElement).toBe(trigger)
    expect(document.body.style.overflow).toBe('')
  })

  it('dismisses a non-modal layer after a pointer down outside', async () => {
    const { container } = render(<TestLayer />)
    const trigger = container.querySelector('button')

    act(() => trigger?.click())
    await nextFrame()

    act(() => {
      document.body.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }))
    })

    expect(document.querySelector('[data-headless-portal]')).toBeNull()
    expect(document.activeElement).toBe(trigger)
  })

  it('keeps background state locked when nested modals close out of order', async () => {
    const { container, rerender } = render(<ModalStack firstOpen secondOpen />)
    await nextFrame()

    let portals = document.querySelectorAll<HTMLElement>('[data-headless-portal]')

    expect(document.body.style.overflow).toBe('hidden')
    expect(container.inert).toBe(true)
    expect(portals).toHaveLength(2)
    expect(portals[0].inert).toBe(true)
    expect(portals[1].inert).toBe(false)

    rerender(<ModalStack firstOpen={false} secondOpen />)
    portals = document.querySelectorAll<HTMLElement>('[data-headless-portal]')

    expect(document.body.style.overflow).toBe('hidden')
    expect(container.inert).toBe(true)
    expect(portals).toHaveLength(1)
    expect(portals[0].inert).toBe(false)

    rerender(<ModalStack firstOpen={false} secondOpen={false} />)

    expect(document.body.style.overflow).toBe('')
    expect(container.inert).toBe(false)
  })
})
