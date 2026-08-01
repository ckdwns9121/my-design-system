import type { ComponentDoc } from '../../docs/doc-types'

export const doc: ComponentDoc = {
  name: 'Toast',
  category: 'Feedback',
  summary: '작업 결과를 화면을 막지 않고 잠깐 알립니다.',
  keywords: [
    'toast',
    '토스트',
    'snackbar',
    'notification',
    '알림',
  ],
  import: 'src/components',
  exports: [
    'ToastProvider',
    'ToastViewport',
    'useToast',
  ],
  rules: [
    'ToastProvider로 앱을 감싸고 ToastViewport를 한 번만 둡니다. 알림은 useToast().toast()로 띄웁니다.',
    'warning과 danger는 role=alert로 즉시 읽히고, info와 success는 role=status로 읽던 문장을 끊지 않습니다.',
    '뷰포트는 비어 있어도 계속 붙어 있습니다. 알림이 도착한 뒤에 라이브 영역을 만들면 읽히지 않을 수 있습니다.',
    '포인터나 포커스가 뷰포트 안에 있는 동안에는 자동 닫힘이 멈춥니다.',
    '사용자가 반드시 읽어야 하는 내용은 duration을 null로 두거나 Dialog를 사용합니다.',
  ],
  related: [
    { name: 'Alert', when: '알림이 화면에 계속 남아 있어야 할 때' },
    { name: 'Dialog', when: '사용자가 반드시 응답해야 할 때' },
  ],
  headless: {
    exports: [
      'ToastProvider',
      'ToastViewport',
      'ToastRoot',
      'useToast',
    ],
    import: 'src/headless',
  },
  ariaPattern: {
    name: 'Alert Pattern',
    url: 'https://www.w3.org/WAI/ARIA/apg/patterns/alert/',
    notes: [
      'APG에는 toast 패턴이 없습니다. 라이브 영역 규칙만 따르고 자동 닫힘과 일시정지는 직접 정의했습니다.',
    ],
  },
  overviewStory: 'Playground',
  styleStories: [
    { title: '즉시 읽히는 알림', story: 'AssertiveTone' },
    { title: '직접 닫기', story: 'Dismiss' },
    { title: '자동 닫힘', story: 'AutoDismiss' },
    { title: '여러 개 쌓기', story: 'Stacking' },
  ],
}
