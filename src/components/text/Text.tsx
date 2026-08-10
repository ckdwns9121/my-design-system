import type { ElementType, HTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

type TextSize = 'xs' | 'sm' | 'md' | 'lg'
type TextTone = 'strong' | 'default' | 'muted' | 'subtle' | 'inverse' | 'danger' | 'success'
type TextWeight = 'normal' | 'medium' | 'semibold'

export type TextProps = HTMLAttributes<HTMLElement> & {
  /** Defaults to `p`. Use `span` inline, `dd`/`dt` in a description list. */
  as?: ElementType
  size?: TextSize
  tone?: TextTone
  weight?: TextWeight
  /** Clips to one line with an ellipsis. */
  truncate?: boolean
}

const sizeClasses: Record<TextSize, string> = {
  xs: 'text-xs leading-5',
  sm: 'text-sm leading-6',
  md: 'text-base leading-7',
  lg: 'text-lg leading-7',
}

const toneClasses: Record<TextTone, string> = {
  strong: 'text-content-strong',
  default: 'text-content-default',
  muted: 'text-content-muted',
  subtle: 'text-content-subtle',
  inverse: 'text-content-inverse',
  danger: 'text-status-danger-text',
  success: 'text-status-success-text',
}

const weightClasses: Record<TextWeight, string> = {
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
}

/**
 * Body text on the type scale.
 *
 * Size and tone are steps rather than values, so a screen cannot drift to a
 * one-off font size or a color outside the content tokens. Size and line height
 * move together; they are not separable props.
 */
export function Text({
  as: Component = 'p',
  className,
  size = 'sm',
  tone = 'default',
  truncate = false,
  weight = 'normal',
  ...props
}: TextProps) {
  return (
    <Component
      className={cn(
        sizeClasses[size],
        toneClasses[tone],
        weightClasses[weight],
        truncate ? 'truncate' : undefined,
        className,
      )}
      {...props}
    />
  )
}
