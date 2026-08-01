import type { ComponentDoc } from '../../docs/doc-types'

export const doc: ComponentDoc = {
  name: 'Combobox',
  category: 'Form',
  summary: '입력으로 목록을 좁혀 하나의 값을 고릅니다.',
  keywords: [
    'combobox',
    '콤보박스',
    'autocomplete',
    '자동완성',
    'search select',
    'typeahead',
  ],
  import: 'src/components',
  exports: [
    'Combobox',
    'ComboboxContent',
    'ComboboxEmpty',
    'ComboboxInput',
    'ComboboxList',
    'ComboboxOption',
    'ComboboxPortal',
  ],
  rules: [
    '선택지가 많아 스크롤만으로 찾기 어려울 때 사용합니다.',
    '필터링은 소비자가 담당합니다. 프리미티브는 열림 상태, 활성 옵션, 선택만 관리합니다.',
    'ComboboxEmpty는 ComboboxList 바깥에 둡니다. option 없는 listbox는 ARIA 위반입니다.',
    '포커스는 입력에 남고 활성 옵션은 aria-activedescendant로 가리킵니다.',
  ],
  related: [
    { name: 'Select', when: '목록이 짧아 검색이 필요 없을 때' },
  ],
  headless: {
    exports: [
      'ComboboxRoot',
      'ComboboxInput',
      'ComboboxPortal',
      'ComboboxContent',
      'ComboboxList',
      'ComboboxOption',
      'ComboboxEmpty',
    ],
    import: 'src/headless',
  },
  ariaPattern: {
    name: 'Combobox Pattern (list autocomplete)',
    url: 'https://www.w3.org/WAI/ARIA/apg/patterns/combobox/',
  },
  overviewStory: 'Playground',
  styleStories: [
    { title: '검색 결과 없음', story: 'EmptyResult' },
    { title: '초기값', story: 'Prefilled' },
  ],
}
