import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import {
  CloseIcon,
  CopyIcon,
  EditIcon,
  MoreVerticalIcon,
  RefreshIcon,
  SearchIcon,
  TrashIcon,
} from '../../icons'
import { IconButton } from './IconButton'

const meta = {
  title: 'Components/IconButton',
  component: IconButton,
  tags: ['ai-generated'],
  args: {
    label: '검색',
    icon: <SearchIcon />,
  },
} satisfies Meta<typeof IconButton>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Variants: Story = {
  render: (args) => (
    <div className="flex items-center gap-3">
      <IconButton {...args} label="추가" variant="primary" />
      <IconButton {...args} label="검색" variant="secondary" />
      <IconButton {...args} icon={<MoreVerticalIcon />} label="더보기" variant="subtle" />
      <IconButton {...args} icon={<TrashIcon />} label="삭제" variant="danger" />
    </div>
  ),
}

export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-3">
      <IconButton {...args} size="sm" />
      <IconButton {...args} size="md" />
      <IconButton {...args} size="lg" />
    </div>
  ),
}

export const States: Story = {
  render: (args) => (
    <div className="flex items-center gap-3">
      <IconButton {...args} icon={<RefreshIcon />} label="새로고침" />
      <IconButton {...args} icon={<RefreshIcon />} isLoading label="새로고침" />
      <IconButton {...args} disabled icon={<RefreshIcon />} label="새로고침" />
    </div>
  ),
}

export const Rounded: Story = {
  args: {
    icon: <CloseIcon />,
    label: '닫기',
    rounded: true,
    variant: 'subtle',
  },
}

export const InToolbar: Story = {
  render: (args) => (
    <div className="inline-flex items-center gap-1 rounded-md border border-border-default bg-surface-panel p-1">
      <IconButton {...args} icon={<EditIcon />} label="수정" size="sm" variant="subtle" />
      <IconButton {...args} icon={<CopyIcon />} label="복제" size="sm" variant="subtle" />
      <IconButton {...args} icon={<TrashIcon />} label="삭제" size="sm" variant="subtle" />
    </div>
  ),
}

export const AccessibleName: Story = {
  args: {
    icon: <TrashIcon />,
    label: '주문 삭제',
    variant: 'danger',
  },
  play: async ({ canvas }) => {
    const button = canvas.getByRole('button', { name: '주문 삭제' })

    // The icon itself must stay decorative so the name is not read twice.
    await expect(canvas.queryByRole('img')).not.toBeInTheDocument()
    await expect(getComputedStyle(button).backgroundColor).toBe('rgb(185, 28, 28)')
    await expect(getComputedStyle(button).width).toBe('40px')
  },
}

export const LoadingIsDisabled: Story = {
  args: {
    icon: <RefreshIcon />,
    label: '새로고침',
    isLoading: true,
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: '새로고침' })).toBeDisabled()
  },
}
