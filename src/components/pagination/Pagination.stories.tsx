import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { expect } from 'storybook/test'
import { Pagination } from './Pagination'

const meta = {
  title: 'Components/Pagination',
  component: Pagination,
  tags: ['ai-generated'],
  parameters: {
    layout: 'padded',
  },
  args: {
    page: 1,
    pageCount: 10,
    onPageChange: () => {},
  },
} satisfies Meta<typeof Pagination>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const MiddlePage: Story = {
  args: {
    page: 10,
    pageCount: 20,
  },
}

export const LastPage: Story = {
  args: {
    page: 20,
    pageCount: 20,
  },
}

export const FewPages: Story = {
  args: {
    page: 2,
    pageCount: 3,
  },
}

export const WiderWindow: Story = {
  args: {
    page: 10,
    pageCount: 20,
    siblingCount: 2,
  },
}

function ControlledExample() {
  const [page, setPage] = useState(1)

  return (
    <div className="grid gap-3">
      <Pagination onPageChange={setPage} page={page} pageCount={20} />
      <p className="text-sm text-content-muted">현재 페이지: {page}</p>
    </div>
  )
}

export const Controlled: Story = {
  render: () => <ControlledExample />,
  play: async ({ canvas, userEvent }) => {
    const first = canvas.getByRole('button', { name: '1페이지' })

    await expect(first).toHaveAttribute('aria-current', 'page')
    await expect(canvas.getByRole('button', { name: '이전 페이지' })).toBeDisabled()
    await expect(getComputedStyle(first).backgroundColor).toBe('rgb(21, 128, 61)')

    await userEvent.click(canvas.getByRole('button', { name: '다음 페이지' }))

    await expect(canvas.getByText('현재 페이지: 2')).toBeInTheDocument()
    await expect(canvas.getByRole('button', { name: '2페이지' })).toHaveAttribute(
      'aria-current',
      'page',
    )
  },
}
