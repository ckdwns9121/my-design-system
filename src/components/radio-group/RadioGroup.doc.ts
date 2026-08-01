import type { ComponentDoc } from '../../docs/doc-types'

export const doc: ComponentDoc = {
  name: 'RadioGroup',
  category: 'Form',
  summary: '배타적인 선택지 중 하나를 고릅니다.',
  keywords: [
    'radio',
    'radio group',
    '라디오',
    '단일 선택',
    'option group',
  ],
  import: 'src/components',
  exports: [
    'RadioGroup',
    'RadioGroupItem',
  ],
  rules: [
    '그룹 전체가 하나의 탭 정지점입니다. 방향키로 이동하면 선택도 함께 옮겨집니다.',
    '선택이 없을 때는 첫 번째 라디오가 탭 정지점을 갖습니다.',
    '선택지가 다섯 개를 넘으면 Select를 검토합니다.',
  ],
  related: [
    { name: 'Checkbox', when: '동시에 여러 개를 고를 수 있을 때' },
    { name: 'Select', when: '선택지가 많아 목록을 접어야 할 때' },
  ],
  headless: {
    exports: [
      'RadioGroupRoot',
      'RadioGroupItem',
    ],
    import: 'src/headless',
  },
  ariaPattern: {
    name: 'Radio Group Pattern',
    url: 'https://www.w3.org/WAI/ARIA/apg/patterns/radio/',
    notes: [
      '라디오는 버튼으로 구현했습니다. 네이티브 input[type=radio]는 그룹 안에서 roving tabindex를 직접 제어할 수 없습니다.',
    ],
  },
  overviewStory: 'Playground',
  styleStories: [
    { title: '설명 포함', story: 'WithDescriptions' },
    { title: '가로 배치', story: 'Horizontal' },
    { title: '비활성 항목', story: 'DisabledItem' },
    { title: '선택 없음', story: 'NoSelection' },
  ],
}
