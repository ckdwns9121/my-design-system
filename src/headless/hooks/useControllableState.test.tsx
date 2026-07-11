import { act } from 'react'
import type { ReactNode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useControllableState } from './useControllableState'

;(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT =
  true

type CounterProps = {
  value?: number
  defaultValue?: number
  onChange?: (value: number) => void
}

function Counter({ value, defaultValue = 0, onChange }: CounterProps) {
  const [count, setCount] = useControllableState({
    value,
    defaultValue,
    onChange,
  })

  return (
    <button type="button" onClick={() => setCount((currentCount) => currentCount + 1)}>
      {count}
    </button>
  )
}

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

describe('useControllableState', () => {
  it('updates internal state in uncontrolled mode', () => {
    const onChange = vi.fn()
    const { container } = render(<Counter defaultValue={2} onChange={onChange} />)
    const button = container.querySelector('button')

    expect(button?.textContent).toBe('2')

    act(() => {
      button?.click()
    })

    expect(button?.textContent).toBe('3')
    expect(onChange).toHaveBeenCalledWith(3)
  })

  it('does not update internal state in controlled mode', () => {
    const onChange = vi.fn()
    const { container } = render(<Counter value={7} onChange={onChange} />)
    const button = container.querySelector('button')

    act(() => {
      button?.click()
    })

    expect(button?.textContent).toBe('7')
    expect(onChange).toHaveBeenCalledWith(8)
  })

  it('reflects controlled value updates from the parent', () => {
    const { container, rerender } = render(<Counter value={1} />)
    const button = container.querySelector('button')

    expect(button?.textContent).toBe('1')

    rerender(<Counter value={5} />)

    expect(button?.textContent).toBe('5')
  })

  it('does not emit change events when the resolved value is unchanged', () => {
    function FixedCounter({ onChange }: { onChange: (value: number) => void }) {
      const [count, setCount] = useControllableState({
        defaultValue: 4,
        onChange,
      })

      return (
        <button type="button" onClick={() => setCount(count)}>
          {count}
        </button>
      )
    }

    const onChange = vi.fn()
    const { container } = render(<FixedCounter onChange={onChange} />)
    const button = container.querySelector('button')

    act(() => {
      button?.click()
    })

    expect(button?.textContent).toBe('4')
    expect(onChange).not.toHaveBeenCalled()
  })
})
