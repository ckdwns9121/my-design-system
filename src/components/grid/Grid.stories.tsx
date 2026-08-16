import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { Card, CardContent, CardHeader, CardTitle } from '../card'
import { Grid } from './Grid'

const meta = {
  title: 'Components/Grid',
  component: Grid,
  tags: ['ai-generated'],
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof Grid>

export default meta
type Story = StoryObj<typeof meta>

function Cell({ children }: { children: string }) {
  return (
    <div className="rounded-md border border-border-muted bg-surface-panel px-3 py-6 text-center text-sm text-content-default">
      {children}
    </div>
  )
}

const cells = (count: number) =>
  Array.from({ length: count }, (_, index) => <Cell key={index}>{String(index + 1)}</Cell>)

export const Playground: Story = {
  args: {
    children: cells(4),
  },
}

export const Columns: Story = {
  render: () => (
    <div className="grid gap-6">
      {([2, 3, 4] as const).map((columns) => (
        <Grid columns={columns} key={columns}>
          {cells(columns * 2)}
        </Grid>
      ))}
    </div>
  ),
}

export const WithCards: Story = {
  args: {
    columns: 3,
    gap: 4,
    children: ['주문', '재고', '정산'].map((title) => (
      <Card key={title}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-content-muted">지난 7일</p>
        </CardContent>
      </Card>
    )),
  },
}

export const CollapsesOnNarrowScreens: Story = {
  args: {
    columns: 4,
    children: cells(4),
  },
  render: (args) => <Grid {...args} aria-label="샘플 그리드" role="group" />,
  play: async ({ canvas }) => {
    const grid = canvas.getByRole('group', { name: '샘플 그리드' })

    // Column counts start at sm; below it the layout is a single column.
    await expect(getComputedStyle(grid).display).toBe('grid')
    await expect(getComputedStyle(grid).gap).toBe('16px')
  },
}
