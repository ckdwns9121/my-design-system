import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { Toggle } from './Toggle'

const meta = {
  title: 'Components/Toggle',
  component: Toggle,
  tags: ['ai-generated'],
  args: {
    children: 'Bold',
  },
} satisfies Meta<typeof Toggle>

export default meta
type Story = StoryObj<typeof meta>

export const Uncontrolled: Story = {
  args: {
    defaultPressed: true,
  },
  play: async ({ canvas, userEvent }) => {
    const toggle = canvas.getByRole('button', { name: /bold/i })

    await expect(toggle).toHaveAttribute('aria-pressed', 'true')
    await userEvent.click(toggle)
    await expect(toggle).toHaveAttribute('aria-pressed', 'false')
  },
}

export const Controlled: Story = {
  args: {
    pressed: true,
  },
  play: async ({ canvas, userEvent }) => {
    const toggle = canvas.getByRole('button', { name: /bold/i })

    await userEvent.click(toggle)
    await expect(toggle).toHaveAttribute('aria-pressed', 'true')
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
  },
  play: async ({ canvas }) => {
    const toggle = canvas.getByRole('button', { name: /bold/i })

    await expect(toggle).toBeDisabled()
    await expect(toggle).toHaveAttribute('aria-pressed', 'false')
  },
}
