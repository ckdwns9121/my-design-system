import {
  createContext,
  useContext,
  useEffect,
  useRef,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type TableHTMLAttributes,
  type TdHTMLAttributes,
  type ThHTMLAttributes,
} from 'react'
import type { TableSortDirection } from '../../hooks'

type TableContextValue = {
  grid: boolean
}

const TableContext = createContext<TableContextValue>({ grid: false })

const interactiveElementSelector = [
  'a[href]',
  'button',
  'input',
  'select',
  'textarea',
  '[contenteditable="true"]',
  '[role="button"]',
  '[role="checkbox"]',
].join(',')

function isHTMLElement(target: EventTarget | null): target is HTMLElement {
  return target instanceof HTMLElement
}

function getGridRows(table: HTMLTableElement) {
  return Array.from(table.rows).filter((row) => row.closest('table') === table)
}

function getGridCells(row: HTMLTableRowElement) {
  return Array.from(row.cells).filter((cell) => cell.hasAttribute('data-grid-cell'))
}

function getGridFocusTarget(cell: HTMLTableCellElement) {
  const nestedTarget = cell.querySelector<HTMLElement>('[data-grid-focus-target]')

  if (
    nestedTarget &&
    !nestedTarget.matches(':disabled') &&
    nestedTarget.getAttribute('aria-disabled') !== 'true'
  ) {
    return nestedTarget
  }

  return cell
}

function setGridTabStop(table: HTMLTableElement, target: HTMLElement) {
  for (const row of getGridRows(table)) {
    for (const cell of getGridCells(row)) {
      cell.tabIndex = -1

      for (const nestedTarget of cell.querySelectorAll<HTMLElement>('[data-grid-focus-target]')) {
        nestedTarget.tabIndex = -1
      }
    }
  }

  target.tabIndex = 0
}

function getGridCellFromTarget(target: EventTarget | null, table: HTMLTableElement) {
  if (!isHTMLElement(target)) {
    return null
  }

  const cell = target.closest<HTMLTableCellElement>('[data-grid-cell]')
  return cell?.closest('table') === table ? cell : null
}

function moveGridFocus(
  table: HTMLTableElement,
  currentCell: HTMLTableCellElement,
  key: string,
  moveToBoundary: boolean,
) {
  const rows = getGridRows(table)
  const rowIndex = rows.findIndex((row) => row === currentCell.parentElement)

  if (rowIndex < 0) {
    return false
  }

  const currentRowCells = getGridCells(rows[rowIndex])
  const columnIndex = currentRowCells.indexOf(currentCell)

  if (columnIndex < 0) {
    return false
  }

  let nextCell: HTMLTableCellElement | undefined

  if (key === 'ArrowLeft') {
    nextCell = currentRowCells[Math.max(0, columnIndex - 1)]
  } else if (key === 'ArrowRight') {
    nextCell = currentRowCells[Math.min(currentRowCells.length - 1, columnIndex + 1)]
  } else if (key === 'ArrowUp' || key === 'ArrowDown') {
    const rowOffset = key === 'ArrowUp' ? -1 : 1
    const nextRowIndex = Math.min(rows.length - 1, Math.max(0, rowIndex + rowOffset))
    const nextRowCells = getGridCells(rows[nextRowIndex])
    nextCell = nextRowCells[Math.min(columnIndex, nextRowCells.length - 1)]
  } else if (key === 'Home' || key === 'End') {
    const boundaryRow = moveToBoundary
      ? rows[key === 'Home' ? 0 : rows.length - 1]
      : rows[rowIndex]
    const boundaryCells = getGridCells(boundaryRow)
    nextCell = boundaryCells[key === 'Home' ? 0 : boundaryCells.length - 1]
  } else if (key === 'PageUp' || key === 'PageDown') {
    const boundaryRow = rows[key === 'PageUp' ? 0 : rows.length - 1]
    const boundaryCells = getGridCells(boundaryRow)
    nextCell = boundaryCells[Math.min(columnIndex, boundaryCells.length - 1)]
  }

  if (!nextCell) {
    return false
  }

  const nextTarget = getGridFocusTarget(nextCell)
  setGridTabStop(table, nextTarget)
  nextTarget.focus()
  return true
}

