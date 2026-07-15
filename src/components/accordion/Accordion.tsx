import {
  AccordionContent as HeadlessAccordionContent,
  AccordionHeader as HeadlessAccordionHeader,
  AccordionItem as HeadlessAccordionItem,
  AccordionRoot as HeadlessAccordionRoot,
  AccordionTrigger as HeadlessAccordionTrigger,
  type AccordionContentProps,
  type AccordionHeaderProps,
  type AccordionItemProps,
  type AccordionRootProps,
  type AccordionTriggerProps,
} from '../../headless/primitives/accordion'
import { cn } from '../../lib/cn'

export type AccordionProps = AccordionRootProps
export type {
  AccordionContentProps,
  AccordionHeaderProps,
  AccordionItemProps,
  AccordionTriggerProps,
}

export function Accordion({ className, ...props }: AccordionProps) {
  return (
    <HeadlessAccordionRoot
      className={cn(
        'w-full divide-y divide-border-muted rounded-md border border-border-default bg-surface-panel',
        className,
      )}
      {...props}
    />
  )
}

export function AccordionItem({ className, ...props }: AccordionItemProps) {
  return (
    <HeadlessAccordionItem
      className={cn(
        'data-[disabled]:opacity-50',
        'first:rounded-t-md last:rounded-b-md',
        className,
      )}
      {...props}
    />
  )
}

export function AccordionHeader({ className, ...props }: AccordionHeaderProps) {
  return (
    <HeadlessAccordionHeader
      className={cn('text-sm font-medium leading-6 text-content-strong', className)}
      {...props}
    />
  )
}

export function AccordionTrigger({
  children,
  className,
  ...props
}: AccordionTriggerProps) {
  return (
    <HeadlessAccordionTrigger
      className={cn(
        'group flex min-h-12 w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors',
        'text-content-strong hover:bg-surface-muted/70',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-focus-default',
        'disabled:pointer-events-none disabled:cursor-not-allowed',
        'aria-disabled:cursor-default aria-disabled:hover:bg-transparent',
        className,
      )}
      {...props}
    >
      <span>{children}</span>
      <span
        aria-hidden="true"
        className="text-content-muted transition-transform group-data-[state=open]:rotate-180"
      >
        v
      </span>
    </HeadlessAccordionTrigger>
  )
}

export function AccordionContent({
  children,
  className,
  ...props
}: AccordionContentProps) {
  return (
    <HeadlessAccordionContent
      className={cn(
        'px-4 pb-4 text-sm leading-6 text-content-muted',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-focus-default',
        className,
      )}
      {...props}
    >
      {children}
    </HeadlessAccordionContent>
  )
}
