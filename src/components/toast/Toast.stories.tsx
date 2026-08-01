import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, screen, waitFor } from 'storybook/test'
import { Button } from '../button'
import { ToastProvider, ToastViewport } from './Toast'
import type { ToastOptions } from './toast-shared'
import { useToast } from './useToast'

const meta = {
  title: 'Components/Toast',
  component: ToastProvider,
  tags: ['ai-generated'],
  parameters: {
    layout: 'padded',
  },
  args: {
    children: null,
  },
} satisfies Meta<typeof ToastProvider>

export default meta
type Story = StoryObj<typeof meta>

function Trigger({ children, ...options }: ToastOptions & { children: string }) {
  const { toast } = useToast()

  return (
    <Button onClick={() => toast(options)} size="sm" variant="secondary">
      {children}
    </Button>
  )
}

function DismissAllTrigger() {
  const { dismissAll } = useToast()

  return (
    <Button onClick={dismissAll} size="sm" variant="subtle">
      모두 닫기
    </Button>
  )
}

function Demo({ duration }: { duration?: number }) {
  return (
    <ToastProvider duration={duration}>
      <div className="flex flex-wrap gap-2">
        <Trigger description="변경한 내용이 반영되었습니다." title="저장했습니다" tone="success">
          성공
        </Trigger>
        <Trigger description="검수 대기 항목이 3건 있습니다." title="확인이 필요합니다" tone="warning">
          경고
        </Trigger>
        <Trigger description="네트워크 상태를 확인하세요." title="저장하지 못했습니다" tone="danger">
          오류
        </Trigger>
        <Trigger description="잠시 후 결과를 알려드립니다." title="동기화를 시작했습니다">
          정보
        </Trigger>
        <DismissAllTrigger />
      </div>
      <ToastViewport />
    </ToastProvider>
  )
}

export const Playground: Story = {
  render: () => <Demo />,
}

export const Tones: Story = {
  render: () => <Demo />,
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: '성공' }))

    const toast = await screen.findByRole('status')

    await expect(toast).toHaveTextContent('저장했습니다')
    await expect(toast).toHaveAttribute('aria-atomic', 'true')
  },
}

export const AssertiveTone: Story = {
  render: () => <Demo />,
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: '오류' }))

    // Danger implies an assertive live region, so the toast lands as an alert.
    const toast = await screen.findByRole('alert')

    await expect(toast).toHaveTextContent('저장하지 못했습니다')
    await expect(getComputedStyle(toast).backgroundColor).toBe('rgb(255, 255, 255)')
  },
}

export const Dismiss: Story = {
  render: () => <Demo />,
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: '정보' }))

    const toast = await screen.findByRole('status')

    await userEvent.click(screen.getByRole('button', { name: '동기화를 시작했습니다 알림 닫기' }))

    await waitFor(() => expect(toast).not.toBeInTheDocument())
  },
}

export const AutoDismiss: Story = {
  render: () => <Demo duration={1200} />,
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: '성공' }))

    const toast = await screen.findByRole('status')

    await waitFor(() => expect(toast).not.toBeInTheDocument(), { timeout: 4000 })
  },
}

export const Stacking: Story = {
  render: () => <Demo />,
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: '성공' }))
    await userEvent.click(canvas.getByRole('button', { name: '경고' }))
    await userEvent.click(canvas.getByRole('button', { name: '정보' }))

    await waitFor(async () => expect(await screen.findAllByRole('status')).toHaveLength(2))

    await userEvent.click(canvas.getByRole('button', { name: '모두 닫기' }))

    await waitFor(() => expect(screen.queryByRole('status')).not.toBeInTheDocument())
  },
}
