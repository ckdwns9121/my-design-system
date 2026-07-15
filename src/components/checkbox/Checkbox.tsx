import { type ReactNode } from 'react'
import {
  Checkbox as HeadlessCheckbox,
  type CheckboxProps as HeadlessCheckboxProps,
} from '../../headless/primitives/checkbox'
import { cn } from '../../lib/cn'

export type CheckboxProps = HeadlessCheckboxProps & {
  label?: ReactNode
}

export function Checkbox({ className, disabled, label, ...props }: CheckboxProps) {
  const checkbox = (
    <HeadlessCheckbox
      className={cn(
        'size-4 shrink-0 cursor-pointer rounded border border-border-default accent-primary-solid',
        'bg-surface-panel text-primary-text-strong transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-default focus-visible:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'data-[state=indeterminate]:accent-primary-solid',
        className,
      )}
      disabled={disabled}
      {...props}
    />
  )

  if (!label) {
    return checkbox
  }

  return (
    <label
      className={cn(
        'inline-flex cursor-pointer items-center gap-2 text-sm text-content-default',
        disabled && 'cursor-not-allowed opacity-50',
      )}
    >
      {checkbox}
      <span>{label}</span>
    </label>
  )
}
