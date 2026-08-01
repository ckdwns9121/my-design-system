import { createContext, useContext } from 'react'

export type ToastPoliteness = 'polite' | 'assertive'

/**
 * The primitive only tracks identity, lifetime, and how urgently the toast
 * should be announced. Everything the toast renders lives in `data`, which the
 * styled layer types for its own shape.
 */
export type ToastRecord = {
  id: string
  /** Milliseconds before the toast removes itself. `null` keeps it until dismissed. */
  duration: number | null
  politeness: ToastPoliteness
  data: Record<string, unknown>
}

export type ToastInput = {
  id?: string
  duration?: number | null
  politeness?: ToastPoliteness
  data?: Record<string, unknown>
}

export type ToastContextValue = {
  dismiss: (id: string) => void
  dismissAll: () => void
  pause: () => void
  paused: boolean
  resume: () => void
  toast: (input: ToastInput) => string
  toasts: ToastRecord[]
}

export const ToastContext = createContext<ToastContextValue | null>(null)

export function useToastContext(componentName: string) {
  const context = useContext(ToastContext)

  if (!context) {
    throw new Error(`${componentName} must be used within ToastProvider`)
  }

  return context
}
