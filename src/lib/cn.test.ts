import { describe, expect, it } from 'vitest'
import { cn } from './cn'

/**
 * The class names here are this system's semantic tokens rather than Tailwind's
 * built-in palette, so these tests check that the merge still recognizes which
 * property each one sets.
 */
describe('cn', () => {
  it('drops falsy entries', () => {
    expect(cn('a', false, null, undefined, 'b')).toBe('a b')
  })

  it('lets a later semantic color win', () => {
    expect(cn('bg-primary-solid', 'bg-surface-panel')).toBe('bg-surface-panel')
    expect(cn('text-content-muted', 'text-content-strong')).toBe('text-content-strong')
  })

  it('keeps classes that set different properties', () => {
    expect(cn('bg-primary-solid', 'text-primary-on-solid')).toBe(
      'bg-primary-solid text-primary-on-solid',
    )
  })

  it('separates border width from border color', () => {
    // The width is overridden; the color is a different property and survives.
    expect(cn('border border-border-default', 'border-0')).toBe('border-border-default border-0')
  })

  it('resolves radius and size conflicts', () => {
    expect(cn('rounded-sm', 'rounded-none')).toBe('rounded-none')
    expect(cn('size-4', 'size-8')).toBe('size-8')
    expect(cn('h-10 px-4', 'h-8')).toBe('px-4 h-8')
  })

  it('treats a variant as a separate property from its base', () => {
    // Switch relies on this: the base track color and the checked override must
    // both survive, because they never apply at the same time.
    expect(cn('bg-border-default', 'data-[state=checked]:bg-primary-solid')).toBe(
      'bg-border-default data-[state=checked]:bg-primary-solid',
    )
  })

  it('still resolves conflicts inside the same variant', () => {
    expect(cn('hover:bg-surface-muted', 'hover:bg-primary-surface')).toBe(
      'hover:bg-primary-surface',
    )
  })
})
