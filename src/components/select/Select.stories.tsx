import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import {
  Select,
  SelectContent,
  SelectLabel,
  SelectOption,
  SelectPortal,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from './Select'

const meta = {
  title: 'Components/Select',
  component: Select,
  tags: ['ai-generated'],
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof Select>

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
    <Select defaultValue="team">
      <SelectTrigger aria-label="Assignee">
        <SelectValue placeholder="Choose assignee" />
        <span aria-hidden="true">v</span>
      </SelectTrigger>
      <SelectPortal>
        <SelectContent>
          <SelectLabel>People</SelectLabel>
          <SelectOption value="team">Team Inbox</SelectOption>
          <SelectOption disabled value="ops">
            Operations
          </SelectOption>
          <SelectSeparator />
          <SelectOption value="design">Design System</SelectOption>
          <SelectOption value="support">Support</SelectOption>
        </SelectContent>
      </SelectPortal>
    </Select>
  ),
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole('combobox', { name: /assignee/i })

    await expect(trigger).toHaveTextContent('Team Inbox')
    await expect(trigger).toHaveAttribute('aria-expanded', 'false')

    await userEvent.click(trigger)
    await waitFrame()
    await expect(trigger).toHaveAttribute('aria-expanded', 'true')

    const body = within(document.body)
    const listbox = body.getByRole('listbox')
    const team = body.getByRole('option', { name: /team inbox/i })
    const operations = body.getByRole('option', { name: /operations/i })

    await expect(listbox).toHaveAttribute('aria-labelledby', trigger.id)
    await expect(team).toHaveAttribute('aria-selected', 'true')
    await expect(trigger).toHaveFocus()
    await expect(trigger).toHaveAttribute('aria-activedescendant', team.id)
    await expect(operations).toHaveAttribute('aria-disabled', 'true')

    await userEvent.keyboard('{ArrowDown}')
    await expect(trigger).toHaveAttribute(
      'aria-activedescendant',
      body.getByRole('option', { name: /design system/i }).id,
    )

    await userEvent.keyboard('{Enter}')
    await waitFrame()

    await expect(trigger).toHaveTextContent('Design System')
    await expect(trigger).toHaveAttribute('aria-expanded', 'false')
    await expect(trigger).toHaveFocus()
  },
}

export const Typeahead: Story = {
  args: {
    children: null,
  },
  render: () => (
    <Select defaultValue="low">
      <SelectTrigger aria-label="Priority">
        <SelectValue placeholder="Choose priority" />
      </SelectTrigger>
      <SelectPortal>
        <SelectContent>
          <SelectOption value="low">Low</SelectOption>
          <SelectOption value="medium">Medium</SelectOption>
          <SelectOption value="high">High</SelectOption>
        </SelectContent>
      </SelectPortal>
    </Select>
  ),
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole('combobox', { name: /priority/i })

    await userEvent.click(trigger)
    await waitFrame()

    const body = within(document.body)
    await expect(trigger).toHaveAttribute(
      'aria-activedescendant',
      body.getByRole('option', { name: /low/i }).id,
    )

    await userEvent.keyboard('h')
    await expect(trigger).toHaveAttribute(
      'aria-activedescendant',
      body.getByRole('option', { name: /high/i }).id,
    )

    await userEvent.keyboard(' ')
    await waitFrame()

    await expect(trigger).toHaveTextContent('High')
  },
}
