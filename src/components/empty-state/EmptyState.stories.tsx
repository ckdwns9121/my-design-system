import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { Button } from '../button'
import { EmptyState } from './EmptyState'

const meta = {
  title: 'Components/EmptyState',
  component: EmptyState,
  tags: ['ai-generated'],
  parameters: {
    layout: 'padded',
  },
  args: {
    title: '표시할 주문이 없습니다',
    description: '선택한 기간에 등록된 주문이 없습니다. 기간을 넓히거나 필터를 지워보세요.',
  },
} satisfies Meta<typeof EmptyState>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const TitleOnly: Story = {
  args: {
    description: undefined,
  },
}

export const WithAction: Story = {
  args: {
    action: <Button size="sm">필터 지우기</Button>,
  },
}

export const WithMedia: Story = {
  args: {
    media: <span className="text-4xl">📦</span>,
    action: <Button size="sm">주문 등록</Button>,
  },
  play: async ({ canvas }) => {
    const heading = canvas.getByText('표시할 주문이 없습니다')

    await expect(canvas.getByRole('button', { name: '주문 등록' })).toBeEnabled()
    await expect(getComputedStyle(heading).fontWeight).toBe('600')
  },
}
