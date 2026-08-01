import type { ReactNode, SVGProps } from 'react'
import { cn } from '../lib/cn'

export type IconProps = Omit<SVGProps<SVGSVGElement>, 'children'> & {
  /**
   * Accessible name. Leave it out for icons that sit next to their own text —
   * those are decorative and stay hidden from assistive technology.
   */
  title?: string
  /** Rendered size in pixels. A `size-*` class overrides it. */
  size?: number
}

/**
 * Builds an icon component from path data.
 *
 * Every icon draws on a 24x24 grid with strokes in `currentColor`, so an icon
 * takes its color from the surrounding text and never needs a color prop.
 */
export function createIcon(displayName: string, paths: ReactNode) {
  function Icon({ className, size = 20, title, ...props }: IconProps) {
    return (
      <svg
        aria-hidden={title ? undefined : true}
        aria-label={title}
        className={cn('shrink-0', className)}
        fill="none"
        focusable="false"
        height={size}
        role={title ? 'img' : undefined}
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        viewBox="0 0 24 24"
        width={size}
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        {paths}
      </svg>
    )
  }

  Icon.displayName = displayName

  return Icon
}
