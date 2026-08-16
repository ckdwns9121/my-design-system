import type { ComponentDoc } from '../../docs/doc-types'

export const doc: ComponentDoc = {
  name: 'ThemeProvider',
  category: 'Data display',
  summary: '밝은 테마와 어두운 테마를 정하고 문서에 반영합니다.',
  keywords: [
    'theme',
    '테마',
    'dark mode',
    '다크 모드',
    'color scheme',
    'light',
    'appearance',
    'toggle',
  ],
  import: 'src/components',
  exports: [
    'ThemeProvider',
    'ThemeToggle',
  ],
  rules: [
    '컴포넌트는 테마를 읽지 않습니다. 어두운 테마는 같은 semantic 이름 뒤의 값만 바꾸므로 bg-surface-panel을 그대로 쓰면 됩니다.',
    'data-theme은 기본적으로 문서 루트에 붙습니다. Portal로 나간 오버레이까지 함께 바뀌어야 하기 때문입니다.',
    '한 화면 안에서만 테마를 다르게 보여줘야 하면 target으로 요소를 지정합니다.',
    'system은 OS 설정을 따라 계속 반응합니다. 사용자가 직접 고르면 그 선택이 우선합니다.',
    'ThemeToggle의 이름은 현재 상태가 아니라 누르면 무엇이 되는지를 말합니다.',
    '두 테마의 색 대비는 src/tokens/contrast.test.ts가 검증합니다. 토큰을 바꾸면 이 테스트를 돌립니다.',
  ],
  headless: {
    exports: [
      'ThemeProvider',
      'useTheme',
    ],
    import: 'src/headless',
  },
  overviewStory: 'Playground',
  styleStories: [
    { title: '어두운 테마', story: 'Dark' },
    { title: '전환', story: 'Toggle' },
    { title: '같은 토큰 두 테마', story: 'SameTokensBothThemes' },
  ],
}
