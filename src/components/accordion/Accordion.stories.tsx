import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { useState } from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionItem,
  AccordionTrigger,
} from './Accordion'

const meta = {
  component: Accordion,
  tags: ['ai-generated'],
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof Accordion>

export default meta
type Story = StoryObj<typeof meta>

function ComponentGuidanceAccordion({
  collapsible = true,
  disabledItem = false,
  multiple = false,
}: {
  collapsible?: boolean
  disabledItem?: boolean
  multiple?: boolean
}) {
  return (
    <Accordion
      collapsible={collapsible}
      defaultValue={multiple ? ['usage'] : 'usage'}
      type={multiple ? 'multiple' : 'single'}
    >
      <AccordionItem value="usage">
        <AccordionHeader level={2}>
          <AccordionTrigger>Usage</AccordionTrigger>
        </AccordionHeader>
        <AccordionContent>
          Use accordion sections for related details that can be scanned from their headers.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="keyboard">
        <AccordionHeader level={2}>
          <AccordionTrigger>Keyboard support</AccordionTrigger>
        </AccordionHeader>
        <AccordionContent>
          Enter and Space activate each native button. Arrow keys, Home, and End move focus
          between enabled headers.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem disabled={disabledItem} value="disabled">
        <AccordionHeader level={2}>
          <AccordionTrigger>Disabled section</AccordionTrigger>
        </AccordionHeader>
        <AccordionContent>
          Disabled accordion items keep their state but cannot be activated.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

function ControlledAccordion() {
  const [value, setValue] = useState<string | string[]>('usage')

  return (
    <div className="space-y-3">
      <p aria-live="polite" className="text-sm text-content-muted">
        Open section: {value || 'none'}
      </p>
      <Accordion collapsible onValueChange={setValue} value={value}>
        <AccordionItem value="usage">
          <AccordionHeader level={2}>
            <AccordionTrigger>Usage</AccordionTrigger>
          </AccordionHeader>
          <AccordionContent>Controlled accordions mirror parent state.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="keyboard">
          <AccordionHeader level={2}>
            <AccordionTrigger>Keyboard support</AccordionTrigger>
          </AccordionHeader>
          <AccordionContent>Focus movement stays in the headless layer.</AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}

export const Single: Story = {
  render: () => <ComponentGuidanceAccordion />,
  play: async ({ canvas, userEvent }) => {
    const usageTrigger = canvas.getByRole('button', { name: /usage/i })
    const keyboardTrigger = canvas.getByRole('button', { name: /keyboard support/i })
    const usageContent = canvas.getByRole('region', { name: /usage/i })

    await expect(usageTrigger).toHaveAttribute('aria-expanded', 'true')
    await expect(usageTrigger).toHaveAttribute('aria-controls', usageContent.id)

    await userEvent.click(keyboardTrigger)
    await expect(usageTrigger).toHaveAttribute('aria-expanded', 'false')
    await expect(keyboardTrigger).toHaveAttribute('aria-expanded', 'true')

    await userEvent.click(keyboardTrigger)
    await expect(keyboardTrigger).toHaveAttribute('aria-expanded', 'false')
  },
}

export const Multiple: Story = {
  render: () => <ComponentGuidanceAccordion multiple />,
  play: async ({ canvas, userEvent }) => {
    const usageTrigger = canvas.getByRole('button', { name: /usage/i })
    const keyboardTrigger = canvas.getByRole('button', { name: /keyboard support/i })

    await userEvent.click(keyboardTrigger)

    await expect(usageTrigger).toHaveAttribute('aria-expanded', 'true')
    await expect(keyboardTrigger).toHaveAttribute('aria-expanded', 'true')
  },
}

export const NonCollapsible: Story = {
  render: () => <ComponentGuidanceAccordion collapsible={false} />,
  play: async ({ canvas, userEvent }) => {
    const usageTrigger = canvas.getByRole('button', { name: /usage/i })

    await expect(usageTrigger).toHaveAttribute('aria-expanded', 'true')
    await expect(usageTrigger).toHaveAttribute('aria-disabled', 'true')

    await userEvent.click(usageTrigger)
    await expect(usageTrigger).toHaveAttribute('aria-expanded', 'true')
  },
}

export const DisabledItem: Story = {
  render: () => <ComponentGuidanceAccordion disabledItem />,
  play: async ({ canvas, userEvent }) => {
    const disabledTrigger = canvas.getByRole('button', { name: /disabled section/i })
    const keyboardTrigger = canvas.getByRole('button', { name: /keyboard support/i })

    await expect(disabledTrigger).toBeDisabled()

    keyboardTrigger.focus()
    await userEvent.keyboard('{ArrowDown}')
    await expect(disabledTrigger).toHaveAttribute('aria-expanded', 'false')
    await expect(disabledTrigger).not.toHaveFocus()
  },
}

export const KeyboardNavigation: Story = {
  render: () => <ComponentGuidanceAccordion disabledItem />,
  play: async ({ canvas, userEvent }) => {
    const usageTrigger = canvas.getByRole('button', { name: /usage/i })
    const keyboardTrigger = canvas.getByRole('button', { name: /keyboard support/i })
    const disabledTrigger = canvas.getByRole('button', { name: /disabled section/i })

    usageTrigger.focus()
    await userEvent.keyboard('{ArrowDown}')
    await expect(keyboardTrigger).toHaveFocus()

    await userEvent.keyboard('{ArrowDown}')
    await expect(usageTrigger).toHaveFocus()

    await userEvent.keyboard('{End}')
    await expect(keyboardTrigger).toHaveFocus()
    await expect(disabledTrigger).not.toHaveFocus()
  },
}

export const Controlled: Story = {
  render: () => <ControlledAccordion />,
  play: async ({ canvas, userEvent }) => {
    const status = canvas.getByText(/open section:/i)
    const usageTrigger = canvas.getByRole('button', { name: /usage/i })
    const keyboardTrigger = canvas.getByRole('button', { name: /keyboard support/i })

    await expect(status).toHaveTextContent('usage')
    await userEvent.click(keyboardTrigger)
    await expect(status).toHaveTextContent('keyboard')
    await expect(usageTrigger).toHaveAttribute('aria-expanded', 'false')
    await expect(keyboardTrigger).toHaveAttribute('aria-expanded', 'true')
  },
}