export type TableRootProps = TableHTMLAttributes<HTMLTableElement> & {
  grid?: boolean
}

export type TableHeaderProps = HTMLAttributes<HTMLTableSectionElement>
export type TableBodyProps = HTMLAttributes<HTMLTableSectionElement>
export type TableFooterProps = HTMLAttributes<HTMLTableSectionElement>

export type TableRowProps = HTMLAttributes<HTMLTableRowElement> & {
  disabled?: boolean
  selected?: boolean
  onSelectedChange?: (selected: boolean) => void
}

export type TableColumnHeaderProps = Omit<
  ThHTMLAttributes<HTMLTableCellElement>,
  'aria-sort'
> & {
  sortDirection?: TableSortDirection | 'none'
  onSortChange?: () => void
}

export type TableCellProps = TdHTMLAttributes<HTMLTableCellElement>
export type TableCaptionProps = HTMLAttributes<HTMLTableCaptionElement>

export type TableSelectionCheckboxProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'checked' | 'defaultChecked' | 'type'
> & {
  checked: boolean
  indeterminate?: boolean
}

export function TableRoot({
  children,
  grid = false,
  onFocusCapture,
  onKeyDown,
  role,
  ...props
}: TableRootProps) {
  const tableRef = useRef<HTMLTableElement>(null)

  useEffect(() => {
    const table = tableRef.current

    if (!grid || !table) {
      return
    }

    const activeElement = document.activeElement
    const activeCell = getGridCellFromTarget(activeElement, table)
    const currentTabStop = table.querySelector<HTMLElement>(
      '[data-grid-cell][tabindex="0"], [data-grid-focus-target][tabindex="0"]',
    )
    const firstCell = getGridRows(table).flatMap(getGridCells)[0]
    const preferredTarget = activeCell
      ? isHTMLElement(activeElement) &&
        (activeElement === activeCell || activeElement.hasAttribute('data-grid-focus-target'))
        ? activeElement
        : getGridFocusTarget(activeCell)
      : currentTabStop ?? (firstCell ? getGridFocusTarget(firstCell) : null)

    if (preferredTarget) {
      setGridTabStop(table, preferredTarget)
    }
  }, [children, grid])

  return (
    <TableContext.Provider value={{ grid }}>
      <table
        {...props}
        onFocusCapture={(event) => {
          onFocusCapture?.(event)

          const table = tableRef.current
          const eventTarget: EventTarget = event.target
          const cell = table ? getGridCellFromTarget(eventTarget, table) : null

          if (!grid || event.defaultPrevented || !table || !cell || !isHTMLElement(eventTarget)) {
            return
          }

          const focusTarget =
            eventTarget === cell || eventTarget.hasAttribute('data-grid-focus-target')
              ? eventTarget
              : getGridFocusTarget(cell)
          setGridTabStop(table, focusTarget)
        }}
        onKeyDown={(event) => {
          onKeyDown?.(event)

          const table = tableRef.current
          const eventTarget: EventTarget = event.target
          const cell = table ? getGridCellFromTarget(eventTarget, table) : null

          if (
            !grid ||
            event.defaultPrevented ||
            event.altKey ||
            !table ||
            !cell ||
            !isHTMLElement(eventTarget) ||
            (eventTarget !== cell && !eventTarget.hasAttribute('data-grid-focus-target'))
          ) {
            return
          }

          if (moveGridFocus(table, cell, event.key, event.ctrlKey || event.metaKey)) {
            event.preventDefault()
          }
        }}
        ref={tableRef}
        role={grid ? 'grid' : role}
      >
        {children}
      </table>
    </TableContext.Provider>
  )
}

export function TableHeader({ role, ...props }: TableHeaderProps) {
  const { grid } = useContext(TableContext)
  return <thead role={grid ? 'rowgroup' : role} {...props} />
}

