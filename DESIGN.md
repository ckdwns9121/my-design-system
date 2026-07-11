# Design

## Source of truth
- Status: Active
- Last refreshed: 2026-07-11
- Primary product surfaces: React component library, Storybook documentation, Vite demo surface.
- Evidence reviewed: `README.md`, `src/index.css`, `src/App.tsx`, `src/components/*`, `.storybook/preview.tsx`.

## Brand
- Personality: Calm, practical, component-first, slightly fresh through a green primary palette.
- Trust signals: Consistent token naming, accessible contrast, predictable component states.
- Avoid: One-off hex values in components, decorative gradients, palette choices outside tokens.

## Product goals
- Goals: Build a reusable personal design system with Tailwind and Storybook.
- Non-goals: Full production app UX, marketing landing page, external package publishing at this stage.
- Success signals: Components consume semantic tokens only; Storybook shows primitive and semantic color usage clearly.

## Personas and jobs
- Primary personas: Frontend developer maintaining a personal component library.
- User jobs: Inspect tokens, reuse components, extend variants without breaking consistency.
- Key contexts of use: Local development, Storybook review, future app prototyping.

## Information architecture
- Primary navigation: Storybook component and token stories.
- Core routes/screens: Vite demo app, component stories, token palette story.
- Content hierarchy: Tokens first, then primitive components, then composed examples.

## Design principles
- Principle 1: Token changes must flow from primitive tokens to semantic aliases to components.
- Principle 2: Components should express intent through semantic names, not raw palette names.
- Tradeoffs: Primitive tokens remain visible in palette documentation, but normal component styling uses semantic tokens.

## Visual language
- Color: Primary is green. `src/tokens/color-tokens.json` is the color SSOT; generated CSS is derived output.
- Typography: System sans-serif through Tailwind theme token.
- Spacing/layout rhythm: Tailwind spacing utilities with compact, dashboard-like layouts.
- Shape/radius/elevation: 6-8px radii for controls and panels; subtle panel shadow only where framing helps.
- Motion: Minimal transitions for hover/focus state changes.
- Imagery/iconography: None required for current token/component surfaces.

## Components
- Existing components to reuse: `Button`, `Badge`, `Card`, `TextField`.
- New/changed components: `ColorPalette` documents primitive and semantic color tokens.
- Variants and states: Primary, secondary, subtle, danger; success/warning/danger status badges; input helper/error states.
- Token/component ownership: `src/tokens/color-tokens.json` owns color values and aliases. Components consume generated semantic Tailwind classes.

## Accessibility
- Target standard: WCAG AA-oriented defaults.
- Keyboard/focus behavior: Interactive components must expose visible focus rings through semantic focus tokens.
- Contrast/readability: Primary solid uses white text on green 600; body text uses slate semantic content tokens.
- Screen-reader semantics: Form controls use labels and ARIA descriptions/invalid state.
- Reduced motion and sensory considerations: Current motion is limited to small state transitions.

## Responsive behavior
- Supported breakpoints/devices: Mobile-first responsive layouts through Tailwind utilities.
- Layout adaptations: Demo cards stack on small screens and form columns on medium screens.
- Touch/hover differences: Hover enhances states, but base states remain usable without hover.

## Interaction states
- Loading: Button loading disables interaction and shows a spinner.
- Empty: Not defined yet.
- Error: Text field exposes `aria-invalid` and semantic danger color.
- Success: Status badges use semantic success tokens.
- Disabled: Button disabled state reduces opacity and blocks pointer interaction.
- Offline/slow network, if applicable: Not applicable yet.

## Content voice
- Tone: Clear, concise, implementation-oriented Korean/English labels.
- Terminology: Use `primitive` for raw palette values and `semantic` for usage aliases.
- Microcopy rules: Prefer direct labels over explanatory prose inside components.

## Implementation constraints
- Framework/styling system: React, TypeScript, Vite, Tailwind CSS v4, Storybook.
- Design-token constraints: No component-level raw hex colors. Color CSS is generated from `src/tokens/color-tokens.json`.
- Performance constraints: No runtime token generation in the browser.
- Compatibility constraints: Local Node/npm workflow.
- Test/screenshot expectations: Storybook story tests must keep one concrete CSS computed-style check.

## Open questions
- [ ] Should future themes include dark mode aliases or only light mode initially? / owner: project owner / impact: token schema expansion.
