import { useLayoutEffect, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

export type PortalProps = {
  children: ReactNode
  container?: HTMLElement | null
  disabled?: boolean
}

export function Portal({ children, container, disabled = false }: PortalProps) {
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null)

  useLayoutEffect(() => {
    if (disabled) {
      return
    }

    if (container) {
      setPortalContainer(container)
      return
    }

    const element = document.createElement('div')
    element.setAttribute('data-headless-portal', '')
    document.body.append(element)
    setPortalContainer(element)

    return () => {
      element.remove()
    }
  }, [container, disabled])

  if (disabled) {
    return children
  }

  return portalContainer ? createPortal(children, portalContainer) : null
}
