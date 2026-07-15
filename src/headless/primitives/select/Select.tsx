import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type KeyboardEvent,
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

type FocusIntent = 'selected' | 'first' | 'last'

type SelectOptionRecord = {
  disabled: boolean
  label: string
  value: string
}

type SelectContextValue = {
  activeValue: string | undefined
  baseId: string
  close: (returnFocus?: boolean) => void
  contentRef: RefObject<HTMLDivElement | null>
  focusIntentRef: RefObject<FocusIntent>
  getOptionLabel: (value: string) => string | undefined
  open: boolean
  registerOption: (option: SelectOptionRecord) => () => void
  selectValue: (value: string) => void
  setActiveValue: (value: string | undefined) => void
  setOpen: (open: boolean) => void
  triggerRef: RefObject<HTMLButtonElement | null>
  value: string | undefined
}

const SelectContext = createContext<SelectContextValue | null>(null)

function useSelectContext(componentName: string) {
  const context = useContext(SelectContext)

  if (!context) {
    throw new Error(`${componentName} must be used within SelectRoot`)
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

function getOptions(container: HTMLElement) {
  return Array.from(container.querySelectorAll<HTMLElement>('[role="option"]'))
}

function getEnabledOptions(container: HTMLElement) {
  return getOptions(container).filter(
    (option) => option.getAttribute('aria-disabled') !== 'true',
  )
}

function getOptionValue(option: HTMLElement) {
  return option.dataset.value ?? ''
}

function setActiveOption(
  container: HTMLElement,
  index: number,
  setActiveValue: (value: string | undefined) => void,
) {
  const options = getEnabledOptions(container)

  if (options.length === 0) {
    setActiveValue(undefined)
    return
  }

  const option = options[(index + options.length) % options.length]
  setActiveValue(getOptionValue(option))
}

function getPrintableKey(event: KeyboardEvent<HTMLElement>) {
  if (event.key.length !== 1 || event.ctrlKey || event.metaKey || event.altKey) {
    return ''
  }

  return event.key.toLocaleLowerCase()
}

function findOptionByText(container: HTMLElement, query: string) {
  return getEnabledOptions(container).find((option) =>
    (option.textContent ?? '').trim().toLocaleLowerCase().startsWith(query),
  )
}

export type SelectRootProps = {
  children: ReactNode
  defaultOpen?: boolean
  defaultValue?: string
  id?: string
  onOpenChange?: (open: boolean) => void
  onValueChange?: (value: string) => void
  open?: boolean
  value?: string
}

export type SelectTriggerProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'aria-activedescendant' | 'aria-controls' | 'aria-expanded' | 'aria-haspopup' | 'id' | 'role'
>

export type SelectValueProps = HTMLAttributes<HTMLSpanElement> & {
  placeholder?: ReactNode
}

export type SelectPortalProps = {
  children: ReactNode
  container?: HTMLElement | null
  disabled?: boolean
}

export type SelectContentProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  'aria-labelledby' | 'hidden' | 'id' | 'role'
> & {
  align?: OverlayAlign
  collisionPadding?: number
  side?: OverlaySide
  sideOffset?: number
}

export type SelectOptionProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  'id' | 'role' | 'tabIndex'
> & {
  disabled?: boolean
  value: string
}

export type SelectLabelProps = HTMLAttributes<HTMLDivElement>
export type SelectSeparatorProps = Omit<HTMLAttributes<HTMLDivElement>, 'role'>

export function SelectRoot({
  children,
  defaultOpen = false,
  defaultValue,
  id,
  onOpenChange,
  onValueChange,
  open,
  value,
}: SelectRootProps) {
  const generatedId = useId()
  const [currentValue, setCurrentValue] = useControllableState<string | undefined>({
    value,
    defaultValue,
    onChange: (nextValue) => {
      if (nextValue !== undefined) {
        onValueChange?.(nextValue)
      }
    },
  })
  const [currentOpen, setCurrentOpen] = useControllableState({
    value: open,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  })
  const [activeValue, setActiveValue] = useState(currentValue)
  const optionRegistryRef = useRef(new Map<string, SelectOptionRecord>())
  const [, forceRegistryUpdate] = useState(0)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const focusIntentRef = useRef<FocusIntent>('selected')
  const returnFocusOnCloseRef = useRef(false)
  const baseId = id ?? generatedId

  useEffect(() => {
    setActiveValue(currentValue)
  }, [currentValue])

  const close = useCallback(
    (returnFocus = true) => {
      returnFocusOnCloseRef.current = returnFocus
      setCurrentOpen(false)
    },
    [setCurrentOpen],
  )

  useEffect(() => {
    if (currentOpen || !returnFocusOnCloseRef.current) {
      return
    }

    returnFocusOnCloseRef.current = false
    triggerRef.current?.focus({ preventScroll: true })
  }, [currentOpen])

  const registerOption = useCallback((option: SelectOptionRecord) => {
    optionRegistryRef.current.set(option.value, option)
    forceRegistryUpdate((version) => version + 1)

    return () => {
      if (optionRegistryRef.current.get(option.value) === option) {
        optionRegistryRef.current.delete(option.value)
        forceRegistryUpdate((version) => version + 1)
      }
    }
  }, [])

  const getOptionLabel = useCallback((optionValue: string) => {
    return optionRegistryRef.current.get(optionValue)?.label
  }, [])

  const selectValue = useCallback(
    (nextValue: string) => {
      setCurrentValue(nextValue)
      setActiveValue(nextValue)
      close(true)
    },
    [close, setCurrentValue],
  )

  const context: SelectContextValue = {
    activeValue,
    baseId,
    close,
    contentRef,
    focusIntentRef,
    getOptionLabel,
    open: currentOpen,
    registerOption,
    selectValue,
    setActiveValue,
    setOpen: setCurrentOpen,
    triggerRef,
    value: currentValue,
  }

  return <SelectContext.Provider value={context}>{children}</SelectContext.Provider>
}

export function SelectTrigger({
  disabled,
  onClick,
  onKeyDown,
  type = 'button',
  ...props
}: SelectTriggerProps) {
  const context = useSelectContext('SelectTrigger')
  const searchRef = useRef('')
  const searchTimerRef = useRef<number | null>(null)
  const triggerId = `${context.baseId}-trigger`
  const contentId = `${context.baseId}-content`
  const activeOptionId = context.activeValue !== undefined
    ? getOptionId(context.baseId, context.activeValue)
    : undefined

  useEffect(() => {
    if (context.open) {
      return
    }

    searchRef.current = ''
    if (searchTimerRef.current) {
      window.clearTimeout(searchTimerRef.current)
      searchTimerRef.current = null
    }
  }, [context.open])

  return (
    <button
      {...props}
      aria-activedescendant={context.open ? activeOptionId : undefined}
      aria-autocomplete="none"
      aria-controls={contentId}
      aria-expanded={context.open}
      aria-haspopup="listbox"
      data-state={context.open ? 'open' : 'closed'}
      disabled={disabled}
      id={triggerId}
      onClick={(event) => {
        onClick?.(event)

        if (event.defaultPrevented || disabled) {
          return
        }

        if (context.open) {
          context.close(false)
        } else {
          context.focusIntentRef.current = 'selected'
          context.setOpen(true)
        }
      }}
      onKeyDown={(event) => {
        onKeyDown?.(event)

        if (event.defaultPrevented || disabled) {
          return
        }

        if (!context.open && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
          event.preventDefault()
          context.focusIntentRef.current = event.key === 'ArrowUp' ? 'last' : 'first'
          context.setOpen(true)
          return
        }

        if (!context.open) {
          return
        }

        if (event.key === 'Tab') {
          context.close(false)
          return
        }

        if (event.key === 'Escape') {
          event.preventDefault()
          context.close(true)
          return
        }

        const content = context.contentRef.current

        if (!content) {
          return
        }

        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          const activeOption = getEnabledOptions(content).find(
            (option) => getOptionValue(option) === context.activeValue,
          )

          if (activeOption) {
            context.selectValue(getOptionValue(activeOption))
          }
          return
        }

        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
          event.preventDefault()
          const options = getEnabledOptions(content)
          const currentIndex = options.findIndex(
            (option) => getOptionValue(option) === context.activeValue,
          )
          setActiveOption(
            content,
            currentIndex + (event.key === 'ArrowDown' ? 1 : -1),
            context.setActiveValue,
          )
          return
        }

        if (event.key === 'Home' || event.key === 'End') {
          event.preventDefault()
          const options = getEnabledOptions(content)
          setActiveOption(
            content,
            event.key === 'Home' ? 0 : options.length - 1,
            context.setActiveValue,
          )
          return
        }

        const printableKey = getPrintableKey(event)

        if (printableKey) {
          event.preventDefault()

          if (searchTimerRef.current) {
            window.clearTimeout(searchTimerRef.current)
          }

          searchRef.current += printableKey
          searchTimerRef.current = window.setTimeout(() => {
            searchRef.current = ''
          }, 700)

          const nextOption = findOptionByText(content, searchRef.current)
          if (nextOption) {
            context.setActiveValue(getOptionValue(nextOption))
          }
        }
      }}
      ref={context.triggerRef}
      role="combobox"
      type={type}
    />
  )
}

