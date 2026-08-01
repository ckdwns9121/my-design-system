import { useMultiSelectContext } from './context'

/**
 * Reads the current selection from the nearest MultiSelectRoot so a trigger can
 * render its own summary without lifting state out of the primitive.
 */
export function useMultiSelectValues() {
  const context = useMultiSelectContext('useMultiSelectValues')

  return {
    getOptionLabel: context.getOptionLabel,
    values: context.values,
  }
}
