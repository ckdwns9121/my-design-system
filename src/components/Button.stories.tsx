import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { Button } from './Button'

const meta = {
  component: Button,
  tags: ['ai-generated'],
  args: {
    children: 'Submit',
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {}

export const Secondary: Story = {
  args: {
    children: 'Review',
    variant: 'secondary',
  },
}

export const Loading: Story = {
  args: {
    children: 'Saving',
    isLoading: true,
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: /saving/i })).toBeDisabled()
  },
}

export const Danger: Story = {
  args: {
    children: 'Delete',
    variant: 'danger',
  },
}

export const CssCheck: Story = {
  args: {
    children: 'Submit',
  },
  play: async ({ canvas }) => {
    const button = canvas.getByRole('button', { name: /submit/i })
    await expect(getComputedStyle(button).backgroundColor).toBe('rgb(22, 163, 74)')
  },
}
