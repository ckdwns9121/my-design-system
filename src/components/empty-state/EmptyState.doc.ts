import type { ComponentDoc } from '../../docs/doc-types'

export const doc: ComponentDoc = {
  name: 'EmptyState',
  category: 'Data display',
  summary: '보여줄 데이터가 없을 때 이유와 다음 행동을 안내합니다.',
  keywords: [
    'empty state',
    '빈 상태',
    'no data',
    'placeholder',
    'zero state',
  ],
  import: 'src/components',
  exports: [
    'EmptyState',
  ],
  rules: [
    '"데이터 없음"으로 끝내지 않고 왜 비어 있는지와 무엇을 하면 되는지를 함께 씁니다.',
    '필터 때문에 비었다면 필터를 지우는 액션을 붙입니다.',
    'media는 장식이므로 의미를 담지 않습니다. 스크린리더에서 감춰집니다.',
  ],
  overviewStory: 'Playground',
  styleStories: [
    { title: '제목만', story: 'TitleOnly' },
    { title: '액션 포함', story: 'WithAction' },
    { title: '일러스트 포함', story: 'WithMedia' },
  ],
}
