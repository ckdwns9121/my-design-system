import type { Meta, StoryObj } from '@storybook/react-vite'
import { ColorPalette } from './ColorPalette'

const meta = {
  component: ColorPalette,
  tags: ['ai-generated'],
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof ColorPalette>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
