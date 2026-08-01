import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, waitFor } from 'storybook/test'
import { RadioGroup, RadioGroupItem } from './RadioGroup'

const meta = {
  title: 'Components/RadioGroup',
  component: RadioGroup,
  tags: ['ai-generated'],
  parameters: {
    layout: 'padded',
  },
  args: {
    label: '배송 방식',
    defaultValue: 'standard',
    children: (
      <>
        <RadioGroupItem label="일반 배송" value="standard" />
        <RadioGroupItem label="특급 배송" value="express" />
        <RadioGroupItem label="방문 수령" value="pickup" />
      </>
    ),
  },
} satisfies Meta<typeof RadioGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const WithDescriptions: Story = {
  args: {
    description: '주문 확정 후에는 변경할 수 없습니다.',
    children: (
      <>
        <RadioGroupItem description="2~3일 소요" label="일반 배송" value="standard" />
        <RadioGroupItem description="다음 날 도착" label="특급 배송" value="express" />
        <RadioGroupItem description="창고에서 직접 수령" label="방문 수령" value="pickup" />
      </>
    ),
  },
}

export const Horizontal: Story = {
  args: {
    orientation: 'horizontal',
  },
}

export const DisabledItem: Story = {
  args: {
    children: (
      <>
        <RadioGroupItem label="일반 배송" value="standard" />
        <RadioGroupItem disabled label="특급 배송 (마감)" value="express" />
        <RadioGroupItem label="방문 수령" value="pickup" />
      </>
    ),
  },
}

export const NoSelection: Story = {
  args: {
    defaultValue: undefined,
  },
}

export const KeyboardNavigation: Story = {
  play: async ({ canvas, userEvent }) => {
    const standard = canvas.getByRole('radio', { name: '일반 배송' })
    const express = canvas.getByRole('radio', { name: '특급 배송' })

    await expect(standard).toHaveAttribute('aria-checked', 'true')
    await expect(express).toHaveAttribute('tabindex', '-1')

    standard.focus()
    await userEvent.keyboard('{ArrowDown}')

    await expect(express).toHaveFocus()
    await expect(express).toHaveAttribute('aria-checked', 'true')
    // The control transitions colors, so wait for the settled value.
    await waitFor(() =>
      expect(getComputedStyle(express).backgroundColor).toBe('rgb(21, 128, 61)'),
    )
  },
}
