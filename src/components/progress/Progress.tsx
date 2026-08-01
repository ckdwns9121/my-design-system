import type { HTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

type ProgressTone = 'primary' | 'success' | 'warning' | 'danger'
type ProgressSize = 'sm' | 'md'

export type ProgressProps = Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'role'> & {
  /** Accessible name for the progress bar. */
  label: string
  /** Current value. Omit for an indeterminate bar. */
  value?: number
  max?: number
  /** Human readable value announced instead of the raw percentage. */
  valueText?: string
  /** Shows the label and percentage above the track. */
  showValue?: boolean
  size?: ProgressSize
  tone?: ProgressTone
}

const toneClasses: Record<ProgressTone, string> = {
  primary: 'bg-primary-solid',
  success: 'bg-status-success-ring',
  warning: 'bg-status-warning-ring',
  danger: 'bg-status-danger-solid',
}

const sizeClasses: Record<ProgressSize, string> = {
  sm: 'h-1.5',
  md: 'h-2.5',
}

function clamp(value: number, max: number) {
  return Math.min(Math.max(value, 0), max)
}

export function Progress({
  className,
  label,
  max = 100,
  showValue = false,
  size = 'md',
  tone = 'primary',
  value,
  valueText,
  ...props
}: ProgressProps) {
  const isIndeterminate = value === undefined
  const currentValue = isIndeterminate ? undefined : clamp(value, max)
  const percentage = currentValue === undefined ? undefined : (currentValue / max) * 100

  return (
    <div className={cn('grid gap-1.5', className)}>
      {showValue ? (
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-sm font-medium text-content-strong">{label}</span>
          <span className="text-xs text-content-muted">
            {valueText ?? (percentage === undefined ? '진행 중' : `${Math.round(percentage)}%`)}
          </span>
        </div>
      ) : null}

      <div
        aria-label={label}
        aria-valuemax={max}
        aria-valuemin={0}
        aria-valuenow={currentValue}
        aria-valuetext={valueText}
        className={cn(
          'w-full overflow-hidden rounded-full bg-surface-muted',
          sizeClasses[size],
        )}
        role="progressbar"
        {...props}
      >
        <div
          className={cn(
            'h-full rounded-full transition-[width]',
            toneClasses[tone],
            isIndeterminate ? 'w-2/5 animate-pulse' : undefined,
          )}
          style={isIndeterminate ? undefined : { width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
