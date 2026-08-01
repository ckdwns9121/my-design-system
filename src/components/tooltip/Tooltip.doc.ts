import type { ComponentDoc } from '../../docs/doc-types'

export const doc: ComponentDoc = {
  name: 'Tooltip',
  category: 'Overlay',
  summary: '요소의 이름이나 짧은 보충 설명을 띄웁니다.',
  keywords: [
    'tooltip',
    '툴팁',
    'hint',
    '설명',
  ],
  import: 'src/components',
  exports: [
    'TooltipRoot',
    'TooltipContent',
    'TooltipPortal',
    'TooltipTrigger',
  ],
  rules: [
    '포커스와 마우스 오버 모두에서 열립니다. 키보드 사용자도 같은 내용을 볼 수 있어야 합니다.',
    '툴팁 안에는 상호작용 요소를 넣지 않습니다.',
    '없으면 이해할 수 없는 내용은 툴팁이 아니라 본문에 씁니다.',
  ],
  related: [
    { name: 'Popover', when: '안에 버튼이나 입력이 들어갈 때' },
  ],
  headless: {
    exports: [
      'TooltipRoot',
      'TooltipTrigger',
      'TooltipPortal',
      'TooltipContent',
    ],
    import: 'src/headless',
  },
  ariaPattern: {
    name: 'Tooltip Pattern',
    url: 'https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/',
  },
  overviewStory: 'Focus',
  styleStories: [
    { title: '마우스 오버', story: 'Hover' },
  ],
}
