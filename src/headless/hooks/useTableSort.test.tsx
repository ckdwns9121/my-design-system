import { act, type ReactNode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  useTableSort,
  type TableSortDescriptor,
  type TableSortValue,
} from './useTableSort'

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

type Row = {
  id: string
  name: string
  score: number
}

type ColumnId = 'name' | 'score'

const rows: readonly Row[] = [
  { id: 'charlie', name: 'Charlie', score: 2 },
  { id: 'alpha', name: 'Alpha', score: 1 },
  { id: 'bravo', name: 'Bravo', score: 2 },
]

function SortHarness({
  onSortChange,
  sortDescriptor,
}: {
  onSortChange?: (sortDescriptor: TableSortDescriptor<ColumnId> | null) => void
  sortDescriptor?: TableSortDescriptor<ColumnId> | null
}) {
  const { sortedRows, toggleSort } = useTableSort({
    rows,
    getSortValue: (row, columnId): TableSortValue => row[columnId],
    onSortChange,
    sortDescriptor,
  })

  return (
    <div>
      <button onClick={() => toggleSort('name')} type="button">
        Sort name
      </button>
      <button onClick={() => toggleSort('score')} type="button">
        Sort score
      </button>
      <output>{sortedRows.map((row) => row.id).join(',')}</output>
    </div>
  )
}

describe('useTableSort', () => {
  it('toggles ascending and descending stable sorting', () => {
    const container = render(<SortHarness />)
    const buttons = container.querySelectorAll('button')
    const output = container.querySelector('output')

    expect(output?.textContent).toBe('charlie,alpha,bravo')

    act(() => {
      buttons[0].click()
    })

    expect(output?.textContent).toBe('alpha,bravo,charlie')

    act(() => {
      buttons[0].click()
    })

    expect(output?.textContent).toBe('charlie,bravo,alpha')

    act(() => {
      buttons[1].click()
    })

    expect(output?.textContent).toBe('alpha,charlie,bravo')
  })

  it('reports the next descriptor without mutating controlled state', () => {
    const onSortChange = vi.fn()
    const container = render(
      <SortHarness
        onSortChange={onSortChange}
        sortDescriptor={{ columnId: 'name', direction: 'ascending' }}
      />,
    )
    const button = container.querySelector('button')
    const output = container.querySelector('output')

    act(() => {
      button?.click()
    })

    expect(onSortChange).toHaveBeenCalledWith({
      columnId: 'name',
      direction: 'descending',
    })
    expect(output?.textContent).toBe('alpha,bravo,charlie')
  })
})
