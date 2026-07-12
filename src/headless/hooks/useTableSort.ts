import { useCallback, useMemo } from 'react'
import { useControllableState } from './useControllableState'

export type TableSortDirection = 'ascending' | 'descending'

export type TableSortDescriptor<ColumnId extends string = string> = {
  columnId: ColumnId
  direction: TableSortDirection
}

export type TableSortValue = string | number | bigint | boolean | Date | null | undefined

export type UseTableSortOptions<Row, ColumnId extends string> = {
  rows: readonly Row[]
  getSortValue: (row: Row, columnId: ColumnId) => TableSortValue
  sortDescriptor?: TableSortDescriptor<ColumnId> | null
  defaultSortDescriptor?: TableSortDescriptor<ColumnId> | null
  onSortChange?: (sortDescriptor: TableSortDescriptor<ColumnId> | null) => void
  compareValues?: (
    leftValue: TableSortValue,
    rightValue: TableSortValue,
    columnId: ColumnId,
  ) => number
}

function compareTableSortValues(leftValue: TableSortValue, rightValue: TableSortValue) {
  if (Object.is(leftValue, rightValue)) {
    return 0
  }

  if (leftValue == null) {
    return 1
  }

  if (rightValue == null) {
    return -1
  }

  if (leftValue instanceof Date && rightValue instanceof Date) {
    return leftValue.getTime() - rightValue.getTime()
  }

  if (typeof leftValue === 'number' && typeof rightValue === 'number') {
    return leftValue - rightValue
  }

  if (typeof leftValue === 'bigint' && typeof rightValue === 'bigint') {
    return leftValue < rightValue ? -1 : 1
  }

  if (typeof leftValue === 'boolean' && typeof rightValue === 'boolean') {
    return Number(leftValue) - Number(rightValue)
  }

  return String(leftValue).localeCompare(String(rightValue), undefined, {
    numeric: true,
    sensitivity: 'base',
  })
}

export function useTableSort<Row, ColumnId extends string>({
  rows,
  getSortValue,
  sortDescriptor,
  defaultSortDescriptor = null,
  onSortChange,
  compareValues = compareTableSortValues,
}: UseTableSortOptions<Row, ColumnId>) {
  const [currentSortDescriptor, setCurrentSortDescriptor] = useControllableState<
    TableSortDescriptor<ColumnId> | null
  >({
    value: sortDescriptor,
    defaultValue: defaultSortDescriptor,
    onChange: onSortChange,
  })

  const sortedRows = useMemo(() => {
    if (!currentSortDescriptor) {
      return rows
    }

    const { columnId, direction } = currentSortDescriptor
    const directionMultiplier = direction === 'ascending' ? 1 : -1

    return rows
      .map((row, index) => ({ index, row }))
      .sort((left, right) => {
        const comparison = compareValues(
          getSortValue(left.row, columnId),
          getSortValue(right.row, columnId),
          columnId,
        )

        return comparison === 0
          ? left.index - right.index
          : comparison * directionMultiplier
      })
      .map(({ row }) => row)
  }, [compareValues, currentSortDescriptor, getSortValue, rows])

  const toggleSort = useCallback(
    (columnId: ColumnId) => {
      setCurrentSortDescriptor((previousDescriptor) => ({
        columnId,
        direction:
          previousDescriptor?.columnId === columnId &&
          previousDescriptor.direction === 'ascending'
            ? 'descending'
            : 'ascending',
      }))
    },
    [setCurrentSortDescriptor],
  )

  const clearSort = useCallback(() => {
    setCurrentSortDescriptor(null)
  }, [setCurrentSortDescriptor])

  return {
    clearSort,
    setSortDescriptor: setCurrentSortDescriptor,
    sortDescriptor: currentSortDescriptor,
    sortedRows,
    toggleSort,
  }
}
