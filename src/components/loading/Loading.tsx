import type { HTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

type LoadingSize = 'sm' | 'md' | 'lg'

export type LoadingProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  /** Announced to assistive technology while the spinner is visible. */
  label?: string
  /** Renders the label next to the spinner instead of only announcing it. */
  showLabel?: boolean
  size?: LoadingSize
}

const sizeClasses: Record<LoadingSize, string> = {
  sm: 'size-4 border-2',
  md: 'size-6 border-2',
  lg: 'size-10 border-[3px]',
}

export function Loading({
  className,
  label = '불러오는 중',
  showLabel = false,
  size = 'md',
  ...props
}: LoadingProps) {
  return (
    <div
      className={cn('inline-flex items-center gap-2 text-content-muted', className)}
      role="status"
      {...props}
    >
      <span
        aria-hidden="true"
        className={cn(
          'inline-block animate-spin rounded-full border-border-muted border-t-primary-solid',
          sizeClasses[size],
        )}
      />
      <span className={cn('text-sm', showLabel ? undefined : 'sr-only')}>{label}</span>
    </div>
  )
}
