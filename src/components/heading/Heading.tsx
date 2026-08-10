import type { HTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

type HeadingLevel = 1 | 2 | 3 | 4
type HeadingSize = 'sm' | 'md' | 'lg' | 'xl'

export type HeadingProps = HTMLAttributes<HTMLHeadingElement> & {
  /** Heading rank. Pick it from the document outline, not from the wanted size. */
  level?: HeadingLevel
  /** Visual size, when the rank the outline needs is not the size the design wants. */
  size?: HeadingSize
}

const sizeClasses: Record<HeadingSize, string> = {
  sm: 'text-sm leading-6',
  md: 'text-base leading-7',
  lg: 'text-lg leading-7',
  xl: 'text-2xl leading-9',
}

const defaultSizeByLevel: Record<HeadingLevel, HeadingSize> = {
  1: 'xl',
  2: 'lg',
  3: 'md',
  4: 'sm',
}

/**
 * A heading whose rank and size are separate props.
 *
 * Screen reader users navigate by heading rank, so skipping from `h1` to `h3`
 * because `h2` looked too big breaks the outline. Keep `level` correct and reach
 * for `size` when the design disagrees.
 */
export function Heading({ className, level = 2, size, ...props }: HeadingProps) {
  const Component = `h${level}` as const

  return (
    <Component
      className={cn(
        'font-semibold text-content-strong',
        sizeClasses[size ?? defaultSizeByLevel[level]],
        className,
      )}
      {...props}
    />
  )
}
