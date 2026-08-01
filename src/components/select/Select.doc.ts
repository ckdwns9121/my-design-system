import type { ComponentDoc } from '../../docs/doc-types'

export const doc: ComponentDoc = {
  name: 'Select',
  category: 'Form',
  summary: '정해진 목록에서 하나의 값을 고릅니다.',
  keywords: [
    'select',
    '셀렉트',
    'dropdown',
    '드롭다운',
    'picker',
    'listbox',
  ],
  import: 'src/components',
  exports: [
    'Select',
    'SelectContent',
    'SelectLabel',
    'SelectOption',
    'SelectPortal',
    'SelectSeparator',
    'SelectTrigger',
    'SelectValue',
  ],
  rules: [
    '선택 전 상태를 설명하는 placeholder를 지정합니다.',
    '글자를 입력하면 해당 글자로 시작하는 옵션으로 이동합니다.',
  ],
  related: [
    { name: 'MultiSelect', when: '여러 값을 함께 골라야 할 때' },
    { name: 'Combobox', when: '선택지가 많아 검색이 필요할 때' },
    { name: 'DropdownMenu', when: '값을 고르는 것이 아니라 명령을 실행할 때' },
  ],
  headless: {
    exports: [
      'SelectRoot',
      'SelectTrigger',
      'SelectValue',
      'SelectPortal',
      'SelectContent',
      'SelectOption',
    ],
    import: 'src/headless',
  },
  ariaPattern: {
    name: 'Select-Only Combobox Pattern',
    url: 'https://www.w3.org/WAI/ARIA/apg/patterns/combobox/',
  },
  overviewStory: 'Basic',
  styleStories: [
    { title: '타이핑으로 찾기', story: 'Typeahead' },
  ],
}
