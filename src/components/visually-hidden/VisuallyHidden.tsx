import type { HTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

export type VisuallyHiddenProps = HTMLAttributes<HTMLSpanElement>

/**
 * Removes content from view while leaving it in the accessibility tree.
 *
 * Use it when a control's visible form already reads clearly to sighted users
 * but leaves a screen reader without the words: a table's sort direction, the
 * unit behind a number, the label of an icon-only control that cannot take
 * `aria-label` because its text belongs in the tree.
 *
 * `display: none` and `visibility: hidden` remove content from the tree as
 * well, so this clips it instead.
 */
export function VisuallyHidden({ className, ...props }: VisuallyHiddenProps) {
  return <span className={cn('sr-only', className)} {...props} />
}
