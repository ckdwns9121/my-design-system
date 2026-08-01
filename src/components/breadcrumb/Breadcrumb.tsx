import type { AnchorHTMLAttributes, HTMLAttributes, LiHTMLAttributes, OlHTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

export type BreadcrumbProps = Omit<HTMLAttributes<HTMLElement>, 'children'> & {
  /** Accessible name for the landmark. Multiple breadcrumbs on a page need distinct names. */
  label?: string
  children: OlHTMLAttributes<HTMLOListElement>['children']
}

export type BreadcrumbListProps = OlHTMLAttributes<HTMLOListElement>
export type BreadcrumbItemProps = LiHTMLAttributes<HTMLLIElement>
export type BreadcrumbLinkProps = AnchorHTMLAttributes<HTMLAnchorElement>
export type BreadcrumbPageProps = HTMLAttributes<HTMLSpanElement>
export type BreadcrumbSeparatorProps = LiHTMLAttributes<HTMLLIElement>

export function Breadcrumb({ children, className, label = 'Breadcrumb', ...props }: BreadcrumbProps) {
  return (
    <nav aria-label={label} className={cn('w-full', className)} {...props}>
      <BreadcrumbList>{children}</BreadcrumbList>
    </nav>
  )
}

function BreadcrumbList({ className, ...props }: BreadcrumbListProps) {
  return (
    <ol
      className={cn('flex flex-wrap items-center gap-1.5 text-sm text-content-muted', className)}
      {...props}
    />
  )
}

export function BreadcrumbItem({ className, ...props }: BreadcrumbItemProps) {
  return <li className={cn('inline-flex items-center gap-1.5', className)} {...props} />
}

export function BreadcrumbLink({ className, ...props }: BreadcrumbLinkProps) {
  return (
    <a
      className={cn(
        'rounded-sm underline-offset-4 transition-colors hover:text-content-strong hover:underline',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-default focus-visible:ring-offset-2',
        className,
      )}
      {...props}
    />
  )
}

export function BreadcrumbPage({ className, ...props }: BreadcrumbPageProps) {
  return (
    <span
      aria-current="page"
      className={cn('font-medium text-content-strong', className)}
      {...props}
    />
  )
}

export function BreadcrumbSeparator({ children, className, ...props }: BreadcrumbSeparatorProps) {
  return (
    <li aria-hidden="true" className={cn('text-content-subtle', className)} {...props}>
      {children ?? '/'}
    </li>
  )
}
