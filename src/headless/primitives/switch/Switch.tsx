import type { ButtonHTMLAttributes } from 'react'
import { useControllableState } from '../../hooks'

export type SwitchProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'aria-checked' | 'defaultValue' | 'onChange' | 'role' | 'value'
> & {
  checked?: boolean
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
}

/**
 * WAI-ARIA switch pattern. A native button already answers Enter and Space, so
 * this primitive only owns the checked state and the ARIA contract.
 */
export function Switch({
  checked,
  defaultChecked = false,
  disabled,
  onCheckedChange,
  onClick,
  type = 'button',
  ...props
}: SwitchProps) {
  const [currentChecked, setCurrentChecked] = useControllableState({
    value: checked,
    defaultValue: defaultChecked,
    onChange: onCheckedChange,
  })

  return (
    <button
      {...props}
      aria-checked={currentChecked}
      data-disabled={disabled ? '' : undefined}
      data-state={currentChecked ? 'checked' : 'unchecked'}
      disabled={disabled}
      onClick={(event) => {
        onClick?.(event)

        if (event.defaultPrevented || disabled) {
          return
        }

        setCurrentChecked((previousChecked) => !previousChecked)
      }}
      role="switch"
      type={type}
    />
  )
}
