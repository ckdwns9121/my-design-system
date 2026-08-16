import { describe, expect, it } from 'vitest'
import { loadIndex } from './index-data.mjs'
import { getComponent, getIcon, search, searchTokens } from './search.mjs'

const index = await loadIndex()
const names = (results) => results.map((result) => result.name)

describe('mcp search', () => {
  it('indexes components, icons, and tokens', () => {
    // Exact, so adding or dropping a component is a deliberate edit here rather
    // than a silent change in what agents can find.
    expect(index.components).toHaveLength(35)
    expect(index.icons).toHaveLength(37)
    expect(index.tokens.length).toBeGreaterThan(50)
  })

  it('resolves a Korean description of intent to the right component', () => {
    expect(names(search(index, '설정 켜고 끄기'))[0]).toBe('Switch')
    expect(names(search(index, '여러 개 선택'))).toContain('MultiSelect')
    expect(names(search(index, '페이지 이동'))).toContain('Pagination')
  })

  it('sends 토글 to Switch and carries the alternative with it', () => {
    // The rename moved this keyword deliberately; a request for a "toggle" in
    // everyday speech means the setting control, not the toolbar button.
    const [top] = search(index, '토글')

    expect(top.name).toBe('Switch')
    expect(top.related.map((entry) => entry.name)).toContain('ToggleButton')
  })

  it('finds icons by Korean and by intent', () => {
    expect(names(search(index, '쓰레기통', { type: 'icon' }))).toContain('TrashIcon')
    expect(names(search(index, '돋보기', { type: 'icon' }))).toContain('SearchIcon')
    expect(names(search(index, 'loading', { type: 'icon' }))).toContain('SpinnerIcon')
  })

  it('ranks an exact name first', () => {
    expect(names(search(index, 'Dialog'))[0]).toBe('Dialog')
  })

  it('keeps a result set small enough to sit in a prompt', () => {
    const results = search(index, '선택')

    expect(results.length).toBeLessThanOrEqual(8)
    expect(JSON.stringify(results).length).toBeLessThan(4000)
  })

  it('returns nothing rather than noise for an unrelated query', () => {
    expect(search(index, 'kubernetes')).toHaveLength(0)
  })

  it('gets a component by exact and partial name', () => {
    expect(getComponent(index, 'switch').name).toBe('Switch')
    expect(getComponent(index, 'MultiSel').name).toBe('MultiSelect')
    expect(getComponent(index, 'nope')).toBeNull()
  })

  it('gets an icon with or without the Icon suffix', () => {
    expect(getIcon(index, 'Trash').name).toBe('TrashIcon')
    expect(getIcon(index, 'TrashIcon').name).toBe('TrashIcon')
  })

  it('resolves a semantic token to a value and a Tailwind class', () => {
    const [token] = searchTokens(index, 'primary.solid', { kind: 'semantic' })

    expect(token.cssVariable).toBe('--color-primary-solid')
    expect(token.tailwind).toBe('primary-solid')
    expect(token.value).toBe('#15803d')
    expect(token.references).toBe('primitive.green.700')
  })

  it('finds a token by hex', () => {
    expect(searchTokens(index, '#15803d').length).toBeGreaterThan(0)
  })
})
