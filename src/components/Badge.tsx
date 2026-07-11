import type { HTMLAttributes } from 'react'
import { cn } from '../lib/cn'

type BadgeTone = 'neutral' | 'primary' | 'success' | 'warning' | 'danger'

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: BadgeTone
}

const toneClasses: Record<BadgeTone, string> = {
  neutral: 'bg-surface-muted text-content-muted ring-border-muted',
  primary: 'bg-primary-surface text-primary-text ring-primary-ring/15',
  success: 'bg-status-success-surface text-status-success-text ring-status-success-ring/15',
  warning: 'bg-status-warning-surface text-status-warning-text ring-status-warning-ring/15',
  danger: 'bg-status-danger-surface text-status-danger-text ring-status-danger-ring/15',
}

export function Badge({ className, tone = 'neutral', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex h-6 items-center rounded-sm px-2 text-xs font-medium ring-1 ring-inset',
        toneClasses[tone],
        className,
      )}
      {...props}
    />
  )
}
