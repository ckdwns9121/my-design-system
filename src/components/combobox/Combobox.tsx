import {
  ComboboxContent as HeadlessContent,
  ComboboxEmpty as HeadlessEmpty,
  ComboboxInput as HeadlessInput,
  ComboboxList as HeadlessList,
  ComboboxOption as HeadlessOption,
  ComboboxPortal as HeadlessPortal,
  ComboboxRoot as HeadlessRoot,
  type ComboboxContentProps as HeadlessContentProps,
  type ComboboxEmptyProps as HeadlessEmptyProps,
  type ComboboxInputProps as HeadlessInputProps,
  type ComboboxListProps as HeadlessListProps,
  type ComboboxOptionProps as HeadlessOptionProps,
  type ComboboxPortalProps as HeadlessPortalProps,
  type ComboboxRootProps as HeadlessRootProps,
} from '../../headless'
import { cn } from '../../lib/cn'

export type ComboboxProps = HeadlessRootProps
export type ComboboxInputProps = HeadlessInputProps
export type ComboboxPortalProps = HeadlessPortalProps
export type ComboboxContentProps = HeadlessContentProps
export type ComboboxListProps = HeadlessListProps
export type ComboboxOptionProps = HeadlessOptionProps
export type ComboboxEmptyProps = HeadlessEmptyProps

export function Combobox(props: ComboboxProps) {
  return <HeadlessRoot {...props} />
}

export function ComboboxInput({ className, ...props }: ComboboxInputProps) {
  return (
    <HeadlessInput
      className={cn(
        'h-10 w-full min-w-56 rounded-md border border-border-strong bg-surface-panel px-3 text-sm text-content-strong outline-none transition',
        'placeholder:text-content-subtle focus:border-primary-solid focus:ring-2 focus:ring-primary-ring/20',
        'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  )
}

export function ComboboxPortal(props: ComboboxPortalProps) {
  return <HeadlessPortal {...props} />
}

export function ComboboxContent({ className, ...props }: ComboboxContentProps) {
  return (
    <HeadlessContent
      className={cn(
        'z-50 max-h-72 overflow-auto rounded-md border border-border-default bg-surface-panel p-1 text-sm text-content-default shadow-panel',
        className,
      )}
      {...props}
    />
  )
}

export function ComboboxList({ className, ...props }: ComboboxListProps) {
  return <HeadlessList className={cn('grid gap-0.5', className)} {...props} />
}

export function ComboboxOption({ className, ...props }: ComboboxOptionProps) {
  return (
    <HeadlessOption
      className={cn(
        'flex h-9 cursor-pointer items-center rounded px-2 text-sm text-content-default transition-colors',
        'data-[state=selected]:bg-primary-surface-strong data-[state=selected]:text-primary-text-strong',
        'data-[active]:bg-surface-muted data-[active]:text-content-strong',
        'data-[disabled]:pointer-events-none data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50',
        className,
      )}
      {...props}
    />
  )
}

export function ComboboxEmpty({ className, ...props }: ComboboxEmptyProps) {
  return (
    <HeadlessEmpty
      className={cn('px-2 py-6 text-center text-sm text-content-muted', className)}
      {...props}
    />
  )
}
