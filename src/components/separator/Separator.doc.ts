import type { ComponentDoc } from '../../docs/doc-types'

export const doc: ComponentDoc = {
  name: 'Separator',
  category: 'Data display',
  summary: '내용의 경계를 선으로 나눕니다.',
  keywords: [
    'separator',
    'divider',
    '구분선',
    '구획',
    'hr',
    'rule',
    'line',
  ],
  import: 'src/components',
  exports: [
    'Separator',
  ],
  rules: [
    '경계가 내용만으로 이미 분명하면 decorative로 두어 접근성 트리에서 빼냅니다. 그렇지 않으면 경계를 두 번 알립니다.',
    'orientation은 시각 방향이 아니라 무엇을 나누는지를 따릅니다. 가로로 늘어선 항목 사이에는 vertical입니다.',
    'label을 주면 선 가운데에 글자가 들어갑니다. "또는" 같은 짧은 말에만 씁니다.',
    '여백만으로 구분되는 곳에 선을 더하지 않습니다.',
  ],
  overviewStory: 'Horizontal',
  styleStories: [
    { title: '세로', story: 'Vertical' },
    { title: '라벨 포함', story: 'WithLabel' },
    { title: '장식용', story: 'Decorative' },
  ],
}
