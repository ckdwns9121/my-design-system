import { describe, expect, it } from 'vitest'
import type { ComponentDoc } from './doc-types'

/**
 * Docs reference stories by name, so a renamed story would leave a blank Canvas
 * that only a human viewing the page would notice. These tests fail instead.
 */
const docModules = import.meta.glob<{ doc: ComponentDoc }>('../components/*/*.doc.ts', {
  eager: true,
})
const storyModules = import.meta.glob<Record<string, unknown>>('../components/*/*.stories.tsx', {
  eager: true,
})

function storiesFor(docPath: string) {
  return storyModules[docPath.replace(/\.doc\.ts$/, '.stories.tsx')]
}

const entries = Object.entries(docModules).map(([docPath, module]) => ({
  docPath,
  doc: module.doc,
  stories: storiesFor(docPath),
}))

const docNames = new Set(entries.map((entry) => entry.doc.name))

describe('component docs', () => {
  it('finds a doc for every component directory', () => {
    const componentDirs = new Set(
      Object.keys(import.meta.glob('../components/*/index.ts')).map(
        (file) => file.split('/')[2],
      ),
    )

    expect(entries).toHaveLength(componentDirs.size)
  })

  it.each(entries)('$doc.name has a matching stories module', ({ stories }) => {
    expect(stories).toBeDefined()
  })

  it.each(entries)('$doc.name points at stories that exist', ({ doc, stories }) => {
    expect(stories?.[doc.overviewStory]).toBeDefined()

    for (const entry of doc.styleStories ?? []) {
      expect(stories?.[entry.story], `${doc.name}.${entry.story}`).toBeDefined()
    }
  })

  it.each(entries)('$doc.name only relates to components that exist', ({ doc }) => {
    for (const entry of doc.related ?? []) {
      expect(docNames, `${doc.name} -> ${entry.name}`).toContain(entry.name)
    }
  })

  it.each(entries)('$doc.name carries the fields agents read', ({ doc }) => {
    expect(doc.summary.length).toBeGreaterThan(0)
    expect(doc.rules.length).toBeGreaterThan(0)
    expect(doc.keywords.length).toBeGreaterThan(0)
    // Keywords are matched case-insensitively against lowercase input.
    expect(doc.keywords).toEqual(doc.keywords.map((keyword) => keyword.toLowerCase()))
  })

  it('lists exports that the barrel actually provides', async () => {
    const barrel = (await import('../components')) as Record<string, unknown>

    for (const { doc } of entries) {
      expect(doc.exports.length, doc.name).toBeGreaterThan(0)

      for (const name of doc.exports) {
        expect(barrel[name], `${doc.name} -> ${name}`).toBeDefined()
      }
    }
  })
})
