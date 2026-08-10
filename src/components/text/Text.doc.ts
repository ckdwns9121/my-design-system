import type { ComponentDoc } from '../../docs/doc-types'

export const doc: ComponentDoc = {
  name: 'Text',
  category: 'Data display',
  summary: '본문 텍스트를 type scale과 content 토큰 안에서 씁니다.',
  keywords: [
    'text',
    'typography',
    '본문',
    '텍스트',
    'paragraph',
    'body',
    'copy',
    'font',
  ],
  import: 'src/components',
  exports: [
    'Text',
  ],
  rules: [
    'size와 line-height는 함께 움직입니다. 따로 지정하는 prop이 없습니다.',
    'tone은 content 토큰 단계입니다. 임의 색을 넣지 않습니다.',
    '문단이 아니라 인라인 강조면 as="span"으로 바꿉니다. p 안에 p를 넣으면 안 됩니다.',
    '제목에는 Heading을 씁니다. Text를 크게 만들어 제목처럼 쓰면 문서 구조가 비어버립니다.',
  ],
  related: [
    { name: 'Heading', when: '제목일 때' },
    { name: 'VisuallyHidden', when: '화면에는 감추고 읽히게만 할 때' },
  ],
  overviewStory: 'Sizes',
  styleStories: [
    { title: '색', story: 'Tones' },
    { title: '굵기', story: 'Weights' },
    { title: '한 줄 자르기', story: 'Truncated' },
    { title: '인라인', story: 'Inline' },
  ],
}
