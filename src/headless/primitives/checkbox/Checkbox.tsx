import { useEffect, useRef, type InputHTMLAttributes } from 'react'
import { useControllableState } from '../../hooks'

export type CheckboxProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'checked' | 'defaultChecked' | 'type'
> & {
  checked?: boolean
  defaultChecked?: boolean
  indeterminate?: boolean
  onCheckedChange?: (checked: boolean) => void
}

export function Checkbox({
  checked,
  defaultChecked = false,
  disabled,
  indeterminate = false,
  onChange,
  onCheckedChange,
  ...props
}: CheckboxProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [currentChecked, setCurrentChecked] = useControllableState({
    value: checked,
    defaultValue: defaultChecked,
    onChange: onCheckedChange,
  })

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = indeterminate
    }
  }, [currentChecked, indeterminate])

  return (
    <input
      {...props}
      aria-checked={indeterminate ? 'mixed' : currentChecked}
      checked={currentChecked}
      data-disabled={disabled ? '' : undefined}
      data-state={indeterminate ? 'indeterminate' : currentChecked ? 'checked' : 'unchecked'}
      disabled={disabled}
      onChange={(event) => {
        onChange?.(event)

        if (event.defaultPrevented || disabled) {
          return
        }

        setCurrentChecked(event.currentTarget.checked)
      }}
      ref={inputRef}
      type="checkbox"
    />
  )
}
