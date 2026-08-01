import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/tabs'
import colorTokens from '../../tokens/color-tokens.json'

type TokenNode = string | { [key: string]: TokenNode }
type TokenTree = { [key: string]: TokenNode }

type PrimitiveShade = {
  shade: string
  variable: string
  hex: string
}

type PrimitivePalette = {
  name: string
  shades: PrimitiveShade[]
}

type SemanticToken = {
  name: string
  variable: string
  reference: string
  hex: string
}

type SemanticGroup = {
  name: string
  tokens: SemanticToken[]
}

function readToken(path: string[]) {
  let node: TokenNode | undefined = colorTokens as unknown as TokenNode

  for (const part of path) {
    if (node === undefined || typeof node === 'string') {
      return undefined
    }

    node = node[part]
  }

  return typeof node === 'string' ? node : undefined
}

function resolveValue(value: string) {
  const match = /^\{(.+)\}$/.exec(value)

  if (!match) {
    return value
  }

  return readToken(match[1].split('.')) ?? value
}

function formatReference(value: string) {
  return value.replace(/^\{(.+)\}$/, '$1')
}

function flattenSemantic(node: TokenTree, pathParts: string[]): SemanticToken[] {
  return Object.entries(node).flatMap(([key, value]) => {
    const nextPath = [...pathParts, key]

    if (typeof value === 'string') {
      return {
        name: nextPath.join('.'),
        variable: `--color-${nextPath.join('-')}`,
        reference: formatReference(value),
        hex: resolveValue(value),
      }
    }

    return flattenSemantic(value, nextPath)
  })
}

const primitivePalettes: PrimitivePalette[] = Object.entries(
  colorTokens.primitive as TokenTree,
).map(([name, shades]) => ({
  name,
  shades: Object.entries(shades as TokenTree).map(([shade, hex]) => ({
    shade,
    variable: `--color-primitive-${name}-${shade}`,
    hex: String(hex),
  })),
}))

const semanticGroups: SemanticGroup[] = Object.entries(colorTokens.semantic as TokenTree).map(
  ([name, group]) => ({
    name,
    tokens: flattenSemantic(group as TokenTree, [name]),
  }),
)

function Swatch({ className, variable }: { className: string; variable: string }) {
  return <div className={className} style={{ backgroundColor: `var(${variable})` }} />
}

function OverviewCard({
  description,
  title,
  variables,
}: {
  description: string
  title: string
  variables: string[]
}) {
  return (
    <div className="rounded-md border border-border-muted bg-surface-panel p-5">
      <div className="mb-4 flex gap-2">
        {variables.map((variable) => (
          <Swatch
            className="h-10 flex-1 rounded-sm border border-border-muted"
            key={variable}
            variable={variable}
          />
        ))}
      </div>
      <p className="text-sm font-semibold text-content-strong">{title}</p>
      <p className="mt-2 text-sm leading-6 text-content-muted">{description}</p>
    </div>
  )
}

function SemanticCard({ token }: { token: SemanticToken }) {
  return (
    <div className="rounded-md border border-border-muted bg-surface-panel p-4">
      <Swatch
        className="mb-3 h-12 rounded-sm border border-border-muted"
        variable={token.variable}
      />
      <p className="truncate text-sm font-medium text-content-strong" title={token.name}>
        {token.name}
      </p>
      <p className="mt-1 truncate text-xs text-content-muted" title={token.variable}>
        {token.variable}
      </p>
      <p className="mt-2 truncate text-xs text-content-subtle" title={token.reference}>
        {token.reference}
      </p>
      <code className="mt-1 inline-block rounded-sm bg-surface-muted px-1.5 py-0.5 text-xs text-content-muted">
        {token.hex}
      </code>
    </div>
  )
}

function PaletteRow({ palette }: { palette: PrimitivePalette }) {
  return (
    <div className="border-b border-border-muted py-6 last:border-b-0 last:pb-0">
      <h3 className="mb-4 text-base font-semibold capitalize text-content-strong">{palette.name}</h3>

      <div className="overflow-x-auto pb-1">
        <div className="min-w-140">
          <div className="flex overflow-hidden rounded-md border border-border-muted">
            {palette.shades.map((shade) => (
              <Swatch className="h-20 flex-1" key={shade.variable} variable={shade.variable} />
            ))}
          </div>
          <div className="mt-3 flex">
            {palette.shades.map((shade) => (
              <div className="min-w-0 flex-1 pr-2" key={shade.variable}>
                <p className="truncate text-xs font-medium text-content-default">{shade.shade}</p>
                <p className="truncate text-xs text-content-subtle">{shade.hex}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export function ColorPalette() {
  return (
    <Tabs defaultValue="overview">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="palette">Palette</TabsTrigger>
      </TabsList>

      <TabsContent className="grid gap-10 pt-4" value="overview">
        <section className="grid gap-4">
          <h2 className="text-lg font-semibold text-content-strong">색상 개요</h2>

          <div className="grid gap-4 md:grid-cols-3">
            <OverviewCard
              description="저장, 확정, 선택처럼 가장 중요한 액션에 사용합니다."
              title="Primary"
              variables={['--color-primary-solid', '--color-primary-surface-strong']}
            />
            <OverviewCard
              description="페이지 배경, 패널, 비활성 면을 구성합니다."
              title="Surface"
              variables={[
                '--color-surface-canvas',
                '--color-surface-panel',
                '--color-surface-muted',
              ]}
            />
            <OverviewCard
              description="성공, 주의, 위험 상태를 구분합니다. 색상만으로 의미를 전달하지 않습니다."
              title="Status"
              variables={[
                '--color-status-success-text',
                '--color-status-warning-text',
                '--color-status-danger-solid',
              ]}
            />
          </div>
        </section>

        <section className="grid gap-6">
          <h2 className="text-lg font-semibold text-content-strong">Semantic Colors</h2>

          {semanticGroups.map((group) => (
            <div className="grid gap-3" key={group.name}>
              <h3 className="text-sm font-semibold capitalize text-content-strong">{group.name}</h3>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {group.tokens.map((token) => (
                  <SemanticCard key={token.variable} token={token} />
                ))}
              </div>
            </div>
          ))}
        </section>
      </TabsContent>

      <TabsContent className="grid gap-4 pt-4" value="palette">
        <h2 className="text-lg font-semibold text-content-strong">Primitive Palette</h2>

        <div className="rounded-md border border-border-muted bg-surface-panel px-5 pb-5">
          {primitivePalettes.map((palette) => (
            <PaletteRow key={palette.name} palette={palette} />
          ))}
        </div>
      </TabsContent>
    </Tabs>
  )
}
