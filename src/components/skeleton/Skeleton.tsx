import type { HTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

type SkeletonShape = 'line' | 'block' | 'circle'

export type SkeletonProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  shape?: SkeletonShape
}

export type SkeletonTextProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  lines?: number
}

const shapeClasses: Record<SkeletonShape, string> = {
  line: 'h-4 w-full rounded-sm',
  block: 'h-24 w-full rounded-md',
  circle: 'size-10 rounded-full',
}

/**
 * A placeholder shaped like the content that is loading.
 *
 * The placeholder itself carries no information, so it is hidden from assistive
 * technology. The surrounding region is what announces the wait: mark it
 * `aria-busy="true"` while loading, and use Loading when the wait needs to be
 * announced rather than only shown.
 */
export function Skeleton({ className, shape = 'line', ...props }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn('animate-pulse bg-surface-muted', shapeClasses[shape], className)}
      {...props}
    />
  )
}

/**
 * Several skeleton lines, with the last one short so it reads as a paragraph.
 * Each line hides itself, so the wrapper stays a plain container.
 */
export function SkeletonText({ className, lines = 3, ...props }: SkeletonTextProps) {
  return (
    <div className={cn('grid gap-2', className)} {...props}>
      {Array.from({ length: Math.max(lines, 1) }, (_, index) => (
        <Skeleton
          className={index === lines - 1 && lines > 1 ? 'w-3/5' : undefined}
          key={index}
        />
      ))}
    </div>
  )
}
