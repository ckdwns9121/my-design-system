import type { ButtonHTMLAttributes } from 'react'
import { useControllableState } from '../../hooks'

export type ToggleProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'aria-pressed' | 'defaultValue' | 'onChange' | 'value'
> & {
  pressed?: boolean
  defaultPressed?: boolean
  onPressedChange?: (pressed: boolean) => void
}

export function Toggle({
  pressed,
  defaultPressed = false,
  onPressedChange,
  disabled,
  onClick,
  type = 'button',
  ...props
}: ToggleProps) {
  const [currentPressed, setCurrentPressed] = useControllableState({
    value: pressed,
    defaultValue: defaultPressed,
    onChange: onPressedChange,
  })

  return (
    <button
      aria-pressed={currentPressed}
      data-disabled={disabled ? '' : undefined}
      data-state={currentPressed ? 'on' : 'off'}
      disabled={disabled}
      onClick={(event) => {
        onClick?.(event)

        if (event.defaultPrevented || disabled) {
          return
        }

        setCurrentPressed((previousPressed) => !previousPressed)
      }}
      type={type}
      {...props}
    />
  )
}
