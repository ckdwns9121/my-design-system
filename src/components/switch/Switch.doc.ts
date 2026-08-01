import type { ComponentDoc } from '../../docs/doc-types'

export const doc: ComponentDoc = {
  name: 'Switch',
  category: 'Form',
  summary: '설정을 즉시 켜고 끕니다.',
  keywords: [
    'switch',
    '스위치',
    'on off',
    '설정',
    'ios toggle',
    'toggle',
  ],
  import: 'src/components',
  exports: [
    'Switch',
  ],
  rules: [
    '저장 버튼 없이 바로 반영되는 설정에 사용합니다.',
    '버튼에는 label for를 걸 수 없어 보이는 라벨을 aria-labelledby로 연결합니다.',
    '라벨을 생략할 때는 aria-label을 직접 넘깁니다.',
  ],
  related: [
    { name: 'Checkbox', when: '폼을 제출해야 값이 반영될 때' },
    { name: 'ToggleButton', when: '툴바에서 서식이나 보기 방식을 바꿀 때' },
  ],
  headless: {
    exports: [
      'Switch',
    ],
    import: 'src/headless',
  },
  ariaPattern: {
    name: 'Switch Pattern',
    url: 'https://www.w3.org/WAI/ARIA/apg/patterns/switch/',
  },
  overviewStory: 'States',
  styleStories: [
    { title: '설명 포함', story: 'WithDescription' },
    { title: '크기', story: 'Sizes' },
    { title: '라벨 없음', story: 'WithoutLabel' },
  ],
}
