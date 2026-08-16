import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { SpinnerIcon } from '../../icons'
import { cn } from '../../lib/cn'

type IconButtonVariant = 'primary' | 'secondary' | 'subtle' | 'danger'
type IconButtonSize = 'sm' | 'md' | 'lg'

export type IconButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'aria-label' | 'children'
> & {
  /** Accessible name. An icon alone carries no text, so this is required. */
  label: string
  icon: ReactNode
  variant?: IconButtonVariant
  size?: IconButtonSize
  isLoading?: boolean
  /** Rounds the button into a circle. */
  rounded?: boolean
}

const variantClasses: Record<IconButtonVariant, string> = {
  primary:
    'bg-primary-solid text-primary-on-solid hover:bg-primary-solid-hover focus-visible:ring-focus-default',
  secondary:
    'border border-border-strong bg-surface-panel text-content-default hover:bg-surface-muted hover:text-content-strong focus-visible:ring-focus-default',
  subtle:
    'bg-transparent text-content-muted hover:bg-surface-muted hover:text-content-strong focus-visible:ring-focus-default',
  danger:
    'bg-status-danger-solid text-content-inverse hover:bg-status-danger-solid-hover focus-visible:ring-status-danger-ring',
}

const sizeClasses: Record<IconButtonSize, string> = {
  sm: 'size-8',
  md: 'size-10',
  lg: 'size-12',
}

const iconSize: Record<IconButtonSize, number> = {
  sm: 16,
  md: 20,
  lg: 24,
}

export function IconButton({
  className,
  icon,
  isLoading = false,
  label,
  rounded = false,
  size = 'md',
  variant = 'secondary',
  disabled,
  ...props
}: IconButtonProps) {
  return (
    <button
      aria-label={label}
      className={cn(
        'inline-flex items-center justify-center transition-colors',
        rounded ? 'rounded-full' : 'rounded-md',
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
      {isLoading ? <SpinnerIcon className="animate-spin" size={iconSize[size]} /> : icon}
    </button>
  )
}
