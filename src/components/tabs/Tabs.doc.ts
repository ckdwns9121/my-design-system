import type { ComponentDoc } from '../../docs/doc-types'

export const doc: ComponentDoc = {
  name: 'Tabs',
  category: 'Data display',
  summary: '같은 자리에서 여러 화면을 전환합니다.',
  keywords: [
    'tabs',
    '탭',
    'tab list',
    'segmented',
  ],
  import: 'src/components',
  exports: [
    'Tabs',
    'TabsContent',
    'TabsList',
    'TabsTrigger',
  ],
  rules: [
    '기본은 방향키 이동과 동시에 패널이 바뀝니다. 전환 비용이 크면 manual로 두고 Enter나 Space로 확정합니다.',
    '탭 라벨은 짧게 쓰고 패널의 내용과 이름을 맞춥니다.',
    '순서가 중요한 단계 이동에는 사용하지 않습니다.',
  ],
  related: [
    { name: 'Accordion', when: '여러 구역을 동시에 펼쳐 보여야 할 때' },
  ],
  headless: {
    exports: [
      'TabsRoot',
      'TabsList',
      'TabsTrigger',
      'TabsContent',
    ],
    import: 'src/headless',
  },
  ariaPattern: {
    name: 'Tabs Pattern',
    url: 'https://www.w3.org/WAI/ARIA/apg/patterns/tabs/',
  },
  overviewStory: 'Basic',
  styleStories: [
    { title: '수동 활성화', story: 'ManualActivation' },
    { title: '세로 배치', story: 'Vertical' },
  ],
}
