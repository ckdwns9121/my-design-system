import type { ComponentDoc } from '../../docs/doc-types'

export const doc: ComponentDoc = {
  name: 'Dialog',
  category: 'Overlay',
  summary: '현재 작업을 멈추고 확인이나 입력을 받습니다.',
  keywords: [
    'dialog',
    'modal',
    '모달',
    '대화상자',
    'popup',
  ],
  import: 'src/components',
  exports: [
    'DialogRoot',
    'DialogClose',
    'DialogContent',
    'DialogDescription',
    'DialogOverlay',
    'DialogPortal',
    'DialogTitle',
    'DialogTrigger',
  ],
  rules: [
    '포커스를 가두고 닫을 때 트리거로 되돌립니다. 배경은 inert 처리되고 스크롤이 잠깁니다.',
    'DialogTitle을 반드시 두어 대화상자에 이름을 줍니다.',
    '취소로 잃을 내용이 있으면 바깥 클릭만으로 닫지 않도록 확인 단계를 둡니다.',
  ],
  related: [
    { name: 'Popover', when: '현재 작업을 막지 않아도 될 때' },
  ],
  headless: {
    exports: [
      'DialogRoot',
      'DialogTrigger',
      'DialogPortal',
      'DialogOverlay',
      'DialogContent',
      'DialogTitle',
      'DialogDescription',
      'DialogClose',
    ],
    import: 'src/headless',
  },
  ariaPattern: {
    name: 'Dialog (Modal) Pattern',
    url: 'https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/',
  },
  overviewStory: 'Basic',
  styleStories: [
    { title: '이름 대체', story: 'LabelFallback' },
  ],
}
