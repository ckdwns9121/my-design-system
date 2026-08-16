import type { ElementType, HTMLAttributes } from 'react'
import { cn } from '../../lib/cn'
import type { SpacingStep } from '../stack'

type GridColumns = 1 | 2 | 3 | 4 | 6 | 12

export type GridProps = HTMLAttributes<HTMLElement> & {
  as?: ElementType
  /** Columns from the `sm` breakpoint up. One column below it. */
  columns?: GridColumns
  gap?: SpacingStep
}

/**
 * A column grid on the spacing scale.
 *
 * Column counts apply from `sm` up and collapse to one column below it, so a
 * layout is readable on a phone without every caller repeating the breakpoint.
 * Anything more specific belongs in className.
 */
const columnClasses: Record<GridColumns, string> = {
  1: 'grid-cols-1',
  2: 'sm:grid-cols-2',
  3: 'sm:grid-cols-2 lg:grid-cols-3',
  4: 'sm:grid-cols-2 lg:grid-cols-4',
  6: 'sm:grid-cols-3 lg:grid-cols-6',
  12: 'sm:grid-cols-6 lg:grid-cols-12',
}

const gapClasses: Record<SpacingStep, string> = {
  0: 'gap-0',
  1: 'gap-1',
  2: 'gap-2',
  3: 'gap-3',
  4: 'gap-4',
  6: 'gap-6',
  8: 'gap-8',
  12: 'gap-12',
}

export function Grid({
  as: Component = 'div',
  className,
  columns = 2,
  gap = 4,
  ...props
}: GridProps) {
  return (
    <Component
      className={cn('grid grid-cols-1', columnClasses[columns], gapClasses[gap], className)}
      {...props}
    />
  )
}