export function SelectValue({ placeholder, ...props }: SelectValueProps) {
  const context = useSelectContext('SelectValue')
  const label =
    context.value !== undefined ? context.getOptionLabel(context.value) : undefined

  return <span {...props}>{label ?? placeholder}</span>
}

export function SelectPortal({ children, container, disabled }: SelectPortalProps) {
  return (
    <OverlayPortal container={container} disabled={disabled}>
      {children}
    </OverlayPortal>
  )
}

export function SelectContent({
  align = 'start',
  collisionPadding = 8,
  onKeyDown,
  side = 'bottom',
  sideOffset = 6,
  style,
  tabIndex = -1,
  ...props
}: SelectContentProps) {
  const context = useSelectContext('SelectContent')
  const positionStyle = useAnchoredPosition({
    open: context.open,
    triggerRef: context.triggerRef,
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
    triggerRef: context.triggerRef,
    onDismiss: () => context.close(true),
    modal: false,
    initialFocus: false,
    returnFocus: false,
  })

  useEffect(() => {
    if (!context.open || !context.contentRef.current) {
      return
    }

    const content = context.contentRef.current
    const frame = requestAnimationFrame(() => {
      const options = getEnabledOptions(content)
      const selectedIndex = options.findIndex(
        (option) => getOptionValue(option) === context.value,
      )

      if (context.focusIntentRef.current === 'last') {
        setActiveOption(content, options.length - 1, context.setActiveValue)
      } else if (context.focusIntentRef.current === 'first' || selectedIndex < 0) {
        setActiveOption(content, 0, context.setActiveValue)
      } else {
        setActiveOption(content, selectedIndex, context.setActiveValue)
      }
    })

    return () => {
      cancelAnimationFrame(frame)
    }
  }, [
    context.contentRef,
    context.focusIntentRef,
    context.open,
    context.setActiveValue,
    context.value,
  ])

  return (
    <div
      {...props}
      aria-labelledby={`${context.baseId}-trigger`}
      data-state={context.open ? 'open' : 'closed'}
      hidden={!context.open}
      id={`${context.baseId}-content`}
      onKeyDown={onKeyDown}
      ref={context.contentRef}
      role="listbox"
      style={{
        ...positionStyle,
        display: context.open ? positionStyle.display : 'none',
        ...style,
      }}
      tabIndex={tabIndex}
    />
  )
}

