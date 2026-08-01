import type { ReactNode } from 'react'
import type { ToastPoliteness, ToastRecord } from '../../headless'
import { CheckCircleIcon, ErrorIcon, InfoIcon, WarningIcon } from '../../icons'

export type ToastTone = 'info' | 'success' | 'warning' | 'danger'

export type ToastOptions = {
  title: string
  description?: string
  tone?: ToastTone
  /** Action rendered inside the toast, such as an undo control. */
  action?: ReactNode
  /** Milliseconds before it disappears. `null` keeps it until dismissed. */
  duration?: number | null
  /** Overrides the politeness implied by the tone. */
  politeness?: ToastPoliteness
}

export type StyledToast = {
  id: string
  title: string
  description?: string
  tone: ToastTone
  action?: ReactNode
  politeness: ToastPoliteness
}

export const toneIcons: Record<ToastTone, typeof InfoIcon> = {
  info: InfoIcon,
  success: CheckCircleIcon,
  warning: WarningIcon,
  danger: ErrorIcon,
}

export const toneClasses: Record<ToastTone, string> = {
  info: 'text-content-muted',
  success: 'text-status-success-text',
  warning: 'text-status-warning-text',
  danger: 'text-status-danger-text',
}

/** Warnings and errors interrupt; the quieter tones wait their turn. */
export const politenessByTone: Record<ToastTone, ToastPoliteness> = {
  info: 'polite',
  success: 'polite',
  warning: 'assertive',
  danger: 'assertive',
}

/**
 * The primitive stores render data untyped. This is the one place that gives it
 * a shape, so nothing downstream has to cast.
 */
export function readToast(record: ToastRecord): StyledToast {
  const data = record.data as Partial<StyledToast>

  return {
    id: record.id,
    title: typeof data.title === 'string' ? data.title : '',
    description: typeof data.description === 'string' ? data.description : undefined,
    tone: data.tone ?? 'info',
    action: data.action,
    politeness: record.politeness,
  }
}
