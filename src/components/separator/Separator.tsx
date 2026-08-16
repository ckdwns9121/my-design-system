import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '../../lib/cn'

type SeparatorOrientation = 'horizontal' | 'vertical'

export type SeparatorProps = Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'role'> & {
  orientation?: SeparatorOrientation
  /**
   * True when the line only groups things visually and the grouping is already
   * clear from the content. Decorative separators leave the accessibility tree
   * so a screen reader does not announce a boundary twice.
   */
  decorative?: boolean
  /** Text placed in the middle of the line, such as "또는". */
  label?: ReactNode
}

export function Separator({
  className,
  decorative = false,
  label,
  orientation = 'horizontal',
  ...props
}: SeparatorProps) {
  const semantics = decorative
    ? { 'aria-hidden': true as const }
    : { 'aria-orientation': orientation, role: 'separator' as const }

  if (label && orientation === 'horizontal') {
    return (
      <div className={cn('flex items-center gap-3', className)} {...props}>
        <div className="h-px flex-1 bg-border-muted" {...semantics} />
        <span className="text-xs text-content-subtle">{label}</span>
        <div className="h-px flex-1 bg-border-muted" aria-hidden="true" />
      </div>
    )
  }

  return (
    <div
      className={cn(
        'shrink-0 bg-border-muted',
        orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px self-stretch',
        className,
      )}
      {...semantics}
      {...props}
    />
  )
}
