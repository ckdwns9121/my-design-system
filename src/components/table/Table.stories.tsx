import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { useTableSelection, useTableSort } from '../../headless'
import { Badge } from '../badge'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
  TableSelectionCheckbox,
} from './Table'

const meta = {
  component: Table,
  tags: ['ai-generated'],
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof Table>

export default meta
type Story = StoryObj<typeof meta>

const rows = [
  { component: 'Button', layer: 'Styled', status: 'Ready', owner: 'Components' },
  { component: 'Toggle', layer: 'Headless + Styled', status: 'Ready', owner: 'Components' },
  { component: 'Checkbox', layer: 'Headless + Styled', status: 'Next', owner: 'Components' },
  { component: 'Table', layer: 'Headless + Styled', status: 'Ready', owner: 'Components' },
]

type Row = (typeof rows)[number]
type SortableColumn = 'component' | 'layer' | 'status' | 'owner'

const rowIds = rows.map((row) => row.component)

function getRowSortValue(row: Row, columnId: SortableColumn) {
  return row[columnId]
}

function InteractiveGridExample() {
  const { sortDescriptor, sortedRows, toggleSort } = useTableSort({
    rows,
    getSortValue: getRowSortValue,
  })
  const {
    allRowsSelected,
    isRowSelected,
    selectedRowIds,
    setAllRowsSelected,
    setRowSelected,
    someRowsSelected,
  } = useTableSelection({ rowIds })

  const getSortDirection = (columnId: SortableColumn) =>
    sortDescriptor?.columnId === columnId ? sortDescriptor.direction : 'none'

  return (
    <div className="space-y-3">
      <p aria-live="polite" className="text-sm text-content-muted">
        {selectedRowIds.length} of {rows.length} rows selected
      </p>
      <Table aria-multiselectable grid>
        <TableCaption>정렬 및 선택이 가능한 컴포넌트 그리드입니다.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <TableSelectionCheckbox
                aria-label="Select all rows"
                checked={allRowsSelected}
                indeterminate={someRowsSelected}
                onChange={(event) => setAllRowsSelected(event.currentTarget.checked)}
              />
            </TableHead>
            <TableHead
              onSortChange={() => toggleSort('component')}
              sortDirection={getSortDirection('component')}
            >
              Component
            </TableHead>
            <TableHead
              onSortChange={() => toggleSort('layer')}
              sortDirection={getSortDirection('layer')}
            >
              Layer
            </TableHead>
            <TableHead
              onSortChange={() => toggleSort('status')}
              sortDirection={getSortDirection('status')}
            >
              Status
            </TableHead>
            <TableHead
              onSortChange={() => toggleSort('owner')}
              sortDirection={getSortDirection('owner')}
            >
              Owner
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedRows.map((row) => {
            const selected = isRowSelected(row.component)

            return (
              <TableRow
                key={row.component}
                onSelectedChange={(nextSelected) =>
                  setRowSelected(row.component, nextSelected)
                }
                selected={selected}
              >
                <TableCell>
                  <TableSelectionCheckbox
                    aria-label={`Select ${row.component}`}
                    checked={selected}
                    onChange={(event) =>
                      setRowSelected(row.component, event.currentTarget.checked)
                    }
                  />
                </TableCell>
                <TableCell className="font-medium text-content-strong">
                  {row.component}
                </TableCell>
                <TableCell>{row.layer}</TableCell>
                <TableCell>
                  <Badge tone={row.status === 'Ready' ? 'success' : 'warning'}>
                    {row.status}
                  </Badge>
                </TableCell>
                <TableCell>{row.owner}</TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}

export const Basic: Story = {
  render: () => (
    <Table>
      <TableCaption>현재 컴포넌트 진행 상태입니다.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Component</TableHead>
          <TableHead>Layer</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Owner</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.component}>
            <TableCell className="font-medium text-content-strong">{row.component}</TableCell>
            <TableCell>{row.layer}</TableCell>
            <TableCell>
              <Badge tone={row.status === 'Ready' ? 'success' : 'warning'}>{row.status}</Badge>
            </TableCell>
            <TableCell>{row.owner}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
  play: async ({ canvas }) => {
    const table = canvas.getByRole('table', { name: /현재 컴포넌트 진행 상태/i })

    await expect(table).toBeVisible()
    await expect(canvas.getByRole('columnheader', { name: /component/i })).toBeVisible()
    await expect(canvas.getByRole('cell', { name: /toggle/i })).toBeVisible()
  },
}

export const WithFooter: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Token</TableHead>
          <TableHead>Usage</TableHead>
          <TableHead className="text-right">Count</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="font-medium text-content-strong">Color</TableCell>
          <TableCell>primitive / semantic</TableCell>
          <TableCell className="text-right">2</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium text-content-strong">Typography</TableCell>
          <TableCell>type scale</TableCell>
          <TableCell className="text-right">6</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium text-content-strong">Spacing</TableCell>
          <TableCell>4px scale</TableCell>
          <TableCell className="text-right">11</TableCell>
        </TableRow>
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={2}>Foundation groups</TableCell>
          <TableCell className="text-right">3</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  ),
}

export const InteractiveGrid: Story = {
  render: () => <InteractiveGridExample />,
  play: async ({ canvas, userEvent }) => {
    const grid = canvas.getByRole('grid', {
      name: /정렬 및 선택이 가능한 컴포넌트 그리드/i,
    })
    const componentHeader = canvas.getByRole('columnheader', { name: /component/i })
    const componentSortButton = canvas.getByRole('button', { name: /component/i })
    const selectAll = canvas.getByRole('checkbox', { name: /select all rows/i })

    await expect(grid).toHaveAttribute('aria-multiselectable', 'true')
    await expect(componentHeader).not.toHaveAttribute('aria-sort')
    await expect(getComputedStyle(componentSortButton).cursor).toBe('pointer')

    await userEvent.click(componentSortButton)
    await expect(componentHeader).toHaveAttribute('aria-sort', 'ascending')
    await expect(grid.querySelectorAll('[aria-sort]')).toHaveLength(1)
    await expect(grid.querySelectorAll('tbody tr')[0]).toHaveTextContent('Button')

    await userEvent.click(componentSortButton)
    await expect(componentHeader).toHaveAttribute('aria-sort', 'descending')
    await expect(grid.querySelectorAll('tbody tr')[0]).toHaveTextContent('Toggle')

    const toggleCheckbox = canvas.getByRole('checkbox', { name: /select toggle/i })
    const toggleRow = toggleCheckbox.closest('tr')

    await userEvent.click(toggleCheckbox)
    await expect(toggleRow).toHaveAttribute('aria-selected', 'true')
    await expect(selectAll).toHaveAttribute('data-state', 'indeterminate')

    await userEvent.click(selectAll)
    for (const row of grid.querySelectorAll('tbody tr')) {
      await expect(row).toHaveAttribute('aria-selected', 'true')
    }

    selectAll.focus()
    await userEvent.keyboard('{ArrowRight}')
    await expect(componentSortButton).toHaveFocus()

    await userEvent.keyboard('{Enter}')
    await expect(componentHeader).toHaveAttribute('aria-sort', 'ascending')

    await userEvent.keyboard('{ArrowDown}')
    const firstRow = grid.querySelectorAll('tbody tr')[0]
    const firstComponentCell = firstRow.querySelectorAll('td')[1]
    await expect(firstComponentCell).toHaveFocus()

    await userEvent.keyboard('{End}')
    await expect(firstRow.querySelectorAll('td')[4]).toHaveFocus()

    await userEvent.keyboard(' ')
    await expect(firstRow).toHaveAttribute('aria-selected', 'false')
  },
}
