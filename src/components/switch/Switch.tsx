import { useId } from 'react'
import { Switch as HeadlessSwitch, type SwitchProps as HeadlessSwitchProps } from '../../headless'
import { cn } from '../../lib/cn'

type SwitchSize = 'sm' | 'md'

export type SwitchProps = HeadlessSwitchProps & {
  /** Visible label rendered next to the control. */
  label?: string
  description?: string
  size?: SwitchSize
}

const trackClasses: Record<SwitchSize, string> = {
  sm: 'h-5 w-9',
  md: 'h-6 w-11',
}

const thumbClasses: Record<SwitchSize, string> = {
  sm: 'size-4 group-data-[state=checked]:translate-x-4',
  md: 'size-5 group-data-[state=checked]:translate-x-5',
}

export function Switch({
  className,
  description,
  id,
  label,
  size = 'md',
  ...props
}: SwitchProps) {
  const generatedId = useId()
  const switchId = id ?? generatedId
  const labelId = `${switchId}-label`
  const descriptionId = `${switchId}-description`

  const control = (
    // A button cannot be the target of <label for>, so the visible text is wired
    // up with aria-labelledby instead.
    <HeadlessSwitch
      aria-describedby={description ? descriptionId : undefined}
      aria-labelledby={label ? labelId : undefined}
      className={cn(
        'group inline-flex shrink-0 items-center rounded-full border border-transparent p-0.5 transition-colors',
        'bg-border-default data-[state=checked]:bg-primary-solid',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-default focus-visible:ring-offset-2',
        'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
        trackClasses[size],
        className,
      )}
      id={switchId}
      {...props}
    >
      <span
        aria-hidden="true"
        className={cn(
          'pointer-events-none inline-block rounded-full bg-surface-panel shadow-sm transition-transform',
          thumbClasses[size],
        )}
      />
    </HeadlessSwitch>
  )

  if (!label) {
    return control
  }

  return (
    <div className="flex items-start gap-3">
      {control}
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
    </div>
  )
}
