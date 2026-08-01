import { useMemo } from 'react'

export type PaginationItem =
  | { type: 'page'; page: number }
  | { type: 'ellipsis'; key: 'start' | 'end' }

export type UsePaginationOptions = {
  /** Current page, 1-based. */
  page: number
  pageCount: number
  /** Pages shown on each side of the current page. */
  siblingCount?: number
  /** Pages always shown at the start and end of the list. */
  boundaryCount?: number
}

export type UsePaginationResult = {
  items: PaginationItem[]
  page: number
  pageCount: number
  hasPrevious: boolean
  hasNext: boolean
  previousPage: number
  nextPage: number
}

function clampPage(page: number, pageCount: number) {
  if (!Number.isFinite(page)) {
    return 1
  }

  return Math.min(Math.max(Math.trunc(page), 1), Math.max(pageCount, 1))
}

function range(start: number, end: number) {
  return Array.from({ length: Math.max(end - start + 1, 0) }, (_, index) => start + index)
}

/**
 * Builds the page list for a pagination control, collapsing the pages outside
 * the boundary and sibling windows into ellipsis markers.
 *
 * The window grows at the edges so the number of rendered items stays constant
 * as the page moves; the control keeps its width instead of shifting layout.
 */
export function usePagination({
  boundaryCount = 1,
  page,
  pageCount,
  siblingCount = 1,
}: UsePaginationOptions): UsePaginationResult {
  return useMemo(() => {
    const totalPages = Math.max(Math.trunc(pageCount), 0)
    const currentPage = clampPage(page, totalPages)

    if (totalPages === 0) {
      return {
        items: [],
        page: currentPage,
        pageCount: 0,
        hasPrevious: false,
        hasNext: false,
        previousPage: 1,
        nextPage: 1,
      }
    }

    const startPages = range(1, Math.min(boundaryCount, totalPages))
    const endPages = range(Math.max(totalPages - boundaryCount + 1, boundaryCount + 1), totalPages)

    const siblingStart = Math.max(
      Math.min(currentPage - siblingCount, totalPages - boundaryCount - siblingCount * 2 - 1),
      boundaryCount + 2,
    )
    const siblingEnd = Math.min(
      Math.max(currentPage + siblingCount, boundaryCount + siblingCount * 2 + 2),
      endPages.length > 0 ? endPages[0] - 2 : totalPages - 1,
    )

    const pages = [
      ...startPages,
      ...(siblingStart > boundaryCount + 2
        ? ['start-ellipsis' as const]
        : boundaryCount + 1 < totalPages - boundaryCount
          ? [boundaryCount + 1]
          : []),
      ...range(siblingStart, siblingEnd),
      ...(siblingEnd < totalPages - boundaryCount - 1
        ? ['end-ellipsis' as const]
        : totalPages - boundaryCount > boundaryCount
          ? [totalPages - boundaryCount]
          : []),
      ...endPages,
    ]

    const items: PaginationItem[] = pages.map((entry) =>
      entry === 'start-ellipsis'
        ? { type: 'ellipsis', key: 'start' }
        : entry === 'end-ellipsis'
          ? { type: 'ellipsis', key: 'end' }
          : { type: 'page', page: entry },
    )

    return {
      items,
      page: currentPage,
      pageCount: totalPages,
      hasPrevious: currentPage > 1,
      hasNext: currentPage < totalPages,
      previousPage: Math.max(currentPage - 1, 1),
      nextPage: Math.min(currentPage + 1, totalPages),
    }
  }, [boundaryCount, page, pageCount, siblingCount])
}
