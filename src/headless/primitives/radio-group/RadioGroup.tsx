import {
  createContext,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type KeyboardEvent,
} from 'react'
import { useControllableState } from '../../hooks'

export type RadioGroupOrientation = 'horizontal' | 'vertical'

type RadioGroupContextValue = {
  disabled: boolean
  /** Value of the first enabled radio; owns the tab stop when nothing is checked. */
  fallbackValue: string | undefined
  name: string
  orientation: RadioGroupOrientation
  selectValue: (value: string) => void
  value: string | undefined
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null)

function useRadioGroupContext(componentName: string) {
  const context = useContext(RadioGroupContext)

  if (!context) {
    throw new Error(`${componentName} must be used within RadioGroupRoot`)
  }

  return context
}

function getEnabledRadios(group: HTMLElement) {
  return Array.from(group.querySelectorAll<HTMLElement>('[role="radio"]')).filter(
    (radio) => !radio.hasAttribute('disabled') && radio.getAttribute('aria-disabled') !== 'true',
  )
}

function getNextRadio(event: KeyboardEvent<HTMLElement>, orientation: RadioGroupOrientation) {
  const radios = getEnabledRadios(event.currentTarget)
  const currentIndex = radios.findIndex((radio) => radio === event.target)

  if (radios.length === 0 || currentIndex < 0) {
    return null
  }

  const forwardKey = orientation === 'horizontal' ? 'ArrowRight' : 'ArrowDown'
  const backwardKey = orientation === 'horizontal' ? 'ArrowLeft' : 'ArrowUp'

  if (event.key === forwardKey) {
    return radios[(currentIndex + 1) % radios.length]
  }

  if (event.key === backwardKey) {
    return radios[(currentIndex - 1 + radios.length) % radios.length]
  }

  if (event.key === 'Home') {
    return radios[0]
  }

  if (event.key === 'End') {
    return radios[radios.length - 1]
  }

  return null
}

type RadioGroupRootBaseProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  'defaultValue' | 'onChange' | 'role'
> & {
  disabled?: boolean
  /** Shared name so the group reads as one control in forms. */
  name?: string
  onValueChange?: (value: string) => void
  orientation?: RadioGroupOrientation
}

export type RadioGroupRootProps = RadioGroupRootBaseProps & {
  defaultValue?: string
  value?: string
}

export type RadioGroupItemProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'aria-checked' | 'defaultValue' | 'onChange' | 'role' | 'value'
> & {
  value: string
}

/**
 * WAI-ARIA radio group pattern: the group is a single tab stop, arrow keys move
 * focus and selection together with wrapping, and Home/End jump to the ends.
 */
export function RadioGroupRoot({
  children,
  defaultValue,
  disabled = false,
  name,
  onKeyDown,
  onValueChange,
  orientation = 'vertical',
  value,
  ...props
}: RadioGroupRootProps) {
  const generatedName = useId()
  const groupRef = useRef<HTMLDivElement>(null)
  const [fallbackValue, setFallbackValue] = useState<string | undefined>(undefined)
  const [currentValue, setCurrentValue] = useControllableState<string | undefined>({
    value,
    defaultValue,
    onChange: onValueChange as ((value: string | undefined) => void) | undefined,
  })

  // Re-read whenever the rendered radios can change so the tab stop stays on the
  // first enabled radio while the group has no selection.
  useEffect(() => {
    if (!groupRef.current) {
      return
    }

    setFallbackValue(getEnabledRadios(groupRef.current)[0]?.dataset.value)
  }, [children, disabled])

  return (
    <RadioGroupContext.Provider
      value={{
        disabled,
        fallbackValue,
        name: name ?? generatedName,
        orientation,
        selectValue: setCurrentValue,
        value: currentValue,
      }}
    >
      <div
        {...props}
        aria-orientation={orientation}
        data-disabled={disabled ? '' : undefined}
        data-orientation={orientation}
        onKeyDown={(event) => {
          onKeyDown?.(event)

          if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) {
            return
          }

          const nextRadio = getNextRadio(event, orientation)

          if (!nextRadio) {
            return
          }

          event.preventDefault()
          nextRadio.focus()

          const nextValue = nextRadio.dataset.value

          if (nextValue !== undefined) {
            setCurrentValue(nextValue)
          }
        }}
        ref={groupRef}
        role="radiogroup"
      >
        {children}
      </div>
    </RadioGroupContext.Provider>
  )
}

export function RadioGroupItem({
  disabled = false,
  onClick,
  tabIndex,
  type = 'button',
  value,
  ...props
}: RadioGroupItemProps) {
  const context = useRadioGroupContext('RadioGroupItem')
  const isDisabled = disabled || context.disabled
  const checked = context.value === value
  const ownsTabStop =
    context.value === undefined ? context.fallbackValue === value : checked

  return (
    <button
      {...props}
      aria-checked={checked}
      data-disabled={isDisabled ? '' : undefined}
      data-state={checked ? 'checked' : 'unchecked'}
      data-value={value}
      disabled={isDisabled}
      name={context.name}
      onClick={(event) => {
        onClick?.(event)

        if (event.defaultPrevented || isDisabled) {
          return
        }

        context.selectValue(value)
      }}
      role="radio"
      tabIndex={tabIndex ?? (ownsTabStop ? 0 : -1)}
      type={type}
    />
  )
}