export function SelectOption({
  children,
  disabled = false,
  onClick,
  onFocus,
  onKeyDown,
  value,
  ...props
}: SelectOptionProps) {
  const context = useSelectContext('SelectOption')
  const selected = context.value === value
  const active = context.activeValue === value
  const optionRef = useRef<HTMLDivElement>(null)
  const registerOption = context.registerOption

  useEffect(() => {
    const label = (optionRef.current?.textContent ?? '').trim()
    return registerOption({ disabled, label, value })
  }, [children, disabled, registerOption, value])

  return (
    <div
      {...props}
      aria-disabled={disabled || undefined}
      aria-selected={selected}
      data-disabled={disabled ? '' : undefined}
      data-state={selected ? 'selected' : 'unselected'}
      data-active={active ? '' : undefined}
      data-value={value}
      id={getOptionId(context.baseId, value)}
      onClick={(event) => {
        onClick?.(event)

        if (event.defaultPrevented || disabled) {
          return
        }

        context.selectValue(value)
      }}
      onFocus={(event) => {
        onFocus?.(event)

        if (event.defaultPrevented) {
          return
        }

        if (!disabled) {
          context.setActiveValue(value)
        }
      }}
      onKeyDown={(event) => {
        onKeyDown?.(event)

        if (
          event.defaultPrevented ||
          disabled ||
          (event.key !== 'Enter' && event.key !== ' ')
        ) {
          return
        }

        event.preventDefault()
        context.selectValue(value)
      }}
      ref={optionRef}
      role="option"
      tabIndex={-1}
    >
      {children}
    </div>
  )
}

export function SelectLabel(props: SelectLabelProps) {
  return <div role="presentation" {...props} />
}

export function SelectSeparator(props: SelectSeparatorProps) {
  return <div aria-orientation="horizontal" role="separator" {...props} />
}
