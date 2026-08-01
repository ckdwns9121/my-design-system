# Headless Core Design System

접근성, 상태, 키보드 인터랙션을 직접 구현하는 React 디자인 시스템입니다.

라이브러리를 감싸는 대신 headless primitive를 직접 만들고, 그 위에 토큰 기반 styled layer를 얹습니다. 27개 컴포넌트, 37개 아이콘, SSOT 색상 토큰, Storybook 문서로 구성되어 있습니다.

```txt
primitive token → semantic token → headless primitive → styled component → docs
```

<br />

## 이 시스템의 특징

**동작과 스타일이 분리되어 있습니다.** headless layer가 상태, ARIA, 키보드, controlled/uncontrolled API를 소유하고 스타일 결정은 하지 않습니다. styled layer는 Tailwind class와 semantic token만 얹습니다. 팔레트를 바꿔도 동작 코드는 바뀌지 않고, 디자인을 갈아끼워도 접근성은 유지됩니다.

**색상 값은 한 곳에만 있습니다.** `src/tokens/color-tokens.json`이 SSOT이고 Tailwind CSS 변수는 여기에서 생성됩니다. 컴포넌트에는 raw hex가 없습니다.

**접근성이 사후 작업이 아닙니다.** 각 컴포넌트는 [WAI-ARIA 명세](https://www.w3.org/TR/wai-aria/)를 계약으로, [APG Patterns](https://www.w3.org/WAI/ARIA/apg/patterns/)를 구현 가이드로 삼습니다. `role`과 `aria-*`를 붙이는 데서 끝내지 않고 roving tabindex, focus trap, focus return 같은 실제 동작을 primitive에 구현하고 테스트로 고정합니다.

**모든 컴포넌트에 문서가 있습니다.** Storybook 문서 페이지마다 대표 예제, 사용 규칙, props 표가 있고, story는 그대로 테스트로 실행됩니다.

<br />

## 시작하기

```bash
npm install
npm run storybook     # http://localhost:6006
```

Vite 데모 앱은 `npm run dev`로 실행합니다.

> **npm 배포는 아직 준비 중입니다.** 현재는 이 저장소를 클론해서 사용합니다.

<br />

## 사용 예시

토큰 CSS를 한 번 불러오고 컴포넌트를 가져다 씁니다.

```tsx
import './index.css'
import { Button, TextField, ToastProvider, ToastViewport, useToast } from './components'

function App() {
  return (
    <ToastProvider>
      <SaveForm />
      <ToastViewport />
    </ToastProvider>
  )
}

function SaveForm() {
  const { toast } = useToast()

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        toast({ title: '저장했습니다', tone: 'success' })
      }}
    >
      <TextField label="주문 번호" placeholder="ORD-0000" />
      <Button type="submit">저장</Button>
    </form>
  )
}
```

동작만 필요하면 headless layer를 직접 씁니다. 스타일은 전부 소비자 몫입니다.

```tsx
import { TabsRoot, TabsList, TabsTrigger, TabsContent } from './headless'

<TabsRoot defaultValue="orders" activationMode="manual">
  <TabsList>
    <TabsTrigger value="orders">주문</TabsTrigger>
    <TabsTrigger value="stock">재고</TabsTrigger>
  </TabsList>
  <TabsContent value="orders">…</TabsContent>
</TabsRoot>
```

<br />

## 컴포넌트

각 컴포넌트는 Storybook에 문서 페이지를 가집니다. **Headless** 표시가 있으면 스타일 없이 동작만 가져다 쓸 수 있습니다.

### 폼

| 컴포넌트 | 설명 | Headless |
| --- | --- | :---: |
| `Button` | 화면의 명령을 실행 | |
| `IconButton` | 아이콘만 있는 버튼. 접근 이름이 필수 | |
| `TextField` | 한 줄 입력. label, helper, error | |
| `Textarea` | 여러 줄 입력, 글자 수 표시 | |
| `Checkbox` | 독립 선택. indeterminate 지원 | ✓ |
| `RadioGroup` | 배타적 선택. 그룹 단일 탭 정지점 | ✓ |
| `Switch` | 즉시 반영되는 설정 | ✓ |
| `ToggleButton` | `aria-pressed` 기반 양방향 버튼 | ✓ |
| `Select` | 목록에서 하나 선택. typeahead | ✓ |
| `MultiSelect` | 여러 값 선택. `aria-multiselectable` | ✓ |
| `Combobox` | 입력으로 좁혀 선택. list autocomplete | ✓ |

### 오버레이

| 컴포넌트 | 설명 | Headless |
| --- | --- | :---: |
| `Dialog` | focus trap, background inert, scroll lock | ✓ |
| `Popover` | 앵커 위치 계산, 비모달 dismiss | ✓ |
| `DropdownMenu` | menu button, roving focus, typeahead | ✓ |
| `Tooltip` | hover/focus 지연 열기, `aria-describedby` | ✓ |

### 데이터 표시

| 컴포넌트 | 설명 | Headless |
| --- | --- | :---: |
| `Table` | 네이티브 table. opt-in grid 정렬·선택 | ✓ |
| `Accordion` | 단일/다중 열기, 헤더 키보드 탐색 | ✓ |
| `Tabs` | 자동/수동 활성화, 가로/세로 | ✓ |
| `Card` | 패널 레이아웃 | |
| `Badge` | 상태·분류 라벨 | |
| `EmptyState` | 비어 있는 이유와 다음 행동 | |

### 피드백

| 컴포넌트 | 설명 | Headless |
| --- | --- | :---: |
| `Toast` | 화면을 막지 않는 일시 알림 | ✓ |
| `Alert` | 화면에 남는 상태 알림 | |
| `Progress` | 진행률. 미완료 상태 지원 | |
| `Loading` | 처리 중 표시 | |

### 내비게이션

| 컴포넌트 | 설명 | Headless |
| --- | --- | :---: |
| `Pagination` | 페이지 이동. 폭이 고정된 페이지 창 | |
| `Breadcrumb` | 현재 경로와 상위 이동 | |

<br />

## Foundation

| 문서 | 내용 |
| --- | --- |
| `Color Palette` | primitive 원색과 semantic alias, 해석된 값 |
| `Typography` | type scale과 semantic content token |
| `Spacing` | Tailwind 4px spacing scale |
| `Icons` | 24×24 그리드에 직접 그린 37개 아이콘 |

아이콘은 `currentColor`를 따르므로 색상 prop이 없고, 기본이 장식(`aria-hidden`)입니다. 아이콘만으로 의미를 전달할 때만 `title`을 넘겨 이름을 갖게 합니다. 새 아이콘은 `createIcon`으로 만들어야 크기·색·접근성 처리가 같아집니다.

### 에이전트로 쓰기

이 저장소에서 작업하는 에이전트는 `.mcp.json`을 통해 디자인 시스템에 직접 물어볼 수 있습니다.

```txt
search("설정 켜고 끄기")  → Switch  (+ "ToggleButton은 툴바 서식용" 이라는 구분까지)
get("Switch")            → 사용 규칙, export, headless 대응물, ARIA 패턴
tokens("danger")         → status-danger-solid = #b91c1c (bg-status-danger-solid)
```

파일을 찾아 읽지 않아도 되고, 답의 근거는 `X.doc.ts` 한 곳입니다.

<br />

## 토큰

색상은 `primitive → semantic → component` 순서로 흐릅니다.

| 단계 | 예시 | 역할 |
| --- | --- | --- |
| primitive | `primitive.green.700` | 실제 색상 값 |
| semantic | `primary.solid` | primitive를 참조하는 의미 이름 |
| component | `bg-primary-solid` | 컴포넌트가 쓰는 Tailwind class |

색상을 바꿀 때는 `src/tokens/color-tokens.json`만 수정하고 다시 생성합니다.

```bash
npm run tokens:build
```

`src/tokens/generated/colors.css`는 생성 산출물입니다. 직접 수정하지 않습니다.

<br />

## 구조

```txt
src/
├── tokens/          color-tokens.json (SSOT) → generated/colors.css
├── headless/
│   ├── hooks/       useControllableState, usePagination, useTableSort, useTableSelection
│   └── primitives/  상태 · ARIA · 키보드 · controlled/uncontrolled
├── components/      Tailwind semantic token을 쓰는 styled layer
├── icons/           createIcon으로 만든 24×24 세트
├── foundation/      색상 · 타이포그래피 · spacing 문서
└── docs/            문서 스키마와 렌더러
```

각 컴포넌트 폴더에는 `X.doc.ts`가 있습니다. **문서는 산문이 아니라 데이터입니다.**

```txt
X.doc.ts ─┬─→ X.mdx                      (Storybook 문서 페이지)
          ├─→ component-manifest.json    (전체 목록)
          └─→ MCP search / get           (에이전트가 물어보는 형태)
```

한 번 쓴 규칙이 사람과 에이전트 양쪽에 도달하고, 둘이 어긋날 수 없습니다. 스토리 이름이 바뀌면 `npm run test`가 실패합니다.

<br />

## 스크립트

| 명령 | 설명 |
| --- | --- |
| `npm run storybook` | Storybook 개발 서버 |
| `npm run dev` | Vite 데모 앱 |
| `npm run build` | TypeScript + Vite 프로덕션 빌드 |
| `npm run build-storybook` | 정적 Storybook 빌드 |
| `npm run tokens:build` | SSOT 색상 토큰에서 Tailwind CSS 생성 |
| `npm run docs:manifest` | `*.doc.ts`에서 `docs/component-manifest.json` 생성 |
| `npm run mcp` | MCP 서버 (stdio). 보통은 `.mcp.json`으로 자동 연결됩니다 |
| `npm run lint` | Oxlint |
| `npm run test` | headless primitive 단위 테스트 |
| `npm run test:storybook` | Chromium 기반 interaction · 접근성 테스트 |

<br />

## 구현 규칙

- 컴포넌트에 raw hex를 쓰지 않습니다.
- 컴포넌트 스타일은 primitive가 아니라 semantic token을 씁니다.
- headless layer는 스타일 결정을 하지 않습니다.
- styled layer는 headless의 상태와 ARIA를 유지한 채 시각 스타일만 더합니다.
- 네이티브 HTML semantics를 우선합니다. `<button>`, `<input>`, `<table>`로 되는 동작을 `div`와 ARIA로 다시 만들지 않습니다.
- 합성 컴포넌트의 headless 루트는 `*Root`, styled 루트는 컴포넌트 이름 그대로입니다.
- 새 컴포넌트는 story와 `X.doc.ts`, 그리고 interaction 또는 접근성 검증을 함께 추가합니다.
- MDX는 직접 수정하지 않습니다. 내용은 `X.doc.ts`에 씁니다.

자세한 작업 규칙은 [AGENT.md](AGENT.md), 설계 기준은 [DESIGN.md](DESIGN.md)에 있습니다.

<br />

## 기술 문서

- [Table을 넘어 Data Grid로: React에서 Headless Table 직접 구현하기](docs/headless-table-implementation.md)

<br />

## 기술 스택

React 19 · TypeScript · Vite · Tailwind CSS v4 · Storybook 10 · Vitest (Playwright)
