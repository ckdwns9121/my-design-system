import { act, useRef, type ReactNode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, describe, expect, it } from 'vitest'
import { useAnchoredPosition } from './useAnchoredPosition'

;(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT =
  true

let root: Root | null = null
let container: HTMLElement | null = null

function render(ui: ReactNode) {
  container = document.createElement('div')
  document.body.append(container)
  root = createRoot(container)

  act(() => root?.render(ui))

  return {
    container,
    rerender(nextUi: ReactNode) {
      act(() => root?.render(nextUi))
    },
  }
}

function PositionFixture({ open }: { open: boolean }) {
  const triggerRef = useRef<HTMLButtonElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const style = useAnchoredPosition({ open, triggerRef, contentRef })

  return (
    <>
      <button ref={triggerRef} type="button">Trigger</button>
      <div data-testid="content" ref={contentRef} style={style}>Content</div>
    </>
  )
}

async function nextFrame() {
  await act(async () => {
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))
  })
}

afterEach(() => {
  act(() => root?.unmount())
  container?.remove()
  root = null
  container = null
})

describe('useAnchoredPosition', () => {
  it('returns hidden positioning when mounted content closes', async () => {
    const view = render(<PositionFixture open />)
    await nextFrame()

    const content = view.container.querySelector<HTMLElement>('[data-testid="content"]')
    expect(content?.style.position).toBe('fixed')
    expect(content?.style.visibility).toBe('')

    view.rerender(<PositionFixture open={false} />)

    expect(content?.style.position).toBe('fixed')
    expect(content?.style.visibility).toBe('hidden')
  })
})
