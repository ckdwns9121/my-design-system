import type { Meta, StoryObj } from '@storybook/react-vite'
import { Badge } from './Badge'

const meta = {
  component: Badge,
  tags: ['ai-generated'],
  args: {
    children: 'Ready',
  },
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

export const Neutral: Story = {}

export const Brand: Story = {
  args: {
    children: 'New',
    tone: 'primary',
  },
}

export const StatusSet: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge tone="success">Success</Badge>
      <Badge tone="warning">Warning</Badge>
      <Badge tone="danger">Danger</Badge>
    </div>
  ),
}
