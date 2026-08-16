import {
  ThemeProvider as HeadlessThemeProvider,
  useTheme,
  type ThemeProviderProps,
} from '../../headless'
import { EyeIcon, EyeOffIcon } from '../../icons'
import { IconButton, type IconButtonProps } from '../icon-button'

export type { ThemeProviderProps }

export type ThemeToggleProps = Omit<IconButtonProps, 'icon' | 'label' | 'onClick'> & {
  /** Accessible name. It should say what pressing does, not the current state. */
  label?: string
}

export function ThemeProvider(props: ThemeProviderProps) {
  return <HeadlessThemeProvider {...props} />
}

/**
 * Switches between light and dark.
 *
 * The name describes the action rather than the current theme, because a screen
 * reader user hears the name before knowing the state.
 */
export function ThemeToggle({ label, ...props }: ThemeToggleProps) {
  const { resolvedTheme, toggle } = useTheme()
  const goingDark = resolvedTheme === 'light'

  return (
    <IconButton
      icon={goingDark ? <EyeOffIcon /> : <EyeIcon />}
      label={label ?? (goingDark ? '어두운 테마로 전환' : '밝은 테마로 전환')}
      onClick={toggle}
      variant="subtle"
      {...props}
    />
  )
}
