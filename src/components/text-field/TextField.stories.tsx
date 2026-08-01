import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { TextField } from './TextField'

const meta = {
  title: 'Components/TextField',
  component: TextField,
  tags: ['ai-generated'],
  args: {
    label: 'Email',
    placeholder: 'you@example.com',
  },
} satisfies Meta<typeof TextField>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithHelperText: Story = {
  args: {
    helperText: '제품 업데이트와 보안 알림을 받을 주소입니다.',
  },
}

export const ErrorState: Story = {
  args: {
    error: '올바른 이메일 주소를 입력해 주세요.',
  },
  play: async ({ canvas }) => {
    const input = canvas.getByLabelText(/email/i)
    await expect(input).toHaveAttribute('aria-invalid', 'true')
  },
}
