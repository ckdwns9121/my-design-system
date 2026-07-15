import {
  createContext,
  useEffect,
  useContext,
  useId,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type KeyboardEvent,
} from 'react'
import { useControllableState } from '../../hooks'

export type TabsActivationMode = 'automatic' | 'manual'
export type TabsOrientation = 'horizontal' | 'vertical'

type TabsContextValue = {
  activationMode: TabsActivationMode
  baseId: string
  focusedValue: string
  orientation: TabsOrientation
  setFocusedValue: (value: string) => void
  setValue: (value: string) => void
  value: string
}

const TabsContext = createContext<TabsContextValue | null>(null)

function useTabsContext(componentName: string) {
  const context = useContext(TabsContext)

  if (!context) {
    throw new Error(`${componentName} must be used within TabsRoot`)
  }

  return context
}

function getIdPart(value: string) {
  return Array.from(value)
    .map((character) => character.codePointAt(0)?.toString(36) ?? '')
    .join('-')
}

function getTriggerId(baseId: string, value: string) {
  return `${baseId}-trigger-${getIdPart(value)}`
}

function getContentId(baseId: string, value: string) {
  return `${baseId}-content-${getIdPart(value)}`
}

function getEnabledTabs(list: HTMLElement) {
  return Array.from(list.querySelectorAll<HTMLElement>('[role="tab"]')).filter(
    (tab) =>
      !tab.hasAttribute('disabled') && tab.getAttribute('aria-disabled') !== 'true',
  )
}

function focusTab(
  tab: HTMLElement,
  activationMode: TabsActivationMode,
  setFocusedValue: (value: string) => void,
  setValue: (value: string) => void,
) {
  tab.focus()

  const nextValue = tab.dataset.value

  if (nextValue) {
    setFocusedValue(nextValue)
  }

  if (activationMode === 'automatic') {
    if (nextValue) {
      setValue(nextValue)
    }
  }
}

function moveFocus(event: KeyboardEvent<HTMLElement>, context: TabsContextValue) {
  const list = event.currentTarget
  const tabs = getEnabledTabs(list)
  const currentIndex = tabs.findIndex((tab) => tab === event.target)

  if (currentIndex < 0 || tabs.length === 0) {
    return false
  }

  let nextIndex: number | null = null

  if (
    context.orientation === 'horizontal' &&
    (event.key === 'ArrowLeft' || event.key === 'ArrowRight')
  ) {
    nextIndex =
      event.key === 'ArrowLeft'
        ? (currentIndex - 1 + tabs.length) % tabs.length
        : (currentIndex + 1) % tabs.length
  } else if (
    context.orientation === 'vertical' &&
    (event.key === 'ArrowUp' || event.key === 'ArrowDown')
  ) {
    nextIndex =
      event.key === 'ArrowUp'
        ? (currentIndex - 1 + tabs.length) % tabs.length
        : (currentIndex + 1) % tabs.length
  } else if (event.key === 'Home') {
    nextIndex = 0
  } else if (event.key === 'End') {
    nextIndex = tabs.length - 1
  }

  if (nextIndex === null) {
    return false
  }

  focusTab(
    tabs[nextIndex],
    context.activationMode,
    context.setFocusedValue,
    context.setValue,
  )
  return true
}

type TabsRootBaseProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  'defaultValue' | 'onChange'
> & {
  activationMode?: TabsActivationMode
  onValueChange?: (value: string) => void
  orientation?: TabsOrientation
}

export type TabsRootProps = TabsRootBaseProps &
  (
    | { defaultValue: string; value?: never }
    | { defaultValue?: string; value: string }
  )

export type TabsListProps = HTMLAttributes<HTMLDivElement>

export type TabsTriggerProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'aria-controls' | 'aria-selected' | 'defaultValue' | 'id' | 'onChange' | 'role' | 'value'
> & {
  value: string
}

export type TabsContentProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  'aria-labelledby' | 'id' | 'role'
> & {
  value: string
}

export function TabsRoot({
  activationMode = 'automatic',
  defaultValue,
  id,
  onValueChange,
  orientation = 'horizontal',
  value,
  ...props
}: TabsRootProps) {
  if (value === undefined && defaultValue === undefined) {
    throw new Error('TabsRoot requires either value or defaultValue')
  }

  const generatedId = useId()
  const [currentValue, setCurrentValue] = useControllableState({
    value,
    defaultValue: defaultValue ?? '',
    onChange: onValueChange,
  })
  const [focusedValue, setFocusedValue] = useState(currentValue)
  const baseId = id ?? generatedId

  useEffect(() => {
    setFocusedValue(currentValue)
  }, [currentValue])

  return (
    <TabsContext.Provider
      value={{
        activationMode,
        baseId,
        focusedValue,
        orientation,
        setFocusedValue,
        setValue: setCurrentValue,
        value: currentValue,
      }}
    >
      <div
        data-activation-mode={activationMode}
        data-orientation={orientation}
        id={id}
        {...props}
      />
    </TabsContext.Provider>
  )
}

export function TabsList({ onKeyDown, role, ...props }: TabsListProps) {
  const context = useTabsContext('TabsList')

  return (
    <div
      aria-orientation={context.orientation}
      data-orientation={context.orientation}
      onKeyDown={(event) => {
        onKeyDown?.(event)

        if (event.defaultPrevented || event.altKey) {
          return
        }

        if (moveFocus(event, context)) {
          event.preventDefault()
        }
      }}
      role={role ?? 'tablist'}
      {...props}
    />
  )
}

export function TabsTrigger({
  disabled = false,
  onClick,
  onFocus,
  onKeyDown,
  tabIndex,
  type = 'button',
  value,
  ...props
}: TabsTriggerProps) {
  const context = useTabsContext('TabsTrigger')
  const selected = context.value === value
  const triggerId = getTriggerId(context.baseId, value)
  const contentId = getContentId(context.baseId, value)

  return (
    <button
      {...props}
      aria-controls={contentId}
      aria-disabled={disabled || undefined}
      aria-selected={selected}
      data-disabled={disabled ? '' : undefined}
      data-state={selected ? 'active' : 'inactive'}
      data-value={value}
      disabled={disabled}
      id={triggerId}
      onClick={(event) => {
        onClick?.(event)

        if (event.defaultPrevented || disabled) {
          return
        }

        context.setValue(value)
      }}
      onFocus={(event) => {
        onFocus?.(event)

        if (!disabled) {
          context.setFocusedValue(value)
        }
      }}
      onKeyDown={(event) => {
        onKeyDown?.(event)

        if (
          event.defaultPrevented ||
          disabled ||
          context.activationMode !== 'manual' ||
          (event.key !== 'Enter' && event.key !== ' ')
        ) {
          return
        }

        event.preventDefault()
        context.setValue(value)
      }}
      role="tab"
      tabIndex={tabIndex ?? (context.focusedValue === value && !disabled ? 0 : -1)}
      type={type}
    />
  )
}

export function TabsContent({ hidden, value, ...props }: TabsContentProps) {
  const context = useTabsContext('TabsContent')
  const selected = context.value === value
  const triggerId = getTriggerId(context.baseId, value)
  const contentId = getContentId(context.baseId, value)

  return (
    <div
      {...props}
      aria-labelledby={triggerId}
      data-state={selected ? 'active' : 'inactive'}
      hidden={hidden ?? !selected}
      id={contentId}
      role="tabpanel"
      tabIndex={0}
    />
  )
}
