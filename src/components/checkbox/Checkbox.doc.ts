import type { ComponentDoc } from '../../docs/doc-types'

export const doc: ComponentDoc = {
  name: 'Checkbox',
  category: 'Form',
  summary: '독립적인 선택을 켜고 끕니다.',
  keywords: [
    'checkbox',
    '체크박스',
    '선택',
    'tick',
  ],
  import: 'src/components',
  exports: [
    'Checkbox',
  ],
  rules: [
    '하위 항목이 일부만 선택된 상태는 indeterminate로 표현합니다. 이때 aria-checked는 mixed가 됩니다.',
    '네이티브 input[type=checkbox] 위에 스타일만 얹어 폼 제출과 키보드 동작을 그대로 유지합니다.',
  ],
  related: [
    { name: 'RadioGroup', when: '선택지가 서로 배타적일 때' },
    { name: 'Switch', when: '제출 없이 설정이 즉시 반영될 때' },
  ],
  headless: {
    exports: [
      'Checkbox',
    ],
    import: 'src/headless',
  },
  ariaPattern: {
    name: 'Checkbox Pattern',
    url: 'https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/',
  },
  overviewStory: 'Unchecked',
  styleStories: [
    { title: '선택됨', story: 'Checked' },
    { title: '부분 선택', story: 'Indeterminate' },
    { title: '비활성', story: 'Disabled' },
  ],
}
