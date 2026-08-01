import {
  ToastProvider as HeadlessToastProvider,
  ToastRoot as HeadlessToastRoot,
  ToastViewport as HeadlessToastViewport,
  type ToastProviderProps,
} from '../../headless'
import { CloseIcon } from '../../icons'
import { cn } from '../../lib/cn'
import { IconButton } from '../icon-button'
import { toneClasses, toneIcons, type StyledToast } from './toast-shared'
import { useToast } from './useToast'

export type { ToastProviderProps }

export type ToastViewportProps = {
  className?: string
  label?: string
}

export function ToastProvider(props: ToastProviderProps) {
  return <HeadlessToastProvider {...props} />
}

export function ToastViewport({ className, label }: ToastViewportProps) {
  const { dismiss, toasts } = useToast()

  return (
    <HeadlessToastViewport
      className={cn(
        'pointer-events-none fixed inset-x-0 bottom-0 z-50 flex flex-col items-center gap-2 p-4',
        'sm:inset-x-auto sm:right-0 sm:items-end',
        className,
      )}
      label={label}
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} onDismiss={dismiss} toast={toast} />
      ))}
    </HeadlessToastViewport>
  )
}

function ToastItem({ onDismiss, toast }: { onDismiss: (id: string) => void; toast: StyledToast }) {
  const ToneIcon = toneIcons[toast.tone]

  return (
    <HeadlessToastRoot
      className="pointer-events-auto flex w-full max-w-96 items-start gap-3 rounded-md border border-border-default bg-surface-panel p-4 shadow-panel"
      politeness={toast.politeness}
      toastId={toast.id}
    >
      <ToneIcon className={cn('mt-0.5', toneClasses[toast.tone])} size={20} />

      <div className="grid flex-1 gap-1">
        <p className="text-sm font-semibold text-content-strong">{toast.title}</p>
        {toast.description ? (
          <p className="text-sm leading-6 text-content-muted">{toast.description}</p>
        ) : null}
        {toast.action ? <div className="mt-1">{toast.action}</div> : null}
      </div>

      <IconButton
        className="-mr-1 -mt-1"
        icon={<CloseIcon size={16} />}
        label={`${toast.title} 알림 닫기`}
        onClick={() => onDismiss(toast.id)}
        size="sm"
        variant="subtle"
      />
    </HeadlessToastRoot>
  )
}
