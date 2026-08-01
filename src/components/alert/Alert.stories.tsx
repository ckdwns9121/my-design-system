import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { Button } from '../button'
import { Alert } from './Alert'

const meta = {
  title: 'Components/Alert',
  component: Alert,
  tags: ['ai-generated'],
  parameters: {
    layout: 'padded',
  },
  args: {
    title: '재고 동기화가 완료되었습니다',
    children: '마지막 동기화는 5분 전에 실행되었습니다.',
  },
} satisfies Meta<typeof Alert>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Tones: Story = {
  render: (args) => (
    <div className="grid gap-3">
      <Alert {...args} title="예약 작업이 등록되었습니다" tone="info" />
      <Alert {...args} title="재고 동기화가 완료되었습니다" tone="success" />
      <Alert {...args} title="검수가 필요한 항목이 있습니다" tone="warning" />
      <Alert {...args} title="주문 3건을 처리하지 못했습니다" tone="danger" />
    </div>
  ),
}

export const TitleOnly: Story = {
  args: {
    children: undefined,
  },
}

export const WithAction: Story = {
  args: {
    tone: 'danger',
    title: '주문 3건을 처리하지 못했습니다',
    children: '실패 사유를 확인한 뒤 다시 시도하세요.',
    action: (
      <Button size="sm" variant="secondary">
        다시 시도
      </Button>
    ),
  },
}

export const LiveRegionRole: Story = {
  args: {
    tone: 'danger',
  },
  play: async ({ canvas }) => {
    const alert = canvas.getByRole('alert')

    await expect(alert).toHaveTextContent('재고 동기화가 완료되었습니다')
    await expect(getComputedStyle(alert).backgroundColor).toBe('rgb(254, 242, 242)')
  },
}

export const StatusRole: Story = {
  args: {
    tone: 'success',
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('status')).toBeInTheDocument()
  },
}
