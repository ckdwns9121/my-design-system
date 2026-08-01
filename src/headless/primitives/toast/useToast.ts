import { useToastContext } from './context'

/**
 * Queues and dismisses toasts from anywhere under a ToastProvider.
 */
export function useToast() {
  const context = useToastContext('useToast')

  return {
    dismiss: context.dismiss,
    dismissAll: context.dismissAll,
    toast: context.toast,
    toasts: context.toasts,
  }
}
