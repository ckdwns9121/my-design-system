import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { expect, screen, waitFor } from 'storybook/test'
import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectOption,
  MultiSelectPortal,
  MultiSelectTrigger,
  MultiSelectValue,
} from './MultiSelect'

const warehouses = [
  { label: '서울 A동', value: 'seoul-a' },
  { label: '서울 B동', value: 'seoul-b' },
  { label: '부산 물류센터', value: 'busan' },
  { label: '대전 물류센터', value: 'daejeon' },
  { label: '광주 물류센터', value: 'gwangju' },
]

const meta = {
  title: 'Components/MultiSelect',
  component: MultiSelect,
  tags: ['ai-generated'],
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof MultiSelect>

export default meta
type Story = StoryObj<typeof meta>

function Example({
  defaultValues,
  disabledValue,
}: {
  defaultValues?: string[]
  disabledValue?: string
}) {
  return (
    <MultiSelect defaultValues={defaultValues}>
      <MultiSelectTrigger aria-label="창고 선택">
        <MultiSelectValue placeholder="창고를 선택하세요" />
        <span aria-hidden="true" className="text-content-subtle">
          ▾
        </span>
      </MultiSelectTrigger>
      <MultiSelectPortal>
        <MultiSelectContent>
          {warehouses.map((warehouse) => (
            <MultiSelectOption
              disabled={warehouse.value === disabledValue}
              key={warehouse.value}
              value={warehouse.value}
            >
              {warehouse.label}
            </MultiSelectOption>
          ))}
        </MultiSelectContent>
      </MultiSelectPortal>
    </MultiSelect>
  )
}

export const Playground: Story = {
  args: {
    children: null,
  },
  render: () => <Example />,
}

export const WithSelection: Story = {
  args: {
    children: null,
  },
  render: () => <Example defaultValues={['seoul-a', 'busan']} />,
}

export const CollapsedSummary: Story = {
  args: {
    children: null,
  },
  render: () => <Example defaultValues={['seoul-a', 'seoul-b', 'busan', 'daejeon']} />,
}

export const DisabledOption: Story = {
  args: {
    children: null,
  },
  render: () => <Example disabledValue="gwangju" />,
}

function ControlledExample() {
  const [values, setValues] = useState<string[]>(['seoul-a'])

  return (
    <div className="grid gap-3">
      <MultiSelect onValuesChange={setValues} values={values}>
        <MultiSelectTrigger aria-label="창고 선택">
          <MultiSelectValue placeholder="창고를 선택하세요" />
          <span aria-hidden="true" className="text-content-subtle">
            ▾
          </span>
        </MultiSelectTrigger>
        <MultiSelectPortal>
          <MultiSelectContent>
            {warehouses.map((warehouse) => (
              <MultiSelectOption key={warehouse.value} value={warehouse.value}>
                {warehouse.label}
              </MultiSelectOption>
            ))}
          </MultiSelectContent>
        </MultiSelectPortal>
      </MultiSelect>
      <p className="text-sm text-content-muted">선택한 창고 {values.length}개</p>
    </div>
  )
}

export const Controlled: Story = {
  args: {
    children: null,
  },
  render: () => <ControlledExample />,
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole('combobox', { name: '창고 선택' })

    await expect(trigger).toHaveAttribute('aria-expanded', 'false')

    await userEvent.click(trigger)

    const listbox = await screen.findByRole('listbox')

    await expect(listbox).toHaveAttribute('aria-multiselectable', 'true')

    await userEvent.click(screen.getByRole('option', { name: '부산 물류센터' }))

    await expect(canvas.getByText('선택한 창고 2개')).toBeInTheDocument()
    await expect(trigger).toHaveAttribute('aria-expanded', 'true')
  },
}

export const KeyboardToggle: Story = {
  args: {
    children: null,
  },
  render: () => <Example />,
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole('combobox', { name: '창고 선택' })

    trigger.focus()
    await userEvent.keyboard('{ArrowDown}')

    const listbox = await screen.findByRole('listbox')

    await expect(listbox).toBeVisible()
    // Opening seeds the active option asynchronously; wait for it before moving.
    await waitFor(() => expect(trigger).toHaveAttribute('aria-activedescendant'))

    await userEvent.keyboard('{ArrowDown}')
    await userEvent.keyboard(' ')

    await expect(screen.getByRole('option', { name: '서울 B동' })).toHaveAttribute(
      'aria-selected',
      'true',
    )

    await userEvent.keyboard('{Escape}')

    await expect(trigger).toHaveAttribute('aria-expanded', 'false')
  },
}
