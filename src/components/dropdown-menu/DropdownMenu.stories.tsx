import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './DropdownMenu'

const meta = {
  component: DropdownMenu,
  tags: ['ai-generated'],
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof DropdownMenu>

export default meta
type Story = StoryObj<typeof meta>

async function waitFrame() {
  await new Promise((resolve) => requestAnimationFrame(resolve))
}

export const Basic: Story = {
  args: {
    children: null,
  },
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger>
        Actions
        <span aria-hidden="true">v</span>
      </DropdownMenuTrigger>
      <DropdownMenuPortal>
        <DropdownMenuContent>
          <DropdownMenuLabel>Project</DropdownMenuLabel>
          <DropdownMenuItem>Archive</DropdownMenuItem>
          <DropdownMenuItem disabled>Delete</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Rename</DropdownMenuItem>
          <DropdownMenuItem>Share</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </DropdownMenu>
  ),
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole('button', { name: /actions/i })

    await expect(trigger).toHaveAttribute('aria-haspopup', 'menu')
    await userEvent.click(trigger)
    await waitFrame()
    await expect(trigger).toHaveAttribute('aria-expanded', 'true')

    const body = within(document.body)
    const menu = body.getByRole('menu')
    const archive = body.getByRole('menuitem', { name: /archive/i })
    const deleteItem = body.getByRole('menuitem', { name: /delete/i })

    await expect(menu).toHaveAttribute('aria-labelledby', trigger.id)
    await expect(archive).toHaveFocus()
    await expect(deleteItem).toHaveAttribute('aria-disabled', 'true')

    await userEvent.keyboard('{ArrowDown}')
    await expect(deleteItem).toHaveFocus()

    await userEvent.keyboard('{ArrowDown}')
    await expect(body.getByRole('menuitem', { name: /rename/i })).toHaveFocus()

    await userEvent.keyboard('s')
    await expect(body.getByRole('menuitem', { name: /share/i })).toHaveFocus()

    await userEvent.keyboard('{Escape}')
    await waitFrame()
    await expect(trigger).toHaveAttribute('aria-expanded', 'false')
    await expect(trigger).toHaveFocus()
  },
}

export const KeyboardOpenLast: Story = {
  args: {
    children: null,
  },
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger>More options</DropdownMenuTrigger>
      <DropdownMenuPortal>
        <DropdownMenuContent>
          <DropdownMenuItem>Copy</DropdownMenuItem>
          <DropdownMenuItem>Duplicate</DropdownMenuItem>
          <DropdownMenuItem>Move</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </DropdownMenu>
  ),
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole('button', { name: /more options/i })

    trigger.focus()
    await userEvent.keyboard('{ArrowUp}')
    await waitFrame()

    const body = within(document.body)
    await expect(body.getByRole('menuitem', { name: /move/i })).toHaveFocus()

    await userEvent.keyboard('{Home}')
    await expect(body.getByRole('menuitem', { name: /copy/i })).toHaveFocus()
  },
}
