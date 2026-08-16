import {
  TooltipContent as HeadlessTooltipContent,
  TooltipPortal as HeadlessTooltipPortal,
  TooltipRoot as HeadlessTooltipRoot,
  TooltipTrigger as HeadlessTooltipTrigger,
  type TooltipContentProps,
  type TooltipPortalProps,
  type TooltipRootProps,
  type TooltipTriggerProps,
} from '../../headless/primitives/tooltip'
import { cn } from '../../lib/cn'

export type {
  TooltipContentProps,
  TooltipPortalProps,
  TooltipRootProps,
  TooltipTriggerProps,
}

export function Tooltip(props: TooltipRootProps) {
  return <HeadlessTooltipRoot {...props} />
}

export function TooltipTrigger({ className, ...props }: TooltipTriggerProps) {
  return (
    <HeadlessTooltipTrigger
      className={cn(
        'inline-flex h-9 items-center justify-center rounded-md border border-border-strong bg-surface-panel px-3 text-sm font-medium text-content-default transition-colors',
        'hover:bg-surface-muted hover:text-content-strong',
        'data-[state=open]:border-primary-solid data-[state=open]:text-primary-text-strong',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-default focus-visible:ring-offset-2',
        'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  )
}

export function TooltipPortal(props: TooltipPortalProps) {
  return <HeadlessTooltipPortal {...props} />
}

export function TooltipContent({ className, ...props }: TooltipContentProps) {
  return (
    <HeadlessTooltipContent
      className={cn(
        'z-50 max-w-64 rounded-md border border-border-muted bg-surface-inverse px-3 py-2 text-xs leading-5 text-content-inverse shadow-panel',
        'select-none',
        className,
      )}
      {...props}
    />
  )
}
