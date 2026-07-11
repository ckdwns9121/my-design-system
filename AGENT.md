# Agent Guide

이 문서는 이 저장소에서 작업할 때 따르는 구현, 검증, 커밋 규칙입니다.

## 프로젝트 방향

- 이 프로젝트는 headless primitive를 직접 구현하고, 그 위에 token-driven styled component를 얹는 FE 디자인 시스템입니다.
- `src/tokens/color-tokens.json`은 color token의 SSOT입니다.
- `src/tokens/generated/colors.css`는 생성 산출물입니다. 직접 수정하지 않습니다.
- 컴포넌트에서 raw hex 값을 사용하지 않습니다.
- 일반 컴포넌트 스타일은 primitive token이 아니라 semantic token을 사용합니다.
- headless layer는 상태, ARIA, 키보드 인터랙션, controlled/uncontrolled API를 담당합니다.
- styled layer는 Tailwind class, semantic token, variant/size, Storybook 문서화를 담당합니다.

## 작업 순서

1. 변경 전 관련 파일과 기존 패턴을 확인합니다.
2. headless 로직과 styled layer를 분리할 수 있는지 먼저 판단합니다.
3. 새 컴포넌트는 Storybook story를 함께 추가합니다.
4. 접근성 상태가 있는 컴포넌트는 story `play`에서 ARIA 또는 interaction을 검증합니다.
5. 색상 토큰을 변경한 경우 `npm run tokens:build`를 실행합니다.
6. 변경 범위에 맞는 검증 명령을 실행합니다.

## 검증 기준

기본 검증:

```bash
npm run lint
npm run build
```

Storybook 또는 컴포넌트를 변경한 경우:

```bash
npx vitest --project storybook run
npm run build-storybook
```

토큰을 변경한 경우:

```bash
npm run tokens:build
```

## 커밋 타입

커밋 제목은 다음 타입 중 하나로 시작합니다.

- `feat`: 사용자에게 보이는 기능, 컴포넌트, 토큰, Storybook 문서 추가
- `fix`: 버그, 접근성 문제, 타입 오류, 빌드 실패 수정
- `refactor`: 동작 변경 없이 구조, 추상화, 파일 배치를 개선
- `test`: 테스트, Storybook play 검증, 테스트 유틸 추가 또는 수정
- `chore`: 설정, 스크립트, 문서, 의존성, 저장소 운영 작업

필요할 때만 다음 타입을 추가로 사용합니다.

- `docs`: README, DESIGN, 사용법 문서만 변경
- `style`: 코드 동작 없이 포맷, 클래스 정렬, 문장 톤만 변경

## 커밋 제목 형식

```txt
<type>: <변경 이유를 짧게 설명>
```

좋은 예:

```txt
feat: add a headless toggle primitive
fix: preserve aria-invalid on text fields
refactor: split toggle behavior from styled wrapper
test: cover controlled toggle interactions
chore: document repository commit rules
```

피해야 할 예:

```txt
feat: update files
fix: bug
chore: misc
```

## 커밋 본문 형식

커밋 본문은 변경 이유, 제약, 검증 내역을 남깁니다.

```txt
<type>: <변경 이유>

<왜 이 변경이 필요한지, 어떤 방향을 선택했는지 설명합니다.>

Constraint: <작업을 제한한 조건>
Rejected: <검토했지만 선택하지 않은 대안> | <선택하지 않은 이유>
Confidence: <low|medium|high>
Scope-risk: <narrow|moderate|broad>
Directive: <다음 수정자가 지켜야 할 주의점>
Tested: <실행한 검증>
Not-tested: <검증하지 못한 부분>
```

## 커밋 예시

```txt
feat: add a headless toggle primitive

Toggle is the first interactive primitive in the headless layer, so it establishes
the controlled/uncontrolled API shape that Checkbox and Tabs can reuse.

Constraint: Headless primitives must not depend on Tailwind classes
Rejected: Implement styled Toggle first | behavior API should be stable before styling
Confidence: high
Scope-risk: narrow
Directive: Keep aria-pressed behavior in the headless layer, not the styled wrapper
Tested: npm run lint
Tested: npm run build
Tested: npx vitest --project storybook run
Not-tested: Screen reader manual pass
```

## 브랜치와 원격 반영

- 기본 브랜치는 `main`입니다.
- 작은 단위로 커밋합니다.
- 커밋 전에는 `git status -sb`로 변경 범위를 확인합니다.
- 관련 없는 변경을 함께 커밋하지 않습니다.
- push 전에는 최소한 `npm run lint`와 변경 범위에 맞는 검증을 실행합니다.
