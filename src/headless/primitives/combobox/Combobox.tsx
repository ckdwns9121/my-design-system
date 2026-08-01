import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
  type RefObject,
} from 'react'
import { useControllableState } from '../../hooks'
import {
  Portal as OverlayPortal,
  useAnchoredPosition,
  useDismissableLayer,
  type OverlayAlign,
  type OverlaySide,
} from '../overlay'

type ComboboxContextValue = {
  activeValue: string | undefined
  baseId: string
  close: (returnFocus?: boolean) => void
  contentRef: RefObject<HTMLDivElement | null>
  inputRef: RefObject<HTMLInputElement | null>
  inputValue: string
  open: boolean
  selectValue: (value: string, label: string) => void
  setActiveValue: (value: string | undefined) => void
  setInputValue: (value: string) => void
  setOpen: (open: boolean) => void
  value: string | undefined
}

const ComboboxContext = createContext<ComboboxContextValue | null>(null)

function useComboboxContext(componentName: string) {
  const context = useContext(ComboboxContext)

  if (!context) {
    throw new Error(`${componentName} must be used within ComboboxRoot`)
  }

  return context
}

function getIdPart(value: string) {
  return Array.from(value)
    .map((character) => character.codePointAt(0)?.toString(36) ?? '')
    .join('-')
}

function getOptionId(baseId: string, value: string) {
  return `${baseId}-option-${getIdPart(value)}`
}

function getEnabledOptions(container: HTMLElement) {
  return Array.from(container.querySelectorAll<HTMLElement>('[role="option"]')).filter(
    (option) => option.getAttribute('aria-disabled') !== 'true',
  )
}

function getOptionValue(option: HTMLElement) {
  return option.dataset.value ?? ''
}

function moveActiveOption(
  container: HTMLElement,
  index: number,
  setActiveValue: (value: string | undefined) => void,
) {
  const options = getEnabledOptions(container)

  if (options.length === 0) {
    setActiveValue(undefined)
    return
  }

  setActiveValue(getOptionValue(options[(index + options.length) % options.length]))
}

export type ComboboxRootProps = {
  children: ReactNode
  defaultInputValue?: string
  defaultOpen?: boolean
  defaultValue?: string
  id?: string
  inputValue?: string
  onInputValueChange?: (inputValue: string) => void
  onOpenChange?: (open: boolean) => void
  onValueChange?: (value: string) => void
  open?: boolean
  value?: string
}

export type ComboboxInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'aria-expanded' | 'defaultValue' | 'role' | 'type' | 'value'
>

export type ComboboxPortalProps = {
  children: ReactNode
  container?: HTMLElement | null
  disabled?: boolean
}

export type ComboboxContentProps = Omit<HTMLAttributes<HTMLDivElement>, 'id'> & {
  align?: OverlayAlign
  collisionPadding?: number
  side?: OverlaySide
  sideOffset?: number
}

export type ComboboxListProps = Omit<HTMLAttributes<HTMLDivElement>, 'id' | 'role'>

export type ComboboxOptionProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  'aria-selected' | 'id' | 'role'
> & {
  disabled?: boolean
  /** Text committed to the input when the option is chosen. Defaults to the option text. */
  label?: string
  value: string
}

export type ComboboxEmptyProps = HTMLAttributes<HTMLDivElement>

/**
 * WAI-ARIA combobox with list autocomplete. The input keeps DOM focus and points
 * at the active option through aria-activedescendant; filtering stays with the
 * consumer so the primitive never owns the data.
 */
export function ComboboxRoot({
  children,
  defaultInputValue = '',
  defaultOpen = false,
  defaultValue,
  id,
  inputValue,
  onInputValueChange,
  onOpenChange,
  onValueChange,
  open,
  value,
}: ComboboxRootProps) {
  const generatedId = useId()
  const baseId = id ?? generatedId
  const inputRef = useRef<HTMLInputElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [activeValue, setActiveValue] = useState<string | undefined>(undefined)
  const [currentOpen, setCurrentOpen] = useControllableState({
    value: open,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  })
  const [currentInputValue, setCurrentInputValue] = useControllableState({
    value: inputValue,
    defaultValue: defaultInputValue,
    onChange: onInputValueChange,
  })
  const [currentValue, setCurrentValue] = useControllableState<string | undefined>({
    value,
    defaultValue,
    onChange: onValueChange as ((value: string | undefined) => void) | undefined,
  })

  const close = useCallback(
    (returnFocus = true) => {
      setCurrentOpen(false)

      if (returnFocus) {
        inputRef.current?.focus()
      }
    },
    [setCurrentOpen],
  )

  const selectValue = useCallback(
    (nextValue: string, label: string) => {
      setCurrentValue(nextValue)
      setCurrentInputValue(label)
      setCurrentOpen(false)
      inputRef.current?.focus()
    },
    [setCurrentInputValue, setCurrentOpen, setCurrentValue],
  )

  return (
    <ComboboxContext.Provider
      value={{
        activeValue,
        baseId,
        close,
        contentRef,
        inputRef,
        inputValue: currentInputValue,
        open: currentOpen,
        selectValue,
        setActiveValue,
        setInputValue: setCurrentInputValue,
        setOpen: setCurrentOpen,
        value: currentValue,
      }}
    >
      {children}
    </ComboboxContext.Provider>
  )
}

