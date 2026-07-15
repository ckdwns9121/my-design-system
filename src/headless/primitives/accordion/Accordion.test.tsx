import { act, type ReactNode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  AccordionContent,
  AccordionHeader,
  AccordionItem,
  AccordionRoot,
  AccordionTrigger,
} from './Accordion'

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

function Fixture({
  collapsible,
  defaultValue,
  disabledItem = false,
  onValueChange,
  type,
  value,
}: {
  collapsible?: boolean
  defaultValue?: string | string[]
  disabledItem?: boolean
  onValueChange?: (value: string | string[]) => void
  type?: 'single' | 'multiple'
  value?: string | string[]
}) {
  return (
    <AccordionRoot
      collapsible={collapsible}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      type={type}
      value={value}
    >
      <AccordionItem value="usage">
        <AccordionHeader level={2}>
          <AccordionTrigger>Usage</AccordionTrigger>
        </AccordionHeader>
        <AccordionContent>Use native buttons for disclosure.</AccordionContent>
      </AccordionItem>
      <AccordionItem disabled={disabledItem} value="keyboard">
        <AccordionHeader level={2}>
          <AccordionTrigger>Keyboard</AccordionTrigger>
        </AccordionHeader>
        <AccordionContent>Arrow keys move between headers.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="disabled">
        <AccordionHeader level={2}>
          <AccordionTrigger>Disabled</AccordionTrigger>
        </AccordionHeader>
        <AccordionContent>Disabled items cannot be opened.</AccordionContent>
      </AccordionItem>
    </AccordionRoot>
  )
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

describe('headless Accordion', () => {
  it('wires APG accordion attributes with native headings and buttons', () => {
    const { container } = render(<Fixture defaultValue="usage" />)
    const trigger = container.querySelector<HTMLButtonElement>('button')
    const content = container.querySelector('[role="region"]')
    const heading = container.querySelector('h2')

    expect(heading?.textContent).toBe('Usage')
    expect(trigger?.getAttribute('aria-expanded')).toBe('true')
    expect(trigger?.getAttribute('aria-controls')).toBe(content?.id)
    expect(content?.getAttribute('aria-labelledby')).toBe(trigger?.id)
    expect(content?.hasAttribute('hidden')).toBe(false)
  })

  it('opens one item at a time in uncontrolled single mode', () => {
    const onValueChange = vi.fn()
    const { container } = render(
      <Fixture defaultValue="usage" onValueChange={onValueChange} />,
    )
    const triggers = container.querySelectorAll<HTMLButtonElement>('button')
    const contents = container.querySelectorAll('[role="region"]')

    act(() => {
      triggers[1].click()
    })

    expect(triggers[0].getAttribute('aria-expanded')).toBe('false')
    expect(triggers[1].getAttribute('aria-expanded')).toBe('true')
    expect(contents[0].hasAttribute('hidden')).toBe(true)
    expect(contents[1].hasAttribute('hidden')).toBe(false)
    expect(onValueChange).toHaveBeenCalledWith('keyboard')
  })

  it('prevents closing the open item when single mode is not collapsible', () => {
    const onValueChange = vi.fn()
    const { container } = render(
      <Fixture defaultValue="usage" onValueChange={onValueChange} />,
    )
    const trigger = container.querySelector<HTMLButtonElement>('button')

    act(() => {
      trigger?.click()
    })

    expect(trigger?.getAttribute('aria-expanded')).toBe('true')
    expect(trigger?.getAttribute('aria-disabled')).toBe('true')
    expect(onValueChange).not.toHaveBeenCalled()
  })

  it('allows closing the open item when collapsible', () => {
    const onValueChange = vi.fn()
    const { container } = render(
      <Fixture collapsible defaultValue="usage" onValueChange={onValueChange} />,
    )
    const trigger = container.querySelector<HTMLButtonElement>('button')
    const content = container.querySelector('[role="region"]')

    act(() => {
      trigger?.click()
    })

    expect(trigger?.getAttribute('aria-expanded')).toBe('false')
    expect(content?.hasAttribute('hidden')).toBe(true)
    expect(onValueChange).toHaveBeenCalledWith('')
  })

  it('supports multiple open items', () => {
    const onValueChange = vi.fn()
    const { container } = render(
      <Fixture defaultValue={['usage']} onValueChange={onValueChange} type="multiple" />,
    )
    const triggers = container.querySelectorAll<HTMLButtonElement>('button')

    act(() => {
      triggers[1].click()
    })

    expect(triggers[0].getAttribute('aria-expanded')).toBe('true')
    expect(triggers[1].getAttribute('aria-expanded')).toBe('true')
    expect(onValueChange).toHaveBeenCalledWith(['usage', 'keyboard'])
  })

  it('calls onValueChange without changing displayed state in controlled mode', () => {
    const onValueChange = vi.fn()
    const { container, rerender } = render(
      <Fixture onValueChange={onValueChange} value="usage" />,
    )
    const triggers = container.querySelectorAll<HTMLButtonElement>('button')

    act(() => {
      triggers[1].click()
    })

    expect(triggers[0].getAttribute('aria-expanded')).toBe('true')
    expect(triggers[1].getAttribute('aria-expanded')).toBe('false')
    expect(onValueChange).toHaveBeenCalledWith('keyboard')

    rerender(<Fixture onValueChange={onValueChange} value="keyboard" />)

    expect(triggers[0].getAttribute('aria-expanded')).toBe('false')
    expect(triggers[1].getAttribute('aria-expanded')).toBe('true')
  })

  it('does not open disabled items', () => {
    const onValueChange = vi.fn()
    const { container } = render(
      <Fixture disabledItem onValueChange={onValueChange} />,
    )
    const triggers = container.querySelectorAll<HTMLButtonElement>('button')

    act(() => {
      triggers[1].click()
    })

    expect(triggers[1].disabled).toBe(true)
    expect(triggers[1].getAttribute('aria-expanded')).toBe('false')
    expect(onValueChange).not.toHaveBeenCalled()
  })

  it('moves focus between enabled headers with arrow and boundary keys', () => {
    const { container } = render(<Fixture disabledItem />)
    const triggers = container.querySelectorAll<HTMLButtonElement>('button')

    act(() => {
      triggers[0].focus()
    })

    pressKey(triggers[0], 'ArrowDown')
    expect(document.activeElement).toBe(triggers[2])

    pressKey(triggers[2], 'ArrowUp')
    expect(document.activeElement).toBe(triggers[0])

    pressKey(triggers[0], 'End')
    expect(document.activeElement).toBe(triggers[2])

    pressKey(triggers[2], 'Home')
    expect(document.activeElement).toBe(triggers[0])
  })
})
