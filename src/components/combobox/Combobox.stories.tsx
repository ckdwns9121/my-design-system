import type { Meta, StoryObj } from '@storybook/react-vite'
import { useMemo, useState } from 'react'
import { expect, screen, waitFor } from 'storybook/test'
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxList,
  ComboboxOption,
  ComboboxPortal,
} from './Combobox'

const couriers = [
  { label: '대한통운', value: 'cj' },
  { label: '한진택배', value: 'hanjin' },
  { label: '롯데택배', value: 'lotte' },
  { label: '우체국택배', value: 'post' },
  { label: '로젠택배', value: 'logen' },
]

const meta = {
  title: 'Components/Combobox',
  component: Combobox,
  tags: ['ai-generated'],
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof Combobox>

export default meta
type Story = StoryObj<typeof meta>

function Example({ defaultInputValue = '' }: { defaultInputValue?: string }) {
  const [query, setQuery] = useState(defaultInputValue)
  const options = useMemo(
    () => couriers.filter((courier) => courier.label.includes(query.trim())),
    [query],
  )

  return (
    <Combobox defaultInputValue={defaultInputValue} onInputValueChange={setQuery}>
      <ComboboxInput aria-label="택배사" placeholder="택배사를 검색하세요" />
      <ComboboxPortal>
        <ComboboxContent>
          <ComboboxList>
            {options.map((courier) => (
              <ComboboxOption key={courier.value} label={courier.label} value={courier.value}>
                {courier.label}
              </ComboboxOption>
            ))}
          </ComboboxList>
          {options.length === 0 ? <ComboboxEmpty>검색 결과가 없습니다</ComboboxEmpty> : null}
        </ComboboxContent>
      </ComboboxPortal>
    </Combobox>
  )
}

export const Playground: Story = {
  args: {
    children: null,
  },
  render: () => <Example />,
}

export const Prefilled: Story = {
  args: {
    children: null,
  },
  render: () => <Example defaultInputValue="택배" />,
}

export const Filtering: Story = {
  args: {
    children: null,
  },
  render: () => <Example />,
  play: async ({ canvas, userEvent }) => {
    const input = canvas.getByRole('combobox', { name: '택배사' })

    await expect(input).toHaveAttribute('aria-expanded', 'false')
    await expect(input).toHaveAttribute('aria-autocomplete', 'list')

    await userEvent.type(input, '한진')

    await expect(input).toHaveAttribute('aria-expanded', 'true')

    const options = await screen.findAllByRole('option')

    await expect(options).toHaveLength(1)
    await expect(options[0]).toHaveTextContent('한진택배')
  },
}

export const EmptyResult: Story = {
  args: {
    children: null,
  },
  render: () => <Example />,
  play: async ({ canvas, userEvent }) => {
    const input = canvas.getByRole('combobox', { name: '택배사' })

    await userEvent.type(input, '없는택배')

    await expect(await screen.findByText('검색 결과가 없습니다')).toBeVisible()
  },
}

export const KeyboardSelection: Story = {
  args: {
    children: null,
  },
  render: () => <Example />,
  play: async ({ canvas, userEvent }) => {
    const input = canvas.getByRole('combobox', { name: '택배사' })

    input.focus()
    await userEvent.keyboard('{ArrowDown}')

    await expect(await screen.findByRole('listbox')).toBeVisible()
    // Opening seeds the active option asynchronously; wait for it before moving.
    await waitFor(() => expect(input).toHaveAttribute('aria-activedescendant'))

    await userEvent.keyboard('{ArrowDown}')
    await userEvent.keyboard('{Enter}')

    await expect(input).toHaveValue('한진택배')
    await expect(input).toHaveAttribute('aria-expanded', 'false')
    await expect(getComputedStyle(input).height).toBe('40px')
  },
}
