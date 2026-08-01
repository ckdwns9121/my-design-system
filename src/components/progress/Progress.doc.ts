import type { ComponentDoc } from '../../docs/doc-types'

export const doc: ComponentDoc = {
  name: 'Progress',
  category: 'Feedback',
  summary: '작업이 얼마나 진행됐는지 보여줍니다.',
  keywords: [
    'progress',
    '진행률',
    'progress bar',
    'loading bar',
    'percentage',
  ],
  import: 'src/components',
  exports: [
    'Progress',
  ],
  rules: [
    '끝을 알 수 없는 작업은 value를 비워 미완료 상태로 둡니다. 이때 aria-valuenow가 빠집니다.',
    '단위가 퍼센트가 아니면 valueText로 사람이 읽을 문구를 직접 지정합니다.',
  ],
  related: [
    { name: 'Loading', when: '진행률을 알 수 없고 대기만 표시할 때' },
  ],
  overviewStory: 'WithValue',
  styleStories: [
    { title: '상태 색', story: 'Tones' },
    { title: '크기', story: 'Sizes' },
    { title: '완료 시점 미정', story: 'Indeterminate' },
    { title: '값 문구 지정', story: 'ValueText' },
  ],
}
