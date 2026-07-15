import {
  TabsContent as HeadlessTabsContent,
  TabsList as HeadlessTabsList,
  TabsRoot as HeadlessTabsRoot,
  TabsTrigger as HeadlessTabsTrigger,
  type TabsContentProps,
  type TabsListProps,
  type TabsRootProps,
  type TabsTriggerProps,
} from '../../headless/primitives/tabs'
import { cn } from '../../lib/cn'

export type TabsProps = TabsRootProps
export type { TabsContentProps, TabsListProps, TabsRootProps, TabsTriggerProps }

export function Tabs({ className, ...props }: TabsProps) {
  return <HeadlessTabsRoot className={cn('w-full', className)} {...props} />
}

export function TabsList({ className, ...props }: TabsListProps) {
  return (
    <HeadlessTabsList
      className={cn(
        'inline-flex items-center gap-1 rounded-md bg-surface-muted p-1',
        'data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-stretch',
        className,
      )}
      {...props}
    />
  )
}

export function TabsTrigger({ className, ...props }: TabsTriggerProps) {
  return (
    <HeadlessTabsTrigger
      className={cn(
        'inline-flex h-9 min-w-20 items-center justify-center rounded px-3 text-sm font-medium transition-colors',
        'text-content-muted hover:bg-surface-panel hover:text-content-strong',
        'data-[state=active]:bg-surface-panel data-[state=active]:text-content-strong data-[state=active]:shadow-sm',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-default focus-visible:ring-offset-2',
        'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  )
}

export function TabsContent({ className, ...props }: TabsContentProps) {
  return (
    <HeadlessTabsContent
      className={cn(
        'mt-3 text-sm leading-6 text-content-default',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-default focus-visible:ring-offset-2',
        className,
      )}
      {...props}
    />
  )
}
