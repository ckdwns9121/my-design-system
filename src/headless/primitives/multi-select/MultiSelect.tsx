import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
} from 'react'
import { useControllableState } from '../../hooks'
import { MultiSelectContext, useMultiSelectContext, type MultiSelectOptionRecord } from './context'
import {
  Portal as OverlayPortal,
  useAnchoredPosition,
  useDismissableLayer,
  type OverlayAlign,
  type OverlaySide,
} from '../overlay'

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

export type MultiSelectRootProps = {
  children: ReactNode
  defaultOpen?: boolean
  defaultValues?: string[]
  id?: string
  onOpenChange?: (open: boolean) => void
  onValuesChange?: (values: string[]) => void
  open?: boolean
  values?: string[]
}

export type MultiSelectTriggerProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'aria-expanded' | 'aria-haspopup' | 'role' | 'value'
>

export type MultiSelectPortalProps = {
  children: ReactNode
  container?: HTMLElement | null
  disabled?: boolean
}

export type MultiSelectContentProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  'role' | 'id'
> & {
  align?: OverlayAlign
  collisionPadding?: number
  side?: OverlaySide
  sideOffset?: number
}

export type MultiSelectOptionProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  'aria-selected' | 'role' | 'id'
> & {
  disabled?: boolean
  value: string
}

/**
 * Multi-select listbox. Selection is a set, so activating an option toggles it
 * and leaves the list open; only Escape, Tab, or an outside click close it.
 */
export function MultiSelectRoot({
  children,
  defaultOpen = false,
  defaultValues = [],
  id,
  onOpenChange,
  onValuesChange,
  open,
  values,
}: MultiSelectRootProps) {
  const generatedId = useId()
  const baseId = id ?? generatedId
  const triggerRef = useRef<HTMLButtonElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const optionsRef = useRef(new Map<string, MultiSelectOptionRecord>())
  const [activeValue, setActiveValue] = useState<string | undefined>(undefined)
  const [currentOpen, setCurrentOpen] = useControllableState({
    value: open,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  })
  const [currentValues, setCurrentValues] = useControllableState<string[]>({
    value: values,
    defaultValue: defaultValues,
    onChange: onValuesChange,
  })

  const registerOption = useCallback((option: MultiSelectOptionRecord) => {
    optionsRef.current.set(option.value, option)

    return () => {
      optionsRef.current.delete(option.value)
    }
  }, [])

  const getOptionLabel = useCallback(
    (value: string) => optionsRef.current.get(value)?.label,
    [],
  )

  const close = useCallback(
    (returnFocus = true) => {
      setCurrentOpen(false)

      if (returnFocus) {
        triggerRef.current?.focus()
      }
    },
    [setCurrentOpen],
  )

  const toggleValue = useCallback(
    (value: string) => {
      setCurrentValues((previousValues) =>
        previousValues.includes(value)
          ? previousValues.filter((item) => item !== value)
          : [...previousValues, value],
      )
    },
    [setCurrentValues],
  )

  return (
    <MultiSelectContext.Provider
      value={{
        activeValue,
        baseId,
        close,
        contentRef,
        getOptionLabel,
        open: currentOpen,
        registerOption,
        setActiveValue,
        setOpen: setCurrentOpen,
        toggleValue,
        triggerRef,
        values: currentValues,
      }}
    >
      {children}
    </MultiSelectContext.Provider>
  )
}

export function MultiSelectTrigger({
  disabled,
  onClick,
  onKeyDown,
  type = 'button',
  ...props
}: MultiSelectTriggerProps) {
  const context = useMultiSelectContext('MultiSelectTrigger')
  const activeOptionId =
    context.activeValue !== undefined ? getOptionId(context.baseId, context.activeValue) : undefined

  return (
    <button
      {...props}
      aria-activedescendant={context.open ? activeOptionId : undefined}
      aria-controls={`${context.baseId}-content`}
      aria-expanded={context.open}
      aria-haspopup="listbox"
      data-state={context.open ? 'open' : 'closed'}
      disabled={disabled}
      id={`${context.baseId}-trigger`}
      onClick={(event) => {
        onClick?.(event)

        if (event.defaultPrevented || disabled) {
          return
        }

        if (context.open) {
          context.close(false)
        } else {
          context.setOpen(true)
        }
      }}
      onKeyDown={(event) => {
        onKeyDown?.(event)

        if (event.defaultPrevented || disabled) {
          return
        }

        if (!context.open) {
          if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault()
            context.setOpen(true)
          }

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

          if (context.activeValue !== undefined) {
            context.toggleValue(context.activeValue)
          }

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
      ref={context.triggerRef}
      role="combobox"
      type={type}
    />
  )
}

export function MultiSelectPortal({ children, container, disabled }: MultiSelectPortalProps) {
  return (
    <OverlayPortal container={container} disabled={disabled}>
      {children}
    </OverlayPortal>
  )
}

export function MultiSelectContent({
  align = 'start',
  collisionPadding = 8,
  side = 'bottom',
  sideOffset = 6,
  style,
  tabIndex = -1,
  ...props
}: MultiSelectContentProps) {
  const context = useMultiSelectContext('MultiSelectContent')
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
      const selectedIndex = options.findIndex((option) =>
        context.values.includes(getOptionValue(option)),
      )

      moveActiveOption(content, Math.max(selectedIndex, 0), context.setActiveValue)
    })

    return () => {
      cancelAnimationFrame(frame)
    }
  }, [context.contentRef, context.open, context.setActiveValue, context.values])

  return (
    <div
      {...props}
      aria-labelledby={`${context.baseId}-trigger`}
      aria-multiselectable="true"
      data-state={context.open ? 'open' : 'closed'}
      hidden={!context.open}
      id={`${context.baseId}-content`}
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

export function MultiSelectOption({
  children,
  disabled = false,
  onClick,
  onMouseMove,
  value,
  ...props
}: MultiSelectOptionProps) {
  const context = useMultiSelectContext('MultiSelectOption')
  const selected = context.values.includes(value)
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
      data-active={active ? '' : undefined}
      data-disabled={disabled ? '' : undefined}
      data-state={selected ? 'selected' : 'unselected'}
      data-value={value}
      id={getOptionId(context.baseId, value)}
      onClick={(event) => {
        onClick?.(event)

        if (event.defaultPrevented || disabled) {
          return
        }

        context.toggleValue(value)
        context.triggerRef.current?.focus()
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
