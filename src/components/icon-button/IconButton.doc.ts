import type { ComponentDoc } from '../../docs/doc-types'

export const doc: ComponentDoc = {
  name: 'IconButton',
  category: 'Form',
  summary: '아이콘만으로 명령을 실행합니다.',
  keywords: [
    'icon button',
    '아이콘 버튼',
    'square button',
    'ghost button',
  ],
  import: 'src/components',
  exports: [
    'IconButton',
  ],
  rules: [
    'label은 필수입니다. 아이콘에는 읽을 텍스트가 없어 이름이 없으면 버튼의 용도를 알 수 없습니다.',
    '넘긴 아이콘은 장식으로 남습니다. 아이콘에 title을 함께 주면 이름이 두 번 읽힙니다.',
    '뜻이 분명하지 않은 동작에는 아이콘만 두지 말고 텍스트가 있는 Button을 사용합니다.',
    'isLoading은 버튼을 자동으로 비활성화합니다.',
  ],
  related: [
    { name: 'Button', when: '동작의 뜻을 아이콘만으로 전달하기 어려울 때' },
  ],
  overviewStory: 'Variants',
  styleStories: [
    { title: '크기', story: 'Sizes' },
    { title: '상태', story: 'States' },
    { title: '원형', story: 'Rounded' },
    { title: '툴바', story: 'InToolbar' },
  ],
}
