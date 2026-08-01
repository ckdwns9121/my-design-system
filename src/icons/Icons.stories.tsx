import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import * as icons from './icons'
import { CheckCircleIcon, SearchIcon, SpinnerIcon } from './icons'

const entries = Object.entries(icons)

function Gallery() {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-6">
      {entries.map(([name, Icon]) => (
        <div
          className="grid justify-items-center gap-2 rounded-md border border-border-muted bg-surface-panel p-4"
          key={name}
        >
          <Icon size={24} />
          <p className="truncate text-xs text-content-muted" title={name}>
            {name.replace(/Icon$/, '')}
          </p>
        </div>
      ))}
    </div>
  )
}

const meta = {
  title: 'Foundation/Icons',
  component: Gallery,
  tags: ['ai-generated'],
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof Gallery>

export default meta
type Story = StoryObj<typeof meta>

export const All: Story = {}

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4 text-content-strong">
      <SearchIcon size={16} />
      <SearchIcon size={20} />
      <SearchIcon size={24} />
      <SearchIcon size={32} />
    </div>
  ),
}

export const InheritsTextColor: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <span className="inline-flex items-center gap-1.5 text-sm text-content-muted">
        <SearchIcon size={16} />
        검색
      </span>
      <span className="inline-flex items-center gap-1.5 text-sm text-status-success-text">
        <CheckCircleIcon size={16} />
        완료
      </span>
      <span className="inline-flex items-center gap-1.5 text-sm text-status-danger-text">
        <icons.ErrorIcon size={16} />
        실패
      </span>
    </div>
  ),
}

export const Spinning: Story = {
  render: () => <SpinnerIcon className="animate-spin text-primary-solid" size={24} />,
}

export const Labelled: Story = {
  render: () => (
    <div className="flex items-center gap-4 text-content-strong">
      <SearchIcon title="검색" />
      <CheckCircleIcon />
    </div>
  ),
  play: async ({ canvas }) => {
    const labelled = canvas.getByRole('img', { name: '검색' })

    await expect(labelled).toBeInTheDocument()
    // The unlabelled icon stays decorative, so it is the only img in the tree.
    await expect(canvas.getAllByRole('img')).toHaveLength(1)
    await expect(getComputedStyle(labelled).width).toBe('20px')
  },
}
