import { describe, expect, it } from 'vitest'
import { iconKeywords } from './icon-keywords'
import * as icons from './icons'

const exported = Object.keys(icons)

describe('icon keywords', () => {
  it('covers every exported icon', () => {
    expect(Object.keys(iconKeywords).sort()).toEqual(exported.sort())
  })

  it('keeps every term lowercase for case-insensitive matching', () => {
    for (const [name, keywords] of Object.entries(iconKeywords)) {
      expect(keywords.length, name).toBeGreaterThan(0)
      expect(keywords, name).toEqual(keywords.map((keyword) => keyword.toLowerCase()))
    }
  })
})
