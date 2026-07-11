import type { ButtonHTMLAttributes } from 'react'
import { cn } from '../lib/cn'

type ButtonVariant = 'primary' | 'secondary' | 'subtle' | 'danger'
type ButtonSize = 'sm' | 'md' | 'lg'

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  size?: ButtonSize
  isLoading?: boolean
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-primary-solid text-primary-on-solid hover:bg-primary-solid-hover focus-visible:ring-focus-default',
  secondary: 'border border-border-default bg-surface-panel text-content-default hover:bg-surface-muted focus-visible:ring-focus-default',
  subtle: 'bg-transparent text-content-muted hover:bg-surface-muted hover:text-content-strong focus-visible:ring-focus-default',
  danger: 'bg-status-danger-solid text-content-inverse hover:bg-status-danger-solid-hover focus-visible:ring-status-danger-ring',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-5 text-base',
}

export function Button({
  className,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      disabled={disabled || isLoading}
      type="button"
      {...props}
    >
      {isLoading ? (
        <span
          aria-hidden="true"
          className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent"
        />
      ) : null}
      <span>{children}</span>
    </button>
  )
}
