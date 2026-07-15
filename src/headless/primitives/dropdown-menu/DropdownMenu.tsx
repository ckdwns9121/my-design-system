import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
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

type FocusIntent = 'first' | 'last'

type DropdownMenuContextValue = {
  baseId: string
  close: (returnFocus?: boolean) => void
  contentRef: RefObject<HTMLDivElement | null>
  focusIntentRef: RefObject<FocusIntent>
  open: boolean
  setOpen: (open: boolean) => void
  triggerRef: RefObject<HTMLButtonElement | null>
}

const DropdownMenuContext = createContext<DropdownMenuContextValue | null>(null)

function useDropdownMenuContext(componentName: string) {
  const context = useContext(DropdownMenuContext)

  if (!context) {
    throw new Error(`${componentName} must be used within DropdownMenuRoot`)
  }

  return context
}

function getMenuItems(container: HTMLElement) {
  return Array.from(container.querySelectorAll<HTMLElement>('[role="menuitem"]'))
}

function focusMenuItem(container: HTMLElement, index: number) {
  const items = getMenuItems(container)

  if (items.length === 0) {
    container.focus()
    return
  }

  items[(index + items.length) % items.length].focus()
}

function getPrintableKey(event: KeyboardEvent<HTMLElement>) {
  if (event.key.length !== 1 || event.ctrlKey || event.metaKey || event.altKey) {
    return ''
  }

  return event.key.toLocaleLowerCase()
}

function findItemByText(container: HTMLElement, query: string) {
  return getMenuItems(container).find((item) =>
    (item.textContent ?? '').trim().toLocaleLowerCase().startsWith(query),
  )
}

export type DropdownMenuRootProps = {
  children: ReactNode
  defaultOpen?: boolean
  id?: string
  onOpenChange?: (open: boolean) => void
  open?: boolean
}

export type DropdownMenuTriggerProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'aria-controls' | 'aria-expanded' | 'aria-haspopup' | 'id'
>

export type DropdownMenuPortalProps = {
  children: ReactNode
  container?: HTMLElement | null
  disabled?: boolean
}

export type DropdownMenuContentProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  'aria-labelledby' | 'id' | 'role'
> & {
  align?: OverlayAlign
  collisionPadding?: number
  side?: OverlaySide
  sideOffset?: number
}

export type DropdownMenuItemProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'role'
> & {
  onSelect?: () => void
}

export type DropdownMenuLabelProps = HTMLAttributes<HTMLDivElement>
export type DropdownMenuSeparatorProps = Omit<HTMLAttributes<HTMLDivElement>, 'role'>

export function DropdownMenuRoot({
  children,
  defaultOpen = false,
  id,
  onOpenChange,
  open,
}: DropdownMenuRootProps) {
  const generatedId = useId()
  const [currentOpen, setCurrentOpen] = useControllableState({
    value: open,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  })
  const triggerRef = useRef<HTMLButtonElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const focusIntentRef = useRef<FocusIntent>('first')
  const returnFocusOnCloseRef = useRef(false)
  const baseId = id ?? generatedId

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

  const context = useMemo<DropdownMenuContextValue>(
    () => ({
      baseId,
      close,
      contentRef,
      focusIntentRef,
      open: currentOpen,
      setOpen: setCurrentOpen,
      triggerRef,
    }),
    [baseId, close, currentOpen, setCurrentOpen],
  )

  return (
    <DropdownMenuContext.Provider value={context}>
      {children}
    </DropdownMenuContext.Provider>
  )
}

