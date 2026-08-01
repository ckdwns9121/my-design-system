# Design

## Source of truth
- Status: Active
- Last refreshed: 2026-07-15
- Primary product surfaces: React component library, Storybook documentation, Vite demo surface.
- Evidence reviewed: `README.md`, `src/index.css`, `src/App.tsx`, `src/foundation/*`, `src/components/*`, `src/headless/*`, `.storybook/preview.tsx`.

## Brand
- Personality: Calm, practical, component-first, slightly fresh through a green primary palette.
- Trust signals: Consistent token naming, accessible contrast, predictable component states.
- Avoid: One-off hex values in components, decorative gradients, palette choices outside tokens.

## Product goals
- Goals: Build a learning-first FE design system by implementing headless primitives directly, then layering token-driven styled components on top.
- Non-goals: Full production app UX, marketing landing page, external package publishing at this stage, copying shadcn implementations.
- Success signals: Headless primitives expose accessible behavior without styling decisions; styled components consume semantic tokens only; Storybook proves behavior and styling.

## Personas and jobs
- Primary personas: Frontend developer studying design-system internals and accessible component behavior.
- User jobs: Inspect tokens, implement headless state/ARIA patterns, reuse styled wrappers, extend variants without breaking consistency.
- Key contexts of use: Local development, Storybook review, future app prototyping, portfolio explanation.

## Information architecture
- Primary navigation: Storybook foundation docs, per-component docs pages, and the stories each docs page is built from.
- Core routes/screens: Vite demo app, Foundation/Docs, foundation stories, component stories.
- Content hierarchy: Foundation first, then primitive components, then composed examples.

## Design principles
- Principle 1: Token changes must flow from primitive tokens to semantic aliases to components.
- Principle 2: Headless primitives own behavior and accessibility, not visual style.
- Principle 3: Styled components express intent through semantic names, not raw palette names.
- Tradeoffs: Simple components may stay directly styled until a real headless behavior layer is useful; complex overlay/menu components should be attempted after lower-risk primitives.

## Visual language
- Color: Primary is green. `src/tokens/color-tokens.json` is the color SSOT; generated CSS is derived output.
- Typography: Documented in `src/foundation/typography`; system sans-serif through Tailwind theme token.
- Spacing/layout rhythm: Documented in `src/foundation/spacing`; Tailwind 4px spacing scale with compact, dashboard-like layouts.
- Shape/radius/elevation: 6-8px radii for controls and panels; subtle panel shadow only where framing helps.
- Motion: Minimal transitions for hover/focus state changes.
- Imagery/iconography: `src/icons` holds a hand-drawn 24x24 stroke set built through `createIcon`. Icons take their color from `currentColor` and are decorative unless given a `title`.

## Components
- Existing foundation docs: `Docs`, `ColorPalette`, `Typography`, `Spacing`, `Icons`.
- Documentation surface: every component has an MDX docs page attached to its CSF file, built from `src/docs/DocsTabs.tsx` (Overview and Properties tabs, with style variations grouped under Overview). Docs pages show stories and token data; explanatory prose stays out of them.
- Existing components to reuse: `Button`, `Badge`, `Card`, `Table`, `TextField`, `Toggle`.
- Behavior-carrying components: `Checkbox`, `Tabs`, `Accordion`, `Dialog`, `Popover`, `DropdownMenu`, `Select`, `Tooltip`, `Switch`, `RadioGroup`, `MultiSelect`, `Combobox`, and `Toast` expose headless behavior with token-driven styled layers. `Table` keeps native table behavior by default and enables sortable, selectable grid behavior through the opt-in `grid` mode.
- Presentational components: `Alert`, `Loading`, `Progress`, `EmptyState`, `Breadcrumb`, `Textarea`, `IconButton`, and `Pagination` own no cross-component state; `IconButton` requires a `label` because an icon carries no text; `Pagination` takes its page window from the `usePagination` hook.
- Implemented headless primitives: `useControllableState`, `usePagination`, `Toggle`, `Checkbox`, `Switch`, `RadioGroup`, `Tabs`, `Accordion`, `Dialog`, `Popover`, `DropdownMenu`, `Select`, `MultiSelect`, `Combobox`, `Tooltip`, `Toast`, and Table grid behavior.
- Variants and states: Primary, secondary, subtle, danger; success/warning/danger status badges and alerts; input helper/error states; table ascending/descending sort and selected/indeterminate states; single vs multiple listbox selection.
- Token/component ownership: `src/tokens/color-tokens.json` owns color values and aliases, including inverse and overlay surfaces. Headless primitives own state, ARIA, keyboard, focus, and overlay behavior. Styled components consume generated semantic Tailwind classes.

## Accessibility
- Target standard: WCAG AA-oriented defaults.
- Keyboard/focus behavior: Interactive components expose visible focus rings through semantic focus tokens. Tabs, Accordion, DropdownMenu, Select, and Table implement their APG keyboard models. Dialog traps focus and restores it to its trigger; Tooltip keeps focus on its trigger.
- Contrast/readability: Primary solid uses white text on green 700 for WCAG AA body-text contrast; body text uses slate semantic content tokens.
- Screen-reader semantics: Form controls use labels and ARIA descriptions/invalid state. Interactive tables expose `role="grid"`, `aria-sort`, `aria-selected`, and `aria-multiselectable` where applicable.
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
- Selected: Table rows expose both `aria-selected` and the semantic primary selection surface.
- Open overlays: Dialog, Popover, DropdownMenu, Select, and Tooltip expose open state through ARIA and `data-state`; Dialog additionally makes background content inert and locks body scrolling.
- Offline/slow network, if applicable: Not applicable yet.

## Content voice
- Tone: Clear, concise, implementation-oriented Korean/English labels.
- Terminology: Use `primitive` for raw palette values and `semantic` for usage aliases.
- Microcopy rules: Prefer direct labels over explanatory prose inside components.

## Implementation constraints
- Framework/styling system: React, TypeScript, Vite, Tailwind CSS v4, Storybook.
- Design-token constraints: No component-level raw hex colors. Color CSS is generated from `src/tokens/color-tokens.json`.
- Headless constraints: Headless primitives should support controlled/uncontrolled usage where applicable, expose ARIA state, and avoid Tailwind or token-specific classes.
- Performance constraints: No runtime token generation in the browser.
- Compatibility constraints: Local Node/npm workflow.
- Test/screenshot expectations: Storybook story tests must keep one concrete CSS computed-style check.

## Open questions
- [ ] Should future themes include dark mode aliases or only light mode initially? / owner: project owner / impact: token schema expansion.
