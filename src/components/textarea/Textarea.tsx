import { useId, type TextareaHTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string
  helperText?: string
  error?: string
  /** Shows a live character counter. Requires `maxLength`. */
  showCount?: boolean
}

export function Textarea({
  className,
  error,
  helperText,
  id,
  label,
  maxLength,
  rows = 4,
  showCount = false,
  value,
  ...props
}: TextareaProps) {
  const generatedId = useId()
  const textareaId = id ?? generatedId
  const descriptionId = `${textareaId}-description`
  const description = error ?? helperText
  const length = typeof value === 'string' ? value.length : undefined

  return (
    <div className="grid gap-1.5">
      <label className="text-sm font-medium text-content-strong" htmlFor={textareaId}>
        {label}
      </label>
      <textarea
        aria-describedby={description ? descriptionId : undefined}
        aria-invalid={error ? true : undefined}
        className={cn(
          'w-full resize-y rounded-md border bg-surface-panel px-3 py-2 text-sm leading-6 text-content-strong outline-none transition',
          'placeholder:text-content-subtle focus:border-primary-solid focus:ring-2 focus:ring-primary-ring/20',
          error ? 'border-status-danger-text' : 'border-border-strong',
          className,
        )}
        id={textareaId}
        maxLength={maxLength}
        rows={rows}
        value={value}
        {...props}
      />
      {description || (showCount && maxLength) ? (
        <div className="flex items-start justify-between gap-3">
          {description ? (
            <p
              className={cn(
                'text-xs leading-5',
                error ? 'text-status-danger-text' : 'text-content-muted',
              )}
              id={descriptionId}
            >
              {description}
            </p>
          ) : (
            <span />
          )}
          {showCount && maxLength ? (
            <p className="shrink-0 text-xs leading-5 text-content-muted">
              {length ?? 0}/{maxLength}
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