export function ComboboxInput({
  onChange,
  onClick,
  onKeyDown,
  ...props
}: ComboboxInputProps) {
  const context = useComboboxContext('ComboboxInput')
  const activeOptionId =
    context.activeValue !== undefined ? getOptionId(context.baseId, context.activeValue) : undefined

  return (
    <input
      {...props}
      aria-activedescendant={context.open ? activeOptionId : undefined}
      aria-autocomplete="list"
      aria-controls={`${context.baseId}-listbox`}
      aria-expanded={context.open}
      data-state={context.open ? 'open' : 'closed'}
      id={`${context.baseId}-input`}
      onChange={(event) => {
        onChange?.(event)

        if (event.defaultPrevented) {
          return
        }

        context.setInputValue(event.currentTarget.value)
        context.setOpen(true)
      }}
      onClick={(event) => {
        onClick?.(event)

        if (event.defaultPrevented || context.open) {
          return
        }

        context.setOpen(true)
      }}
      onKeyDown={(event) => {
        onKeyDown?.(event)

        if (event.defaultPrevented) {
          return
        }

        if (!context.open) {
          if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault()
            context.setOpen(true)
          }

          return
        }

        if (event.key === 'Escape') {
          event.preventDefault()
          context.close(false)
          return
        }

        if (event.key === 'Tab') {
          context.close(false)
          return
        }

        const content = context.contentRef.current

        if (!content) {
          return
        }

        if (event.key === 'Enter') {
          const activeOption = getEnabledOptions(content).find(
            (option) => getOptionValue(option) === context.activeValue,
          )

          if (!activeOption) {
            return
          }

          event.preventDefault()
          context.selectValue(
            getOptionValue(activeOption),
            activeOption.dataset.label ?? (activeOption.textContent ?? '').trim(),
          )
          return
        }

        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
          event.preventDefault()
          const options = getEnabledOptions(content)
          const currentIndex = options.findIndex(
            (option) => getOptionValue(option) === context.activeValue,
          )
          moveActiveOption(
            content,
            currentIndex + (event.key === 'ArrowDown' ? 1 : -1),
            context.setActiveValue,
          )
          return
        }

        if (event.key === 'Home' || event.key === 'End') {
          event.preventDefault()
          const options = getEnabledOptions(content)
          moveActiveOption(
            content,
            event.key === 'Home' ? 0 : options.length - 1,
            context.setActiveValue,
          )
        }
      }}
      ref={context.inputRef}
      role="combobox"
      type="text"
      value={context.inputValue}
    />
  )
}

export function ComboboxPortal({ children, container, disabled }: ComboboxPortalProps) {
  return (
    <OverlayPortal container={container} disabled={disabled}>
      {children}
    </OverlayPortal>
  )
}

export function ComboboxContent({
  align = 'start',
  collisionPadding = 8,
  side = 'bottom',
  sideOffset = 6,
  style,
  ...props
}: ComboboxContentProps) {
  const context = useComboboxContext('ComboboxContent')
  const positionStyle = useAnchoredPosition({
    open: context.open,
    triggerRef: context.inputRef,
    contentRef: context.contentRef,
    side,
    align,
    sideOffset,
    collisionPadding,
    matchTriggerWidth: true,
  })

  useDismissableLayer({
    open: context.open,
    contentRef: context.contentRef,
    triggerRef: context.inputRef,
    onDismiss: () => context.close(false),
    modal: false,
    initialFocus: false,
    returnFocus: false,
  })

  // Options are filtered by the consumer, so the active option is re-seeded to
  // the top of the list whenever the visible set changes.
  useEffect(() => {
    if (!context.open || !context.contentRef.current) {
      return
    }

    const content = context.contentRef.current
    const frame = requestAnimationFrame(() => {
      const options = getEnabledOptions(content)
      const activeStillVisible = options.some(
        (option) => getOptionValue(option) === context.activeValue,
      )

      if (!activeStillVisible) {
        moveActiveOption(content, 0, context.setActiveValue)
      }
    })

    return () => {
      cancelAnimationFrame(frame)
    }
  }, [
    context.activeValue,
    context.contentRef,
    context.inputValue,
    context.open,
    context.setActiveValue,
  ])

  return (
    <div
      {...props}
      data-state={context.open ? 'open' : 'closed'}
      hidden={!context.open}
      id={`${context.baseId}-content`}
      ref={context.contentRef}
      style={{
        ...positionStyle,
        display: context.open ? positionStyle.display : 'none',
        ...style,
      }}
    />
  )
}

/**
 * The listbox itself. It is separate from the popup container so an empty result
 * message can sit beside it instead of inside a listbox with no options, which
 * would break the aria-required-children contract.
 */
export function ComboboxList(props: ComboboxListProps) {
  const context = useComboboxContext('ComboboxList')

  return <div {...props} id={`${context.baseId}-listbox`} role="listbox" />
}

export function ComboboxOption({
  children,
  disabled = false,
  label,
  onClick,
  onMouseMove,
  value,
  ...props
}: ComboboxOptionProps) {
  const context = useComboboxContext('ComboboxOption')
  const selected = context.value === value
  const active = context.activeValue === value
  const optionRef = useRef<HTMLDivElement>(null)

  return (
    <div
      {...props}
      aria-disabled={disabled || undefined}
      aria-selected={selected}
      data-active={active ? '' : undefined}
      data-disabled={disabled ? '' : undefined}
      data-label={label}
      data-state={selected ? 'selected' : 'unselected'}
      data-value={value}
      id={getOptionId(context.baseId, value)}
      onClick={(event) => {
        onClick?.(event)

        if (event.defaultPrevented || disabled) {
          return
        }

        context.selectValue(value, label ?? (optionRef.current?.textContent ?? '').trim())
      }}
      onMouseMove={(event) => {
        onMouseMove?.(event)

        if (event.defaultPrevented || disabled || active) {
          return
        }

        context.setActiveValue(value)
      }}
      ref={optionRef}
      role="option"
      tabIndex={-1}
    >
      {children}
    </div>
  )
}

export function ComboboxEmpty(props: ComboboxEmptyProps) {
  return <div role="presentation" {...props} />
}
