import {
  TableBody as HeadlessTableBody,
  TableCaption as HeadlessTableCaption,
  TableCell as HeadlessTableCell,
  TableColumnHeader as HeadlessTableColumnHeader,
  TableFooter as HeadlessTableFooter,
  TableHeader as HeadlessTableHeader,
  TableRoot as HeadlessTableRoot,
  TableRow as HeadlessTableRow,
  TableSelectionCheckbox as HeadlessTableSelectionCheckbox,
  type TableBodyProps,
  type TableCaptionProps,
  type TableCellProps,
  type TableColumnHeaderProps,
  type TableFooterProps,
  type TableHeaderProps,
  type TableRootProps,
  type TableRowProps,
  type TableSelectionCheckboxProps,
} from '../../headless/primitives/table'
import { cn } from '../../lib/cn'

export type TableProps = TableRootProps
export type TableHeadProps = TableColumnHeaderProps
export type {
  TableBodyProps,
  TableCaptionProps,
  TableCellProps,
  TableFooterProps,
  TableHeaderProps,
  TableRowProps,
  TableSelectionCheckboxProps,
}

export function Table({ className, ...props }: TableProps) {
  return (
    <div className="w-full overflow-x-auto">
      <HeadlessTableRoot
        className={cn('w-full caption-bottom border-collapse text-left text-sm', className)}
        {...props}
      />
    </div>
  )
}

export function TableHeader({ className, ...props }: TableHeaderProps) {
  return (
    <HeadlessTableHeader
      className={cn('border-b border-border-default', className)}
      {...props}
    />
  )
}

export function TableBody({ className, ...props }: TableBodyProps) {
  return (
    <HeadlessTableBody
      className={cn('divide-y divide-border-muted', className)}
      {...props}
    />
  )
}

export function TableFooter({ className, ...props }: TableFooterProps) {
  return (
    <HeadlessTableFooter
      className={cn(
        'border-t border-border-default bg-surface-muted font-medium',
        className,
      )}
      {...props}
    />
  )
}

export function TableRow({ className, ...props }: TableRowProps) {
  return (
    <HeadlessTableRow
      className={cn(
        'transition-colors hover:bg-surface-muted/70',
        'data-[selectable]:cursor-pointer data-[state=selected]:bg-primary-surface',
        'data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50',
        className,
      )}
      {...props}
    />
  )
}

const sortableHeadClasses = [
  'p-0 select-none',
  '[&>button]:inline-flex [&>button]:h-10 [&>button]:w-full [&>button]:cursor-pointer',
  '[&>button]:items-center [&>button]:px-3 [&>button]:text-left [&>button]:uppercase',
  '[&>button]:hover:text-content-strong [&>button]:focus-visible:outline-none',
  '[&>button]:focus-visible:ring-2 [&>button]:focus-visible:ring-inset',
  '[&>button]:focus-visible:ring-focus-default',
].join(' ')

const staticHeadClasses = [
  'px-3 focus-visible:outline-none',
  'focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-focus-default',
].join(' ')

function getSortIndicator(sortDirection: TableHeadProps['sortDirection']) {
  if (sortDirection === 'ascending') {
    return '↑'
  }

  if (sortDirection === 'descending') {
    return '↓'
  }

  return '↕'
}

export function TableHead({
  children,
  className,
  onSortChange,
  sortDirection,
  ...props
}: TableHeadProps) {
  const sortable = Boolean(onSortChange)

  return (
    <HeadlessTableColumnHeader
      className={cn(
        'h-10 text-xs font-semibold uppercase text-content-muted',
        sortable ? sortableHeadClasses : staticHeadClasses,
        className,
      )}
      onSortChange={onSortChange}
      sortDirection={sortDirection}
      {...props}
    >
      {sortable ? (
        <span className="inline-flex items-center gap-1.5">
          <span>{children}</span>
          <span aria-hidden="true" className="text-sm font-medium normal-case text-primary-text">
            {getSortIndicator(sortDirection)}
          </span>
        </span>
      ) : (
        children
      )}
    </HeadlessTableColumnHeader>
  )
}

export function TableCell({ className, ...props }: TableCellProps) {
  return (
    <HeadlessTableCell
      className={cn(
        'h-12 px-3 text-content-default',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-focus-default',
        className,
      )}
      {...props}
    />
  )
}

export function TableCaption({ className, ...props }: TableCaptionProps) {
  return (
    <HeadlessTableCaption
      className={cn('mt-3 text-sm leading-6 text-content-muted', className)}
      {...props}
    />
  )
}

export function TableSelectionCheckbox({
  className,
  ...props
}: TableSelectionCheckboxProps) {
  return (
    <HeadlessTableSelectionCheckbox
      className={cn(
        'size-4 shrink-0 cursor-pointer accent-primary-solid',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-default focus-visible:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  )
}
