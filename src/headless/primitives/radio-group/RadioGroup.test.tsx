import { act, type ReactNode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { RadioGroupItem, RadioGroupRoot } from './RadioGroup'

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

function pressKey(element: HTMLElement, key: string) {
  act(() => {
    element.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key }))
  })
}

function renderGroup(props: Record<string, unknown> = {}) {
  const { container } = render(
    <RadioGroupRoot aria-label="배송 방식" {...props}>
      <RadioGroupItem value="standard">일반</RadioGroupItem>
      <RadioGroupItem value="express">특급</RadioGroupItem>
      <RadioGroupItem value="pickup">방문 수령</RadioGroupItem>
    </RadioGroupRoot>,
  )

  return Array.from(container.querySelectorAll<HTMLButtonElement>('[role="radio"]'))
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

describe('RadioGroup', () => {
  it('exposes radiogroup and radio roles with unchecked state', () => {
    const radios = renderGroup()

    expect(radios).toHaveLength(3)
    expect(radios.every((radio) => radio.getAttribute('aria-checked') === 'false')).toBe(true)
  })

  it('keeps a single tab stop on the first radio when nothing is selected', () => {
    const radios = renderGroup()

    expect(radios.map((radio) => radio.tabIndex)).toEqual([0, -1, -1])
  })

  it('moves the tab stop to the checked radio', () => {
    const radios = renderGroup({ defaultValue: 'express' })

    expect(radios.map((radio) => radio.tabIndex)).toEqual([-1, 0, -1])
  })

  it('selects on click and reports the value', () => {
    const onValueChange = vi.fn()
    const radios = renderGroup({ onValueChange })

    act(() => {
      radios[1].click()
    })

    expect(radios[1].getAttribute('aria-checked')).toBe('true')
    expect(radios[1].getAttribute('data-state')).toBe('checked')
    expect(onValueChange).toHaveBeenCalledWith('express')
  })

  it('moves focus and selection with arrow keys, wrapping at the end', () => {
    const radios = renderGroup({ defaultValue: 'standard' })

    act(() => {
      radios[0].focus()
    })

    pressKey(radios[0], 'ArrowDown')
    expect(document.activeElement).toBe(radios[1])
    expect(radios[1].getAttribute('aria-checked')).toBe('true')

    pressKey(radios[1], 'ArrowDown')
    pressKey(radios[2], 'ArrowDown')
    expect(document.activeElement).toBe(radios[0])
    expect(radios[0].getAttribute('aria-checked')).toBe('true')
  })

  it('jumps to the ends with Home and End', () => {
    const radios = renderGroup({ defaultValue: 'express' })

    act(() => {
      radios[1].focus()
    })

    pressKey(radios[1], 'End')
    expect(document.activeElement).toBe(radios[2])
    expect(radios[2].getAttribute('aria-checked')).toBe('true')

    pressKey(radios[2], 'Home')
    expect(document.activeElement).toBe(radios[0])
    expect(radios[0].getAttribute('aria-checked')).toBe('true')
  })

  it('uses horizontal arrow keys when the group is horizontal', () => {
    const radios = renderGroup({ defaultValue: 'standard', orientation: 'horizontal' })

    act(() => {
      radios[0].focus()
    })

    pressKey(radios[0], 'ArrowDown')
    expect(document.activeElement).toBe(radios[0])

    pressKey(radios[0], 'ArrowRight')
    expect(document.activeElement).toBe(radios[1])
  })

  it('skips disabled radios while navigating', () => {
    const { container } = render(
      <RadioGroupRoot aria-label="배송 방식" defaultValue="standard">
        <RadioGroupItem value="standard">일반</RadioGroupItem>
        <RadioGroupItem disabled value="express">
          특급
        </RadioGroupItem>
        <RadioGroupItem value="pickup">방문 수령</RadioGroupItem>
      </RadioGroupRoot>,
    )
    const radios = Array.from(container.querySelectorAll<HTMLButtonElement>('[role="radio"]'))

    act(() => {
      radios[0].focus()
    })

    pressKey(radios[0], 'ArrowDown')

    expect(document.activeElement).toBe(radios[2])
    expect(radios[2].getAttribute('aria-checked')).toBe('true')
  })

  it('does not select in controlled mode without a parent update', () => {
    const onValueChange = vi.fn()
    const radios = renderGroup({ onValueChange, value: 'standard' })

    act(() => {
      radios[2].click()
    })

    expect(radios[2].getAttribute('aria-checked')).toBe('false')
    expect(onValueChange).toHaveBeenCalledWith('pickup')
  })
})
