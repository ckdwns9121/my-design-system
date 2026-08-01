import { useMemo } from 'react'
import { useToast as useHeadlessToast } from '../../headless'
import { politenessByTone, readToast, type ToastOptions } from './toast-shared'

/**
 * Queues a toast with the styled layer's shape. Tone decides how urgently the
 * toast is announced unless `politeness` overrides it.
 */
export function useToast() {
  const { dismiss, dismissAll, toast, toasts } = useHeadlessToast()

  return useMemo(
    () => ({
      dismiss,
      dismissAll,
      toasts: toasts.map(readToast),
      toast: ({ duration, politeness, tone = 'info', ...rest }: ToastOptions) =>
        toast({
          data: { tone, ...rest },
          duration,
          politeness: politeness ?? politenessByTone[tone],
        }),
    }),
    [dismiss, dismissAll, toast, toasts],
  )
}
