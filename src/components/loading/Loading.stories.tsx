import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { Loading } from './Loading'

const meta = {
  title: 'Components/Loading',
  component: Loading,
  tags: ['ai-generated'],
  args: {
    label: '불러오는 중',
  },
} satisfies Meta<typeof Loading>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-6">
      <Loading {...args} size="sm" />
      <Loading {...args} size="md" />
      <Loading {...args} size="lg" />
    </div>
  ),
}

export const WithLabel: Story = {
  args: {
    showLabel: true,
    label: '주문 내역을 불러오는 중',
  },
}

export const StatusRole: Story = {
  play: async ({ canvas }) => {
    const status = canvas.getByRole('status')

    await expect(status).toHaveTextContent('불러오는 중')
    await expect(getComputedStyle(status).display).toBe('inline-flex')
  },
}
