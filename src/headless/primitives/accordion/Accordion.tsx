import {
  createContext,
  createElement,
  useContext,
  useId,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react'
import { useControllableState } from '../../hooks'

type AccordionValue = string | string[]
type AccordionType = 'single' | 'multiple'

type AccordionContextValue = {
  collapsible: boolean
  disabled: boolean
  isItemOpen: (value: string) => boolean
  toggleItem: (value: string) => void
}

type AccordionItemContextValue = {
  contentId: string
  disabled: boolean
  open: boolean
  triggerId: string
  value: string
}

const AccordionContext = createContext<AccordionContextValue | null>(null)
const AccordionItemContext = createContext<AccordionItemContextValue | null>(null)

function useAccordionContext(componentName: string) {
  const context = useContext(AccordionContext)

  if (!context) {
    throw new Error(`${componentName} must be used within AccordionRoot`)
  }

  return context
}

function useAccordionItemContext(componentName: string) {
  const context = useContext(AccordionItemContext)

  if (!context) {
    throw new Error(`${componentName} must be used within AccordionItem`)
  }

  return context
}

function normalizeValue(value: AccordionValue, type: AccordionType) {
  if (type === 'multiple') {
    return Array.isArray(value) ? value : value ? [value] : []
  }

  return Array.isArray(value) ? (value[0] ?? '') : value
}

function getNextValue(
  currentValue: AccordionValue,
  itemValue: string,
  type: AccordionType,
  collapsible: boolean,
) {
  if (type === 'multiple') {
    const values = normalizeValue(currentValue, type) as string[]
    const itemOpen = values.includes(itemValue)

    if (itemOpen) {
      return values.filter((value) => value !== itemValue)
    }

    return [...values, itemValue]
  }

  const value = normalizeValue(currentValue, type) as string
  const itemOpen = value === itemValue

  if (itemOpen) {
    return collapsible ? '' : value
  }

  return itemValue
}

function isHeaderNavigationKey(key: string) {
  return key === 'ArrowDown' || key === 'ArrowUp' || key === 'Home' || key === 'End'
}

function moveHeaderFocus(event: KeyboardEvent<HTMLDivElement>) {
  if (!isHeaderNavigationKey(event.key)) {
    return false
  }

  const target = event.target

  if (!(target instanceof HTMLButtonElement) || target.disabled) {
    return false
  }

  const root = event.currentTarget
  const triggers = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-accordion-trigger]'))
    .filter((trigger) => !trigger.disabled && trigger.getAttribute('aria-disabled') !== 'true')
  const currentIndex = triggers.indexOf(target)

  if (currentIndex < 0 || triggers.length === 0) {
    return false
  }

  let nextIndex = currentIndex

  if (event.key === 'ArrowDown') {
    nextIndex = (currentIndex + 1) % triggers.length
  } else if (event.key === 'ArrowUp') {
    nextIndex = (currentIndex - 1 + triggers.length) % triggers.length
  } else if (event.key === 'Home') {
    nextIndex = 0
  } else if (event.key === 'End') {
    nextIndex = triggers.length - 1
  }

  triggers[nextIndex]?.focus()
  return true
}

export type AccordionRootProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  'defaultValue' | 'onChange'
> & {
  collapsible?: boolean
  defaultValue?: AccordionValue
  disabled?: boolean
  onValueChange?: (value: AccordionValue) => void
  type?: AccordionType
  value?: AccordionValue
}

export type AccordionItemProps = HTMLAttributes<HTMLDivElement> & {
  disabled?: boolean
  value: string
}

export type AccordionHeaderProps = HTMLAttributes<HTMLHeadingElement> & {
  level?: 1 | 2 | 3 | 4 | 5 | 6
}

export type AccordionTriggerProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'aria-controls' | 'aria-expanded'
>

export type AccordionContentProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  'aria-labelledby' | 'hidden' | 'id' | 'role'
>

