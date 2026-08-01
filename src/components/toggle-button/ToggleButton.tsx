import type { ToggleButtonProps as HeadlessToggleProps } from '../../headless'
import { ToggleButton as HeadlessToggle } from '../../headless'
import { cn } from '../../lib/cn'

type ToggleButtonSize = 'sm' | 'md' | 'lg'

export type ToggleButtonProps = HeadlessToggleProps & {
  size?: ToggleButtonSize
}

const sizeClasses: Record<ToggleButtonSize, string> = {
  sm: 'h-8 min-w-8 px-2 text-sm',
  md: 'h-10 min-w-10 px-3 text-sm',
  lg: 'h-12 min-w-12 px-4 text-base',
}

export function ToggleButton({ className, size = 'md', ...props }: ToggleButtonProps) {
  return (
    <HeadlessToggle
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-md border font-medium transition-colors',
        'border-border-default bg-surface-panel text-content-muted hover:bg-surface-muted hover:text-content-strong',
        'data-[state=on]:border-primary-solid data-[state=on]:bg-primary-surface-strong data-[state=on]:text-primary-text-strong',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-default focus-visible:ring-offset-2',
        'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
        sizeClasses[size],
        className,
      )}
      {...props}
    />
  )
}
