import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { Badge } from '../badge'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from './Table'

const meta = {
  component: Table,
  tags: ['ai-generated'],
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof Table>

export default meta
type Story = StoryObj<typeof meta>

const rows = [
  { component: 'Button', layer: 'Styled', status: 'Ready', owner: 'Components' },
  { component: 'Toggle', layer: 'Headless + Styled', status: 'Ready', owner: 'Components' },
  { component: 'Checkbox', layer: 'Headless + Styled', status: 'Next', owner: 'Components' },
]

export const Basic: Story = {
  render: () => (
    <Table>
      <TableCaption>현재 컴포넌트 진행 상태입니다.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Component</TableHead>
          <TableHead>Layer</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Owner</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.component}>
            <TableCell className="font-medium text-content-strong">{row.component}</TableCell>
            <TableCell>{row.layer}</TableCell>
            <TableCell>
              <Badge tone={row.status === 'Ready' ? 'success' : 'warning'}>{row.status}</Badge>
            </TableCell>
            <TableCell>{row.owner}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
  play: async ({ canvas }) => {
    const table = canvas.getByRole('table', { name: /현재 컴포넌트 진행 상태/i })

    await expect(table).toBeVisible()
    await expect(canvas.getByRole('columnheader', { name: /component/i })).toBeVisible()
    await expect(canvas.getByRole('cell', { name: /toggle/i })).toBeVisible()
  },
}

export const WithFooter: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Token</TableHead>
          <TableHead>Usage</TableHead>
          <TableHead className="text-right">Count</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="font-medium text-content-strong">Color</TableCell>
          <TableCell>primitive / semantic</TableCell>
          <TableCell className="text-right">2</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium text-content-strong">Typography</TableCell>
          <TableCell>type scale</TableCell>
          <TableCell className="text-right">6</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium text-content-strong">Spacing</TableCell>
          <TableCell>4px scale</TableCell>
          <TableCell className="text-right">11</TableCell>
        </TableRow>
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={2}>Foundation groups</TableCell>
          <TableCell className="text-right">3</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  ),
}
