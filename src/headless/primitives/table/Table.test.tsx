import { act, type ReactNode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  TableBody,
  TableCell,
  TableColumnHeader,
  TableHeader,
  TableRoot,
  TableRow,
  TableSelectionCheckbox,
} from './Table'

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

function pressKey(element: Element, key: string, options: KeyboardEventInit = {}) {
  act(() => {
    element.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key, ...options }))
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

function GridFixture({
  onRowSelectedChange = () => undefined,
  onSortChange = () => undefined,
}: {
  onRowSelectedChange?: (selected: boolean) => void
  onSortChange?: () => void
}) {
  return (
    <TableRoot aria-label="Component grid" grid>
      <TableHeader>
        <TableRow>
          <TableColumnHeader>
            <TableSelectionCheckbox
              aria-label="Select all rows"
              checked={false}
              indeterminate
              onChange={() => undefined}
            />
          </TableColumnHeader>
          <TableColumnHeader onSortChange={onSortChange} sortDirection="none">
            Component
          </TableColumnHeader>
          <TableColumnHeader>Status</TableColumnHeader>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow onSelectedChange={onRowSelectedChange} selected={false}>
          <TableCell>
            <TableSelectionCheckbox
              aria-label="Select ToggleButton"
              checked={false}
              onChange={() => undefined}
            />
          </TableCell>
          <TableCell>ToggleButton</TableCell>
          <TableCell>Ready</TableCell>
        </TableRow>
      </TableBody>
    </TableRoot>
  )
}

describe('headless Table', () => {
  it('keeps one tab stop and moves focus through the grid', () => {
    const container = render(<GridFixture />)
    const table = container.querySelector('table')
    const selectAll = container.querySelector<HTMLInputElement>('[aria-label="Select all rows"]')
    const headers = container.querySelectorAll('th')
    const sortButton = container.querySelector<HTMLButtonElement>('th button')
    const bodyCells = container.querySelectorAll('tbody td')

    expect(table?.getAttribute('role')).toBe('grid')
    expect(selectAll?.tabIndex).toBe(0)
    expect(headers[1].tabIndex).toBe(-1)

    act(() => {
      selectAll?.focus()
    })
    pressKey(selectAll as HTMLInputElement, 'ArrowRight')
    expect(document.activeElement).toBe(sortButton)

    pressKey(sortButton as HTMLButtonElement, 'ArrowDown')
    expect(document.activeElement).toBe(bodyCells[1])

    pressKey(bodyCells[1], 'End')
    expect(document.activeElement).toBe(bodyCells[2])

    pressKey(bodyCells[2], 'Home', { ctrlKey: true })
    expect(document.activeElement).toBe(selectAll)

    pressKey(selectAll as HTMLInputElement, 'PageDown')
    expect(document.activeElement).toBe(
      container.querySelector<HTMLInputElement>('[aria-label="Select ToggleButton"]'),
    )
  })

  it('exposes sortable headers and selectable rows', () => {
    const onSortChange = vi.fn()
    const onRowSelectedChange = vi.fn()
    const container = render(
      <GridFixture
        onRowSelectedChange={onRowSelectedChange}
        onSortChange={onSortChange}
      />,
    )
    const sortableHeader = container.querySelectorAll('th')[1]
    const sortButton = sortableHeader.querySelector('button')
    const row = container.querySelector('tbody tr')
    const nameCell = container.querySelectorAll('tbody td')[1]
    const rowCheckbox = container.querySelector<HTMLInputElement>('[aria-label="Select ToggleButton"]')

    expect(sortableHeader.hasAttribute('aria-sort')).toBe(false)
    expect(row?.getAttribute('aria-selected')).toBe('false')

    act(() => {
      sortButton?.click()
    })
    expect(onSortChange).toHaveBeenCalledTimes(1)

    pressKey(nameCell, ' ')
    expect(onRowSelectedChange).toHaveBeenCalledWith(true)

    onRowSelectedChange.mockClear()
    act(() => {
      rowCheckbox?.click()
    })
    expect(onRowSelectedChange).not.toHaveBeenCalled()
  })

  it('sets native mixed checkbox state and leaves static tables unchanged', () => {
    const gridContainer = render(<GridFixture />)
    const selectAll = gridContainer.querySelector<HTMLInputElement>('[aria-label="Select all rows"]')

    expect(selectAll?.indeterminate).toBe(true)
    expect(selectAll?.getAttribute('aria-checked')).toBe('mixed')

    const tableContainer = render(
      <TableRoot>
        <TableHeader>
          <TableRow>
            <TableColumnHeader>Component</TableColumnHeader>
          </TableRow>
        </TableHeader>
      </TableRoot>,
    )
    const staticTable = tableContainer.querySelector('table')
    const staticHeader = tableContainer.querySelector('th')

    expect(staticTable?.hasAttribute('role')).toBe(false)
    expect(staticHeader?.hasAttribute('tabindex')).toBe(false)
  })
})
