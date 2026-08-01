import { act, type ReactNode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ToastProvider, ToastRoot, ToastViewport } from './Toast'
import { useToast } from './useToast'

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

  return container
}

type ToastApi = ReturnType<typeof useToast>

let api: ToastApi

function Harness() {
  api = useToast()

  return (
    <ToastViewport data-testid="viewport">
      {api.toasts.map((toast) => (
        <ToastRoot key={toast.id} politeness={toast.politeness} toastId={toast.id}>
          {String(toast.data.title ?? '')}
        </ToastRoot>
      ))}
    </ToastViewport>
  )
}

function renderProvider(props: { duration?: number; limit?: number } = {}) {
  return render(
    <ToastProvider {...props}>
      <Harness />
    </ToastProvider>,
  )
}

beforeEach(() => {
  vi.useFakeTimers()
})

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
  vi.useRealTimers()
})

describe('Toast', () => {
  it('keeps the live region mounted before any toast arrives', () => {
    const container = renderProvider()
    const viewport = container.querySelector('[data-testid="viewport"]')

    expect(viewport?.getAttribute('role')).toBe('region')
    expect(viewport?.children).toHaveLength(0)
  })

  it('queues a toast and announces it politely by default', () => {
    const container = renderProvider()

    act(() => {
      api.toast({ data: { title: '저장했습니다' } })
    })

    const toast = container.querySelector('[data-toast-id]')

    expect(toast?.getAttribute('role')).toBe('status')
    expect(toast?.getAttribute('aria-atomic')).toBe('true')
    expect(toast?.textContent).toBe('저장했습니다')
  })

  it('uses role=alert when the toast is assertive', () => {
    const container = renderProvider()

    act(() => {
      api.toast({ data: { title: '실패' }, politeness: 'assertive' })
    })

    expect(container.querySelector('[data-toast-id]')?.getAttribute('role')).toBe('alert')
  })

  it('removes a toast once its duration elapses', () => {
    const container = renderProvider({ duration: 1000 })

    act(() => {
      api.toast({ data: { title: '저장했습니다' } })
    })

    expect(container.querySelectorAll('[data-toast-id]')).toHaveLength(1)

    act(() => {
      vi.advanceTimersByTime(1000)
    })

    expect(container.querySelectorAll('[data-toast-id]')).toHaveLength(0)
  })

  it('keeps a toast with a null duration until it is dismissed', () => {
    const container = renderProvider({ duration: 1000 })
    let id = ''

    act(() => {
      id = api.toast({ data: { title: '확인 필요' }, duration: null })
    })

    act(() => {
      vi.advanceTimersByTime(60_000)
    })

    expect(container.querySelectorAll('[data-toast-id]')).toHaveLength(1)

    act(() => {
      api.dismiss(id)
    })

    expect(container.querySelectorAll('[data-toast-id]')).toHaveLength(0)
  })

  it('pauses the countdown while the pointer is inside the viewport', () => {
    const container = renderProvider({ duration: 1000 })
    const viewport = container.querySelector<HTMLElement>('[data-testid="viewport"]')

    act(() => {
      api.toast({ data: { title: '저장했습니다' } })
    })

    act(() => {
      vi.advanceTimersByTime(600)
      viewport?.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }))
    })

    expect(viewport?.hasAttribute('data-paused')).toBe(true)

    act(() => {
      vi.advanceTimersByTime(5000)
    })

    expect(container.querySelectorAll('[data-toast-id]')).toHaveLength(1)

    act(() => {
      viewport?.dispatchEvent(new MouseEvent('mouseout', { bubbles: true }))
    })

    act(() => {
      vi.advanceTimersByTime(400)
    })

    expect(container.querySelectorAll('[data-toast-id]')).toHaveLength(0)
  })

  it('drops the oldest toast past the limit', () => {
    const container = renderProvider({ limit: 2 })

    act(() => {
      api.toast({ data: { title: '첫 번째' } })
      api.toast({ data: { title: '두 번째' } })
      api.toast({ data: { title: '세 번째' } })
    })

    const titles = Array.from(container.querySelectorAll('[data-toast-id]')).map(
      (node) => node.textContent,
    )

    expect(titles).toEqual(['두 번째', '세 번째'])
  })

  it('clears every toast with dismissAll', () => {
    const container = renderProvider()

    act(() => {
      api.toast({ data: { title: '첫 번째' } })
      api.toast({ data: { title: '두 번째' } })
    })

    act(() => {
      api.dismissAll()
    })

    expect(container.querySelectorAll('[data-toast-id]')).toHaveLength(0)
  })
})
