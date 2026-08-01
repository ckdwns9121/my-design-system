import type { ComponentDoc } from '../../docs/doc-types'

export const doc: ComponentDoc = {
  name: 'Breadcrumb',
  category: 'Navigation',
  summary: '현재 화면이 어느 경로에 있는지 보여주고 상위로 돌아갈 길을 만듭니다.',
  keywords: [
    'breadcrumb',
    '브레드크럼',
    'path',
    '경로',
    'trail',
  ],
  import: 'src/components',
  exports: [
    'Breadcrumb',
    'BreadcrumbItem',
    'BreadcrumbLink',
    'BreadcrumbPage',
    'BreadcrumbSeparator',
  ],
  rules: [
    '마지막 항목은 링크가 아니라 BreadcrumbPage로 두어 aria-current=page를 갖게 합니다.',
    '구분자는 aria-hidden이라 스크린리더가 읽지 않습니다.',
    '한 화면에 두 개 이상 두면 label로 서로 다른 이름을 줍니다.',
  ],
  ariaPattern: {
    name: 'Breadcrumb Pattern',
    url: 'https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/',
  },
  overviewStory: 'Playground',
  styleStories: [
    { title: '구분자 변경', story: 'CustomSeparator' },
  ],
}
