import type { CSSProperties, RefObject } from 'react'

export const focusableSelector = [
  'a[href]',
  'button:not(:disabled)',
  'input:not(:disabled)',
  'select:not(:disabled)',
  'textarea:not(:disabled)',
  '[tabindex]:not([tabindex="-1"])',
  '[contenteditable="true"]',
].join(',')

export function getFocusableElements(container: HTMLElement) {
  return Array.from(container.querySelectorAll<HTMLElement>(focusableSelector)).filter(
    (element) =>
      !element.closest('[hidden], [inert], [aria-hidden="true"]') &&
      element.getAttribute('aria-disabled') !== 'true',
  )
}

export function isHTMLElement(target: EventTarget | null): target is HTMLElement {
  return target instanceof HTMLElement
}

export function getBodyLayerRoot(element: HTMLElement | null) {
  let current = element

  while (current?.parentElement && current.parentElement !== document.body) {
    current = current.parentElement
  }

  return current?.parentElement === document.body ? current : null
}

export type OverlaySide = 'top' | 'right' | 'bottom' | 'left'
export type OverlayAlign = 'start' | 'center' | 'end'

type AnchoredPositionOptions = {
  triggerRef: RefObject<HTMLElement | null>
  contentRef: RefObject<HTMLElement | null>
  side: OverlaySide
  align: OverlayAlign
  sideOffset: number
  collisionPadding: number
  matchTriggerWidth?: boolean
}

export function getAnchoredPosition({
  triggerRef,
  contentRef,
  side,
  align,
  sideOffset,
  collisionPadding,
  matchTriggerWidth = false,
}: AnchoredPositionOptions): CSSProperties {
  const trigger = triggerRef.current
  const content = contentRef.current

  if (!trigger || !content) {
    return { position: 'fixed', visibility: 'hidden' }
  }

  const triggerRect = trigger.getBoundingClientRect()
  const contentRect = content.getBoundingClientRect()
  let top = triggerRect.bottom + sideOffset
  let left = triggerRect.left

  if (side === 'top') {
    top = triggerRect.top - contentRect.height - sideOffset
  } else if (side === 'right') {
    top = triggerRect.top
    left = triggerRect.right + sideOffset
  } else if (side === 'left') {
    top = triggerRect.top
    left = triggerRect.left - contentRect.width - sideOffset
  }

  const horizontal = side === 'top' || side === 'bottom'

  if (horizontal) {
    if (align === 'center') {
      left = triggerRect.left + (triggerRect.width - contentRect.width) / 2
    } else if (align === 'end') {
      left = triggerRect.right - contentRect.width
    }
  } else if (align === 'center') {
    top = triggerRect.top + (triggerRect.height - contentRect.height) / 2
  } else if (align === 'end') {
    top = triggerRect.bottom - contentRect.height
  }

  const maxLeft = Math.max(collisionPadding, window.innerWidth - contentRect.width - collisionPadding)
  const maxTop = Math.max(collisionPadding, window.innerHeight - contentRect.height - collisionPadding)

  return {
    position: 'fixed',
    top: Math.min(Math.max(top, collisionPadding), maxTop),
    left: Math.min(Math.max(left, collisionPadding), maxLeft),
    minWidth: matchTriggerWidth ? triggerRect.width : undefined,
  }
}
