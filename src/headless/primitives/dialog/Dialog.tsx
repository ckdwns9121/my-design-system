import {
  createContext,
  useEffect,
  useContext,
  useId,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type Ref,
  type ReactNode,
} from 'react'
import { useControllableState } from '../../hooks'
import { Portal as HeadlessPortal, useDismissableLayer } from '../overlay'

type DialogContextValue = {
  contentId: string
  descriptionId: string
  modal: boolean
  open: boolean
  setDescriptionMounted: (mounted: boolean) => void
  setOpen: (open: boolean) => void
  setTitleMounted: (mounted: boolean) => void
  descriptionMounted: boolean
  titleId: string
  titleMounted: boolean
  triggerRef: React.RefObject<HTMLButtonElement | null>
}

const DialogContext = createContext<DialogContextValue | null>(null)

function useDialogContext(componentName: string) {
  const context = useContext(DialogContext)

  if (!context) {
    throw new Error(`${componentName} must be used within DialogRoot`)
  }

  return context
}

function assignRef<T>(ref: Ref<T> | undefined, value: T | null) {
  if (!ref) {
    return
  }

  if (typeof ref === 'function') {
    ref(value)
    return
  }

  ref.current = value
}

function composeRefs<T>(...refs: Array<Ref<T> | undefined>) {
  return (value: T | null) => {
    for (const ref of refs) {
      assignRef(ref, value)
    }
  }
}

export type DialogRootProps = {
  children: ReactNode
  defaultOpen?: boolean
  modal?: boolean
  onOpenChange?: (open: boolean) => void
  open?: boolean
}

export type DialogTriggerProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  ref?: Ref<HTMLButtonElement>
}

export type DialogPortalProps = {
  children: ReactNode
  container?: HTMLElement | null
  disabled?: boolean
  forceMount?: boolean
}

export type DialogOverlayProps = HTMLAttributes<HTMLDivElement> & {
  forceMount?: boolean
  ref?: Ref<HTMLDivElement>
}

export type DialogContentProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  'aria-describedby' | 'aria-labelledby' | 'id' | 'role'
> & {
  'aria-describedby'?: string
  'aria-labelledby'?: string
  forceMount?: boolean
  ref?: Ref<HTMLDivElement>
}

export type DialogTitleProps = Omit<HTMLAttributes<HTMLHeadingElement>, 'id'> & {
  ref?: Ref<HTMLHeadingElement>
}

export type DialogDescriptionProps = Omit<HTMLAttributes<HTMLParagraphElement>, 'id'> & {
  ref?: Ref<HTMLParagraphElement>
}

export type DialogCloseProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  ref?: Ref<HTMLButtonElement>
}

export function DialogRoot({
  children,
  defaultOpen = false,
  modal = true,
  onOpenChange,
  open,
}: DialogRootProps) {
  const generatedId = useId()
  const triggerRef = useRef<HTMLButtonElement>(null)
  const [titleMounted, setTitleMounted] = useState(false)
  const [descriptionMounted, setDescriptionMounted] = useState(false)
  const [currentOpen, setCurrentOpen] = useControllableState({
    value: open,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  })
  const contentId = `${generatedId}-content`

  return (
    <DialogContext.Provider
      value={{
        contentId,
        descriptionId: `${contentId}-description`,
        descriptionMounted,
        modal,
        open: currentOpen,
        setDescriptionMounted,
        setOpen: setCurrentOpen,
        setTitleMounted,
        titleId: `${contentId}-title`,
        titleMounted,
        triggerRef,
      }}
    >
      {children}
    </DialogContext.Provider>
  )
}

export function DialogTrigger({
  onClick,
  ref,
  type = 'button',
  ...props
}: DialogTriggerProps) {
  const dialog = useDialogContext('DialogTrigger')

  return (
    <button
      {...props}
      aria-controls={dialog.contentId}
      aria-expanded={dialog.open}
      aria-haspopup="dialog"
      data-state={dialog.open ? 'open' : 'closed'}
      onClick={(event) => {
        onClick?.(event)

        if (event.defaultPrevented || props.disabled) {
          return
        }

        dialog.setOpen(true)
      }}
      ref={composeRefs(dialog.triggerRef, ref)}
      type={type}
    />
  )
}

export function DialogPortal({
  children,
  container,
  disabled,
  forceMount = false,
}: DialogPortalProps) {
  const dialog = useDialogContext('DialogPortal')

  if (!forceMount && !dialog.open) {
    return null
  }

  return (
    <HeadlessPortal container={container} disabled={disabled}>
      {children}
    </HeadlessPortal>
  )
}

export function DialogOverlay({
  forceMount = false,
  ref,
  ...props
}: DialogOverlayProps) {
  const dialog = useDialogContext('DialogOverlay')

  if (!forceMount && !dialog.open) {
    return null
  }

  return (
    <div
      {...props}
      data-state={dialog.open ? 'open' : 'closed'}
      hidden={!dialog.open}
      ref={ref}
    />
  )
}

export function DialogContent({
  'aria-describedby': ariaDescribedBy,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  forceMount = false,
  ref,
  tabIndex = -1,
  ...props
}: DialogContentProps) {
  const dialog = useDialogContext('DialogContent')
  const contentRef = useRef<HTMLDivElement>(null)

  useDismissableLayer({
    contentRef,
    modal: dialog.modal,
    onDismiss: () => dialog.setOpen(false),
    open: dialog.open,
    triggerRef: dialog.triggerRef,
  })

  if (!forceMount && !dialog.open) {
    return null
  }

  return (
    <div
      {...props}
      aria-describedby={
        ariaDescribedBy ?? (dialog.descriptionMounted ? dialog.descriptionId : undefined)
      }
      aria-label={ariaLabel}
      aria-labelledby={
        ariaLabelledBy ?? (ariaLabel || !dialog.titleMounted ? undefined : dialog.titleId)
      }
      aria-modal={dialog.modal}
      data-state={dialog.open ? 'open' : 'closed'}
      hidden={!dialog.open}
      id={dialog.contentId}
      ref={composeRefs(contentRef, ref)}
      role="dialog"
      tabIndex={tabIndex}
    />
  )
}

export function DialogTitle({
  ref,
  ...props
}: DialogTitleProps) {
  const dialog = useDialogContext('DialogTitle')
  const { setTitleMounted, titleId } = dialog

  useEffect(() => {
    setTitleMounted(true)

    return () => {
      setTitleMounted(false)
    }
  }, [setTitleMounted])

  return <h2 {...props} id={titleId} ref={ref} />
}

export function DialogDescription({
  ref,
  ...props
}: DialogDescriptionProps) {
  const dialog = useDialogContext('DialogDescription')
  const { descriptionId, setDescriptionMounted } = dialog

  useEffect(() => {
    setDescriptionMounted(true)

    return () => {
      setDescriptionMounted(false)
    }
  }, [setDescriptionMounted])

  return <p {...props} id={descriptionId} ref={ref} />
}

export function DialogClose({
  onClick,
  ref,
  type = 'button',
  ...props
}: DialogCloseProps) {
  const dialog = useDialogContext('DialogClose')

  return (
    <button
      {...props}
      data-state={dialog.open ? 'open' : 'closed'}
      onClick={(event) => {
        onClick?.(event)

        if (event.defaultPrevented || props.disabled) {
          return
        }

        dialog.setOpen(false)
      }}
      ref={ref}
      type={type}
    />
  )
}
