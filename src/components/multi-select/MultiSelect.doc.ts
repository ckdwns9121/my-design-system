import type { ComponentDoc } from '../../docs/doc-types'

export const doc: ComponentDoc = {
  name: 'MultiSelect',
  category: 'Form',
  summary: '목록에서 여러 값을 함께 고릅니다.',
  keywords: [
    'multi select',
    '다중 선택',
    'multiselect',
    'tags',
    'checkbox list',
  ],
  import: 'src/components',
  exports: [
    'MultiSelect',
    'MultiSelectContent',
    'MultiSelectOption',
    'MultiSelectPortal',
    'MultiSelectTrigger',
    'MultiSelectValue',
  ],
  rules: [
    '선택이 집합이라 옵션을 눌러도 목록이 닫히지 않습니다. Escape, Tab, 바깥 클릭으로만 닫힙니다.',
    '목록은 aria-multiselectable=true를 가지며 각 옵션이 aria-selected로 상태를 알립니다.',
    '선택이 많아지면 트리거에는 앞의 몇 개만 두고 나머지는 개수로 요약합니다.',
  ],
  related: [
    { name: 'Select', when: '하나만 고를 때' },
  ],
  headless: {
    exports: [
      'MultiSelectRoot',
      'MultiSelectTrigger',
      'MultiSelectPortal',
      'MultiSelectContent',
      'MultiSelectOption',
      'useMultiSelectValues',
    ],
    import: 'src/headless',
  },
  ariaPattern: {
    name: 'Listbox Pattern (multi-select)',
    url: 'https://www.w3.org/WAI/ARIA/apg/patterns/listbox/',
  },
  overviewStory: 'Playground',
  styleStories: [
    { title: '선택 있음', story: 'WithSelection' },
    { title: '요약 표시', story: 'CollapsedSummary' },
    { title: '비활성 옵션', story: 'DisabledOption' },
  ],
}
