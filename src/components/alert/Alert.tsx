import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '../../lib/cn'

type AlertTone = 'info' | 'success' | 'warning' | 'danger'

export type AlertProps = Omit<HTMLAttributes<HTMLDivElement>, 'title'> & {
  title: string
  /** Optional action slot rendered at the end of the alert. */
  action?: ReactNode
  tone?: AlertTone
}

const toneClasses: Record<AlertTone, string> = {
  info: 'border-border-default bg-surface-muted',
  success: 'border-status-success-ring/40 bg-status-success-surface',
  warning: 'border-status-warning-ring/40 bg-status-warning-surface',
  danger: 'border-status-danger-ring/40 bg-status-danger-surface',
}

const titleClasses: Record<AlertTone, string> = {
  info: 'text-content-strong',
  success: 'text-status-success-text',
  warning: 'text-status-warning-text',
  danger: 'text-status-danger-text',
}

/**
 * `danger` and `warning` interrupt the user with role="alert"; the quieter tones
 * use role="status" so a screen reader finishes the current sentence first.
 */
const roleByTone: Record<AlertTone, 'alert' | 'status'> = {
  info: 'status',
  success: 'status',
  warning: 'alert',
  danger: 'alert',
}

export function Alert({ action, children, className, title, tone = 'info', ...props }: AlertProps) {
  return (
    <div
      className={cn(
        'flex items-start justify-between gap-4 rounded-md border p-4',
        toneClasses[tone],
        className,
      )}
      role={roleByTone[tone]}
      {...props}
    >
      <div className="grid gap-1">
        <p className={cn('text-sm font-semibold', titleClasses[tone])}>{title}</p>
        {children ? <div className="text-sm leading-6 text-content-default">{children}</div> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  )
}
