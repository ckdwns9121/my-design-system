import {
  createContext,
  useContext,
  useEffect,
  useId,
  useRef,
  type ButtonHTMLAttributes,
  type CSSProperties,
  type HTMLAttributes,
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
  type PortalProps as OverlayPortalProps,
} from '../overlay'

type TooltipContextValue = {
  closeWithGrace: () => void
  contentId: string
  contentRef: RefObject<HTMLDivElement | null>
  open: boolean
  openImmediately: () => void
  openWithDelay: () => void
  setOpen: (open: boolean) => void
  triggerRef: RefObject<HTMLButtonElement | null>
}

const TooltipContext = createContext<TooltipContextValue | null>(null)

function useTooltipContext(componentName: string) {
  const context = useContext(TooltipContext)

  if (!context) {
    throw new Error(`${componentName} must be used within TooltipRoot`)
  }

  return context
}

function mergeStyles(positionStyle: CSSProperties, style?: CSSProperties) {
  return style ? { ...positionStyle, ...style } : positionStyle
}

function composeDescribedBy(existing: string | undefined, contentId: string, open: boolean) {
  if (!open) {
    return existing
  }

  return existing ? `${existing} ${contentId}` : contentId
}

export type TooltipRootProps = {
  children: ReactNode
  closeGraceDuration?: number
  defaultOpen?: boolean
  delayDuration?: number
  onOpenChange?: (open: boolean) => void
  open?: boolean
}

export type TooltipTriggerProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'aria-describedby'
> & {
  'aria-describedby'?: string
}

export type TooltipPortalProps = OverlayPortalProps

export type TooltipContentProps = Omit<HTMLAttributes<HTMLDivElement>, 'id' | 'role'> & {
  align?: OverlayAlign
  collisionPadding?: number
  matchTriggerWidth?: boolean
  side?: OverlaySide
  sideOffset?: number
}

export function TooltipRoot({
  children,
  closeGraceDuration = 120,
  defaultOpen = false,
  delayDuration = 700,
  onOpenChange,
  open,
}: TooltipRootProps) {
  const contentId = useId()
  const triggerRef = useRef<HTMLButtonElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const openTimerRef = useRef<number | null>(null)
  const closeTimerRef = useRef<number | null>(null)
  const [currentOpen, setCurrentOpen] = useControllableState({
    value: open,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  })

  const clearOpenTimer = () => {
    if (openTimerRef.current !== null) {
      window.clearTimeout(openTimerRef.current)
      openTimerRef.current = null
    }
  }

  const clearCloseTimer = () => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
  }

  const openImmediately = () => {
    clearCloseTimer()
    clearOpenTimer()
    setCurrentOpen(true)
  }

  const openWithDelay = () => {
    clearCloseTimer()

    if (currentOpen || openTimerRef.current !== null) {
      return
    }

    openTimerRef.current = window.setTimeout(() => {
      openTimerRef.current = null
      setCurrentOpen(true)
    }, delayDuration)
  }

  const closeWithGrace = () => {
    clearOpenTimer()
    clearCloseTimer()
    closeTimerRef.current = window.setTimeout(() => {
      closeTimerRef.current = null
      setCurrentOpen(false)
    }, closeGraceDuration)
  }

  useEffect(() => {
    return () => {
      if (openTimerRef.current !== null) {
        window.clearTimeout(openTimerRef.current)
      }

      if (closeTimerRef.current !== null) {
        window.clearTimeout(closeTimerRef.current)
      }
    }
  }, [])

  return (
    <TooltipContext.Provider
      value={{
        closeWithGrace,
        contentId,
        contentRef,
        open: currentOpen,
        openImmediately,
        openWithDelay,
        setOpen: setCurrentOpen,
        triggerRef,
      }}
    >
      {children}
    </TooltipContext.Provider>
  )
}

export function TooltipTrigger({
  'aria-describedby': ariaDescribedBy,
  disabled = false,
  onBlur,
  onFocus,
  onKeyDown,
  onPointerEnter,
  onPointerLeave,
  type = 'button',
  ...props
}: TooltipTriggerProps) {
  const context = useTooltipContext('TooltipTrigger')

  return (
    <button
      {...props}
      aria-describedby={composeDescribedBy(ariaDescribedBy, context.contentId, context.open)}
      data-state={context.open ? 'open' : 'closed'}
      disabled={disabled}
      onBlur={(event) => {
        onBlur?.(event)

        if (!event.defaultPrevented) {
          context.setOpen(false)
        }
      }}
      onFocus={(event) => {
        onFocus?.(event)

        if (!event.defaultPrevented && !disabled) {
          context.openImmediately()
        }
      }}
      onKeyDown={(event) => {
        onKeyDown?.(event)

        if (event.defaultPrevented || event.key !== 'Escape') {
          return
        }

        event.preventDefault()
        context.setOpen(false)
      }}
      onPointerEnter={(event) => {
        onPointerEnter?.(event)

        if (!event.defaultPrevented && !disabled) {
          context.openWithDelay()
        }
      }}
      onPointerLeave={(event) => {
        onPointerLeave?.(event)

        if (!event.defaultPrevented) {
          context.closeWithGrace()
        }
      }}
      ref={context.triggerRef}
      type={type}
    />
  )
}

export function TooltipPortal(props: TooltipPortalProps) {
  return <OverlayPortal {...props} />
}

export function TooltipContent({
  align = 'center',
  collisionPadding = 8,
  hidden,
  matchTriggerWidth = false,
  onPointerEnter,
  onPointerLeave,
  side = 'top',
  sideOffset = 8,
  style,
  ...props
}: TooltipContentProps) {
  const context = useTooltipContext('TooltipContent')
  const positionStyle = useAnchoredPosition({
    align,
    collisionPadding,
    contentRef: context.contentRef,
    matchTriggerWidth,
    open: context.open,
    side,
    sideOffset,
    triggerRef: context.triggerRef,
  })

  useDismissableLayer({
    contentRef: context.contentRef,
    initialFocus: false,
    modal: false,
    onDismiss: () => context.setOpen(false),
    open: context.open,
    returnFocus: false,
    triggerRef: context.triggerRef,
  })

  if (!context.open) {
    return null
  }

  return (
    <div
      {...props}
      data-state="open"
      hidden={hidden}
      id={context.contentId}
      onPointerEnter={(event) => {
        onPointerEnter?.(event)

        if (!event.defaultPrevented) {
          context.openImmediately()
        }
      }}
      onPointerLeave={(event) => {
        onPointerLeave?.(event)

        if (!event.defaultPrevented) {
          context.closeWithGrace()
        }
      }}
      ref={context.contentRef}
      role="tooltip"
      style={mergeStyles(positionStyle, style)}
    />
  )
}
