import {
  PopoverClose as HeadlessPopoverClose,
  PopoverContent as HeadlessPopoverContent,
  PopoverPortal as HeadlessPopoverPortal,
  PopoverRoot as HeadlessPopoverRoot,
  PopoverTrigger as HeadlessPopoverTrigger,
  type PopoverCloseProps,
  type PopoverContentProps,
  type PopoverPortalProps,
  type PopoverRootProps,
  type PopoverTriggerProps,
} from '../../headless/primitives/popover'
import { cn } from '../../lib/cn'

export type {
  PopoverCloseProps,
  PopoverContentProps,
  PopoverPortalProps,
  PopoverRootProps,
  PopoverTriggerProps,
}

export function Popover(props: PopoverRootProps) {
  return <HeadlessPopoverRoot {...props} />
}

export function PopoverTrigger({ className, ...props }: PopoverTriggerProps) {
  return (
    <HeadlessPopoverTrigger
      className={cn(
        'inline-flex h-10 items-center justify-center gap-2 rounded-md border border-border-strong bg-surface-panel px-4 text-sm font-medium text-content-default transition-colors',
        'hover:bg-surface-muted hover:text-content-strong',
        'data-[state=open]:border-primary-solid data-[state=open]:bg-primary-surface data-[state=open]:text-primary-text-strong',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-default focus-visible:ring-offset-2',
        'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  )
}

export function PopoverPortal(props: PopoverPortalProps) {
  return <HeadlessPopoverPortal {...props} />
}

export function PopoverContent({ className, ...props }: PopoverContentProps) {
  return (
    <HeadlessPopoverContent
      className={cn(
        'z-50 w-72 rounded-md border border-border-default bg-surface-panel p-4 text-sm text-content-default shadow-panel',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-default focus-visible:ring-offset-2',
        className,
      )}
      {...props}
    />
  )
}

export function PopoverClose({ className, ...props }: PopoverCloseProps) {
  return (
    <HeadlessPopoverClose
      className={cn(
        'inline-flex h-8 items-center justify-center rounded-md px-3 text-sm font-medium text-content-muted transition-colors',
        'hover:bg-surface-muted hover:text-content-strong',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-default focus-visible:ring-offset-2',
        'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  )
}
