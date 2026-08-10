import type { ComponentDoc } from '../../docs/doc-types'

export const doc: ComponentDoc = {
  name: 'Skeleton',
  category: 'Feedback',
  summary: '불러오는 동안 들어올 내용의 자리를 잡아둡니다.',
  keywords: [
    'skeleton',
    '스켈레톤',
    'placeholder',
    '자리 표시자',
    'shimmer',
    'loading',
    '로딩',
  ],
  import: 'src/components',
  exports: [
    'Skeleton',
    'SkeletonText',
  ],
  rules: [
    '자리 표시자 자체는 정보를 담지 않아 접근성 트리에서 감춰집니다. 기다림을 알리는 건 감싸는 영역입니다.',
    '불러오는 동안 감싸는 영역에 aria-busy="true"를 둡니다.',
    '들어올 내용과 비슷한 크기로 맞춥니다. 크기가 크게 다르면 로딩이 끝날 때 레이아웃이 튑니다.',
    '짧은 대기에는 쓰지 않습니다. 깜빡임이 스피너보다 거슬립니다.',
  ],
  related: [
    { name: 'Loading', when: '기다림을 읽어서 알려야 하거나 자리가 작을 때' },
    { name: 'Progress', when: '진행률을 숫자로 알 수 있을 때' },
  ],
  overviewStory: 'Shapes',
  styleStories: [
    { title: '여러 줄', story: 'Text' },
    { title: '카드 안', story: 'InCard' },
    { title: '접근성 트리 제외', story: 'HiddenFromAssistiveTech' },
  ],
}
