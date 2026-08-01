/**
 * The authored shape of a component's documentation.
 *
 * A component doc is data, not prose. The Storybook page renders from it and
 * `npm run docs:manifest` serializes the same objects for agents, so a rule
 * written once reaches both readers and cannot drift between them.
 *
 * Props are deliberately absent: Storybook derives them from the TypeScript
 * types, and restating them here would only give them a second place to rot.
 */
export type ComponentCategory =
  | 'Form'
  | 'Overlay'
  | 'Data display'
  | 'Feedback'
  | 'Navigation'

export type ComponentDoc = {
  /** Primary export name, matching the import. */
  name: string
  category: ComponentCategory
  /** One sentence on what the component does. */
  summary: string
  /**
   * Terms someone might search for instead of `name`: synonyms, the concept in
   * Korean, and the equivalent component in other design systems. Lowercase.
   * An agent asked for a "스위치" or a "Segmented control" has to land here.
   */
  keywords: string[]
  /** Import specifier a consumer writes. */
  import: string
  /**
   * Public exports, primary one first. Compound components expose several, and
   * the root is not always named after the component — Dialog roots at
   * `DialogRoot` while Select roots at `Select` — so this cannot be derived.
   */
  exports: string[]
  /**
   * Rules for choosing and using the component. Each entry stands alone; these
   * are the decisions a reader cannot recover from the type signature.
   */
  rules: string[]
  /** Components that could be confused with this one, and how to decide. */
  related?: Array<{ name: string; when: string }>
  /** Set when behavior lives in a headless primitive that can be used alone. */
  headless?: {
    /** Named exports of the primitive, in composition order. */
    exports: string[]
    import: string
  }
  /** The WAI-ARIA pattern the behavior implements, when one applies. */
  ariaPattern?: {
    name: string
    url: string
    /** Anything the implementation does differently, and why. */
    notes?: string[]
  }
  /** Story export rendered at the top of the page. */
  overviewStory: string
  /** Additional stories shown under Styles, in order. */
  styleStories?: Array<{ title: string; story: string }>
}
