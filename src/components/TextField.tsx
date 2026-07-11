import type { InputHTMLAttributes } from 'react'
import { useId } from 'react'
import { cn } from '../lib/cn'

export type TextFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> & {
  label: string
  helperText?: string
  error?: string
}

export function TextField({
  className,
  id,
  label,
  helperText,
  error,
  ...props
}: TextFieldProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const descriptionId = `${inputId}-description`
  const description = error ?? helperText

  return (
    <div className="grid gap-1.5">
      <label className="text-sm font-medium text-content-strong" htmlFor={inputId}>
        {label}
      </label>
      <input
        aria-describedby={description ? descriptionId : undefined}
        aria-invalid={error ? true : undefined}
        className={cn(
          'h-10 w-full rounded-md border bg-surface-panel px-3 text-sm text-content-strong outline-none transition',
          'placeholder:text-content-subtle focus:border-primary-solid focus:ring-2 focus:ring-primary-ring/20',
          error ? 'border-status-danger-text' : 'border-border-default',
          className,
        )}
        id={inputId}
        {...props}
      />
      {description ? (
        <p
          className={cn('text-xs leading-5', error ? 'text-status-danger-text' : 'text-content-muted')}
          id={descriptionId}
        >
          {description}
        </p>
      ) : null}
    </div>
  )
}
