import { useCallback, useMemo } from 'react'
import { useControllableState } from './useControllableState'

export type TableRowId = string | number
export type TableSelectionMode = 'single' | 'multiple'

export type UseTableSelectionOptions<RowId extends TableRowId> = {
  rowIds: readonly RowId[]
  selectionMode?: TableSelectionMode
  selectedRowIds?: readonly RowId[]
  defaultSelectedRowIds?: readonly RowId[]
  onSelectedRowIdsChange?: (selectedRowIds: readonly RowId[]) => void
}

function uniqueRowIds<RowId extends TableRowId>(rowIds: readonly RowId[]) {
  return Array.from(new Set(rowIds))
}

export function useTableSelection<RowId extends TableRowId>({
  rowIds,
  selectionMode = 'multiple',
  selectedRowIds,
  defaultSelectedRowIds = [],
  onSelectedRowIdsChange,
}: UseTableSelectionOptions<RowId>) {
  const availableRowIds = useMemo(() => uniqueRowIds(rowIds), [rowIds])
  const [currentSelectedRowIds, setCurrentSelectedRowIds] = useControllableState<
    readonly RowId[]
  >({
    value: selectedRowIds,
    defaultValue: uniqueRowIds(defaultSelectedRowIds),
    onChange: onSelectedRowIdsChange,
  })
  const selectedRowIdSet = useMemo(
    () => new Set(currentSelectedRowIds),
    [currentSelectedRowIds],
  )

  const isRowSelected = useCallback(
    (rowId: RowId) => selectedRowIdSet.has(rowId),
    [selectedRowIdSet],
  )

  const setRowSelected = useCallback(
    (rowId: RowId, selected: boolean) => {
      setCurrentSelectedRowIds((previousRowIds) => {
        const previousRowIdSet = new Set(previousRowIds)

        if (selectionMode === 'single') {
          if (!selected) {
            return previousRowIdSet.has(rowId)
              ? previousRowIds.filter((currentRowId) => currentRowId !== rowId)
              : previousRowIds
          }

          return previousRowIds.length === 1 && previousRowIdSet.has(rowId)
            ? previousRowIds
            : [rowId]
        }

        if (selected) {
          return previousRowIdSet.has(rowId) ? previousRowIds : [...previousRowIds, rowId]
        }

        return previousRowIdSet.has(rowId)
          ? previousRowIds.filter((currentRowId) => currentRowId !== rowId)
          : previousRowIds
      })
    },
    [selectionMode, setCurrentSelectedRowIds],
  )

  const toggleRow = useCallback(
    (rowId: RowId) => {
      setRowSelected(rowId, !isRowSelected(rowId))
    },
    [isRowSelected, setRowSelected],
  )

  const allRowsSelected =
    availableRowIds.length > 0 && availableRowIds.every((rowId) => selectedRowIdSet.has(rowId))
  const someRowsSelected =
    !allRowsSelected && availableRowIds.some((rowId) => selectedRowIdSet.has(rowId))

  const setAllRowsSelected = useCallback(
    (selected: boolean) => {
      if (selectionMode !== 'multiple') {
        return
      }

      setCurrentSelectedRowIds((previousRowIds) => {
        const availableRowIdSet = new Set(availableRowIds)
        const preservedRowIds = previousRowIds.filter((rowId) => !availableRowIdSet.has(rowId))

        if (!selected) {
          return preservedRowIds.length === previousRowIds.length
            ? previousRowIds
            : preservedRowIds
        }

        const nextRowIds = [...preservedRowIds, ...availableRowIds]
        return nextRowIds.length === previousRowIds.length && allRowsSelected
          ? previousRowIds
          : nextRowIds
      })
    },
    [allRowsSelected, availableRowIds, selectionMode, setCurrentSelectedRowIds],
  )

  const toggleAllRows = useCallback(() => {
    setAllRowsSelected(!allRowsSelected)
  }, [allRowsSelected, setAllRowsSelected])

  const clearSelection = useCallback(() => {
    setCurrentSelectedRowIds([])
  }, [setCurrentSelectedRowIds])

  return {
    allRowsSelected,
    clearSelection,
    isRowSelected,
    selectedRowIds: currentSelectedRowIds,
    setAllRowsSelected,
    setRowSelected,
    setSelectedRowIds: setCurrentSelectedRowIds,
    someRowsSelected,
    toggleAllRows,
    toggleRow,
  }
}
