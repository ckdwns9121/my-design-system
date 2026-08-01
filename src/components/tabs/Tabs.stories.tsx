import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './Tabs'

const meta = {
  title: 'Components/Tabs',
  component: Tabs,
  tags: ['ai-generated'],
  args: {
    defaultValue: 'overview',
  },
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof Tabs>

export default meta
type Story = StoryObj<typeof meta>

export const Basic: Story = {
  render: () => (
    <Tabs defaultValue="overview">
      <TabsList aria-label="Component documentation">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="usage">Usage</TabsTrigger>
        <TabsTrigger value="api">API</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        Tabs organize related component guidance into one visible panel at a time.
      </TabsContent>
      <TabsContent value="usage">
        Use tabs when each panel is peer-level content and users need quick switching.
      </TabsContent>
      <TabsContent value="api">
        Root controls value, List groups triggers, and Content renders each panel.
      </TabsContent>
    </Tabs>
  ),
  play: async ({ canvas, userEvent }) => {
    const overview = canvas.getByRole('tab', { name: /overview/i })
    const usage = canvas.getByRole('tab', { name: /usage/i })
    const overviewPanel = canvas.getByRole('tabpanel', {
      name: /overview/i,
    })

    await expect(overview).toHaveAttribute('aria-selected', 'true')
    await expect(overview).toHaveAttribute('aria-controls', overviewPanel.id)
    await expect(overviewPanel).toHaveAttribute('aria-labelledby', overview.id)

    overview.focus()
    await userEvent.keyboard('{ArrowRight}')
    await expect(usage).toHaveFocus()
    await expect(usage).toHaveAttribute('aria-selected', 'true')
    await expect(canvas.getByRole('tabpanel', { name: /usage/i })).toBeVisible()
  },
}

export const ManualActivation: Story = {
  render: () => (
    <Tabs activationMode="manual" defaultValue="overview">
      <TabsList aria-label="Manual component documentation">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger disabled value="disabled">
          Disabled
        </TabsTrigger>
        <TabsTrigger value="usage">Usage</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">Overview remains active until a tab is chosen.</TabsContent>
      <TabsContent value="disabled">Disabled content is unavailable.</TabsContent>
      <TabsContent value="usage">Usage content is active after Enter or Space.</TabsContent>
    </Tabs>
  ),
  play: async ({ canvas, userEvent }) => {
    const overview = canvas.getByRole('tab', { name: /overview/i })
    const disabled = canvas.getByRole('tab', { name: /disabled/i })
    const usage = canvas.getByRole('tab', { name: /usage/i })

    await expect(disabled).toBeDisabled()

    overview.focus()
    await userEvent.keyboard('{ArrowRight}')
    await expect(usage).toHaveFocus()
    await expect(overview).toHaveAttribute('aria-selected', 'true')
    await expect(usage).toHaveAttribute('aria-selected', 'false')

    await userEvent.keyboard('{Enter}')
    await expect(usage).toHaveAttribute('aria-selected', 'true')
    await expect(canvas.getByRole('tabpanel', { name: /usage/i })).toBeVisible()
  },
}

export const Vertical: Story = {
  render: () => (
    <Tabs className="flex items-start gap-4" defaultValue="props" orientation="vertical">
      <TabsList aria-label="Vertical component sections">
        <TabsTrigger value="props">Props</TabsTrigger>
        <TabsTrigger value="state">State</TabsTrigger>
        <TabsTrigger value="keyboard">Keyboard</TabsTrigger>
      </TabsList>
      <TabsContent className="mt-0" value="props">
        Props define controlled or uncontrolled tab state.
      </TabsContent>
      <TabsContent className="mt-0" value="state">
        State is reflected through aria-selected and data-state.
      </TabsContent>
      <TabsContent className="mt-0" value="keyboard">
        Vertical tabs use Up and Down arrows, plus Home and End.
      </TabsContent>
    </Tabs>
  ),
  play: async ({ canvas, userEvent }) => {
    const tablist = canvas.getByRole('tablist', { name: /vertical component sections/i })
    const props = canvas.getByRole('tab', { name: /props/i })
    const keyboard = canvas.getByRole('tab', { name: /keyboard/i })

    await expect(tablist).toHaveAttribute('aria-orientation', 'vertical')

    props.focus()
    await userEvent.keyboard('{End}')
    await expect(keyboard).toHaveFocus()
    await expect(keyboard).toHaveAttribute('aria-selected', 'true')
  },
}
