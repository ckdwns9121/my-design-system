import { describe, expect, it } from 'vitest'
import colorTokens from './color-tokens.json'

/**
 * Contrast is the part of a palette that cannot be judged by looking at it, and
 * dark mode is where an eyeballed value usually fails. These pairs are the ones
 * a screen actually puts together, checked against WCAG AA in both themes.
 */
type TokenNode = string | { [key: string]: TokenNode }

const AA_TEXT = 4.5
const AA_LARGE = 3

function readPath(root: TokenNode, parts: string[]): string | undefined {
  let node: TokenNode | undefined = root

  for (const part of parts) {
    if (node === undefined || typeof node === 'string') {
      return undefined
    }

    node = node[part]
  }

  return typeof node === 'string' ? node : undefined
}

/** Resolves a semantic name to a hex value in the given theme. */
function resolve(name: string, theme: 'light' | 'dark') {
  const semantic =
    theme === 'dark'
      ? (readPath(colorTokens.semanticDark as TokenNode, name.split('.')) ??
        readPath(colorTokens.semantic as TokenNode, name.split('.')))
      : readPath(colorTokens.semantic as TokenNode, name.split('.'))

  if (!semantic) {
    throw new Error(`Unknown semantic token: ${name}`)
  }

  const match = /^\{primitive\.(.+)\}$/.exec(semantic)

  if (!match) {
    return semantic
  }

  const primitive = readPath(colorTokens.primitive as TokenNode, match[1].split('.'))

  if (!primitive) {
    throw new Error(`${name} references a missing primitive: ${semantic}`)
  }

  return primitive
}

function channelLuminance(channel: number) {
  const ratio = channel / 255

  return ratio <= 0.03928 ? ratio / 12.92 : ((ratio + 0.055) / 1.055) ** 2.4
}

function relativeLuminance(hex: string) {
  const value = hex.replace('#', '')
  const [red, green, blue] = [0, 2, 4].map((offset) =>
    Number.parseInt(value.slice(offset, offset + 2), 16),
  )

  return (
    0.2126 * channelLuminance(red) +
    0.7152 * channelLuminance(green) +
    0.0722 * channelLuminance(blue)
  )
}

function contrast(foreground: string, background: string) {
  const [lighter, darker] = [relativeLuminance(foreground), relativeLuminance(background)].sort(
    (a, b) => b - a,
  )

  return (lighter + 0.05) / (darker + 0.05)
}

/** [foreground, background, minimum] */
const textPairs: Array<[string, string, number]> = [
  ['content.strong', 'surface.canvas', AA_TEXT],
  ['content.strong', 'surface.panel', AA_TEXT],
  ['content.default', 'surface.canvas', AA_TEXT],
  ['content.default', 'surface.panel', AA_TEXT],
  ['content.muted', 'surface.panel', AA_TEXT],
  ['content.muted', 'surface.muted', AA_TEXT],
  ['content.inverse', 'surface.inverse', AA_TEXT],
  ['primary.on-solid', 'primary.solid', AA_TEXT],
  ['primary.on-solid', 'primary.solid-hover', AA_TEXT],
  ['primary.text', 'surface.panel', AA_TEXT],
  ['primary.text-strong', 'primary.surface', AA_TEXT],
  ['status.success.text', 'status.success.surface', AA_TEXT],
  ['status.success.text', 'surface.panel', AA_TEXT],
  ['status.warning.text', 'status.warning.surface', AA_TEXT],
  ['status.warning.text', 'surface.panel', AA_TEXT],
  ['status.danger.text', 'status.danger.surface', AA_TEXT],
  ['status.danger.text', 'surface.panel', AA_TEXT],
  ['content.inverse', 'status.danger.solid', AA_TEXT],
]

/**
 * Non-text contrast, 3:1 under WCAG 1.4.11.
 *
 * The requirement covers what identifies a control and its state, not every
 * line on the page. `border.strong` draws control boundaries — inputs, secondary
 * buttons, checkboxes — and is checked here. `border.default` and `border.muted`
 * separate containers, which the content already delimits, so they are exempt
 * and stay lighter on purpose.
 */
const nonTextPairs: Array<[string, string, number]> = [
  ['border.strong', 'surface.panel', AA_LARGE],
  ['border.strong', 'surface.canvas', AA_LARGE],
  ['focus.default', 'surface.canvas', AA_LARGE],
  ['focus.default', 'surface.panel', AA_LARGE],
  ['primary.ring', 'surface.panel', AA_LARGE],
]

describe.each(['light', 'dark'] as const)('%s theme contrast', (theme) => {
  it.each(textPairs)('%s on %s meets AA for text', (foreground, background, minimum) => {
    const ratio = contrast(resolve(foreground, theme), resolve(background, theme))

    expect(
      Number(ratio.toFixed(2)),
      `${theme}: ${foreground} on ${background} is ${ratio.toFixed(2)}:1`,
    ).toBeGreaterThanOrEqual(minimum)
  })

  it.each(nonTextPairs)('%s on %s meets AA for non-text', (foreground, background, minimum) => {
    const ratio = contrast(resolve(foreground, theme), resolve(background, theme))

    expect(
      Number(ratio.toFixed(2)),
      `${theme}: ${foreground} on ${background} is ${ratio.toFixed(2)}:1`,
    ).toBeGreaterThanOrEqual(minimum)
  })
})

describe('dark theme coverage', () => {
  it('overrides every semantic group the light theme defines', () => {
    expect(Object.keys(colorTokens.semanticDark).sort()).toEqual(
      Object.keys(colorTokens.semantic).sort(),
    )
  })

  it('remaps every semantic name, so no component sees a light value on a dark surface', () => {
    const flatten = (node: TokenNode, prefix: string[] = []): string[] =>
      typeof node === 'string'
        ? [prefix.join('.')]
        : Object.entries(node).flatMap(([key, value]) => flatten(value, [...prefix, key]))

    expect(flatten(colorTokens.semanticDark as TokenNode).sort()).toEqual(
      flatten(colorTokens.semantic as TokenNode).sort(),
    )
  })
})
