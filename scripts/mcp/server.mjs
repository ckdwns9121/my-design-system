#!/usr/bin/env node
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { z } from 'zod'
import { loadIndex } from './index-data.mjs'
import { getComponent, getIcon, search, searchTokens } from './search.mjs'

/**
 * Serves this design system's own documentation to an agent over stdio.
 *
 * The rules that decide between Switch and ToggleButton, or that require
 * IconButton to carry a label, live in the component docs. Without this server
 * an agent has to find and read those files first, which it usually will not do
 * before writing the component. Answers stay short on purpose: `search` returns
 * candidates with the reason to prefer one, and `get` is the deliberate second
 * call once a choice is made.
 */
const index = await loadIndex()

const server = new McpServer({
  name: 'headless-core-design-system',
  version: '0.1.0',
})

function json(value) {
  return { content: [{ type: 'text', text: JSON.stringify(value, null, 2) }] }
}

server.registerTool(
  'search',
  {
    title: 'Search components and icons',
    description:
      'Find the component or icon to use for a described need. Accepts natural language in Korean or English, e.g. "설정 켜고 끄기", "여러 개 선택", "trash". Returns brief candidates; call get for full documentation.',
    inputSchema: {
      query: z.string().describe('What the UI needs to do, or a component/icon name.'),
      type: z.enum(['all', 'component', 'icon']).optional().describe('Defaults to all.'),
      limit: z.number().int().min(1).max(25).optional().describe('Defaults to 8.'),
    },
  },
  async ({ limit, query, type }) => {
    const results = search(index, query, { limit, type })

    return json({
      query,
      results,
      hint: results.length
        ? 'Call get with a name for rules, exports, and the ARIA pattern.'
        : 'No match. Try a different word, or call search with type "icon".',
    })
  },
)

server.registerTool(
  'get',
  {
    title: 'Get a component or icon',
    description:
      'Full documentation for one component: usage rules, exports to import, headless equivalent, the WAI-ARIA pattern it implements, and which components it is confused with.',
    inputSchema: {
      name: z.string().describe('Component or icon name, e.g. "Switch" or "TrashIcon".'),
    },
  },
  async ({ name }) => {
    const component = getComponent(index, name)

    if (component) {
      return json({ type: 'component', ...component })
    }

    const icon = getIcon(index, name)

    if (icon) {
      return json({
        type: 'icon',
        ...icon,
        usage: [
          'Decorative by default; it is hidden from assistive technology.',
          'Pass title only when the icon alone carries the meaning.',
          'Color comes from currentColor, so there is no color prop.',
        ],
      })
    }

    return json({
      error: `Unknown name: ${name}`,
      suggestions: search(index, name, { limit: 5 }).map((entry) => entry.name),
    })
  },
)

server.registerTool(
  'tokens',
  {
    title: 'Look up color tokens',
    description:
      'Resolve design tokens. Components must use semantic tokens, never a raw hex value or a primitive. Search by intent ("danger", "배경"), by CSS variable, or by hex.',
    inputSchema: {
      query: z.string().optional().describe('Omit to list tokens.'),
      kind: z.enum(['all', 'semantic', 'primitive']).optional().describe('Defaults to all.'),
    },
  },
  async ({ kind, query }) =>
    json({
      query: query ?? null,
      rule: 'Style components with semantic tokens. Primitives exist only to feed them.',
      tokens: searchTokens(index, query, { kind }),
    }),
)

await server.connect(new StdioServerTransport())
