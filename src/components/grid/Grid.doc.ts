import type { ComponentDoc } from '../../docs/doc-types'

export const doc: ComponentDoc = {
  name: 'Grid',
  category: 'Data display',
  summary: '요소를 열로 나누고 좁은 화면에서 한 열로 접습니다.',
  keywords: [
    'grid',
    '그리드',
    '열',
    'columns',
    'layout',
    '레이아웃',
    'responsive',
  ],
  import: 'src/components',
  exports: [
    'Grid',
  ],
  rules: [
    'columns는 sm 이상에서 적용되고 그 아래에서는 한 열입니다. 호출하는 쪽마다 브레이크포인트를 반복하지 않기 위한 기본값입니다.',
    'gap은 값이 아니라 단계입니다.',
    '열 배치가 아니라 한 방향 흐름이면 Stack을 씁니다.',
    '행과 열에 데이터 의미가 있으면 Grid가 아니라 Table입니다.',
  ],
  related: [
    { name: 'Stack', when: '한 방향으로만 쌓을 때' },
    { name: 'Table', when: '행과 열이 데이터를 뜻할 때' },
  ],
  overviewStory: 'Columns',
  styleStories: [
    { title: '카드 배치', story: 'WithCards' },
    { title: '좁은 화면', story: 'CollapsesOnNarrowScreens' },
  ],
}
