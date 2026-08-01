import type { HTMLAttributes } from 'react'
import { usePagination } from '../../headless'
import { cn } from '../../lib/cn'

export type PaginationProps = Omit<HTMLAttributes<HTMLElement>, 'onChange'> & {
  /** Current page, 1-based. */
  page: number
  pageCount: number
  onPageChange: (page: number) => void
  /** Pages shown on each side of the current page. */
  siblingCount?: number
  /** Accessible name for the landmark. */
  label?: string
}

const pageButtonClasses =
  'inline-flex h-9 min-w-9 items-center justify-center rounded-md border px-2 text-sm transition-colors ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-default focus-visible:ring-offset-2 ' +
  'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50'

export function Pagination({
  className,
  label = '페이지네이션',
  onPageChange,
  page,
  pageCount,
  siblingCount = 1,
  ...props
}: PaginationProps) {
  const pagination = usePagination({ page, pageCount, siblingCount })

  if (pagination.pageCount === 0) {
    return null
  }

  return (
    <nav aria-label={label} className={cn('w-full', className)} {...props}>
      <ul className="flex flex-wrap items-center gap-1">
        <li>
          <button
            aria-label="이전 페이지"
            className={cn(
              pageButtonClasses,
              'border-border-default bg-surface-panel text-content-default hover:bg-surface-muted',
            )}
            disabled={!pagination.hasPrevious}
            onClick={() => onPageChange(pagination.previousPage)}
            type="button"
          >
            이전
          </button>
        </li>

        {pagination.items.map((item) =>
          item.type === 'ellipsis' ? (
            <li aria-hidden="true" className="px-1 text-sm text-content-subtle" key={item.key}>
              …
            </li>
          ) : (
            <li key={item.page}>
              <button
                aria-current={item.page === pagination.page ? 'page' : undefined}
                aria-label={`${item.page}페이지`}
                className={cn(
                  pageButtonClasses,
                  item.page === pagination.page
                    ? 'border-primary-solid bg-primary-solid font-medium text-primary-on-solid'
                    : 'border-border-default bg-surface-panel text-content-default hover:bg-surface-muted',
                )}
                onClick={() => onPageChange(item.page)}
                type="button"
              >
                {item.page}
              </button>
            </li>
          ),
        )}

        <li>
          <button
            aria-label="다음 페이지"
            className={cn(
              pageButtonClasses,
              'border-border-default bg-surface-panel text-content-default hover:bg-surface-muted',
            )}
            disabled={!pagination.hasNext}
            onClick={() => onPageChange(pagination.nextPage)}
            type="button"
          >
            다음
          </button>
        </li>
      </ul>
    </nav>
  )
}
