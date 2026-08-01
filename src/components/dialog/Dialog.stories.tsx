import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, waitFor, within } from 'storybook/test'
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from './Dialog'

const meta = {
  title: 'Components/Dialog',
  component: DialogRoot,
  tags: ['ai-generated'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof DialogRoot>

export default meta
type Story = StoryObj<typeof meta>

export const Basic: Story = {
  args: {
    children: null,
  },
  render: () => (
    <DialogRoot>
      <DialogTrigger>Open dialog</DialogTrigger>
      <DialogPortal>
        <DialogOverlay />
        <DialogContent>
          <div className="space-y-2">
            <DialogTitle>Invite collaborator</DialogTitle>
            <DialogDescription>
              Send an invitation to someone who should have access to this workspace.
            </DialogDescription>
          </div>
          <label className="grid gap-1 text-sm font-medium text-content-strong">
            Email
            <input
              className="h-10 rounded-md border border-border-default bg-surface-panel px-3 text-sm text-content-strong outline-none focus:ring-2 focus:ring-focus-default"
              data-autofocus=""
              placeholder="name@example.com"
              type="email"
            />
          </label>
          <div className="flex justify-end gap-2">
            <DialogClose>Cancel</DialogClose>
            <DialogClose variant="primary">
              Send invite
            </DialogClose>
          </div>
        </DialogContent>
      </DialogPortal>
    </DialogRoot>
  ),
  play: async ({ canvas, canvasElement, userEvent }) => {
    const trigger = canvas.getByRole('button', { name: /open dialog/i })
    const page = within(canvasElement.ownerDocument.body)

    await expect(trigger).toHaveAttribute('aria-expanded', 'false')

    await userEvent.click(trigger)

    const dialog = await page.findByRole('dialog', { name: /invite collaborator/i })
    const email = page.getByLabelText(/email/i)
    const cancel = page.getByRole('button', { name: /cancel/i })

    await expect(trigger).toHaveAttribute('aria-expanded', 'true')
    await expect(trigger).toHaveAttribute('aria-controls', dialog.id)
    await expect(dialog).toHaveAttribute('aria-modal', 'true')
    await expect(dialog).toHaveAttribute('aria-describedby')
    await waitFor(() => expect(email).toHaveFocus())

    await userEvent.tab({ shift: true })
    await expect(page.getByRole('button', { name: /send invite/i })).toHaveFocus()

    await userEvent.click(cancel)
    await expect(trigger).toHaveFocus()
    await expect(trigger).toHaveAttribute('aria-expanded', 'false')
  },
}

export const LabelFallback: Story = {
  args: {
    children: null,
  },
  render: () => (
    <DialogRoot>
      <DialogTrigger>Open preferences</DialogTrigger>
      <DialogPortal>
        <DialogOverlay />
        <DialogContent aria-label="Preferences">
          <DialogDescription>Choose how this product notifies you.</DialogDescription>
          <div className="flex items-center justify-between gap-4 rounded-md border border-border-muted p-3">
            <span className="text-sm text-content-default">Email updates</span>
            <input aria-label="Email updates" type="checkbox" />
          </div>
          <div className="flex justify-end">
            <DialogClose>Done</DialogClose>
          </div>
        </DialogContent>
      </DialogPortal>
    </DialogRoot>
  ),
  play: async ({ canvas, canvasElement, userEvent }) => {
    const trigger = canvas.getByRole('button', { name: /open preferences/i })
    const page = within(canvasElement.ownerDocument.body)

    await userEvent.click(trigger)

    const dialog = await page.findByRole('dialog', { name: /preferences/i })

    await expect(dialog).toHaveAttribute('aria-label', 'Preferences')
    await expect(dialog).not.toHaveAttribute('aria-labelledby')

    await userEvent.keyboard('{Escape}')
    await expect(trigger).toHaveAttribute('aria-expanded', 'false')
  },
}
