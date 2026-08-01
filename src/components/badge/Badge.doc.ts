import type { ComponentDoc } from '../../docs/doc-types'

export const doc: ComponentDoc = {
  name: 'Badge',
  category: 'Data display',
  summary: '항목의 상태나 분류를 짧은 라벨로 표시합니다.',
  keywords: [
    'badge',
    '뱃지',
    'chip',
    'tag',
    'label',
    'status',
  ],
  import: 'src/components',
  exports: [
    'Badge',
  ],
  rules: [
    '클릭할 수 있는 요소로 쓰지 않습니다. 동작이 필요하면 Button을 사용합니다.',
    '상태 색은 status 토큰을 따르고, 색과 함께 텍스트로도 상태를 전달합니다.',
    '한두 단어로 끝나지 않는 내용은 Badge 대신 본문에 씁니다.',
  ],
  overviewStory: 'StatusSet',
  styleStories: [
    { title: '기본', story: 'Neutral' },
    { title: '브랜드', story: 'Brand' },
  ],
}
