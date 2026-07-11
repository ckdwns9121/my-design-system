import { useCallback, useState } from 'react'

export type ControllableStateSetter<T> = (nextValue: T | ((prevValue: T) => T)) => void

export type UseControllableStateOptions<T> = {
  value?: T
  defaultValue: T
  onChange?: (value: T) => void
}

export function useControllableState<T>({
  value,
  defaultValue,
  onChange,
}: UseControllableStateOptions<T>): [T, ControllableStateSetter<T>] {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue)
  const isControlled = value !== undefined
  const currentValue = isControlled ? value : uncontrolledValue

  const setValue = useCallback<ControllableStateSetter<T>>(
    (nextValue) => {
      const resolvedValue =
        typeof nextValue === 'function'
          ? (nextValue as (prevValue: T) => T)(currentValue)
          : nextValue

      if (Object.is(resolvedValue, currentValue)) {
        return
      }

      if (!isControlled) {
        setUncontrolledValue(resolvedValue)
      }

      onChange?.(resolvedValue)
    },
    [currentValue, isControlled, onChange],
  )

  return [currentValue, setValue]
}