export function TableBody({ role, ...props }: TableBodyProps) {
  const { grid } = useContext(TableContext)
  return <tbody role={grid ? 'rowgroup' : role} {...props} />
}

export function TableFooter({ role, ...props }: TableFooterProps) {
  const { grid } = useContext(TableContext)
  return <tfoot role={grid ? 'rowgroup' : role} {...props} />
}

export function TableRow({
  disabled = false,
  onClick,
  onKeyDown,
  onSelectedChange,
  role,
  selected,
  ...props
}: TableRowProps) {
  const { grid } = useContext(TableContext)
  const selectable = Boolean(onSelectedChange)

  return (
    <tr
      {...props}
      aria-disabled={disabled || undefined}
      aria-selected={selectable || selected !== undefined ? Boolean(selected) : undefined}
      data-disabled={disabled ? '' : undefined}
      data-selectable={selectable ? '' : undefined}
      data-state={selected ? 'selected' : undefined}
      onClick={(event) => {
        onClick?.(event)

        if (
          event.defaultPrevented ||
          disabled ||
          !onSelectedChange ||
          (isHTMLElement(event.target) && event.target.closest(interactiveElementSelector))
        ) {
          return
        }

        onSelectedChange(!selected)
      }}
      onKeyDown={(event) => {
        onKeyDown?.(event)

        if (
          event.defaultPrevented ||
          event.key !== ' ' ||
          disabled ||
          !onSelectedChange ||
          !isHTMLElement(event.target) ||
          event.target.closest(interactiveElementSelector) ||
          !event.target.closest('[data-grid-cell]')
        ) {
          return
        }

        event.preventDefault()
        onSelectedChange(!selected)
      }}
      role={grid ? 'row' : role}
    />
  )
}

export function TableColumnHeader({
  children,
  onClick,
  onKeyDown,
  onSortChange,
  role,
  scope = 'col',
  sortDirection = 'none',
  tabIndex,
  ...props
}: TableColumnHeaderProps) {
  const { grid } = useContext(TableContext)
  const sortable = Boolean(onSortChange)

  return (
    <th
      {...props}
      aria-sort={sortable ? sortDirection : undefined}
      data-grid-cell={grid ? '' : undefined}
      data-sort-direction={sortable ? sortDirection : undefined}
      data-sortable={sortable ? '' : undefined}
      onClick={(event) => {
        onClick?.(event)

        if (
          event.defaultPrevented ||
          !onSortChange ||
          (isHTMLElement(event.target) &&
            event.target !== event.currentTarget &&
            event.target.closest(interactiveElementSelector))
        ) {
          return
        }

        onSortChange()
      }}
      onKeyDown={(event) => {
        onKeyDown?.(event)

        if (
          event.defaultPrevented ||
          !onSortChange ||
          event.target !== event.currentTarget ||
          (event.key !== 'Enter' && event.key !== ' ')
        ) {
          return
        }

        event.preventDefault()
        onSortChange()
      }}
      role={grid ? 'columnheader' : role}
      scope={scope}
      tabIndex={grid ? (tabIndex ?? -1) : tabIndex}
    >
      {children}
    </th>
  )
}

export function TableCell({ role, tabIndex, ...props }: TableCellProps) {
  const { grid } = useContext(TableContext)

  return (
    <td
      {...props}
      data-grid-cell={grid ? '' : undefined}
      role={grid ? 'gridcell' : role}
      tabIndex={grid ? (tabIndex ?? -1) : tabIndex}
    />
  )
}

export function TableCaption(props: TableCaptionProps) {
  return <caption {...props} />
}

export function TableSelectionCheckbox({
  checked,
  indeterminate = false,
  ...props
}: TableSelectionCheckboxProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = indeterminate
    }
  }, [indeterminate])

  return (
    <input
      {...props}
      aria-checked={indeterminate ? 'mixed' : checked}
      checked={checked}
      data-grid-focus-target=""
      data-state={indeterminate ? 'indeterminate' : checked ? 'checked' : 'unchecked'}
      ref={inputRef}
      type="checkbox"
    />
  )
}
