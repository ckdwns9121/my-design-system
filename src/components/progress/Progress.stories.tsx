import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { Progress } from './Progress'

const meta = {
  title: 'Components/Progress',
  component: Progress,
  tags: ['ai-generated'],
  parameters: {
    layout: 'padded',
  },
  args: {
    label: '업로드 진행률',
    value: 60,
  },
} satisfies Meta<typeof Progress>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const WithValue: Story = {
  args: {
    showValue: true,
  },
}

export const Tones: Story = {
  render: (args) => (
    <div className="grid gap-4">
      <Progress {...args} showValue tone="primary" />
      <Progress {...args} label="검수 완료율" showValue tone="success" value={82} />
      <Progress {...args} label="임계치 사용량" showValue tone="warning" value={91} />
      <Progress {...args} label="실패율" showValue tone="danger" value={12} />
    </div>
  ),
}

export const Sizes: Story = {
  render: (args) => (
    <div className="grid gap-4">
      <Progress {...args} size="sm" />
      <Progress {...args} size="md" />
    </div>
  ),
}

export const Indeterminate: Story = {
  args: {
    label: '동기화 중',
    value: undefined,
    showValue: true,
  },
  play: async ({ canvas }) => {
    const progressbar = canvas.getByRole('progressbar', { name: '동기화 중' })

    await expect(progressbar).not.toHaveAttribute('aria-valuenow')
  },
}

export const ValueText: Story = {
  args: {
    label: '적재 수량',
    max: 240,
    value: 96,
    showValue: true,
    valueText: '240개 중 96개',
  },
  play: async ({ canvas }) => {
    const progressbar = canvas.getByRole('progressbar', { name: '적재 수량' })

    await expect(progressbar).toHaveAttribute('aria-valuenow', '96')
    await expect(progressbar).toHaveAttribute('aria-valuemax', '240')
    await expect(progressbar).toHaveAttribute('aria-valuetext', '240개 중 96개')
    await expect(getComputedStyle(progressbar).backgroundColor).toBe('rgb(241, 245, 249)')
  },
}