export function AccordionRoot({
  children,
  collapsible = false,
  defaultValue,
  disabled = false,
  onKeyDown,
  onValueChange,
  type = 'single',
  value,
  ...props
}: AccordionRootProps) {
  const [currentValue, setCurrentValue] = useControllableState<AccordionValue>({
    value: value === undefined ? undefined : normalizeValue(value, type),
    defaultValue: normalizeValue(defaultValue ?? (type === 'multiple' ? [] : ''), type),
    onChange: onValueChange,
  })

  const normalizedValue = normalizeValue(currentValue, type)
  const context: AccordionContextValue = {
    collapsible,
    disabled,
    isItemOpen(itemValue) {
      return type === 'multiple'
        ? (normalizedValue as string[]).includes(itemValue)
        : normalizedValue === itemValue
    },
    toggleItem(itemValue) {
      setCurrentValue((previousValue) => getNextValue(previousValue, itemValue, type, collapsible))
    },
  }

  return (
    <AccordionContext.Provider value={context}>
      <div
        {...props}
        data-disabled={disabled ? '' : undefined}
        data-orientation="vertical"
        onKeyDown={(event) => {
          onKeyDown?.(event)

          if (event.defaultPrevented || disabled) {
            return
          }

          if (moveHeaderFocus(event)) {
            event.preventDefault()
          }
        }}
      >
        {children}
      </div>
    </AccordionContext.Provider>
  )
}

export function AccordionItem({
  children,
  disabled = false,
  id,
  value,
  ...props
}: AccordionItemProps) {
  const accordion = useAccordionContext('AccordionItem')
  const generatedId = useId()
  const itemId = id ?? generatedId
  const itemDisabled = accordion.disabled || disabled
  const open = accordion.isItemOpen(value)
  const triggerId = `${itemId}-trigger`
  const contentId = `${itemId}-content`

  return (
    <AccordionItemContext.Provider
      value={{
        contentId,
        disabled: itemDisabled,
        open,
        triggerId,
        value,
      }}
    >
      <div
        {...props}
        data-disabled={itemDisabled ? '' : undefined}
        data-state={open ? 'open' : 'closed'}
        id={itemId}
      >
        {children}
      </div>
    </AccordionItemContext.Provider>
  )
}

export function AccordionHeader({
  children,
  level = 3,
  ...props
}: AccordionHeaderProps) {
  useAccordionItemContext('AccordionHeader')

  return createElement(`h${level}`, props, children) as ReactNode
}

export function AccordionTrigger({
  disabled,
  onClick,
  type = 'button',
  ...props
}: AccordionTriggerProps) {
  const accordion = useAccordionContext('AccordionTrigger')
  const item = useAccordionItemContext('AccordionTrigger')
  const triggerDisabled = item.disabled || disabled
  const lockedOpen = item.open && !accordion.collapsible

  return (
    <button
      {...props}
      aria-controls={item.contentId}
      aria-disabled={lockedOpen ? true : undefined}
      aria-expanded={item.open}
      data-accordion-trigger=""
      data-disabled={triggerDisabled ? '' : undefined}
      data-state={item.open ? 'open' : 'closed'}
      disabled={triggerDisabled}
      id={item.triggerId}
      onClick={(event) => {
        onClick?.(event)

        if (event.defaultPrevented || triggerDisabled || lockedOpen) {
          return
        }

        accordion.toggleItem(item.value)
      }}
      type={type}
    />
  )
}

export function AccordionContent({ children, ...props }: AccordionContentProps) {
  const item = useAccordionItemContext('AccordionContent')

  return (
    <div
      {...props}
      aria-labelledby={item.triggerId}
      data-disabled={item.disabled ? '' : undefined}
      data-state={item.open ? 'open' : 'closed'}
      hidden={!item.open}
      id={item.contentId}
      role="region"
    >
      {children}
    </div>
  )
}
