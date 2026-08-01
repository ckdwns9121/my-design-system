import { useId } from 'react'
import {
  RadioGroupItem as HeadlessRadioGroupItem,
  RadioGroupRoot as HeadlessRadioGroupRoot,
  type RadioGroupItemProps as HeadlessRadioGroupItemProps,
  type RadioGroupRootProps as HeadlessRadioGroupRootProps,
} from '../../headless'
import { cn } from '../../lib/cn'

export type RadioGroupProps = HeadlessRadioGroupRootProps & {
  /** Accessible name for the group. Rendered above the options. */
  label?: string
  description?: string
}

export type RadioGroupItemProps = HeadlessRadioGroupItemProps & {
  label: string
  description?: string
}

export function RadioGroup({
  children,
  className,
  description,
  id,
  label,
  orientation = 'vertical',
  ...props
}: RadioGroupProps) {
  const generatedId = useId()
  const groupId = id ?? generatedId
  const labelId = `${groupId}-label`
  const descriptionId = `${groupId}-description`

  return (
    <div className="grid gap-2">
      {label ? (
        <div className="grid gap-0.5">
          <span className="text-sm font-medium text-content-strong" id={labelId}>
            {label}
          </span>
          {description ? (
            <p className="text-xs leading-5 text-content-muted" id={descriptionId}>
              {description}
            </p>
          ) : null}
        </div>
      ) : null}

      <HeadlessRadioGroupRoot
        aria-describedby={description ? descriptionId : undefined}
        aria-labelledby={label ? labelId : undefined}
        className={cn(
          'flex gap-3',
          orientation === 'vertical' ? 'flex-col' : 'flex-row flex-wrap items-center',
          className,
        )}
        id={groupId}
        orientation={orientation}
        {...props}
      >
        {children}
      </HeadlessRadioGroupRoot>
    </div>
  )
}

export function RadioGroupItem({
  className,
  description,
  id,
  label,
  ...props
}: RadioGroupItemProps) {
  const generatedId = useId()
  const itemId = id ?? generatedId
  const labelId = `${itemId}-label`
  const descriptionId = `${itemId}-description`

  return (
    <div className="flex items-start gap-2">
      <HeadlessRadioGroupItem
        aria-describedby={description ? descriptionId : undefined}
        aria-labelledby={labelId}
        className={cn(
          'group mt-0.5 grid size-4 shrink-0 place-items-center rounded-full border transition-colors',
          'border-border-strong bg-surface-panel',
          'data-[state=checked]:border-primary-solid data-[state=checked]:bg-primary-solid',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-default focus-visible:ring-offset-2',
          'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        id={itemId}
        {...props}
      >
        <span
          aria-hidden="true"
          className="size-1.5 rounded-full bg-primary-on-solid opacity-0 transition-opacity group-data-[state=checked]:opacity-100"
        />
      </HeadlessRadioGroupItem>
      <div className="grid gap-0.5">
        <span className="text-sm text-content-strong" id={labelId}>
          {label}
        </span>
        {description ? (
          <p className="text-xs leading-5 text-content-muted" id={descriptionId}>
            {description}
          </p>
        ) : null}
      </div>
    </div>
  )
}
