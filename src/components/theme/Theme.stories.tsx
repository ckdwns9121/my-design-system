import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ReactNode } from 'react'
import { expect, waitFor } from 'storybook/test'
import { useTheme } from '../../headless'
import { Alert } from '../alert'
import { Badge } from '../badge'
import { Button } from '../button'
import { Card, CardContent, CardHeader, CardTitle } from '../card'
import { Stack } from '../stack'
import { Text } from '../text'
import { TextField } from '../text-field'
import { ThemeProvider, ThemeToggle } from './Theme'

const meta = {
  title: 'Components/Theme',
  component: ThemeProvider,
  tags: ['ai-generated'],
  parameters: {
    layout: 'padded',
  },
  args: {
    children: null,
  },
} satisfies Meta<typeof ThemeProvider>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Stories scope the theme to a wrapper instead of the document element so one
 * story cannot repaint the whole Storybook page.
 */
function Scope({ children }: { children: ReactNode }) {
  const { resolvedTheme } = useTheme()

  return (
    <div
      className="rounded-md bg-surface-canvas p-6"
      data-testid="scope"
      data-theme={resolvedTheme}
    >
      {children}
    </div>
  )
}

function Preview() {
  const { preference, resolvedTheme } = useTheme()

  return (
    <Scope>
      <Stack gap={4}>
        <Stack align="center" direction="row" justify="between">
          <Text tone="strong" weight="semibold">
            현재 {resolvedTheme} (설정: {preference})
          </Text>
          <ThemeToggle />
        </Stack>

        <Card>
          <CardHeader>
            <CardTitle>주문 요약</CardTitle>
          </CardHeader>
          <CardContent>
            <Stack gap={3}>
              <Text tone="muted">지난 7일 동안 처리한 주문입니다.</Text>
              <Stack direction="row" gap={2}>
                <Badge tone="success">완료 18</Badge>
                <Badge tone="warning">검수 3</Badge>
                <Badge tone="danger">실패 1</Badge>
              </Stack>
              <TextField label="주문 번호" placeholder="ORD-0000" />
              <Stack direction="row" gap={2}>
                <Button size="sm">확정</Button>
                <Button size="sm" variant="secondary">
                  취소
                </Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        <Alert title="재고 동기화가 완료되었습니다" tone="success">
          마지막 동기화는 5분 전에 실행되었습니다.
        </Alert>
      </Stack>
    </Scope>
  )
}

export const Playground: Story = {
  render: () => (
    <ThemeProvider storageKey={null}>
      <Preview />
    </ThemeProvider>
  ),
}

export const Dark: Story = {
  render: () => (
    <ThemeProvider defaultPreference="dark" storageKey={null}>
      <Preview />
    </ThemeProvider>
  ),
}

export const Toggle: Story = {
  render: () => (
    <ThemeProvider defaultPreference="light" storageKey={null}>
      <Preview />
    </ThemeProvider>
  ),
  play: async ({ canvas, userEvent }) => {
    const scope = canvas.getByTestId('scope')

    await expect(scope).toHaveAttribute('data-theme', 'light')
    await waitFor(() =>
      expect(getComputedStyle(scope).backgroundColor).toBe('rgb(248, 250, 252)'),
    )

    await userEvent.click(canvas.getByRole('button', { name: '어두운 테마로 전환' }))

    await expect(scope).toHaveAttribute('data-theme', 'dark')
    // The same semantic token now resolves to the dark value.
    await waitFor(() => expect(getComputedStyle(scope).backgroundColor).toBe('rgb(2, 6, 23)'))
  },
}

export const SameTokensBothThemes: Story = {
  render: () => (
    <div className="grid gap-4 sm:grid-cols-2">
      <ThemeProvider defaultPreference="light" storageKey={null}>
        <Preview />
      </ThemeProvider>
      <ThemeProvider defaultPreference="dark" storageKey={null}>
        <Preview />
      </ThemeProvider>
    </div>
  ),
}
