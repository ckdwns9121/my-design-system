import { ArgTypes, Canvas, Subtitle, Title } from '@storybook/addon-docs/blocks'
import type { ComponentProps } from 'react'
import { DocsSection, DocsTab, DocsTabs } from './DocsTabs'
import type { ComponentDoc } from './doc-types'

type CanvasOf = ComponentProps<typeof Canvas>['of']

export type ComponentDocsProps = {
  doc: ComponentDoc
  /** The component's `*.stories` module, used to resolve story names in the doc. */
  stories: Record<string, unknown>
}

function Rules({ rules }: { rules: string[] }) {
  return (
    <ul className="ml-5 grid list-disc gap-1.5 text-sm leading-6 text-content-default">
      {rules.map((rule) => (
        <li key={rule}>{rule}</li>
      ))}
    </ul>
  )
}

function Meta({ doc }: { doc: ComponentDoc }) {
  const { ariaPattern, headless, related } = doc

  if (!related && !headless && !ariaPattern) {
    return null
  }

  return (
    <div className="grid gap-3 rounded-md border border-border-muted bg-surface-panel p-4">
      {related ? (
        <div className="grid gap-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-content-subtle">
            헷갈리는 것
          </p>
          <ul className="grid gap-1 text-sm leading-6 text-content-default">
            {related.map((entry) => (
              <li key={entry.name}>
                <code className="rounded-sm bg-surface-muted px-1.5 py-0.5 text-xs">
                  {entry.name}
                </code>{' '}
                {entry.when}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {headless ? (
        <div className="grid gap-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-content-subtle">
            Headless
          </p>
          <p className="text-sm leading-6 text-content-default">
            스타일 없이 동작만 쓰려면{' '}
            <code className="rounded-sm bg-surface-muted px-1.5 py-0.5 text-xs">
              {headless.exports.join(', ')}
            </code>{' '}
            를 <code className="text-xs">{headless.import}</code> 에서 가져옵니다.
          </p>
        </div>
      ) : null}

      {ariaPattern ? (
        <div className="grid gap-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-content-subtle">
            ARIA 패턴
          </p>
          <p className="text-sm leading-6 text-content-default">
            <a
              className="text-primary-text underline underline-offset-4"
              href={ariaPattern.url}
              rel="noreferrer"
              target="_blank"
            >
              {ariaPattern.name}
            </a>
          </p>
          {ariaPattern.notes ? <Rules rules={ariaPattern.notes} /> : null}
        </div>
      ) : null}
    </div>
  )
}

/**
 * Renders a documentation page from its {@link ComponentDoc}. The MDX file only
 * supplies the doc and the story module, so the page and the generated manifest
 * always describe the same component.
 */
export function ComponentDocs({ doc, stories }: ComponentDocsProps) {
  const overview = stories[doc.overviewStory] as CanvasOf

  return (
    <>
      <Title>{doc.name}</Title>
      <Subtitle>{doc.summary}</Subtitle>

      <DocsTabs>
        <DocsTab value="overview">
          <Canvas of={overview} />

          <pre className="overflow-x-auto rounded-md border border-border-muted bg-surface-muted p-3 text-xs leading-6 text-content-default">
            <code>{`import { ${doc.exports.join(', ')} } from '${doc.import}'`}</code>
          </pre>

          <Rules rules={doc.rules} />
          <Meta doc={doc} />
        </DocsTab>

        <DocsTab value="properties">
          <ArgTypes />
        </DocsTab>

        {doc.styleStories ? (
          <DocsTab value="styles">
            {doc.styleStories.map((entry) => (
              <DocsSection key={entry.story} title={entry.title}>
                <Canvas of={stories[entry.story] as CanvasOf} />
              </DocsSection>
            ))}
          </DocsTab>
        ) : null}
      </DocsTabs>
    </>
  )
}
