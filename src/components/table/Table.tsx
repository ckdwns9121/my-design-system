import type {
  HTMLAttributes,
  TableHTMLAttributes,
  TdHTMLAttributes,
  ThHTMLAttributes,
} from 'react'
import { cn } from '../../lib/cn'

export type TableProps = TableHTMLAttributes<HTMLTableElement>
export type TableHeaderProps = HTMLAttributes<HTMLTableSectionElement>
export type TableBodyProps = HTMLAttributes<HTMLTableSectionElement>
export type TableFooterProps = HTMLAttributes<HTMLTableSectionElement>
export type TableRowProps = HTMLAttributes<HTMLTableRowElement>
export type TableHeadProps = ThHTMLAttributes<HTMLTableCellElement>
export type TableCellProps = TdHTMLAttributes<HTMLTableCellElement>
export type TableCaptionProps = HTMLAttributes<HTMLTableCaptionElement>

export function Table({ className, ...props }: TableProps) {
  return (
    <div className="w-full overflow-x-auto">
      <table
        className={cn('w-full caption-bottom border-collapse text-left text-sm', className)}
        {...props}
      />
    </div>
  )
}

export function TableHeader({ className, ...props }: TableHeaderProps) {
  return <thead className={cn('border-b border-border-default', className)} {...props} />
}

export function TableBody({ className, ...props }: TableBodyProps) {
  return <tbody className={cn('divide-y divide-border-muted', className)} {...props} />
}

export function TableFooter({ className, ...props }: TableFooterProps) {
  return (
    <tfoot
      className={cn('border-t border-border-default bg-surface-muted font-medium', className)}
      {...props}
    />
  )
}

export function TableRow({ className, ...props }: TableRowProps) {
  return (
    <tr
      className={cn('transition-colors hover:bg-surface-muted/70 data-[state=selected]:bg-primary-surface', className)}
      {...props}
    />
  )
}

export function TableHead({ className, scope = 'col', ...props }: TableHeadProps) {
  return (
    <th
      className={cn('h-10 px-3 text-xs font-semibold uppercase text-content-muted', className)}
      scope={scope}
      {...props}
    />
  )
}

export function TableCell({ className, ...props }: TableCellProps) {
  return <td className={cn('h-12 px-3 text-content-default', className)} {...props} />
}

export function TableCaption({ className, ...props }: TableCaptionProps) {
  return (
    <caption
      className={cn('mt-3 text-sm leading-6 text-content-muted', className)}
      {...props}
    />
  )
}
