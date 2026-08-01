import type { ComponentDoc } from '../../docs/doc-types'

export const doc: ComponentDoc = {
  name: 'Loading',
  category: 'Feedback',
  summary: '처리 중이라는 사실을 알립니다.',
  keywords: [
    'loading',
    '로딩',
    'spinner',
    '스피너',
    'pending',
  ],
  import: 'src/components',
  exports: [
    'Loading',
  ],
  rules: [
    'role=status로 상태를 알리므로 label은 항상 의미 있는 문장으로 채웁니다.',
    '레이아웃이 크게 비는 자리에는 스피너 대신 자리 표시자를 검토합니다.',
    '버튼 안의 로딩은 Button의 isLoading을 사용합니다.',
  ],
  related: [
    { name: 'Progress', when: '진행률을 숫자로 알 수 있을 때' },
  ],
  overviewStory: 'Sizes',
  styleStories: [
    { title: '라벨 노출', story: 'WithLabel' },
  ],
}
