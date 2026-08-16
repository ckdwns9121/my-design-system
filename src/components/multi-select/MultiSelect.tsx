import {
  MultiSelectContent as HeadlessContent,
  MultiSelectOption as HeadlessOption,
  MultiSelectPortal as HeadlessPortal,
  MultiSelectRoot as HeadlessRoot,
  MultiSelectTrigger as HeadlessTrigger,
  useMultiSelectValues,
  type MultiSelectContentProps as HeadlessContentProps,
  type MultiSelectOptionProps as HeadlessOptionProps,
  type MultiSelectPortalProps as HeadlessPortalProps,
  type MultiSelectRootProps as HeadlessRootProps,
  type MultiSelectTriggerProps as HeadlessTriggerProps,
} from '../../headless'
import { cn } from '../../lib/cn'

export type MultiSelectProps = HeadlessRootProps
export type MultiSelectTriggerProps = HeadlessTriggerProps
export type MultiSelectPortalProps = HeadlessPortalProps
export type MultiSelectContentProps = HeadlessContentProps
export type MultiSelectOptionProps = HeadlessOptionProps
export type MultiSelectValueProps = {
  placeholder?: string
  /** Number of selected labels shown before collapsing into a count. */
  maxVisible?: number
}

export function MultiSelect(props: MultiSelectProps) {
  return <HeadlessRoot {...props} />
}

export function MultiSelectTrigger({ className, ...props }: MultiSelectTriggerProps) {
  return (
    <HeadlessTrigger
      className={cn(
        'inline-flex h-10 min-w-56 items-center justify-between gap-3 rounded-md border border-border-strong bg-surface-panel px-3 text-sm font-medium text-content-default shadow-sm transition-colors',
        'hover:bg-surface-muted hover:text-content-strong',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-default focus-visible:ring-offset-2',
        'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  )
}

export function MultiSelectValue({ maxVisible = 2, placeholder }: MultiSelectValueProps) {
  const { getOptionLabel, values } = useMultiSelectValues()

  if (values.length === 0) {
    return <span className="truncate text-left text-content-subtle">{placeholder}</span>
  }

  const labels = values.map((value) => getOptionLabel(value) ?? value)
  const visible = labels.slice(0, maxVisible)
  const hiddenCount = labels.length - visible.length

  return (
    <span className="truncate text-left">
      {visible.join(', ')}
      {hiddenCount > 0 ? ` 외 ${hiddenCount}개` : ''}
    </span>
  )
}

export function MultiSelectPortal(props: MultiSelectPortalProps) {
  return <HeadlessPortal {...props} />
}

export function MultiSelectContent({ className, ...props }: MultiSelectContentProps) {
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

export function MultiSelectOption({ children, className, ...props }: MultiSelectOptionProps) {
  return (
    <HeadlessOption
      className={cn(
        'flex h-9 cursor-pointer items-center gap-2 rounded px-2 text-sm text-content-default transition-colors',
        'data-[state=selected]:bg-primary-surface-strong data-[state=selected]:text-primary-text-strong',
        'data-[active]:bg-surface-muted data-[active]:text-content-strong',
        'data-[disabled]:pointer-events-none data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50',
        'group',
        className,
      )}
      {...props}
    >
      <span
        aria-hidden="true"
        className={cn(
          'grid size-4 shrink-0 place-items-center rounded-sm border border-border-strong text-primary-on-solid',
          'group-data-[state=selected]:border-primary-solid group-data-[state=selected]:bg-primary-solid',
        )}
      >
        <svg
          className="size-3 opacity-0 group-data-[state=selected]:opacity-100"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          viewBox="0 0 24 24"
        >
          <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <span className="truncate">{children}</span>
    </HeadlessOption>
  )
}
