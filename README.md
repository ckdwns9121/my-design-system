# Headless Core FE Design System

접근성, 상태 관리, 키보드 인터랙션을 직접 구현하는 프론트엔드 디자인 시스템입니다.

이 프로젝트는 headless primitive를 직접 구현하고, 그 위에 토큰 기반 styled component layer를 구성합니다. 컴포넌트는 단계별로 추가하며 Storybook에서 상태, 접근성, 인터랙션을 검증합니다.

## 목표

- headless primitive를 직접 설계하고 구현합니다.
- primitive token에서 semantic token으로 이어지는 SSOT 디자인 토큰 구조를 유지합니다.
- headless layer 위에 Tailwind 기반 styled component layer를 얹습니다.
- Storybook에서 컴포넌트 상태, 접근성, 인터랙션을 검증합니다.
- 복잡한 컴포넌트는 구현 범위와 접근성 요구사항을 문서화한 뒤 단계적으로 추가합니다.

## 구조

```txt
src/tokens
  color-tokens.json
  generated/colors.css

src/headless
  hooks
  primitives

src/foundation
  color-palette
  typography
  spacing

src/components
  styled components
  *.stories.tsx
```

현재 foundation 문서는 색상, 타이포그래피, spacing을 기준으로 구성되어 있습니다.

## 레이어 원칙

```txt
headless layer
- 상태 관리
- ARIA 속성
- 키보드 인터랙션
- controlled / uncontrolled API
- 스타일 없음 또는 최소 className 전달

styled layer
- Tailwind class
- semantic token 사용
- size / variant
- Storybook 문서와 테스트
```

컴포넌트는 최종적으로 다음 흐름을 따릅니다.

```txt
primitive token -> semantic token -> headless primitive -> styled component -> Storybook
```

## 토큰 흐름

Color token은 `primitive -> semantic -> component` 순서로 사용합니다.

- `primitive.green.600`: 실제 색상 값
- `primary.solid`: primitive를 참조하는 semantic alias
- `bg-primary-solid`: 컴포넌트가 사용하는 Tailwind class

컴포넌트에서는 raw hex나 primitive class를 직접 쓰지 않습니다. 색상을 바꿀 때는 `src/tokens/color-tokens.json`을 수정한 뒤 `npm run tokens:build`를 실행합니다.

## 컴포넌트 진행 단계

### Step 1. Headless core

- [x] `useControllableState`
- [x] `Toggle`
- [ ] `Checkbox`
- [ ] `Tabs`
- [ ] `Accordion`

### Step 2. Styled components

- [x] `Button`
- [x] `Badge`
- [x] `Card`
- [x] `TextField`
- [x] `Toggle`
- [ ] `Checkbox`
- [ ] `Tabs`
- [ ] `Accordion`

### Step 2-1. Foundation

- [x] `ColorPalette`
- [x] `Typography`
- [x] `Spacing`

### Step 3. Overlay and advanced primitives

- [ ] `Dialog`
- [ ] `Popover`
- [ ] `DropdownMenu`
- [ ] `Select`
- [ ] `Tooltip`

이 단계의 컴포넌트는 focus trap, focus return, portal, outside click, escape key, scroll lock, screen reader 동작을 포함해 구현합니다.

## 현재 포함된 컴포넌트

- `Button`: semantic token 기반 버튼
- `Badge`: 상태와 primary tone 표시
- `Card`: 패널 레이아웃
- `TextField`: label, helper text, error state 포함 입력 필드

## 현재 포함된 Foundation

- `Docs`: foundation 기준과 token flow 문서
- `ColorPalette`: primitive/semantic 색상 토큰 문서화
- `Typography`: type scale과 semantic content token 문서화
- `Spacing`: Tailwind 4px spacing scale 문서화

## 스크립트

- `npm run tokens:build` - SSOT 색상 토큰으로 Tailwind color CSS 생성
- `npm run dev` - Vite 개발 서버
- `npm run storybook` - Storybook 컴포넌트 문서
- `npm run build` - TypeScript + Vite 프로덕션 빌드
- `npm run build-storybook` - 정적 Storybook 빌드
- `npm run lint` - Oxlint 실행
- `npx vitest --project storybook run` - Storybook story 테스트

## 구현 규칙

- 컴포넌트에서 raw hex 값을 사용하지 않습니다.
- 일반 컴포넌트 스타일은 primitive token이 아니라 semantic token을 사용합니다.
- headless layer는 스타일 결정을 하지 않습니다.
- styled layer는 headless layer의 상태와 ARIA를 유지한 채 시각 스타일만 추가합니다.
- 새 컴포넌트는 Storybook story와 최소한의 interaction 또는 accessibility 검증을 함께 추가합니다.
