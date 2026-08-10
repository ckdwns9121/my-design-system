import type { ComponentDoc } from '../../docs/doc-types'

export const doc: ComponentDoc = {
  name: 'Heading',
  category: 'Data display',
  summary: '제목의 문서 순위와 시각 크기를 따로 정합니다.',
  keywords: [
    'heading',
    'title',
    '제목',
    '헤딩',
    'h1',
    'h2',
    'section title',
    'typography',
  ],
  import: 'src/components',
  exports: [
    'Heading',
  ],
  rules: [
    'level은 원하는 크기가 아니라 문서 구조에서 고릅니다. 스크린리더 사용자는 제목 순위로 화면을 이동합니다.',
    '크기가 안 맞으면 level을 건드리지 말고 size로 조절합니다. h2가 커 보인다고 h3으로 내리면 구조가 깨집니다.',
    '순위를 건너뛰지 않습니다. h1 다음은 h2입니다.',
    '한 화면에 h1은 하나입니다.',
  ],
  related: [
    { name: 'Text', when: '본문일 때' },
  ],
  overviewStory: 'Levels',
  styleStories: [
    { title: '순위와 크기 분리', story: 'SizeSeparateFromLevel' },
    { title: '구조 유지', story: 'KeepsTheOutline' },
  ],
}
