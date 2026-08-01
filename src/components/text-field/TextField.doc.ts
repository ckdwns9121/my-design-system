import type { ComponentDoc } from '../../docs/doc-types'

export const doc: ComponentDoc = {
  name: 'TextField',
  category: 'Form',
  summary: '한 줄 값을 입력받습니다.',
  keywords: [
    'text field',
    'input',
    '입력',
    '텍스트 필드',
    'textbox',
  ],
  import: 'src/components',
  exports: [
    'TextField',
  ],
  rules: [
    'label은 필수입니다. placeholder로 라벨을 대신하지 않습니다.',
    'error를 넘기면 aria-invalid가 켜지고 설명이 오류 문구로 바뀝니다.',
  ],
  related: [
    { name: 'Textarea', when: '여러 줄을 입력받을 때' },
  ],
  overviewStory: 'Default',
  styleStories: [
    { title: '도움말', story: 'WithHelperText' },
    { title: '오류 상태', story: 'ErrorState' },
  ],
}
