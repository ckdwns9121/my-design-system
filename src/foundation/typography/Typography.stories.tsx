import type { Meta, StoryObj } from '@storybook/react-vite'
import { Typography } from './Typography'

const meta = {
  component: Typography,
  tags: ['ai-generated'],
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof Typography>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
