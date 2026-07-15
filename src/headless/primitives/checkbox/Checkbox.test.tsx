import { act, type ReactNode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { Checkbox } from './Checkbox'

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

describe('Checkbox', () => {
  it('toggles checked state and data-state in uncontrolled mode', () => {
    const onCheckedChange = vi.fn()
    const { container } = render(
      <Checkbox aria-label="Accept terms" onCheckedChange={onCheckedChange} />,
    )
    const checkbox = container.querySelector<HTMLInputElement>('input')

    expect(checkbox?.checked).toBe(false)
    expect(checkbox?.getAttribute('aria-checked')).toBe('false')
    expect(checkbox?.getAttribute('data-state')).toBe('unchecked')

    act(() => {
      checkbox?.click()
    })

    expect(checkbox?.checked).toBe(true)
    expect(checkbox?.getAttribute('aria-checked')).toBe('true')
    expect(checkbox?.getAttribute('data-state')).toBe('checked')
    expect(onCheckedChange).toHaveBeenCalledWith(true)
  })

  it('calls onCheckedChange without changing displayed state in controlled mode', () => {
    const onCheckedChange = vi.fn()
    const { container } = render(
      <Checkbox
        aria-label="Accept terms"
        checked={false}
        onCheckedChange={onCheckedChange}
      />,
    )
    const checkbox = container.querySelector<HTMLInputElement>('input')

    act(() => {
      checkbox?.click()
    })

    expect(checkbox?.checked).toBe(false)
    expect(checkbox?.getAttribute('aria-checked')).toBe('false')
    expect(checkbox?.getAttribute('data-state')).toBe('unchecked')
    expect(onCheckedChange).toHaveBeenCalledWith(true)
  })

  it('reflects controlled checked updates from the parent', () => {
    const { container, rerender } = render(
      <Checkbox aria-label="Accept terms" checked={false} />,
    )
    const checkbox = container.querySelector<HTMLInputElement>('input')

    expect(checkbox?.checked).toBe(false)

    rerender(<Checkbox aria-label="Accept terms" checked />)

    expect(checkbox?.checked).toBe(true)
    expect(checkbox?.getAttribute('data-state')).toBe('checked')
  })

  it('synchronizes the mixed state to aria-checked and input.indeterminate', () => {
    const { container, rerender } = render(
      <Checkbox aria-label="Select all" checked={false} indeterminate />,
    )
    const checkbox = container.querySelector<HTMLInputElement>('input')

    expect(checkbox?.checked).toBe(false)
    expect(checkbox?.indeterminate).toBe(true)
    expect(checkbox?.getAttribute('aria-checked')).toBe('mixed')
    expect(checkbox?.getAttribute('data-state')).toBe('indeterminate')

    rerender(<Checkbox aria-label="Select all" checked />)

    expect(checkbox?.checked).toBe(true)
    expect(checkbox?.indeterminate).toBe(false)
    expect(checkbox?.getAttribute('aria-checked')).toBe('true')
    expect(checkbox?.getAttribute('data-state')).toBe('checked')
  })

  it('reapplies the native mixed state after user activation', () => {
    const { container } = render(
      <Checkbox aria-label="Select all" indeterminate />,
    )
    const checkbox = container.querySelector<HTMLInputElement>('input')

    act(() => {
      checkbox?.click()
    })

    expect(checkbox?.checked).toBe(true)
    expect(checkbox?.indeterminate).toBe(true)
    expect(checkbox?.getAttribute('aria-checked')).toBe('mixed')
    expect(checkbox?.getAttribute('data-state')).toBe('indeterminate')
  })

  it('does not toggle when disabled', () => {
    const onCheckedChange = vi.fn()
    const { container } = render(
      <Checkbox aria-label="Accept terms" disabled onCheckedChange={onCheckedChange} />,
    )
    const checkbox = container.querySelector<HTMLInputElement>('input')

    act(() => {
      checkbox?.click()
    })

    expect(checkbox?.checked).toBe(false)
    expect(checkbox?.hasAttribute('data-disabled')).toBe(true)
    expect(onCheckedChange).not.toHaveBeenCalled()
  })
})
