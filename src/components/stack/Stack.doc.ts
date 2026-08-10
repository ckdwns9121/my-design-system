import type { ComponentDoc } from '../../docs/doc-types'

export const doc: ComponentDoc = {
  name: 'Stack',
  category: 'Data display',
  summary: '요소를 한 방향으로 쌓고 간격을 spacing scale로 고정합니다.',
  keywords: [
    'stack',
    'flex',
    '스택',
    '간격',
    'gap',
    'vstack',
    'hstack',
    'flexbox',
    'layout',
  ],
  import: 'src/components',
  exports: [
    'Stack',
  ],
  rules: [
    'gap은 값이 아니라 단계입니다. 임의 간격이 필요하면 className으로 넘기되, 그건 예외로 보이는 게 목적입니다.',
    '묶음에 의미가 있으면 as로 요소를 바꿉니다. 목록은 ul, 내비게이션은 nav입니다.',
    '한 방향으로만 흐르는 배치에 씁니다. 열이 필요하면 Grid를 씁니다.',
  ],
  related: [
    { name: 'Grid', when: '여러 열로 나눠야 할 때' },
    { name: 'Separator', when: '묶음 사이에 선이 필요할 때' },
  ],
  overviewStory: 'Playground',
  styleStories: [
    { title: '가로', story: 'Row' },
    { title: '간격 단계', story: 'Gaps' },
    { title: '양끝 정렬', story: 'SpaceBetween' },
    { title: '목록으로', story: 'AsList' },
  ],
}
