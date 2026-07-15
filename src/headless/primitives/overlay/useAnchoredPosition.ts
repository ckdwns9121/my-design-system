import { useLayoutEffect, useState, type CSSProperties, type RefObject } from 'react'
import {
  getAnchoredPosition,
  type OverlayAlign,
  type OverlaySide,
} from './overlay-utils'

const hiddenPosition: CSSProperties = {
  position: 'fixed',
  visibility: 'hidden',
}

export type UseAnchoredPositionOptions = {
  open: boolean
  triggerRef: RefObject<HTMLElement | null>
  contentRef: RefObject<HTMLElement | null>
  side?: OverlaySide
  align?: OverlayAlign
  sideOffset?: number
  collisionPadding?: number
  matchTriggerWidth?: boolean
}

export function useAnchoredPosition({
  open,
  triggerRef,
  contentRef,
  side = 'bottom',
  align = 'start',
  sideOffset = 6,
  collisionPadding = 8,
  matchTriggerWidth = false,
}: UseAnchoredPositionOptions) {
  const [style, setStyle] = useState<CSSProperties>(hiddenPosition)

  useLayoutEffect(() => {
    if (!open) {
      return
    }

    const update = () => {
      setStyle(
        getAnchoredPosition({
          triggerRef,
          contentRef,
          side,
          align,
          sideOffset,
          collisionPadding,
          matchTriggerWidth,
        }),
      )
    }

    update()
    const frame = requestAnimationFrame(update)
    window.addEventListener('resize', update)
    window.addEventListener('scroll', update, true)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', update)
      window.removeEventListener('scroll', update, true)
    }
  }, [
    align,
    collisionPadding,
    contentRef,
    matchTriggerWidth,
    open,
    side,
    sideOffset,
    triggerRef,
  ])

  return open ? style : hiddenPosition
}
