/**
 * Ranking for the `search` tool.
 *
 * Results are deliberately brief. An agent asking "설정 켜고 끄는 컴포넌트"
 * needs two or three candidates and the reason to prefer one, not the full
 * documentation of every component that mentions a switch.
 */

const EXACT = 100
const PREFIX = 90
const SUBSTRING = 80
const ALL_WORDS = 65
const SOME_WORDS = 40

export function scoreText(text, query) {
  const haystack = text.toLowerCase()
  const needle = query.toLowerCase().trim()

  if (!needle) {
    return 0
  }

  if (haystack === needle) return EXACT
  if (haystack.startsWith(needle)) return PREFIX
  if (haystack.includes(needle)) return SUBSTRING

  const words = needle.split(/\s+/).filter((word) => word.length > 1)

  if (words.length === 0) {
    return 0
  }

  const matched = words.filter((word) => haystack.includes(word)).length

  if (matched === words.length) return ALL_WORDS

  return matched > 0 ? Math.round((SOME_WORDS * matched) / words.length) : 0
}

/** Best score across a set of fields, with names weighted above prose. */
function scoreEntry(fields, query) {
  return Math.max(
    ...fields.map(({ text, weight = 1 }) => Math.round(scoreText(text, query) * weight)),
  )
}

function searchComponents(components, query) {
  return components
    .map((component) => ({
      type: 'component',
      name: component.name,
      category: component.category,
      summary: component.summary,
      import: component.import,
      score: scoreEntry(
        [
          { text: component.name, weight: 1 },
          ...component.keywords.map((keyword) => ({ text: keyword, weight: 0.98 })),
          { text: component.summary, weight: 0.75 },
          ...component.rules.map((rule) => ({ text: rule, weight: 0.5 })),
        ],
        query,
      ),
      // Disambiguation travels with the hit, so the agent sees the alternative
      // in the same response rather than after picking wrong.
      related: component.related,
    }))
    .filter((entry) => entry.score > 0)
}

function searchIcons(icons, query) {
  return icons
    .map((icon) => ({
      type: 'icon',
      name: icon.name,
      import: icon.import,
      score: scoreEntry(
        [
          { text: icon.name, weight: 1 },
          { text: icon.name.replace(/Icon$/, ''), weight: 1 },
          ...icon.keywords.map((keyword) => ({ text: keyword, weight: 0.95 })),
        ],
        query,
      ),
    }))
    .filter((entry) => entry.score > 0)
}

export function search(index, query, { type = 'all', limit = 8 } = {}) {
  const results = [
    ...(type === 'all' || type === 'component' ? searchComponents(index.components, query) : []),
    ...(type === 'all' || type === 'icon' ? searchIcons(index.icons, query) : []),
  ]

  return results
    .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name))
    .slice(0, limit)
}

export function getComponent(index, name) {
  const needle = name.toLowerCase()

  return (
    index.components.find((component) => component.name.toLowerCase() === needle) ??
    index.components.find((component) => component.name.toLowerCase().startsWith(needle)) ??
    null
  )
}

export function getIcon(index, name) {
  const needle = name.toLowerCase().replace(/icon$/, '')

  return (
    index.icons.find((icon) => icon.name.toLowerCase().replace(/icon$/, '') === needle) ?? null
  )
}

export function searchTokens(index, query, { kind = 'all', limit = 40 } = {}) {
  const pool = index.tokens.filter((token) => kind === 'all' || token.kind === kind)

  if (!query) {
    return pool.slice(0, limit)
  }

  return pool
    .map((token) => ({
      ...token,
      score: scoreEntry(
        [
          { text: token.name, weight: 1 },
          { text: token.cssVariable, weight: 0.9 },
          { text: token.tailwind ?? '', weight: 0.9 },
          { text: token.value, weight: 0.8 },
        ],
        query,
      ),
    }))
    .filter((token) => token.score > 0)
    .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name))
    .slice(0, limit)
}
