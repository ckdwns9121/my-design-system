import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { Text } from './Text'

const meta = {
  title: 'Components/Text',
  component: Text,
  tags: ['ai-generated'],
  parameters: {
    layout: 'padded',
  },
  args: {
    children: '주문이 확정되면 배송 정보를 수정할 수 없습니다.',
  },
} satisfies Meta<typeof Text>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Sizes: Story = {
  render: (args) => (
    <div className="grid gap-2">
      <Text {...args} size="xs" />
      <Text {...args} size="sm" />
      <Text {...args} size="md" />
      <Text {...args} size="lg" />
    </div>
  ),
}

export const Tones: Story = {
  render: (args) => (
    <div className="grid gap-2">
      <Text {...args} tone="strong" />
      <Text {...args} tone="default" />
      <Text {...args} tone="muted" />
      <Text {...args} tone="subtle" />
      <Text {...args} tone="danger">
        저장하지 못했습니다.
      </Text>
      <Text {...args} tone="success">
        저장했습니다.
      </Text>
    </div>
  ),
}

export const Weights: Story = {
  render: (args) => (
    <div className="grid gap-2">
      <Text {...args} weight="normal" />
      <Text {...args} weight="medium" />
      <Text {...args} weight="semibold" />
    </div>
  ),
}

export const Truncated: Story = {
  args: {
    truncate: true,
    className: 'max-w-56',
  },
}

export const Inline: Story = {
  render: (args) => (
    <p className="text-sm text-content-default">
      재고{' '}
      <Text {...args} as="span" tone="strong" weight="semibold">
        240
      </Text>
      개 중 96개가 출고 대기입니다.
    </p>
  ),
}

export const SizeAndLineHeightMoveTogether: Story = {
  args: {
    size: 'sm',
    tone: 'muted',
  },
  play: async ({ canvas }) => {
    const text = canvas.getByText('주문이 확정되면 배송 정보를 수정할 수 없습니다.')

    await expect(getComputedStyle(text).fontSize).toBe('14px')
    await expect(getComputedStyle(text).lineHeight).toBe('24px')
    await expect(getComputedStyle(text).color).toBe('rgb(71, 85, 105)')
  },
}
