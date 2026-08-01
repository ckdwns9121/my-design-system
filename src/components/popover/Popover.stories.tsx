import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, screen } from 'storybook/test'
import {
  PopoverClose,
  PopoverContent,
  PopoverPortal,
  PopoverRoot,
  PopoverTrigger,
} from './Popover'

const meta = {
  title: 'Components/Popover',
  component: PopoverRoot,
  tags: ['ai-generated'],
  args: {
    children: null,
  },
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof PopoverRoot>

export default meta
type Story = StoryObj<typeof meta>

function ControlledExample() {
  const [open, setOpen] = useState(false)

  return (
    <PopoverRoot open={open} onOpenChange={setOpen}>
      <PopoverTrigger>Review status</PopoverTrigger>
      <PopoverPortal>
        <PopoverContent>
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-content-strong">Ready for review</p>
              <p className="mt-1 text-sm leading-6 text-content-muted">
                The component API and interaction states are documented.
              </p>
            </div>
            <PopoverClose>Close</PopoverClose>
          </div>
        </PopoverContent>
      </PopoverPortal>
    </PopoverRoot>
  )
}

export const Basic: Story = {
  render: () => (
    <PopoverRoot>
      <PopoverTrigger>Open details</PopoverTrigger>
      <PopoverPortal>
        <PopoverContent>
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-content-strong">Component notes</p>
              <p className="mt-1 text-sm leading-6 text-content-muted">
                Popover content is positioned from its trigger and closes from Escape,
                outside pointer down, or an explicit close action.
              </p>
            </div>
            <div className="flex justify-end">
              <PopoverClose>Done</PopoverClose>
            </div>
          </div>
        </PopoverContent>
      </PopoverPortal>
    </PopoverRoot>
  ),
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole('button', { name: /open details/i })

    await expect(trigger).toHaveAttribute('aria-expanded', 'false')

    await userEvent.click(trigger)

    const dialog = await screen.findByRole('dialog', { name: /open details/i })
    const close = screen.getByRole('button', { name: /done/i })

    await expect(trigger).toHaveAttribute('aria-expanded', 'true')
    await expect(trigger).toHaveAttribute('aria-controls', dialog.id)
    await expect(dialog).toHaveAttribute('aria-labelledby', trigger.id)

    await userEvent.click(close)
    await expect(trigger).toHaveAttribute('aria-expanded', 'false')
    await expect(trigger).toHaveFocus()
  },
}

export const Controlled: Story = {
  render: () => <ControlledExample />,
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole('button', { name: /review status/i })

    await userEvent.click(trigger)

    await expect(await screen.findByRole('dialog', { name: /review status/i })).toBeVisible()
    await userEvent.keyboard('{Escape}')
    await expect(trigger).toHaveAttribute('aria-expanded', 'false')
  },
}
