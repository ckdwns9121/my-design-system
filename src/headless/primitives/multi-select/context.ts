import { createContext, useContext, type RefObject } from 'react'

export type MultiSelectOptionRecord = {
  disabled: boolean
  label: string
  value: string
}

export type MultiSelectContextValue = {
  activeValue: string | undefined
  baseId: string
  close: (returnFocus?: boolean) => void
  contentRef: RefObject<HTMLDivElement | null>
  getOptionLabel: (value: string) => string | undefined
  open: boolean
  registerOption: (option: MultiSelectOptionRecord) => () => void
  setActiveValue: (value: string | undefined) => void
  setOpen: (open: boolean) => void
  toggleValue: (value: string) => void
  triggerRef: RefObject<HTMLButtonElement | null>
  values: string[]
}

export const MultiSelectContext = createContext<MultiSelectContextValue | null>(null)

export function useMultiSelectContext(componentName: string) {
  const context = useContext(MultiSelectContext)

  if (!context) {
    throw new Error(`${componentName} must be used within MultiSelectRoot`)
  }

  return context
}
