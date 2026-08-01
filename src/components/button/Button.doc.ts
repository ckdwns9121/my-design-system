import type { ComponentDoc } from '../../docs/doc-types'

export const doc: ComponentDoc = {
  name: 'Button',
  category: 'Form',
  summary: '화면의 명령을 실행합니다.',
  keywords: [
    'button',
    '버튼',
    'cta',
    'submit',
    'action',
  ],
  import: 'src/components',
  exports: [
    'Button',
  ],
  rules: [
    '한 화면의 주 액션에는 primary, 보조 액션에는 secondary나 subtle을 사용합니다.',
    '되돌리기 어려운 명령에만 danger를 사용합니다.',
    'isLoading은 버튼을 자동으로 비활성화하므로 중복 제출을 따로 막지 않아도 됩니다.',
  ],
  related: [
    { name: 'IconButton', when: '아이콘만 두고 텍스트가 없을 때' },
  ],
  overviewStory: 'Primary',
  styleStories: [
    { title: '보조 액션', story: 'Secondary' },
    { title: '로딩', story: 'Loading' },
    { title: '위험 액션', story: 'Danger' },
  ],
}
