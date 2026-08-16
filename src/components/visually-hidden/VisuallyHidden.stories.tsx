import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { Button } from '../button'
import { VisuallyHidden } from './VisuallyHidden'

const meta = {
  title: 'Components/VisuallyHidden',
  component: VisuallyHidden,
  tags: ['ai-generated'],
  parameters: {
    layout: 'padded',
  },
  args: {
    children: '스크린리더에만 읽히는 텍스트',
  },
} satisfies Meta<typeof VisuallyHidden>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const AddsContextToALink: Story = {
  render: () => (
    <div className="grid gap-2 text-sm text-content-default">
      <p>
        주문 ORD-1024{' '}
        <a className="text-primary-text underline underline-offset-4" href="#">
          자세히
          <VisuallyHidden> 보기 — 주문 ORD-1024</VisuallyHidden>
        </a>
      </p>
      <p>
        주문 ORD-1025{' '}
        <a className="text-primary-text underline underline-offset-4" href="#">
          자세히
          <VisuallyHidden> 보기 — 주문 ORD-1025</VisuallyHidden>
        </a>
      </p>
    </div>
  ),
}

export const AddsAUnit: Story = {
  render: () => (
    <p className="text-sm text-content-default">
      재고 <span className="font-semibold text-content-strong">240</span>
      <VisuallyHidden>개</VisuallyHidden>
    </p>
  ),
}

export const StaysInTheAccessibilityTree: Story = {
  render: () => (
    <Button>
      저장
      <VisuallyHidden> — 변경한 내용을 즉시 반영합니다</VisuallyHidden>
    </Button>
  ),
  play: async ({ canvas }) => {
    // Clipped, not display:none, so the words still form the button's name.
    const button = canvas.getByRole('button', {
      name: '저장 — 변경한 내용을 즉시 반영합니다',
    })
    const hidden = canvas.getByText('— 변경한 내용을 즉시 반영합니다')

    await expect(button).toBeInTheDocument()
    await expect(getComputedStyle(hidden).position).toBe('absolute')
    await expect(getComputedStyle(hidden).display).not.toBe('none')
  },
}
