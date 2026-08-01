import type { ComponentDoc } from '../../docs/doc-types'

export const doc: ComponentDoc = {
  name: 'DropdownMenu',
  category: 'Overlay',
  summary: '트리거에서 펼쳐지는 명령 목록입니다.',
  keywords: [
    'dropdown menu',
    '메뉴',
    'menu button',
    'context menu',
    'actions',
  ],
  import: 'src/components',
  exports: [
    'DropdownMenu',
    'DropdownMenuContent',
    'DropdownMenuItem',
    'DropdownMenuLabel',
    'DropdownMenuPortal',
    'DropdownMenuSeparator',
    'DropdownMenuTrigger',
  ],
  rules: [
    '명령을 실행하는 메뉴입니다.',
    '위/아래 방향키로 항목을 이동하고 Escape로 닫으며 포커스는 트리거로 돌아갑니다.',
    '항목이 많으면 DropdownMenuLabel과 DropdownMenuSeparator로 묶습니다.',
  ],
  related: [
    { name: 'Select', when: '명령이 아니라 값을 고를 때' },
  ],
  headless: {
    exports: [
      'DropdownMenuRoot',
      'DropdownMenuTrigger',
      'DropdownMenuPortal',
      'DropdownMenuContent',
      'DropdownMenuItem',
      'DropdownMenuLabel',
      'DropdownMenuSeparator',
    ],
    import: 'src/headless',
  },
  ariaPattern: {
    name: 'Menu Button Pattern',
    url: 'https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/',
  },
  overviewStory: 'Basic',
  styleStories: [
    { title: '키보드로 열기', story: 'KeyboardOpenLast' },
  ],
}
