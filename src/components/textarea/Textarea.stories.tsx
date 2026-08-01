import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { expect } from 'storybook/test'
import { Textarea } from './Textarea'

const meta = {
  title: 'Components/Textarea',
  component: Textarea,
  tags: ['ai-generated'],
  parameters: {
    layout: 'padded',
  },
  args: {
    label: '메모',
    placeholder: '배송 시 참고할 내용을 입력하세요',
  },
} satisfies Meta<typeof Textarea>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const WithHelperText: Story = {
  args: {
    helperText: '작업자에게 함께 전달됩니다.',
  },
}

export const ErrorState: Story = {
  args: {
    error: '메모는 10자 이상 입력하세요.',
    defaultValue: '확인',
  },
  play: async ({ canvas }) => {
    const textarea = canvas.getByLabelText('메모')

    await expect(textarea).toHaveAttribute('aria-invalid', 'true')
    await expect(textarea).toHaveAccessibleDescription('메모는 10자 이상 입력하세요.')
    await expect(getComputedStyle(textarea).borderColor).toBe('rgb(185, 28, 28)')
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
    defaultValue: '수정할 수 없는 메모입니다.',
  },
}

function CountExample() {
  const [value, setValue] = useState('오전 배송 요청')

  return (
    <Textarea
      label="메모"
      maxLength={100}
      onChange={(event) => setValue(event.currentTarget.value)}
      placeholder="배송 시 참고할 내용을 입력하세요"
      showCount
      value={value}
    />
  )
}

export const WithCount: Story = {
  render: () => <CountExample />,
  play: async ({ canvas, userEvent }) => {
    const textarea = canvas.getByLabelText('메모')

    await userEvent.type(textarea, '!')

    await expect(canvas.getByText('9/100')).toBeInTheDocument()
  },
}
