import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { expect, waitFor } from 'storybook/test'
import { Switch } from './Switch'

const meta = {
  title: 'Components/Switch',
  component: Switch,
  tags: ['ai-generated'],
  args: {
    label: '자동 배차',
  },
} satisfies Meta<typeof Switch>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const WithDescription: Story = {
  args: {
    description: '주문이 들어오면 가능한 기사에게 자동으로 배정합니다.',
  },
}

export const Sizes: Story = {
  render: (args) => (
    <div className="grid gap-4">
      <Switch {...args} label="작은 스위치" size="sm" />
      <Switch {...args} label="기본 스위치" size="md" />
    </div>
  ),
}

export const States: Story = {
  render: (args) => (
    <div className="grid gap-4">
      <Switch {...args} label="꺼짐" />
      <Switch {...args} defaultChecked label="켜짐" />
      <Switch {...args} disabled label="비활성" />
      <Switch {...args} defaultChecked disabled label="비활성 + 켜짐" />
    </div>
  ),
}

export const WithoutLabel: Story = {
  args: {
    label: undefined,
    'aria-label': '자동 배차',
  },
}

function ControlledExample() {
  const [checked, setChecked] = useState(false)

  return (
    <div className="grid gap-2">
      <Switch checked={checked} label="자동 배차" onCheckedChange={setChecked} />
      <p className="text-sm text-content-muted">현재 값: {checked ? '켜짐' : '꺼짐'}</p>
    </div>
  )
}

export const Controlled: Story = {
  render: () => <ControlledExample />,
  play: async ({ canvas, userEvent }) => {
    const control = canvas.getByRole('switch', { name: '자동 배차' })

    await expect(control).toHaveAttribute('aria-checked', 'false')

    await userEvent.click(control)

    await expect(control).toHaveAttribute('aria-checked', 'true')
    await expect(canvas.getByText('현재 값: 켜짐')).toBeInTheDocument()
    // The track transitions colors, so wait for the settled value.
    await waitFor(() =>
      expect(getComputedStyle(control).backgroundColor).toBe('rgb(21, 128, 61)'),
    )
  },
}
