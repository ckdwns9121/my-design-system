import type { ComponentDoc } from '../../docs/doc-types'

export const doc: ComponentDoc = {
  name: 'Pagination',
  category: 'Navigation',
  summary: '긴 목록을 페이지 단위로 나눠 이동합니다.',
  keywords: [
    'pagination',
    '페이지네이션',
    'pager',
    'paging',
    '페이지',
  ],
  import: 'src/components',
  exports: [
    'Pagination',
  ],
  rules: [
    '현재 페이지는 aria-current=page로 표시합니다.',
    '페이지가 이동해도 버튼 개수가 일정하게 유지되어 레이아웃이 흔들리지 않습니다.',
    '생략 기호는 aria-hidden이라 스크린리더가 읽지 않습니다.',
    '페이지 수가 0이면 아무것도 렌더링하지 않습니다.',
  ],
  related: [
    { name: 'Table', when: '나눠 보여줄 대상이 표일 때' },
  ],
  headless: {
    exports: [
      'usePagination',
    ],
    import: 'src/headless',
  },
  overviewStory: 'MiddlePage',
  styleStories: [
    { title: '마지막 페이지', story: 'LastPage' },
    { title: '페이지가 적을 때', story: 'FewPages' },
    { title: '넓은 범위', story: 'WiderWindow' },
  ],
}
