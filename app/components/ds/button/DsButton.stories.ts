import type { Meta, StoryObj } from '@storybook/vue3'
import DsButton from './DsButton.vue'
import DsStack from '../stack/DsStack.vue'

const meta: Meta<typeof DsButton> = {
  title: 'Design System/Actions/DsButton',
  component: DsButton,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'ghost', 'toggle'],
      description: 'Visual variant of the button',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the button',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the button is disabled',
    },
    active: {
      control: 'boolean',
      description: 'Whether the button is in active state (for toggle variant)',
    },
  },
  args: {
    default: 'Button',
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    variant: 'primary',
    size: 'md',
    disabled: false,
  },
  render: (args) => ({
    components: { DsButton },
    setup() {
      return { args }
    },
    template: '<DsButton v-bind="args">Primary Button</DsButton>',
  }),
}

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    size: 'md',
  },
  render: (args) => ({
    components: { DsButton },
    setup() {
      return { args }
    },
    template: '<DsButton v-bind="args">Secondary Button</DsButton>',
  }),
}

export const Outline: Story = {
  args: {
    variant: 'outline',
    size: 'md',
  },
  render: (args) => ({
    components: { DsButton },
    setup() {
      return { args }
    },
    template: '<DsButton v-bind="args">Outline Button</DsButton>',
  }),
}

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    size: 'md',
  },
  render: (args) => ({
    components: { DsButton },
    setup() {
      return { args }
    },
    template: '<DsButton v-bind="args">Ghost Button</DsButton>',
  }),
}

export const Toggle: Story = {
  args: {
    variant: 'toggle',
    size: 'md',
    active: false,
  },
  render: (args) => ({
    components: { DsButton },
    setup() {
      return { args }
    },
    template: '<DsButton v-bind="args">Toggle Button</DsButton>',
  }),
}

export const ToggleActive: Story = {
  args: {
    variant: 'toggle',
    size: 'md',
    active: true,
  },
  render: (args) => ({
    components: { DsButton },
    setup() {
      return { args }
    },
    template: '<DsButton v-bind="args">Active Toggle</DsButton>',
  }),
}

export const Disabled: Story = {
  args: {
    variant: 'primary',
    size: 'md',
    disabled: true,
  },
  render: (args) => ({
    components: { DsButton },
    setup() {
      return { args }
    },
    template: '<DsButton v-bind="args">Disabled Button</DsButton>',
  }),
}

export const AllVariants: Story = {
  render: () => ({
    components: { DsButton, DsStack },
    template: `
      <DsStack direction="column" gap="2">
        <div>
          <p style="margin: 0 0 0.5rem 0; font-size: 0.875rem; font-weight: 600;">Button Variants</p>
          <DsStack direction="row" gap="1">
            <DsButton variant="primary">Primary</DsButton>
            <DsButton variant="secondary">Secondary</DsButton>
            <DsButton variant="outline">Outline</DsButton>
            <DsButton variant="ghost">Ghost</DsButton>
            <DsButton variant="toggle">Toggle</DsButton>
            <DsButton variant="toggle" :active="true">Active</DsButton>
          </DsStack>
        </div>

        <div>
          <p style="margin: 0 0 0.5rem 0; font-size: 0.875rem; font-weight: 600;">Disabled States</p>
          <DsStack direction="row" gap="1">
            <DsButton variant="primary" disabled>Primary</DsButton>
            <DsButton variant="secondary" disabled>Secondary</DsButton>
            <DsButton variant="outline" disabled>Outline</DsButton>
            <DsButton variant="ghost" disabled>Ghost</DsButton>
          </DsStack>
        </div>
      </DsStack>
    `,
  }),
}

export const AllSizes: Story = {
  render: () => ({
    components: { DsButton, DsStack },
    template: `
      <DsStack direction="column" gap="2">
        <div>
          <p style="margin: 0 0 0.5rem 0; font-size: 0.875rem; font-weight: 600;">Small</p>
          <DsStack direction="row" gap="1" align="center">
            <DsButton size="sm">Small Button</DsButton>
            <DsButton variant="secondary" size="sm">Small Secondary</DsButton>
            <DsButton variant="outline" size="sm">Small Outline</DsButton>
          </DsStack>
        </div>

        <div>
          <p style="margin: 0 0 0.5rem 0; font-size: 0.875rem; font-weight: 600;">Medium (Default)</p>
          <DsStack direction="row" gap="1" align="center">
            <DsButton size="md">Medium Button</DsButton>
            <DsButton variant="secondary" size="md">Medium Secondary</DsButton>
            <DsButton variant="outline" size="md">Medium Outline</DsButton>
          </DsStack>
        </div>

        <div>
          <p style="margin: 0 0 0.5rem 0; font-size: 0.875rem; font-weight: 600;">Large</p>
          <DsStack direction="row" gap="1" align="center">
            <DsButton size="lg">Large Button</DsButton>
            <DsButton variant="secondary" size="lg">Large Secondary</DsButton>
            <DsButton variant="outline" size="lg">Large Outline</DsButton>
          </DsStack>
        </div>
      </DsStack>
    `,
  }),
}
