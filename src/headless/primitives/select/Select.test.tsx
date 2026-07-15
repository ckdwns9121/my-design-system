import { act, type ReactNode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  SelectContent,
  SelectLabel,
  SelectOption,
  SelectPortal,
  SelectRoot,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from './Select'

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

function SelectFixture({
  onOpenChange,
  onValueChange,
  open,
  value,
}: {
  onOpenChange?: (open: boolean) => void
  onValueChange?: (value: string) => void
  open?: boolean
  value?: string
}) {
  return (
    <SelectRoot
      defaultValue="team"
      onOpenChange={onOpenChange}
      onValueChange={onValueChange}
      open={open}
      value={value}
    >
      <SelectTrigger aria-label="Assignee">
        <SelectValue placeholder="Choose assignee" />
      </SelectTrigger>
      <SelectPortal>
        <SelectContent>
          <SelectLabel>People</SelectLabel>
          <SelectOption value="team">Team Inbox</SelectOption>
          <SelectOption disabled value="ops">
            Operations
          </SelectOption>
          <SelectSeparator />
          <SelectOption value="design">Design System</SelectOption>
          <SelectOption value="support">Support</SelectOption>
        </SelectContent>
      </SelectPortal>
    </SelectRoot>
  )
}

describe('headless Select', () => {
  it('renders combobox/listbox semantics and keeps the selected label registered while closed', async () => {
    render(<SelectFixture />)
    await waitFrame()
    await waitFrame()

    const trigger = document.querySelector<HTMLButtonElement>('[role="combobox"]')
    const listbox = document.querySelector<HTMLElement>('[role="listbox"]')
    const selected = document.querySelector<HTMLElement>('[role="option"][aria-selected="true"]')

    expect(trigger?.textContent).toContain('Team Inbox')
    expect(trigger?.getAttribute('aria-expanded')).toBe('false')
    expect(trigger?.getAttribute('aria-controls')).toBe(listbox?.id)
    expect(trigger?.getAttribute('aria-haspopup')).toBe('listbox')
    expect(listbox?.hidden).toBe(true)
    expect(selected?.textContent).toBe('Team Inbox')
  })

  it('opens from ArrowDown and tracks options with aria-activedescendant', async () => {
    render(<SelectFixture />)
    await waitFrame()
    await waitFrame()
    const trigger = document.querySelector<HTMLButtonElement>('[role="combobox"]')

    act(() => trigger?.focus())
    pressKey(trigger!, 'ArrowDown')
    await waitFrame()

    const listbox = document.querySelector<HTMLElement>('[role="listbox"]')
    const options = document.querySelectorAll<HTMLElement>('[role="option"]')

    expect(trigger?.getAttribute('aria-expanded')).toBe('true')
    expect(listbox?.hidden).toBe(false)
    expectFocused(trigger)
    expect(trigger?.getAttribute('aria-activedescendant')).toBe(options[0].id)
    expect(options[0].hasAttribute('data-active')).toBe(true)

    pressKey(trigger!, 'ArrowDown')
    expectFocused(trigger)
    expect(trigger?.getAttribute('aria-activedescendant')).toBe(options[2].id)
    expect(options[2].hasAttribute('data-active')).toBe(true)
    expect(options[1].getAttribute('aria-disabled')).toBe('true')

    pressKey(trigger!, 'End')
    expect(trigger?.getAttribute('aria-activedescendant')).toBe(options[3].id)

    pressKey(trigger!, 'Home')
    expect(trigger?.getAttribute('aria-activedescendant')).toBe(options[0].id)
  })

  it('typeaheads to an option and selects it with Space', async () => {
    const onValueChange = vi.fn()
    render(<SelectFixture onValueChange={onValueChange} />)
    await waitFrame()
    await waitFrame()
    const trigger = document.querySelector<HTMLButtonElement>('[role="combobox"]')

    act(() => trigger?.focus())
    pressKey(trigger!, 'ArrowDown')
    await waitFrame()

    const options = document.querySelectorAll<HTMLElement>('[role="option"]')
    pressKey(trigger!, 's')
    expectFocused(trigger)
    expect(trigger?.getAttribute('aria-activedescendant')).toBe(options[3].id)
    expect(options[3].hasAttribute('data-active')).toBe(true)

    pressKey(trigger!, ' ')
    await waitFrame()

    expect(onValueChange).toHaveBeenCalledWith('support')
    expect(trigger?.textContent).toContain('Support')
    expect(trigger?.getAttribute('aria-expanded')).toBe('false')
    expectFocused(trigger)
  })

  it('closes on Escape and outside pointer down with trigger focus return', async () => {
    render(<SelectFixture />)
    await waitFrame()
    await waitFrame()
    const trigger = document.querySelector<HTMLButtonElement>('[role="combobox"]')

    act(() => {
      trigger?.click()
    })
    await waitFrame()

    act(() => {
      document.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'Escape' }))
    })
    await waitFrame()

    expect(trigger?.getAttribute('aria-expanded')).toBe('false')
    expectFocused(trigger)

    act(() => {
      trigger?.click()
    })
    await waitFrame()

    act(() => {
      document.body.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }))
    })
    await waitFrame()

    expect(trigger?.getAttribute('aria-expanded')).toBe('false')
    expectFocused(trigger)
  })

  it('supports controlled value and open state callbacks', async () => {
    const onOpenChange = vi.fn()
    const onValueChange = vi.fn()
    const { rerender } = render(
      <SelectFixture
        onOpenChange={onOpenChange}
        onValueChange={onValueChange}
        open={false}
        value="team"
      />,
    )
    await waitFrame()
    await waitFrame()
    const trigger = document.querySelector<HTMLButtonElement>('[role="combobox"]')

    act(() => {
      trigger?.click()
    })

    expect(onOpenChange).toHaveBeenCalledWith(true)
    expect(trigger?.getAttribute('aria-expanded')).toBe('false')

    rerender(
      <SelectFixture
        onOpenChange={onOpenChange}
        onValueChange={onValueChange}
        open
        value="team"
      />,
    )
    await waitFrame()

    const options = document.querySelectorAll<HTMLElement>('[role="option"]')
    act(() => {
      options[2].click()
    })

    expect(onValueChange).toHaveBeenCalledWith('design')
    expect(trigger?.textContent).toContain('Team Inbox')
  })

  it('treats an empty string as a valid selected value', async () => {
    render(
      <SelectRoot defaultValue="">
        <SelectTrigger aria-label="Status">
          <SelectValue placeholder="Choose status" />
        </SelectTrigger>
        <SelectPortal>
          <SelectContent>
            <SelectOption value="">None</SelectOption>
            <SelectOption value="active">Active</SelectOption>
          </SelectContent>
        </SelectPortal>
      </SelectRoot>,
    )
    await waitFrame()
    await waitFrame()
    const trigger = document.querySelector<HTMLButtonElement>('[role="combobox"]')

    expect(trigger?.textContent).toContain('None')

    act(() => {
      trigger?.focus()
      trigger?.click()
    })
    await waitFrame()

    const noneOption = document.querySelector<HTMLElement>('[role="option"]')
    expect(noneOption?.getAttribute('aria-selected')).toBe('true')
    expect(trigger?.getAttribute('aria-activedescendant')).toBe(noneOption?.id)
  })

  it('removes stale labels when an option unmounts', async () => {
    function DynamicSelect({ showSelected }: { showSelected: boolean }) {
      return (
        <SelectRoot value="team">
          <SelectTrigger aria-label="Assignee">
            <SelectValue placeholder="Choose assignee" />
          </SelectTrigger>
          <SelectPortal>
            <SelectContent>
              {showSelected ? <SelectOption value="team">Team Inbox</SelectOption> : null}
              <SelectOption value="design">Design System</SelectOption>
            </SelectContent>
          </SelectPortal>
        </SelectRoot>
      )
    }

    const { rerender } = render(<DynamicSelect showSelected />)
    await waitFrame()
    await waitFrame()
    const trigger = document.querySelector<HTMLButtonElement>('[role="combobox"]')
    expect(trigger?.textContent).toContain('Team Inbox')

    rerender(<DynamicSelect showSelected={false} />)
    await waitFrame()

    expect(trigger?.textContent).toContain('Choose assignee')
  })

  it('keeps generated combobox, listbox, and option IDs authoritative', async () => {
    const unsafeTriggerProps = { id: 'custom-trigger' }
    const unsafeContentProps = { id: 'custom-listbox' }
    const unsafeOptionProps = { id: 'custom-option' }
    render(
      <SelectRoot defaultValue="team">
        <SelectTrigger {...unsafeTriggerProps} aria-label="Assignee">
          <SelectValue />
        </SelectTrigger>
        <SelectPortal>
          <SelectContent {...unsafeContentProps}>
            <SelectOption {...unsafeOptionProps} value="team">Team Inbox</SelectOption>
          </SelectContent>
        </SelectPortal>
      </SelectRoot>,
    )
    await waitFrame()
    await waitFrame()
    const trigger = document.querySelector<HTMLButtonElement>('[role="combobox"]')

    act(() => {
      trigger?.focus()
      trigger?.click()
    })
    await waitFrame()

    const listbox = document.querySelector<HTMLElement>('[role="listbox"]')
    const option = document.querySelector<HTMLElement>('[role="option"]')
    expect(trigger?.id).not.toBe('custom-trigger')
    expect(listbox?.id).not.toBe('custom-listbox')
    expect(option?.id).not.toBe('custom-option')
    expect(trigger?.getAttribute('aria-controls')).toBe(listbox?.id)
    expect(listbox?.getAttribute('aria-labelledby')).toBe(trigger?.id)
    expect(trigger?.getAttribute('aria-activedescendant')).toBe(option?.id)
  })
})
