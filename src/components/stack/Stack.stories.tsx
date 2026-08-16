import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { Badge } from '../badge'
import { Button } from '../button'
import { Stack } from './Stack'

const meta = {
  title: 'Components/Stack',
  component: Stack,
  tags: ['ai-generated'],
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof Stack>

export default meta
type Story = StoryObj<typeof meta>

function Box({ children }: { children: string }) {
  return (
    <div className="rounded-md border border-border-muted bg-surface-panel px-3 py-2 text-sm text-content-default">
      {children}
    </div>
  )
}

export const Playground: Story = {
  args: {
    children: (
      <>
        <Box>첫째</Box>
        <Box>둘째</Box>
        <Box>셋째</Box>
      </>
    ),
  },
}

export const Row: Story = {
  args: {
    direction: 'row',
    gap: 2,
    align: 'center',
    children: (
      <>
        <Badge tone="success">완료</Badge>
        <Badge tone="warning">검수</Badge>
        <Badge tone="danger">실패</Badge>
      </>
    ),
  },
}

export const Gaps: Story = {
  render: () => (
    <Stack gap={6}>
      {([1, 2, 4, 8] as const).map((gap) => (
        <Stack direction="row" gap={gap} key={gap}>
          <Box>{`gap=${gap}`}</Box>
          <Box>·</Box>
          <Box>·</Box>
        </Stack>
      ))}
    </Stack>
  ),
}

export const SpaceBetween: Story = {
  args: {
    direction: 'row',
    justify: 'between',
    align: 'center',
    children: (
      <>
        <Box>주문 24건</Box>
        <Button size="sm">전체 확정</Button>
      </>
    ),
  },
}

export const AsList: Story = {
  args: {
    as: 'ul',
    gap: 2,
    children: (
      <>
        <li className="text-sm text-content-default">서울 A동</li>
        <li className="text-sm text-content-default">부산 물류센터</li>
      </>
    ),
  },
  play: async ({ canvas }) => {
    // The grouping is a list, so it should reach the tree as one.
    const list = canvas.getByRole('list')

    await expect(canvas.getAllByRole('listitem')).toHaveLength(2)
    await expect(getComputedStyle(list).display).toBe('flex')
    await expect(getComputedStyle(list).rowGap).toBe('8px')
  },
}
