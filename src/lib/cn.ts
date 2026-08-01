import { twMerge } from 'tailwind-merge'

/**
 * Joins class names and drops the ones a later class overrides.
 *
 * Without the merge step a caller passing `bg-surface-panel` to a component
 * whose base is `bg-primary-solid` gets whichever rule Tailwind happened to emit
 * last, which is not something the caller can predict. Conflicts now resolve by
 * argument order: the last class named for a property wins.
 */
export function cn(...classes: Array<string | false | null | undefined>) {
  return twMerge(classes.filter(Boolean).join(' '))
}
