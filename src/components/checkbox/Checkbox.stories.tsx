import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { Checkbox } from './Checkbox'

const meta = {
  title: 'Components/Checkbox',
  component: Checkbox,
  tags: ['ai-generated'],
  args: {
    label: 'Enable notifications',
  },
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>

function IndeterminateExample() {
  const [checked, setChecked] = useState(false)
  const [indeterminate, setIndeterminate] = useState(true)

  return (
    <Checkbox
      checked={checked}
      indeterminate={indeterminate}
      label="Select all options"
      onCheckedChange={(nextChecked) => {
        setChecked(nextChecked)
        setIndeterminate(false)
      }}
    />
  )
}

export const Unchecked: Story = {
  args: {
    defaultChecked: false,
  },
  play: async ({ canvas, userEvent }) => {
    const checkbox = canvas.getByRole('checkbox', { name: /enable notifications/i })

    await expect(checkbox).not.toBeChecked()
    await expect(checkbox).toHaveAttribute('data-state', 'unchecked')

    checkbox.focus()
    await userEvent.keyboard(' ')

    await expect(checkbox).toBeChecked()
    await expect(checkbox).toHaveAttribute('aria-checked', 'true')
    await expect(checkbox).toHaveAttribute('data-state', 'checked')
  },
}

export const Checked: Story = {
  args: {
    defaultChecked: true,
    label: 'Send weekly summary',
  },
  play: async ({ canvas, userEvent }) => {
    const checkbox = canvas.getByRole('checkbox', { name: /send weekly summary/i })

    await expect(checkbox).toBeChecked()
    await expect(checkbox).toHaveAttribute('data-state', 'checked')

    await userEvent.click(checkbox)

    await expect(checkbox).not.toBeChecked()
    await expect(checkbox).toHaveAttribute('aria-checked', 'false')
    await expect(checkbox).toHaveAttribute('data-state', 'unchecked')
  },
}

export const Indeterminate: Story = {
  render: () => <IndeterminateExample />,
  play: async ({ canvas, userEvent }) => {
    const checkbox = canvas.getByRole('checkbox', { name: /select all options/i })

    await expect(checkbox).toHaveAttribute('aria-checked', 'mixed')
    await expect(checkbox).toHaveAttribute('data-state', 'indeterminate')

    await userEvent.click(checkbox)

    await expect(checkbox).toBeChecked()
    await expect(checkbox).toHaveAttribute('aria-checked', 'true')
    await expect(checkbox).toHaveAttribute('data-state', 'checked')
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
    label: 'Disabled option',
  },
  play: async ({ canvas, userEvent }) => {
    const checkbox = canvas.getByRole('checkbox', { name: /disabled option/i })

    await expect(checkbox).toBeDisabled()
    await expect(checkbox).not.toBeChecked()
    await expect(checkbox).toHaveAttribute('data-state', 'unchecked')

    await userEvent.click(checkbox)

    await expect(checkbox).not.toBeChecked()
  },
}
