import {
  DialogClose as HeadlessDialogClose,
  DialogContent as HeadlessDialogContent,
  DialogDescription as HeadlessDialogDescription,
  DialogOverlay as HeadlessDialogOverlay,
  DialogPortal as HeadlessDialogPortal,
  DialogRoot as HeadlessDialogRoot,
  DialogTitle as HeadlessDialogTitle,
  DialogTrigger as HeadlessDialogTrigger,
  type DialogCloseProps as HeadlessDialogCloseProps,
  type DialogContentProps,
  type DialogDescriptionProps,
  type DialogOverlayProps,
  type DialogPortalProps,
  type DialogRootProps,
  type DialogTitleProps,
  type DialogTriggerProps,
} from '../../headless/primitives/dialog'
import { cn } from '../../lib/cn'

export type {
  DialogContentProps,
  DialogDescriptionProps,
  DialogOverlayProps,
  DialogPortalProps,
  DialogRootProps,
  DialogTitleProps,
  DialogTriggerProps,
}

type DialogCloseVariant = 'primary' | 'secondary'

export type DialogCloseProps = HeadlessDialogCloseProps & {
  variant?: DialogCloseVariant
}

const closeVariantClasses: Record<DialogCloseVariant, string> = {
  primary:
    'border-primary-solid bg-primary-solid text-primary-on-solid hover:bg-primary-solid-hover',
  secondary:
    'border-border-default bg-surface-panel text-content-default hover:bg-surface-muted',
}

export function Dialog(props: DialogRootProps) {
  return <HeadlessDialogRoot {...props} />
}

export function DialogTrigger({ className, ...props }: DialogTriggerProps) {
  return (
    <HeadlessDialogTrigger
      className={cn(
        'inline-flex h-10 items-center justify-center rounded-md bg-primary-solid px-4 text-sm font-medium text-primary-on-solid transition-colors',
        'hover:bg-primary-solid-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-default focus-visible:ring-offset-2',
        'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  )
}

export function DialogPortal(props: DialogPortalProps) {
  return <HeadlessDialogPortal {...props} />
}

export function DialogOverlay({ className, ...props }: DialogOverlayProps) {
  return (
    <HeadlessDialogOverlay
      className={cn(
        'fixed inset-0 z-40 bg-surface-overlay/50',
        className,
      )}
      {...props}
    />
  )
}

export function DialogContent({ className, ...props }: DialogContentProps) {
  return (
    <HeadlessDialogContent
      className={cn(
        'fixed left-1/2 top-1/2 z-50 grid w-[calc(100%_-_2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 gap-4',
        'rounded-md border border-border-default bg-surface-panel p-6 shadow-panel',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-default focus-visible:ring-offset-2',
        className,
      )}
      {...props}
    />
  )
}

export function DialogTitle({ className, ...props }: DialogTitleProps) {
  return (
    <HeadlessDialogTitle
      className={cn('text-lg font-semibold leading-7 text-content-strong', className)}
      {...props}
    />
  )
}

export function DialogDescription({ className, ...props }: DialogDescriptionProps) {
  return (
    <HeadlessDialogDescription
      className={cn('text-sm leading-6 text-content-muted', className)}
      {...props}
    />
  )
}

export function DialogClose({ className, variant = 'secondary', ...props }: DialogCloseProps) {
  return (
    <HeadlessDialogClose
      className={cn(
        'inline-flex h-10 items-center justify-center rounded-md border px-4 text-sm font-medium transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-default focus-visible:ring-offset-2',
        'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
        closeVariantClasses[variant],
        className,
      )}
      {...props}
    />
  )
}
