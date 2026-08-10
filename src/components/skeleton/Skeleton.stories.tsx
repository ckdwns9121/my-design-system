import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { Card, CardContent, CardHeader } from '../card'
import { Skeleton, SkeletonText } from './Skeleton'

const meta = {
  title: 'Components/Skeleton',
  component: Skeleton,
  tags: ['ai-generated'],
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof Skeleton>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Shapes: Story = {
  render: () => (
    <div className="grid gap-4">
      <Skeleton shape="line" />
      <Skeleton shape="block" />
      <Skeleton shape="circle" />
    </div>
  ),
}

export const Text: Story = {
  render: () => <SkeletonText lines={4} />,
}

export const InCard: Story = {
  render: () => (
    <Card aria-busy="true">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Skeleton shape="circle" />
          <Skeleton className="w-40" />
        </div>
      </CardHeader>
      <CardContent>
        <SkeletonText lines={3} />
      </CardContent>
    </Card>
  ),
}

export const HiddenFromAssistiveTech: Story = {
  render: () => (
    <div aria-busy="true" data-testid="region">
      <SkeletonText lines={2} />
    </div>
  ),
  play: async ({ canvas }) => {
    const region = canvas.getByTestId('region')
    const placeholders = [...region.querySelectorAll('.animate-pulse')]

    // Every placeholder is decorative; the region carries the loading state.
    await expect(placeholders).toHaveLength(2)
    await expect(placeholders.every((node) => node.getAttribute('aria-hidden') === 'true')).toBe(
      true,
    )
    await expect(region).toHaveAttribute('aria-busy', 'true')
    await expect(getComputedStyle(placeholders[0]).backgroundColor).toBe('rgb(241, 245, 249)')
  },
}
