import { act, type ReactNode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useTableSelection, type TableSelectionMode } from './useTableSelection'

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

const rowIds = ['alpha', 'bravo', 'charlie'] as const

function SelectionHarness({
  mode = 'multiple',
  onSelectedRowIdsChange,
  selectedRowIds,
}: {
  mode?: TableSelectionMode
  onSelectedRowIdsChange?: (selectedRowIds: readonly string[]) => void
  selectedRowIds?: readonly string[]
}) {
  const {
    selectedRowIds: currentSelectedRowIds,
    toggleAllRows,
    toggleRow,
  } = useTableSelection({
    rowIds,
    defaultSelectedRowIds: ['bravo'],
    onSelectedRowIdsChange,
    selectedRowIds,
    selectionMode: mode,
  })

  return (
    <div>
      {rowIds.map((rowId) => (
        <button key={rowId} onClick={() => toggleRow(rowId)} type="button">
          {rowId}
        </button>
      ))}
      <button onClick={toggleAllRows} type="button">
        ToggleButton all
      </button>
      <output>{currentSelectedRowIds.join(',')}</output>
    </div>
  )
}

describe('useTableSelection', () => {
  it('supports row and select-all changes in multiple mode', () => {
    const container = render(<SelectionHarness />)
    const buttons = container.querySelectorAll('button')
    const output = container.querySelector('output')

    expect(output?.textContent).toBe('bravo')

    act(() => {
      buttons[0].click()
    })

    expect(output?.textContent).toBe('bravo,alpha')

    act(() => {
      buttons[3].click()
    })

    expect(output?.textContent).toBe('alpha,bravo,charlie')

    act(() => {
      buttons[3].click()
    })

    expect(output?.textContent).toBe('')
  })

  it('keeps only one selected row in single mode', () => {
    const container = render(<SelectionHarness mode="single" />)
    const buttons = container.querySelectorAll('button')
    const output = container.querySelector('output')

    act(() => {
      buttons[0].click()
    })

    expect(output?.textContent).toBe('alpha')

    act(() => {
      buttons[2].click()
    })

    expect(output?.textContent).toBe('charlie')
  })

  it('reports changes without mutating controlled selection', () => {
    const onSelectedRowIdsChange = vi.fn()
    const container = render(
      <SelectionHarness
        onSelectedRowIdsChange={onSelectedRowIdsChange}
        selectedRowIds={['alpha']}
      />,
    )
    const buttons = container.querySelectorAll('button')
    const output = container.querySelector('output')

    act(() => {
      buttons[1].click()
    })

    expect(onSelectedRowIdsChange).toHaveBeenCalledWith(['alpha', 'bravo'])
    expect(output?.textContent).toBe('alpha')
  })
})