export function DropdownMenuTrigger({
  disabled,
  onClick,
  onKeyDown,
  type = 'button',
  ...props
}: DropdownMenuTriggerProps) {
  const context = useDropdownMenuContext('DropdownMenuTrigger')
  const triggerId = `${context.baseId}-trigger`
  const contentId = `${context.baseId}-content`

  return (
    <button
      {...props}
      aria-controls={contentId}
      aria-expanded={context.open}
      aria-haspopup="menu"
      data-state={context.open ? 'open' : 'closed'}
      disabled={disabled}
      id={triggerId}
      onClick={(event) => {
        onClick?.(event)

        if (event.defaultPrevented || disabled) {
          return
        }

        context.focusIntentRef.current = 'first'
        context.setOpen(!context.open)
      }}
      onKeyDown={(event) => {
        onKeyDown?.(event)

        if (event.defaultPrevented || disabled) {
          return
        }

        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
          event.preventDefault()
          context.focusIntentRef.current = event.key === 'ArrowUp' ? 'last' : 'first'
          context.setOpen(true)
        }
      }}
      ref={context.triggerRef}
      type={type}
    />
  )
}

export function DropdownMenuPortal({
  children,
  container,
  disabled,
}: DropdownMenuPortalProps) {
  return (
    <OverlayPortal container={container} disabled={disabled}>
      {children}
    </OverlayPortal>
  )
}

export function DropdownMenuContent({
  align = 'start',
  collisionPadding = 8,
  onKeyDown,
  side = 'bottom',
  sideOffset = 6,
  style,
  tabIndex = -1,
  ...props
}: DropdownMenuContentProps) {
  const context = useDropdownMenuContext('DropdownMenuContent')
  const searchRef = useRef('')
  const searchTimerRef = useRef<number | null>(null)
  const positionStyle = useAnchoredPosition({
    open: context.open,
    triggerRef: context.triggerRef,
    contentRef: context.contentRef,
    side,
    align,
    sideOffset,
    collisionPadding,
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
      focusMenuItem(
        content,
        context.focusIntentRef.current === 'last'
          ? getMenuItems(content).length - 1
          : 0,
      )
    })

    return () => {
      cancelAnimationFrame(frame)
    }
  }, [context.contentRef, context.focusIntentRef, context.open])

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

  if (!context.open) {
    return null
  }

  return (
    <div
      {...props}
      aria-labelledby={`${context.baseId}-trigger`}
      data-state="open"
      id={`${context.baseId}-content`}
      onKeyDown={(event) => {
        onKeyDown?.(event)

        if (event.defaultPrevented) {
          return
        }

        const content = event.currentTarget

        if (event.key === 'Tab') {
          context.close(false)
          return
        }

        if (event.key === 'ArrowDown') {
          event.preventDefault()
          const items = getMenuItems(content)
          const currentIndex = items.findIndex((item) => item === document.activeElement)
          focusMenuItem(content, currentIndex + 1)
          return
        }

        if (event.key === 'ArrowUp') {
          event.preventDefault()
          const items = getMenuItems(content)
          const currentIndex = items.findIndex((item) => item === document.activeElement)
          focusMenuItem(content, currentIndex - 1)
          return
        }

        if (event.key === 'Home') {
          event.preventDefault()
          focusMenuItem(content, 0)
          return
        }

        if (event.key === 'End') {
          event.preventDefault()
          focusMenuItem(content, getMenuItems(content).length - 1)
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

          findItemByText(content, searchRef.current)?.focus()
        }
      }}
      ref={context.contentRef}
      role="menu"
      style={{ ...positionStyle, ...style }}
      tabIndex={tabIndex}
    />
  )
}

export function DropdownMenuItem({
  disabled,
  onClick,
  onKeyDown,
  onSelect,
  tabIndex = -1,
  type = 'button',
  ...props
}: DropdownMenuItemProps) {
  const context = useDropdownMenuContext('DropdownMenuItem')

  return (
    <button
      {...props}
      aria-disabled={disabled || undefined}
      data-disabled={disabled ? '' : undefined}
      onClick={(event) => {
        onClick?.(event)

        if (event.defaultPrevented || disabled) {
          return
        }

        onSelect?.()
        context.close(true)
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
        onSelect?.()
        context.close(true)
      }}
      role="menuitem"
      tabIndex={tabIndex}
      type={type}
    />
  )
}

export function DropdownMenuLabel(props: DropdownMenuLabelProps) {
  return <div role="presentation" {...props} />
}

export function DropdownMenuSeparator(props: DropdownMenuSeparatorProps) {
  return <div aria-orientation="horizontal" role="separator" {...props} />
}
