import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from 'react'
import {
  ToastContext,
  useToastContext,
  type ToastContextValue,
  type ToastInput,
  type ToastPoliteness,
  type ToastRecord,
} from './context'

export type ToastProviderProps = {
  children: ReactNode
  /** Default milliseconds before a toast removes itself. */
  duration?: number
  /** Oldest toasts past this count are dropped. */
  limit?: number
}

export type ToastViewportProps = Omit<HTMLAttributes<HTMLDivElement>, 'role'> & {
  label?: string
}

export type ToastRootProps = Omit<HTMLAttributes<HTMLDivElement>, 'role'> & {
  toastId: string
  politeness?: ToastPoliteness
}

/**
 * Owns the toast queue and the timers that retire each toast.
 *
 * Timers are held in a ref rather than state so a re-render never restarts a
 * countdown, and the whole queue pauses together while a pointer or the keyboard
 * is inside the viewport.
 */
export function ToastProvider({ children, duration = 5000, limit = 4 }: ToastProviderProps) {
  const generatedId = useId()
  const counterRef = useRef(0)
  const timersRef = useRef(new Map<string, number>())
  const remainingRef = useRef(new Map<string, { endsAt: number; left: number }>())
  const [paused, setPaused] = useState(false)
  const [toasts, setToasts] = useState<ToastRecord[]>([])

  const clearTimer = useCallback((id: string) => {
    const timer = timersRef.current.get(id)

    if (timer !== undefined) {
      window.clearTimeout(timer)
      timersRef.current.delete(id)
    }
  }, [])

  const dismiss = useCallback(
    (id: string) => {
      clearTimer(id)
      remainingRef.current.delete(id)
      setToasts((previousToasts) => previousToasts.filter((item) => item.id !== id))
    },
    [clearTimer],
  )

  const startTimer = useCallback(
    (id: string, left: number) => {
      clearTimer(id)
      remainingRef.current.set(id, { endsAt: Date.now() + left, left })
      timersRef.current.set(
        id,
        window.setTimeout(() => dismiss(id), left),
      )
    },
    [clearTimer, dismiss],
  )

  const toast = useCallback(
    (input: ToastInput) => {
      counterRef.current += 1
      const id = input.id ?? `${generatedId}-toast-${counterRef.current}`
      const record: ToastRecord = {
        id,
        data: input.data ?? {},
        duration: input.duration === undefined ? duration : input.duration,
        politeness: input.politeness ?? 'polite',
      }

      setToasts((previousToasts) => {
        const next = [...previousToasts.filter((item) => item.id !== id), record]

        for (const dropped of next.slice(0, Math.max(next.length - limit, 0))) {
          clearTimer(dropped.id)
          remainingRef.current.delete(dropped.id)
        }

        return next.slice(-limit)
      })

      if (record.duration !== null) {
        startTimer(id, record.duration)
      }

      return id
    },
    [clearTimer, duration, generatedId, limit, startTimer],
  )

  const dismissAll = useCallback(() => {
    for (const id of timersRef.current.keys()) {
      clearTimer(id)
    }

    remainingRef.current.clear()
    setToasts([])
  }, [clearTimer])

  const pause = useCallback(() => {
    setPaused((previousPaused) => {
      if (previousPaused) {
        return previousPaused
      }

      for (const [id, timer] of timersRef.current) {
        window.clearTimeout(timer)
        const remaining = remainingRef.current.get(id)

        if (remaining) {
          remainingRef.current.set(id, {
            endsAt: remaining.endsAt,
            left: Math.max(remaining.endsAt - Date.now(), 0),
          })
        }
      }

      timersRef.current.clear()
      return true
    })
  }, [])

  const resume = useCallback(() => {
    setPaused((previousPaused) => {
      if (!previousPaused) {
        return previousPaused
      }

      for (const [id, remaining] of remainingRef.current) {
        startTimer(id, remaining.left)
      }

      return false
    })
  }, [startTimer])

  useEffect(() => {
    const timers = timersRef.current

    return () => {
      for (const timer of timers.values()) {
        window.clearTimeout(timer)
      }

      timers.clear()
    }
  }, [])

  const value = useMemo<ToastContextValue>(
    () => ({ dismiss, dismissAll, pause, paused, resume, toast, toasts }),
    [dismiss, dismissAll, pause, paused, resume, toast, toasts],
  )

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
}

/**
 * The live region. It stays mounted even while empty so assistive technology has
 * something to observe before the first toast arrives.
 */
export function ToastViewport({
  label = '알림',
  onBlur,
  onFocus,
  onMouseEnter,
  onMouseLeave,
  ...props
}: ToastViewportProps) {
  const context = useToastContext('ToastViewport')

  return (
    <div
      {...props}
      aria-label={label}
      data-paused={context.paused ? '' : undefined}
      onBlur={(event) => {
        onBlur?.(event)

        if (event.defaultPrevented || event.currentTarget.contains(event.relatedTarget)) {
          return
        }

        context.resume()
      }}
      onFocus={(event) => {
        onFocus?.(event)

        if (!event.defaultPrevented) {
          context.pause()
        }
      }}
      onMouseEnter={(event) => {
        onMouseEnter?.(event)

        if (!event.defaultPrevented) {
          context.pause()
        }
      }}
      onMouseLeave={(event) => {
        onMouseLeave?.(event)

        if (!event.defaultPrevented) {
          context.resume()
        }
      }}
      role="region"
    />
  )
}

/**
 * One toast. `role="alert"` and `role="status"` already imply their live-region
 * politeness, so the role alone decides how urgently it is announced.
 */
export function ToastRoot({ politeness = 'polite', toastId, ...props }: ToastRootProps) {
  return (
    <div
      {...props}
      aria-atomic="true"
      data-toast-id={toastId}
      role={politeness === 'assertive' ? 'alert' : 'status'}
    />
  )
}
