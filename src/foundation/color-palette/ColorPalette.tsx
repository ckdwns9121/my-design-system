import colorTokens from '../../tokens/color-tokens.json'

type TokenNode = string | { [key: string]: TokenNode }

type TokenEntry = {
  name: string
  variable: string
  value: string
}

function cssVariable(pathParts: string[]) {
  const cssPath = pathParts[0] === 'semantic' ? pathParts.slice(1) : pathParts

  return `--color-${cssPath.join('-')}`
}

function flattenTokens(node: { [key: string]: TokenNode }, pathParts: string[]): TokenEntry[] {
  return Object.entries(node).flatMap(([key, value]) => {
    const nextPath = [...pathParts, key]

    if (typeof value === 'string') {
      return {
        name: nextPath.slice(1).join('.'),
        variable: cssVariable(nextPath),
        value,
      }
    }

    return flattenTokens(value, nextPath)
  })
}

function formatReference(value: string) {
  return value.replace(/^\{(.+)\}$/, '$1')
}

const primitivePalettes = Object.entries(colorTokens.primitive)
const semanticTokens = flattenTokens(colorTokens.semantic, ['semantic'])

export function ColorPalette() {
  return (
    <div className="grid gap-6">
      <section className="grid gap-3">
        <div>
          <h2 className="text-lg font-semibold text-content-strong">Primitive palette</h2>
          <p className="text-sm leading-6 text-content-muted">
            원색 값은 여기에서만 직접 관리합니다. Primary primitive는 green 계열입니다.
          </p>
        </div>

        <div className="grid gap-4">
          {primitivePalettes.map(([paletteName, shades]) => (
            <div className="rounded-md border border-border-muted bg-surface-panel p-4" key={paletteName}>
              <h3 className="mb-3 text-sm font-semibold capitalize text-content-strong">
                primitive.{paletteName}
              </h3>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-11">
                {Object.entries(shades).map(([shade]) => {
                  const variable = `--color-primitive-${paletteName}-${shade}`

                  return (
                    <div className="min-w-0" key={shade}>
                      <div
                        className="h-12 rounded-sm border border-border-muted"
                        style={{ backgroundColor: `var(${variable})` }}
                      />
                      <p className="mt-1 truncate text-xs font-medium text-content-default">{shade}</p>
                      <p className="truncate text-xs text-content-subtle">{variable}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-3">
        <div>
          <h2 className="text-lg font-semibold text-content-strong">Semantic aliases</h2>
          <p className="text-sm leading-6 text-content-muted">
            컴포넌트는 primitive가 아니라 semantic alias를 사용합니다.
          </p>
        </div>

        <div className="grid gap-2 md:grid-cols-2">
          {semanticTokens.map((token) => (
            <div
              className="grid grid-cols-[3rem_1fr] gap-3 rounded-md border border-border-muted bg-surface-panel p-3"
              key={token.variable}
            >
              <div
                className="h-12 rounded-sm border border-border-muted"
                style={{ backgroundColor: `var(${token.variable})` }}
              />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-content-strong">{token.name}</p>
                <p className="truncate text-xs text-content-muted">{token.variable}</p>
                <p className="truncate text-xs text-content-subtle">{formatReference(token.value)}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
