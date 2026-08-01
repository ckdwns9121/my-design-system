import type { ComponentDoc } from '../../docs/doc-types'

export const doc: ComponentDoc = {
  name: 'Card',
  category: 'Data display',
  summary: '관련된 정보와 액션을 하나의 면으로 묶습니다.',
  keywords: [
    'card',
    '카드',
    'panel',
    'surface',
    'tile',
  ],
  import: 'src/components',
  exports: [
    'Card',
    'CardContent',
    'CardDescription',
    'CardFooter',
    'CardHeader',
    'CardTitle',
  ],
  rules: [
    'CardHeader, CardContent, CardFooter로 역할을 나눠 여백을 일관되게 유지합니다.',
    '카드 전체를 링크로 만들지 않고 내부에 명시적인 액션을 둡니다.',
    '목록에서 반복될 때는 카드마다 담는 정보의 종류를 맞춥니다.',
  ],
  overviewStory: 'Basic',
  styleStories: [
    { title: '액션 포함', story: 'WithActions' },
  ],
}
