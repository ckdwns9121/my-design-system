import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '../../lib/cn'

export type EmptyStateProps = Omit<HTMLAttributes<HTMLDivElement>, 'title'> & {
  title: string
  description?: string
  /** Decorative illustration or icon. Hidden from assistive technology. */
  media?: ReactNode
  /** Primary recovery action. */
  action?: ReactNode
}

export function EmptyState({
  action,
  className,
  description,
  media,
  title,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'grid justify-items-center gap-3 rounded-md border border-dashed border-border-default bg-surface-panel px-6 py-12 text-center',
        className,
      )}
      {...props}
    >
      {media ? (
        <div aria-hidden="true" className="text-content-subtle">
          {media}
        </div>
      ) : null}
      <p className="text-base font-semibold text-content-strong">{title}</p>
      {description ? (
        <p className="max-w-prose text-sm leading-6 text-content-muted">{description}</p>
      ) : null}
      {action ? <div className="mt-1">{action}</div> : null}
    </div>
  )
}
