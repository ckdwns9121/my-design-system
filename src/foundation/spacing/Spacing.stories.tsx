import type { Meta, StoryObj } from '@storybook/react-vite'
import { Spacing } from './Spacing'

const meta = {
  title: 'Foundation/Spacing',
  component: Spacing,
  tags: ['ai-generated'],
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof Spacing>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
