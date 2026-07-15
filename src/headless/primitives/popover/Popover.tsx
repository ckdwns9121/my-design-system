import {
  createContext,
  useContext,
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

type PopoverContextValue = {
  contentId: string
  contentRef: RefObject<HTMLDivElement | null>
  open: boolean
  setOpen: (open: boolean) => void
  triggerId: string
  triggerRef: RefObject<HTMLButtonElement | null>
}

const PopoverContext = createContext<PopoverContextValue | null>(null)

function usePopoverContext(componentName: string) {
  const context = useContext(PopoverContext)

  if (!context) {
    throw new Error(`${componentName} must be used within PopoverRoot`)
  }

  return context
}

function mergeStyles(positionStyle: CSSProperties, style?: CSSProperties) {
  return style ? { ...positionStyle, ...style } : positionStyle
}

export type PopoverRootProps = {
  children: ReactNode
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  open?: boolean
}

export type PopoverTriggerProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'aria-controls' | 'aria-expanded' | 'aria-haspopup' | 'id'
>

export type PopoverPortalProps = OverlayPortalProps

export type PopoverContentProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  'aria-labelledby' | 'id' | 'role'
> & {
  align?: OverlayAlign
  collisionPadding?: number
  matchTriggerWidth?: boolean
  side?: OverlaySide
  sideOffset?: number
}

export type PopoverCloseProps = ButtonHTMLAttributes<HTMLButtonElement>

export function PopoverRoot({
  children,
  defaultOpen = false,
  onOpenChange,
  open,
}: PopoverRootProps) {
  const generatedId = useId()
  const triggerRef = useRef<HTMLButtonElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [currentOpen, setCurrentOpen] = useControllableState({
    value: open,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  })

  return (
    <PopoverContext.Provider
      value={{
        contentId: `${generatedId}-content`,
        contentRef,
        open: currentOpen,
        setOpen: setCurrentOpen,
        triggerId: `${generatedId}-trigger`,
        triggerRef,
      }}
    >
      {children}
    </PopoverContext.Provider>
  )
}

export function PopoverTrigger({
  disabled = false,
  onClick,
  type = 'button',
  ...props
}: PopoverTriggerProps) {
  const context = usePopoverContext('PopoverTrigger')

  return (
    <button
      {...props}
      aria-controls={context.contentId}
      aria-expanded={context.open}
      aria-haspopup="dialog"
      data-state={context.open ? 'open' : 'closed'}
      disabled={disabled}
      id={context.triggerId}
      onClick={(event) => {
        onClick?.(event)

        if (event.defaultPrevented || disabled) {
          return
        }

        context.setOpen(!context.open)
      }}
      ref={context.triggerRef}
      type={type}
    />
  )
}

export function PopoverPortal(props: PopoverPortalProps) {
  return <OverlayPortal {...props} />
}

export function PopoverContent({
  align = 'start',
  collisionPadding = 8,
  hidden,
  matchTriggerWidth = false,
  side = 'bottom',
  sideOffset = 8,
  style,
  tabIndex = -1,
  ...props
}: PopoverContentProps) {
  const context = usePopoverContext('PopoverContent')
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
    modal: false,
    onDismiss: () => context.setOpen(false),
    open: context.open,
    returnFocus: true,
    triggerRef: context.triggerRef,
  })

  if (!context.open) {
    return null
  }

  return (
    <div
      {...props}
      aria-labelledby={props['aria-label'] ? undefined : context.triggerId}
      data-state="open"
      hidden={hidden}
      id={context.contentId}
      ref={context.contentRef}
      role="dialog"
      style={mergeStyles(positionStyle, style)}
      tabIndex={tabIndex}
    />
  )
}

export function PopoverClose({
  disabled = false,
  onClick,
  type = 'button',
  ...props
}: PopoverCloseProps) {
  const context = usePopoverContext('PopoverClose')

  return (
    <button
      disabled={disabled}
      onClick={(event) => {
        onClick?.(event)

        if (event.defaultPrevented || disabled) {
          return
        }

        context.setOpen(false)
      }}
      type={type}
      {...props}
    />
  )
}
