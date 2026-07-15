import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, screen, waitFor } from 'storybook/test'
import {
  TooltipContent,
  TooltipPortal,
  TooltipRoot,
  TooltipTrigger,
} from './Tooltip'

const meta = {
  component: TooltipRoot,
  tags: ['ai-generated'],
  args: {
    children: null,
  },
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof TooltipRoot>

export default meta
type Story = StoryObj<typeof meta>

export const Focus: Story = {
  render: () => (
    <TooltipRoot>
      <TooltipTrigger>Save</TooltipTrigger>
      <TooltipPortal>
        <TooltipContent>Save changes</TooltipContent>
      </TooltipPortal>
    </TooltipRoot>
  ),
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole('button', { name: /save/i })

    trigger.focus()

    const tooltip = await screen.findByRole('tooltip')
    await expect(tooltip).toHaveTextContent('Save changes')
    await expect(trigger).toHaveAttribute('aria-describedby', tooltip.id)

    await userEvent.keyboard('{Escape}')
    await expect(trigger).not.toHaveAttribute('aria-describedby')
  },
}

export const Hover: Story = {
  render: () => (
    <TooltipRoot closeGraceDuration={80} delayDuration={0}>
      <TooltipTrigger>Export</TooltipTrigger>
      <TooltipPortal>
        <TooltipContent>Download CSV</TooltipContent>
      </TooltipPortal>
    </TooltipRoot>
  ),
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole('button', { name: /export/i })

    await userEvent.hover(trigger)

    const tooltip = await screen.findByRole('tooltip')
    await expect(tooltip).toHaveTextContent('Download CSV')
    await expect(trigger).toHaveAttribute('aria-describedby', tooltip.id)

    await userEvent.unhover(trigger)
    await userEvent.hover(tooltip)

    await expect(tooltip).toBeVisible()

    await userEvent.unhover(tooltip)
    await waitFor(() => expect(screen.queryByRole('tooltip')).toBeNull())
  },
}
