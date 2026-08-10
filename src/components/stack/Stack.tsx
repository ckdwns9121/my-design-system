import type { ElementType, HTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

/**
 * Spacing steps, not raw values. Restricting the prop to a scale is the point:
 * `gap-[13px]` is always available through className, but it should be a visible
 * exception rather than the easiest thing to type.
 */
export type SpacingStep = 0 | 1 | 2 | 3 | 4 | 6 | 8 | 12

type StackDirection = 'row' | 'column'
type StackAlign = 'start' | 'center' | 'end' | 'stretch' | 'baseline'
type StackJustify = 'start' | 'center' | 'end' | 'between'

export type StackProps = HTMLAttributes<HTMLElement> & {
  /** Element to render. Use `ul`, `nav`, or `section` when the grouping has meaning. */
  as?: ElementType
  direction?: StackDirection
  gap?: SpacingStep
  align?: StackAlign
  justify?: StackJustify
  wrap?: boolean
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

const alignClasses: Record<StackAlign, string> = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
  baseline: 'items-baseline',
}

const justifyClasses: Record<StackJustify, string> = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
}

export function Stack({
  align,
  as: Component = 'div',
  className,
  direction = 'column',
  gap = 4,
  justify,
  wrap = false,
  ...props
}: StackProps) {
  return (
    <Component
      className={cn(
        'flex',
        direction === 'column' ? 'flex-col' : 'flex-row',
        gapClasses[gap],
        align ? alignClasses[align] : undefined,
        justify ? justifyClasses[justify] : undefined,
        wrap ? 'flex-wrap' : undefined,
        className,
      )}
      {...props}
    />
  )
}
