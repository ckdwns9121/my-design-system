import type { ComponentDoc } from '../../docs/doc-types'

export const doc: ComponentDoc = {
  name: 'Accordion',
  category: 'Data display',
  summary: '여러 구역을 접었다 펴서 긴 화면의 정보량을 조절합니다.',
  keywords: [
    'accordion',
    '아코디언',
    'collapse',
    'disclosure',
    'expand',
  ],
  import: 'src/components',
  exports: [
    'Accordion',
    'AccordionContent',
    'AccordionHeader',
    'AccordionItem',
    'AccordionTrigger',
  ],
  rules: [
    '한 번에 하나만 열어야 하면 Single, 여러 구역을 동시에 보여줘야 하면 Multiple을 사용합니다.',
    '헤더에는 접힌 상태에서도 내용을 짐작할 수 있는 문구를 씁니다.',
    '항상 열려 있어야 하는 내용은 Accordion에 넣지 않습니다.',
  ],
  related: [
    { name: 'Tabs', when: '한 번에 하나만 보이고 자리를 공유할 때' },
  ],
  headless: {
    exports: [
      'AccordionRoot',
      'AccordionItem',
      'AccordionHeader',
      'AccordionTrigger',
      'AccordionContent',
    ],
    import: 'src/headless',
  },
  ariaPattern: {
    name: 'Accordion Pattern',
    url: 'https://www.w3.org/WAI/ARIA/apg/patterns/accordion/',
  },
  overviewStory: 'Single',
  styleStories: [
    { title: '여러 구역 열기', story: 'Multiple' },
    { title: '접기 방지', story: 'NonCollapsible' },
    { title: '비활성 항목', story: 'DisabledItem' },
    { title: '제어 모드', story: 'Controlled' },
  ],
}
