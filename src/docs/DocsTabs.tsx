import { Children, isValidElement, type ReactElement, type ReactNode } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/tabs'

type DocsTabValue = 'overview' | 'properties' | 'styles'

export type DocsTabProps = {
  value: DocsTabValue
  children: ReactNode
}

export type DocsTabsProps = {
  children: ReactNode
}

export type DocsSectionProps = {
  title: string
  children: ReactNode
}

/**
 * Marks a slot inside {@link DocsTabs}. It renders nothing on its own; DocsTabs
 * reads the `value` prop to decide where the children belong.
 */
export function DocsTab({ children }: DocsTabProps) {
  return <>{children}</>
}

export function DocsSection({ children, title }: DocsSectionProps) {
  return (
    <section className="grid gap-3">
      <h3 className="text-base font-semibold text-content-strong">{title}</h3>
      {children}
    </section>
  )
}

export function DocsTabs({ children }: DocsTabsProps) {
  const slots = Children.toArray(children).filter((child): child is ReactElement<DocsTabProps> =>
    isValidElement<DocsTabProps>(child),
  )
  const overview = slots.find((slot) => slot.props.value === 'overview')
  const properties = slots.find((slot) => slot.props.value === 'properties')
  const styles = slots.find((slot) => slot.props.value === 'styles')

  return (
    <div className="mt-8">
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          {properties ? <TabsTrigger value="properties">Properties</TabsTrigger> : null}
        </TabsList>

        <TabsContent className="grid gap-10 py-6" value="overview">
          {overview?.props.children}
          {styles ? (
            <section className="grid gap-6">
              <h2 className="text-lg font-semibold text-content-strong">Styles</h2>
              {styles.props.children}
            </section>
          ) : null}
        </TabsContent>

        {properties ? (
          <TabsContent className="py-6" value="properties">
            {properties.props.children}
          </TabsContent>
        ) : null}
      </Tabs>
    </div>
  )
}
