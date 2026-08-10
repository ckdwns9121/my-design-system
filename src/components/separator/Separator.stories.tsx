import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { Separator } from './Separator'

const meta = {
  title: 'Components/Separator',
  component: Separator,
  tags: ['ai-generated'],
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof Separator>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Horizontal: Story = {
  render: (args) => (
    <div className="grid gap-4 text-sm text-content-default">
      <p>주문 정보</p>
      <Separator {...args} />
      <p>배송 정보</p>
    </div>
  ),
}

export const Vertical: Story = {
  render: () => (
    <div className="flex h-10 items-center gap-4 text-sm text-content-default">
      <span>주문</span>
      <Separator orientation="vertical" />
      <span>배송</span>
      <Separator orientation="vertical" />
      <span>정산</span>
    </div>
  ),
}

export const WithLabel: Story = {
  args: {
    label: '또는',
  },
}

export const Decorative: Story = {
  args: {
    decorative: true,
  },
  play: async ({ canvas }) => {
    // A decorative separator leaves the tree, so no separator role is exposed.
    await expect(canvas.queryByRole('separator')).not.toBeInTheDocument()
  },
}

export const SeparatorRole: Story = {
  play: async ({ canvas }) => {
    const separator = canvas.getByRole('separator')

    await expect(separator).toHaveAttribute('aria-orientation', 'horizontal')
    await expect(getComputedStyle(separator).backgroundColor).toBe('rgb(226, 232, 240)')
  },
}
