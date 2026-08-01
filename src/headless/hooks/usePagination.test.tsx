import { act, type ReactNode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, describe, expect, it } from 'vitest'
import { usePagination, type PaginationItem, type UsePaginationOptions } from './usePagination'

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

function summarize(items: PaginationItem[]) {
  return items.map((item) => (item.type === 'ellipsis' ? '…' : String(item.page)))
}

function readPagination(options: UsePaginationOptions) {
  let result: ReturnType<typeof usePagination> | undefined

  function Probe() {
    result = usePagination(options)
    return null
  }

  render(<Probe />)

  if (!result) {
    throw new Error('usePagination did not run')
  }

  return result
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

describe('usePagination', () => {
  it('lists every page when the range fits', () => {
    const pagination = readPagination({ page: 1, pageCount: 5 })

    expect(summarize(pagination.items)).toEqual(['1', '2', '3', '4', '5'])
    expect(pagination.hasPrevious).toBe(false)
    expect(pagination.hasNext).toBe(true)
  })

  it('keeps a constant item count near the start', () => {
    const pagination = readPagination({ page: 1, pageCount: 20 })

    expect(summarize(pagination.items)).toEqual(['1', '2', '3', '4', '5', '…', '20'])
  })

  it('collapses both sides in the middle of a long range', () => {
    const pagination = readPagination({ page: 10, pageCount: 20 })

    expect(summarize(pagination.items)).toEqual(['1', '…', '9', '10', '11', '…', '20'])
  })

  it('keeps a constant item count near the end', () => {
    const pagination = readPagination({ page: 20, pageCount: 20 })

    expect(summarize(pagination.items)).toEqual(['1', '…', '16', '17', '18', '19', '20'])
    expect(pagination.hasNext).toBe(false)
    expect(pagination.previousPage).toBe(19)
  })

  it('holds the item count steady as the page moves', () => {
    const widths = [1, 5, 10, 15, 20].map(
      (page) => readPagination({ page, pageCount: 20 }).items.length,
    )

    expect(new Set(widths).size).toBe(1)
  })

  it('widens the window with siblingCount', () => {
    const pagination = readPagination({ page: 10, pageCount: 20, siblingCount: 2 })

    expect(summarize(pagination.items)).toEqual(['1', '…', '8', '9', '10', '11', '12', '…', '20'])
  })

  it('clamps a page outside the range', () => {
    expect(readPagination({ page: 0, pageCount: 5 }).page).toBe(1)
    expect(readPagination({ page: 99, pageCount: 5 }).page).toBe(5)
  })

  it('returns an empty list when there are no pages', () => {
    const pagination = readPagination({ page: 1, pageCount: 0 })

    expect(pagination.items).toEqual([])
    expect(pagination.hasPrevious).toBe(false)
    expect(pagination.hasNext).toBe(false)
  })
})
