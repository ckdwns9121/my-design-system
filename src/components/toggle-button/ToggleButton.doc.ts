import type { ComponentDoc } from '../../docs/doc-types'

export const doc: ComponentDoc = {
  name: 'ToggleButton',
  category: 'Form',
  summary: '눌린 상태를 유지하는 버튼입니다.',
  keywords: [
    'toggle button',
    '토글 버튼',
    'pressed',
    '서식',
    'formatting',
    'view mode',
  ],
  import: 'src/components',
  exports: [
    'ToggleButton',
  ],
  rules: [
    'aria-pressed로 눌림 상태를 알립니다. 설정을 켜고 끄는 자리에는 Switch를 사용합니다.',
    '툴바에서 서식이나 보기 방식을 바꾸는 용도에 맞습니다.',
    '아이콘만 둘 때는 aria-label로 이름을 줍니다.',
  ],
  related: [
    { name: 'Switch', when: '설정을 켜고 끄는 것이고 저장 없이 즉시 반영될 때' },
  ],
  headless: {
    exports: [
      'ToggleButton',
    ],
    import: 'src/headless',
  },
  ariaPattern: {
    name: 'Button Pattern (toggle button)',
    url: 'https://www.w3.org/WAI/ARIA/apg/patterns/button/',
  },
  overviewStory: 'Uncontrolled',
  styleStories: [
    { title: '제어 모드', story: 'Controlled' },
    { title: '비활성', story: 'Disabled' },
  ],
}
