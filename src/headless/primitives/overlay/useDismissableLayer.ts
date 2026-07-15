import { useEffect, useRef, type RefObject } from 'react'
import { getBodyLayerRoot, getFocusableElements, isHTMLElement } from './overlay-utils'

const layerStack: symbol[] = []

type ModalLayer = {
  id: symbol
  root: HTMLElement | null
}

const modalLayers: ModalLayer[] = []
const originalInertStates = new Map<HTMLElement, boolean>()
let originalBodyOverflow: string | null = null

function syncModalEnvironment() {
  const topModalRoot = modalLayers.at(-1)?.root ?? null

  if (modalLayers.length === 0) {
    document.body.style.overflow = originalBodyOverflow ?? ''

    for (const [element, inert] of originalInertStates) {
      element.inert = inert
    }

    originalInertStates.clear()
    originalBodyOverflow = null
    return
  }

  if (originalBodyOverflow === null) {
    originalBodyOverflow = document.body.style.overflow
  }

  document.body.style.overflow = 'hidden'

  for (const child of Array.from(document.body.children)) {
    if (!(child instanceof HTMLElement)) {
      continue
    }

    if (!originalInertStates.has(child)) {
      originalInertStates.set(child, child.inert)
    }

    child.inert = child !== topModalRoot
  }
}

function acquireModalLayer(layer: ModalLayer) {
  modalLayers.push(layer)
  syncModalEnvironment()
}

function releaseModalLayer(id: symbol) {
  const index = modalLayers.findIndex((layer) => layer.id === id)

  if (index >= 0) {
    modalLayers.splice(index, 1)
  }

  syncModalEnvironment()
}

export type UseDismissableLayerOptions = {
  open: boolean
  contentRef: RefObject<HTMLElement | null>
  triggerRef?: RefObject<HTMLElement | null>
  onDismiss: () => void
  modal?: boolean
  initialFocus?: boolean
  returnFocus?: boolean
  onEscapeKeyDown?: (event: KeyboardEvent) => void
  onPointerDownOutside?: (event: PointerEvent) => void
}

export function useDismissableLayer({
  open,
  contentRef,
  triggerRef,
  onDismiss,
  modal = false,
  initialFocus = true,
  returnFocus = true,
  onEscapeKeyDown,
  onPointerDownOutside,
}: UseDismissableLayerOptions) {
  const onDismissRef = useRef(onDismiss)
  const onEscapeKeyDownRef = useRef(onEscapeKeyDown)
  const onPointerDownOutsideRef = useRef(onPointerDownOutside)

  useEffect(() => {
    onDismissRef.current = onDismiss
    onEscapeKeyDownRef.current = onEscapeKeyDown
    onPointerDownOutsideRef.current = onPointerDownOutside
  })

  useEffect(() => {
    if (!open) {
      return
    }

    const layer = Symbol('dismissable-layer')
    const previouslyFocused = document.activeElement
    const trigger = triggerRef?.current
    let modalRegistered = false

    layerStack.push(layer)

    const isTopLayer = () => layerStack.at(-1) === layer
    const focusFirst = () => {
      const currentContent = contentRef.current

      if (!currentContent) {
        return
      }

      const autofocusTarget = currentContent.querySelector<HTMLElement>('[data-autofocus]')
      const target = autofocusTarget ?? getFocusableElements(currentContent)[0] ?? currentContent
      target.focus({ preventScroll: true })
    }

    const frame = requestAnimationFrame(() => {
      if (modal) {
        acquireModalLayer({ id: layer, root: getBodyLayerRoot(contentRef.current) })
        modalRegistered = true
      }

      if (initialFocus) {
        focusFirst()
      }
    })

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isTopLayer() || event.defaultPrevented) {
        return
      }

      if (event.key === 'Escape') {
        onEscapeKeyDownRef.current?.(event)

        if (!event.defaultPrevented) {
          event.preventDefault()
          onDismissRef.current()
        }
        return
      }

      if (event.key !== 'Tab' || !modal) {
        return
      }

      const currentContent = contentRef.current

      if (!currentContent) {
        return
      }

      const focusable = getFocusableElements(currentContent)

      if (focusable.length === 0) {
        event.preventDefault()
        currentContent.focus()
        return
      }

      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (!isTopLayer() || event.defaultPrevented || !isHTMLElement(event.target)) {
        return
      }

      const currentContent = contentRef.current
      const currentTrigger = triggerRef?.current

      if (currentContent?.contains(event.target) || currentTrigger?.contains(event.target)) {
        return
      }

      onPointerDownOutsideRef.current?.(event)

      if (!event.defaultPrevented) {
        onDismissRef.current()
      }
    }

    const handleFocusIn = (event: FocusEvent) => {
      if (!modal || !isTopLayer() || !isHTMLElement(event.target)) {
        return
      }

      const currentContent = contentRef.current

      if (currentContent && !currentContent.contains(event.target)) {
        focusFirst()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('focusin', handleFocusIn)

    return () => {
      const wasTopLayer = isTopLayer()
      cancelAnimationFrame(frame)
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('focusin', handleFocusIn)

      const layerIndex = layerStack.indexOf(layer)
      if (layerIndex >= 0) {
        layerStack.splice(layerIndex, 1)
      }

      if (modalRegistered) {
        releaseModalLayer(layer)
      }

      if (returnFocus && wasTopLayer) {
        const target = trigger ?? (isHTMLElement(previouslyFocused) ? previouslyFocused : null)
        target?.focus({ preventScroll: true })
      }
    }
  }, [contentRef, initialFocus, modal, open, returnFocus, triggerRef])
}
