import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { Heading } from './Heading'

const meta = {
  title: 'Components/Heading',
  component: Heading,
  tags: ['ai-generated'],
  parameters: {
    layout: 'padded',
  },
  args: {
    children: '주문 상세',
  },
} satisfies Meta<typeof Heading>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Levels: Story = {
  render: () => (
    <div className="grid gap-3">
      <Heading level={1}>주문 관리</Heading>
      <Heading level={2}>주문 상세</Heading>
      <Heading level={3}>배송 정보</Heading>
      <Heading level={4}>수취인</Heading>
    </div>
  ),
}

export const SizeSeparateFromLevel: Story = {
  render: () => (
    <div className="grid gap-3">
      <Heading level={2} size="xl">
        h2 인데 xl 크기
      </Heading>
      <Heading level={2} size="sm">
        h2 인데 sm 크기
      </Heading>
    </div>
  ),
}

export const KeepsTheOutline: Story = {
  render: () => (
    <div className="grid gap-3">
      <Heading level={1}>주문 관리</Heading>
      <Heading level={2} size="sm">
        주문 상세
      </Heading>
    </div>
  ),
  play: async ({ canvas }) => {
    // The second heading is visually small but still an h2, so the outline holds.
    const outer = canvas.getByRole('heading', { level: 1 })
    const inner = canvas.getByRole('heading', { level: 2 })

    await expect(outer).toHaveTextContent('주문 관리')
    await expect(inner).toHaveTextContent('주문 상세')
    await expect(getComputedStyle(inner).fontSize).toBe('14px')
    await expect(getComputedStyle(inner).fontWeight).toBe('600')
  },
}
