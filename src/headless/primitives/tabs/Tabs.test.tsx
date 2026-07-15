import { act, type ReactNode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { TabsContent, TabsList, TabsRoot, TabsTrigger } from './Tabs'

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

function TabsFixture({
  activationMode = 'automatic',
  defaultValue = 'overview',
  onValueChange,
  orientation = 'horizontal',
  value,
}: {
  activationMode?: 'automatic' | 'manual'
  defaultValue?: string
  onValueChange?: (value: string) => void
  orientation?: 'horizontal' | 'vertical'
  value?: string
}) {
  return (
    <TabsRoot
      activationMode={activationMode}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      orientation={orientation}
      value={value}
    >
      <TabsList aria-label="Component sections">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger disabled value="disabled">
          Disabled
        </TabsTrigger>
        <TabsTrigger value="usage">Usage</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">Overview panel</TabsContent>
      <TabsContent value="disabled">Disabled panel</TabsContent>
      <TabsContent value="usage">Usage panel</TabsContent>
    </TabsRoot>
  )
}

describe('headless Tabs', () => {
  it('requires an explicit controlled or uncontrolled initial value', () => {
    expect(() =>
      render(
        <TabsRoot {...({} as { defaultValue: string })}>
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">Overview panel</TabsContent>
        </TabsRoot>,
      ),
    ).toThrowError('TabsRoot requires either value or defaultValue')
  })

  it('links tabs and panels with selected state in uncontrolled mode', () => {
    const onValueChange = vi.fn()
    const { container } = render(<TabsFixture onValueChange={onValueChange} />)
    const overview = container.querySelector<HTMLButtonElement>('[role="tab"]:first-child')
    const usage = container.querySelector<HTMLButtonElement>('[role="tab"]:last-child')
    const panels = container.querySelectorAll<HTMLElement>('[role="tabpanel"]')

    expect(container.querySelector('[role="tablist"]')?.getAttribute('aria-orientation')).toBe(
      'horizontal',
    )
    expect(overview?.getAttribute('aria-selected')).toBe('true')
    expect(overview?.tabIndex).toBe(0)
    expect(usage?.getAttribute('aria-selected')).toBe('false')
    expect(usage?.tabIndex).toBe(-1)
    expect(overview?.getAttribute('aria-controls')).toBe(panels[0].id)
    expect(panels[0].getAttribute('aria-labelledby')).toBe(overview?.id)
    expect(panels[0].hidden).toBe(false)
    expect(panels[2].hidden).toBe(true)

    act(() => {
      usage?.click()
    })

    expect(usage?.getAttribute('aria-selected')).toBe('true')
    expect(panels[0].hidden).toBe(true)
    expect(panels[2].hidden).toBe(false)
    expect(onValueChange).toHaveBeenCalledWith('usage')
  })

  it('calls onValueChange without changing displayed state in controlled mode', () => {
    const onValueChange = vi.fn()
    const { container, rerender } = render(
      <TabsFixture onValueChange={onValueChange} value="overview" />,
    )
    const usage = container.querySelector<HTMLButtonElement>('[role="tab"]:last-child')

    act(() => {
      usage?.click()
    })

    expect(usage?.getAttribute('aria-selected')).toBe('false')
    expect(onValueChange).toHaveBeenCalledWith('usage')

    rerender(<TabsFixture value="usage" />)

    expect(usage?.getAttribute('aria-selected')).toBe('true')
  })

  it('moves focus with wrapping arrows and activates automatically', () => {
    const { container } = render(<TabsFixture />)
    const tabs = container.querySelectorAll<HTMLButtonElement>('[role="tab"]')
    const panels = container.querySelectorAll<HTMLElement>('[role="tabpanel"]')

    act(() => {
      tabs[0].focus()
    })
    pressKey(tabs[0], 'ArrowRight')

    expect(document.activeElement).toBe(tabs[2])
    expect(tabs[1].disabled).toBe(true)
    expect(tabs[2].getAttribute('aria-selected')).toBe('true')
    expect(panels[2].hidden).toBe(false)

    pressKey(tabs[2], 'ArrowRight')
    expect(document.activeElement).toBe(tabs[0])
    expect(tabs[0].getAttribute('aria-selected')).toBe('true')

    pressKey(tabs[0], 'End')
    expect(document.activeElement).toBe(tabs[2])
  })

  it('moves vertical focus and waits for Enter or Space in manual mode', () => {
    const { container } = render(
      <TabsFixture activationMode="manual" orientation="vertical" />,
    )
    const list = container.querySelector('[role="tablist"]')
    const tabs = container.querySelectorAll<HTMLButtonElement>('[role="tab"]')

    expect(list?.getAttribute('aria-orientation')).toBe('vertical')

    act(() => {
      tabs[0].focus()
    })
    pressKey(tabs[0], 'ArrowDown')

    expect(document.activeElement).toBe(tabs[2])
    expect(tabs[0].tabIndex).toBe(-1)
    expect(tabs[2].tabIndex).toBe(0)
    expect(tabs[0].getAttribute('aria-selected')).toBe('true')
    expect(tabs[2].getAttribute('aria-selected')).toBe('false')

    pressKey(tabs[2], 'Enter')
    expect(tabs[2].getAttribute('aria-selected')).toBe('true')

    pressKey(tabs[2], 'Home')
    expect(document.activeElement).toBe(tabs[0])

    pressKey(tabs[0], ' ')
    expect(tabs[0].getAttribute('aria-selected')).toBe('true')
  })

  it('does not activate disabled tabs', () => {
    const onValueChange = vi.fn()
    const { container } = render(<TabsFixture onValueChange={onValueChange} />)
    const disabled = container.querySelector<HTMLButtonElement>('[disabled]')

    act(() => {
      disabled?.click()
    })

    expect(disabled?.getAttribute('aria-disabled')).toBe('true')
    expect(disabled?.getAttribute('aria-selected')).toBe('false')
    expect(onValueChange).not.toHaveBeenCalled()
  })

  it('keeps generated tab and panel IDs authoritative', () => {
    const unsafeTriggerProps = { id: 'custom-trigger' }
    const unsafeContentProps = { id: 'custom-content' }
    const { container } = render(
      <TabsRoot defaultValue="overview">
        <TabsList>
          <TabsTrigger {...unsafeTriggerProps} value="overview">
            Overview
          </TabsTrigger>
        </TabsList>
        <TabsContent {...unsafeContentProps} value="overview">
          Overview panel
        </TabsContent>
      </TabsRoot>,
    )
    const trigger = container.querySelector<HTMLElement>('[role="tab"]')
    const content = container.querySelector<HTMLElement>('[role="tabpanel"]')

    expect(trigger?.id).not.toBe('custom-trigger')
    expect(content?.id).not.toBe('custom-content')
    expect(trigger?.getAttribute('aria-controls')).toBe(content?.id)
    expect(content?.getAttribute('aria-labelledby')).toBe(trigger?.id)
  })
})
