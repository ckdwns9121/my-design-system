import {
  Content as HeadlessContent,
  Item as HeadlessItem,
  Label as HeadlessLabel,
  Portal as HeadlessPortal,
  Root as HeadlessRoot,
  Separator as HeadlessSeparator,
  Trigger as HeadlessTrigger,
  type ContentProps,
  type ItemProps,
  type LabelProps,
  type PortalProps,
  type RootProps,
  type SeparatorProps,
  type TriggerProps,
} from '../../headless/primitives/dropdown-menu'
import { cn } from '../../lib/cn'

export type DropdownMenuProps = RootProps
export type {
  ContentProps as DropdownMenuContentProps,
  ItemProps as DropdownMenuItemProps,
  LabelProps as DropdownMenuLabelProps,
  PortalProps as DropdownMenuPortalProps,
  RootProps as DropdownMenuRootProps,
  SeparatorProps as DropdownMenuSeparatorProps,
  TriggerProps as DropdownMenuTriggerProps,
}

export function DropdownMenu(props: DropdownMenuProps) {
  return <HeadlessRoot {...props} />
}

export function DropdownMenuTrigger({ className, ...props }: TriggerProps) {
  return (
    <HeadlessTrigger
      className={cn(
        'inline-flex h-10 items-center justify-center gap-2 rounded-md border border-border-strong bg-surface-panel px-3 text-sm font-medium text-content-default shadow-sm transition-colors',
        'hover:bg-surface-muted hover:text-content-strong',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-default focus-visible:ring-offset-2',
        'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  )
}

export function DropdownMenuPortal(props: PortalProps) {
  return <HeadlessPortal {...props} />
}

export function DropdownMenuContent({ className, ...props }: ContentProps) {
  return (
    <HeadlessContent
      className={cn(
        'z-50 min-w-40 rounded-md border border-border-default bg-surface-panel p-1 text-sm text-content-default shadow-panel',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-default',
        className,
      )}
      {...props}
    />
  )
}

export function DropdownMenuItem({ className, ...props }: ItemProps) {
  return (
    <HeadlessItem
      className={cn(
        'flex h-9 w-full cursor-pointer items-center rounded px-2 text-left text-sm text-content-default transition-colors',
        'hover:bg-surface-muted hover:text-content-strong',
        'focus:bg-surface-muted focus:text-content-strong focus:outline-none',
        'data-[disabled]:pointer-events-none data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50',
        className,
      )}
      {...props}
    />
  )
}

export function DropdownMenuLabel({ className, ...props }: LabelProps) {
  return (
    <HeadlessLabel
      className={cn('px-2 py-1.5 text-xs font-medium text-content-muted', className)}
      {...props}
    />
  )
}

export function DropdownMenuSeparator({ className, ...props }: SeparatorProps) {
  return (
    <HeadlessSeparator
      className={cn('-mx-1 my-1 h-px bg-border-muted', className)}
      {...props}
    />
  )
}
