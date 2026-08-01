import type { ComponentDoc } from '../../docs/doc-types'

export const doc: ComponentDoc = {
  name: 'Alert',
  category: 'Feedback',
  summary: '작업 결과나 주의할 상태를 화면에 남겨 알립니다.',
  keywords: [
    'alert',
    '얼럿',
    'banner',
    'callout',
    'message',
    '알림',
  ],
  import: 'src/components',
  exports: [
    'Alert',
  ],
  rules: [
    'warning과 danger는 role=alert로 즉시 읽히고, info와 success는 role=status로 현재 읽기를 끊지 않습니다.',
    '색만으로 의미를 전달하지 않도록 제목에 상태를 함께 씁니다.',
    '사용자가 복구할 수 있는 오류에는 action으로 다음 행동을 붙입니다.',
  ],
  related: [
    { name: 'Toast', when: '잠깐 알리고 사라져도 될 때' },
  ],
  ariaPattern: {
    name: 'Alert Pattern',
    url: 'https://www.w3.org/WAI/ARIA/apg/patterns/alert/',
  },
  overviewStory: 'Tones',
  styleStories: [
    { title: '제목만', story: 'TitleOnly' },
    { title: '액션 포함', story: 'WithAction' },
  ],
}
