import type { ComponentDoc } from '../../docs/doc-types'

export const doc: ComponentDoc = {
  name: 'VisuallyHidden',
  category: 'Data display',
  summary: '화면에서는 감추고 스크린리더에는 남기는 텍스트입니다.',
  keywords: [
    'visually hidden',
    'sr only',
    'screen reader',
    '스크린리더',
    '숨김',
    'a11y',
    'offscreen',
  ],
  import: 'src/components',
  exports: [
    'VisuallyHidden',
  ],
  rules: [
    'display: none과 visibility: hidden은 접근성 트리에서도 사라집니다. 이 컴포넌트는 잘라내는 방식이라 남습니다.',
    '보이는 형태로는 충분하지만 읽을 말이 없는 곳에 씁니다. 정렬 방향, 숫자의 단위, 반복되는 링크의 대상 같은 것.',
    '아이콘만 있는 버튼에는 IconButton의 label을 쓰는 편이 낫습니다. 이건 이름이 트리 안에 텍스트로 있어야 할 때입니다.',
    '보이는 텍스트를 대체하는 데 쓰지 않습니다. 시각 사용자에게 필요한 정보라면 화면에도 있어야 합니다.',
  ],
  related: [
    { name: 'IconButton', when: '아이콘만 있는 버튼에 이름을 줄 때' },
  ],
  overviewStory: 'AddsContextToALink',
  styleStories: [
    { title: '단위 붙이기', story: 'AddsAUnit' },
    { title: '접근성 트리 유지', story: 'StaysInTheAccessibilityTree' },
  ],
}
