import type { ComponentDoc } from '../../docs/doc-types'

export const doc: ComponentDoc = {
  name: 'Table',
  category: 'Data display',
  summary: '행과 열로 이루어진 데이터를 보여줍니다.',
  keywords: [
    'table',
    '테이블',
    'data grid',
    '그리드',
    'list',
    'datatable',
  ],
  import: 'src/components',
  exports: [
    'Table',
    'TableBody',
    'TableCaption',
    'TableCell',
    'TableFooter',
    'TableHead',
    'TableHeader',
    'TableRow',
    'TableSelectionCheckbox',
  ],
  rules: [
    '기본은 네이티브 table 시맨틱을 그대로 씁니다.',
    '정렬과 선택이 필요하면 grid 모드를 켜서 role=grid, aria-sort, aria-selected를 활성화합니다.',
    '정렬 가능한 헤더는 버튼으로 만들어 키보드로도 조작할 수 있게 합니다.',
  ],
  related: [
    { name: 'Pagination', when: '행이 많아 페이지로 나눠야 할 때' },
  ],
  headless: {
    exports: [
      'TableRoot',
      'TableHeader',
      'TableBody',
      'TableRow',
      'TableColumnHeader',
      'TableCell',
      'useTableSort',
      'useTableSelection',
    ],
    import: 'src/headless',
  },
  ariaPattern: {
    name: 'Grid Pattern',
    url: 'https://www.w3.org/WAI/ARIA/apg/patterns/grid/',
    notes: [
      'grid 모드에서만 적용됩니다. 기본 모드는 정적 table이라 패턴을 따르지 않습니다.',
    ],
  },
  overviewStory: 'Basic',
  styleStories: [
    { title: '푸터', story: 'WithFooter' },
    { title: '정렬과 선택', story: 'InteractiveGrid' },
  ],
}
