import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from './Breadcrumb'

const meta = {
  title: 'Components/Breadcrumb',
  component: Breadcrumb,
  tags: ['ai-generated'],
  parameters: {
    layout: 'padded',
  },
  args: {
    children: (
      <>
        <BreadcrumbItem>
          <BreadcrumbLink href="#">홈</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="#">주문</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>주문 상세</BreadcrumbPage>
        </BreadcrumbItem>
      </>
    ),
  },
} satisfies Meta<typeof Breadcrumb>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const CustomSeparator: Story = {
  args: {
    children: (
      <>
        <BreadcrumbItem>
          <BreadcrumbLink href="#">창고</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>›</BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbPage>A동 3층</BreadcrumbPage>
        </BreadcrumbItem>
      </>
    ),
  },
}

export const CurrentPage: Story = {
  play: async ({ canvas }) => {
    const nav = canvas.getByRole('navigation', { name: 'Breadcrumb' })
    const current = canvas.getByText('주문 상세')

    await expect(nav).toBeInTheDocument()
    await expect(current).toHaveAttribute('aria-current', 'page')
    await expect(getComputedStyle(current).fontWeight).toBe('500')
  },
}
