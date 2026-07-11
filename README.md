# My Design System

Tailwind CSS와 Storybook으로 만든 개인 디자인 시스템 시작 프로젝트입니다.

## Scripts

- `npm run dev` - Vite 개발 서버
- `npm run storybook` - Storybook 컴포넌트 문서
- `npm run build` - TypeScript + Vite 프로덕션 빌드
- `npm run build-storybook` - 정적 Storybook 빌드
- `npx vitest --project storybook run` - Storybook story 테스트

## Structure

- `src/index.css` - Tailwind import와 디자인 토큰
- `src/tokens/color-tokens.json` - color token SSOT
- `src/tokens/generated/colors.css` - SSOT에서 생성되는 Tailwind color token CSS
- `scripts/generate-color-tokens.mjs` - token CSS 생성 스크립트
- `src/components` - 재사용 컴포넌트와 colocated stories
- `.storybook/preview.tsx` - Storybook 전역 CSS 및 공통 파라미터

## Token Flow

Color token은 `primitive -> semantic -> component` 순서로 사용합니다.

- `primitive.green.600`: 실제 색상 값
- `primary.solid`: primitive를 참조하는 semantic alias
- `bg-primary-solid`: 컴포넌트가 사용하는 Tailwind class

컴포넌트에서는 raw hex나 primitive class를 직접 쓰지 않습니다. 색상을 바꿀 때는 `src/tokens/color-tokens.json`을 수정한 뒤 `npm run tokens:build`를 실행합니다.

## Components

현재 포함된 컴포넌트는 `ColorPalette`, `Button`, `Badge`, `Card`, `TextField`입니다.
새 컴포넌트는 `src/components` 아래에 컴포넌트와 `*.stories.tsx`를 함께 추가하면 됩니다.
