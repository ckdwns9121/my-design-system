import type { ComponentDoc } from '../../docs/doc-types'

export const doc: ComponentDoc = {
  name: 'Textarea',
  category: 'Form',
  summary: '여러 줄 텍스트를 입력받습니다.',
  keywords: [
    'textarea',
    '여러 줄',
    '메모',
    'multiline',
  ],
  import: 'src/components',
  exports: [
    'Textarea',
  ],
  rules: [
    'rows로 기본 높이를 정하고 사용자가 세로로 늘릴 수 있게 둡니다.',
    'showCount는 maxLength와 함께 써야 표시됩니다.',
    'error를 넘기면 aria-invalid가 켜지고 설명이 오류 문구로 바뀝니다.',
  ],
  related: [
    { name: 'TextField', when: '한 줄만 입력받을 때' },
  ],
  overviewStory: 'Playground',
  styleStories: [
    { title: '도움말', story: 'WithHelperText' },
    { title: '오류 상태', story: 'ErrorState' },
    { title: '비활성', story: 'Disabled' },
    { title: '글자 수', story: 'WithCount' },
  ],
}
