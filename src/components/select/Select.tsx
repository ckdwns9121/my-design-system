import {
  Content as HeadlessContent,
  Label as HeadlessLabel,
  Option as HeadlessOption,
  Portal as HeadlessPortal,
  Root as HeadlessRoot,
  Separator as HeadlessSeparator,
  Trigger as HeadlessTrigger,
  Value as HeadlessValue,
  type ContentProps,
  type LabelProps,
  type OptionProps,
  type PortalProps,
  type RootProps,
  type SeparatorProps,
  type TriggerProps,
  type ValueProps,
} from '../../headless/primitives/select'
import { cn } from '../../lib/cn'

export type SelectProps = RootProps
export type {
  ContentProps as SelectContentProps,
  LabelProps as SelectLabelProps,
  OptionProps as SelectOptionProps,
  PortalProps as SelectPortalProps,
  RootProps as SelectRootProps,
  SeparatorProps as SelectSeparatorProps,
  TriggerProps as SelectTriggerProps,
  ValueProps as SelectValueProps,
}

export function Select(props: SelectProps) {
  return <HeadlessRoot {...props} />
}

export function SelectTrigger({ className, ...props }: TriggerProps) {
  return (
    <HeadlessTrigger
      className={cn(
        'inline-flex h-10 min-w-48 items-center justify-between gap-3 rounded-md border border-border-default bg-surface-panel px-3 text-sm font-medium text-content-default shadow-sm transition-colors',
        'hover:bg-surface-muted hover:text-content-strong',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-default focus-visible:ring-offset-2',
        'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  )
}

export function SelectValue({ className, ...props }: ValueProps) {
  return <HeadlessValue className={cn('truncate text-left', className)} {...props} />
}

export function SelectPortal(props: PortalProps) {
  return <HeadlessPortal {...props} />
}

export function SelectContent({ className, ...props }: ContentProps) {
  return (
    <HeadlessContent
      className={cn(
        'z-50 max-h-72 overflow-auto rounded-md border border-border-default bg-surface-panel p-1 text-sm text-content-default shadow-panel',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-default',
        className,
      )}
      {...props}
    />
  )
}

export function SelectOption({ className, ...props }: OptionProps) {
  return (
    <HeadlessOption
      className={cn(
        'flex h-9 cursor-pointer items-center rounded px-2 text-sm text-content-default transition-colors',
        'hover:bg-surface-muted hover:text-content-strong',
        'focus:bg-surface-muted focus:text-content-strong focus:outline-none',
        'data-[state=selected]:bg-primary-surface-strong data-[state=selected]:text-primary-text-strong',
        'data-[active]:bg-surface-muted data-[active]:text-content-strong',
        'data-[disabled]:pointer-events-none data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50',
        className,
      )}
      {...props}
    />
  )
}

export function SelectLabel({ className, ...props }: LabelProps) {
  return (
    <HeadlessLabel
      className={cn('px-2 py-1.5 text-xs font-medium text-content-muted', className)}
      {...props}
    />
  )
}

export function SelectSeparator({ className, ...props }: SeparatorProps) {
  return (
    <HeadlessSeparator
      className={cn('-mx-1 my-1 h-px bg-border-muted', className)}
      {...props}
    />
  )
}
