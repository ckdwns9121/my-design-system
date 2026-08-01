import type { ComponentDoc } from '../../docs/doc-types'

export const doc: ComponentDoc = {
  name: 'Popover',
  category: 'Overlay',
  summary: '트리거 옆에 보조 내용이나 간단한 입력을 띄웁니다.',
  keywords: [
    'popover',
    '팝오버',
    'flyout',
    'overlay',
  ],
  import: 'src/components',
  exports: [
    'PopoverRoot',
    'PopoverClose',
    'PopoverContent',
    'PopoverPortal',
    'PopoverTrigger',
  ],
  rules: [
    '포커스를 가두지 않으므로 필수 입력을 Popover 안에서 받지 않습니다.',
    'Escape와 바깥 클릭으로 닫히고 포커스는 트리거로 돌아갑니다.',
  ],
  related: [
    { name: 'Tooltip', when: '설명 한 줄만 필요할 때' },
    { name: 'DropdownMenu', when: '명령 목록을 띄울 때' },
    { name: 'Dialog', when: '작업을 끝낼 때까지 다른 조작을 막아야 할 때' },
  ],
  headless: {
    exports: [
      'PopoverRoot',
      'PopoverTrigger',
      'PopoverPortal',
      'PopoverContent',
      'PopoverClose',
    ],
    import: 'src/headless',
  },
  overviewStory: 'Basic',
  styleStories: [
    { title: '제어 모드', story: 'Controlled' },
  ],
}
