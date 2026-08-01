import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, screen, waitFor } from 'storybook/test'
import {
  TooltipContent,
  TooltipPortal,
  Tooltip,
  TooltipTrigger,
} from './Tooltip'

const meta = {
  title: 'Components/Tooltip',
  component: Tooltip,
  tags: ['ai-generated'],
  args: {
    children: null,
  },
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Tooltip>

export default meta
type Story = StoryObj<typeof meta>

export const Focus: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger>Save</TooltipTrigger>
      <TooltipPortal>
        <TooltipContent>Save changes</TooltipContent>
      </TooltipPortal>
    </Tooltip>
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
    <Tooltip closeGraceDuration={80} delayDuration={0}>
      <TooltipTrigger>Export</TooltipTrigger>
      <TooltipPortal>
        <TooltipContent>Download CSV</TooltipContent>
      </TooltipPortal>
    </Tooltip>
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
