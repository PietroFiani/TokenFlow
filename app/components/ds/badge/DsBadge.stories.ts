import type { Meta, StoryObj } from '@storybook/vue3'
import DsBadge from './DsBadge.vue'
import DsStack from '../stack/DsStack.vue'

const meta: Meta<typeof DsBadge> = {
  title: 'Design System/Display/DsBadge',
  component: DsBadge,
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'The text label to display',
    },
    color: {
      control: 'color',
      description: 'Optional color swatch to display (hex, rgb, etc.)',
    },
    size: {
      control: 'select',
      options: ['sm', 'md'],
      description: 'Size variant of the badge',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: 'Badge Label',
    size: 'md',
  },
}

export const WithColorSwatch: Story = {
  args: {
    label: 'Primary Blue',
    color: '#3b82f6',
    size: 'md',
  },
}

export const WithoutColor: Story = {
  args: {
    label: 'No Color',
    size: 'md',
  },
}

export const Small: Story = {
  args: {
    label: 'Small Badge',
    size: 'sm',
  },
}

export const SmallWithColor: Story = {
  args: {
    label: 'Small',
    color: '#10b981',
    size: 'sm',
  },
}

export const ColorPalette: Story = {
  render: () => ({
    components: { DsBadge, DsStack },
    template: `
      <DsStack direction="column" gap="1.5">
        <div>
          <p style="margin: 0 0 0.5rem 0; font-size: 0.875rem; font-weight: 600;">Color Palette Examples</p>
          <DsStack direction="row" gap="0.5">
            <DsBadge label="Primary Blue" color="#3b82f6" />
            <DsBadge label="Success Green" color="#10b981" />
            <DsBadge label="Warning Orange" color="#f59e0b" />
            <DsBadge label="Danger Red" color="#ef4444" />
            <DsBadge label="Purple" color="#8b5cf6" />
          </DsStack>
        </div>

        <div>
          <p style="margin: 0 0 0.5rem 0; font-size: 0.875rem; font-weight: 600;">Without Color Swatches</p>
          <DsStack direction="row" gap="0.5">
            <DsBadge label="Tag 1" />
            <DsBadge label="Tag 2" />
            <DsBadge label="Category" />
            <DsBadge label="Label" />
          </DsStack>
        </div>

        <div>
          <p style="margin: 0 0 0.5rem 0; font-size: 0.875rem; font-weight: 600;">Small Size</p>
          <DsStack direction="row" gap="0.5">
            <DsBadge label="Small" color="#3b82f6" size="sm" />
            <DsBadge label="Compact" color="#10b981" size="sm" />
            <DsBadge label="Mini" size="sm" />
          </DsStack>
        </div>
      </DsStack>
    `,
  }),
}
