import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
import DsToggle from './DsToggle.vue'
import DsStack from '../stack/DsStack.vue'

const meta: Meta<typeof DsToggle> = {
  title: 'Design System/Forms/DsToggle',
  component: DsToggle,
  tags: ['autodocs'],
  argTypes: {
    modelValue: {
      control: 'boolean',
      description: 'The checked state of the toggle (v-model)',
    },
    label: {
      control: 'text',
      description: 'Label text displayed next to the toggle',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the toggle is disabled',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    modelValue: false,
    label: 'Toggle Setting',
    disabled: false,
  },
  render: (args) => ({
    components: { DsToggle },
    setup() {
      const checked = ref(args.modelValue)
      return { args, checked }
    },
    template: '<DsToggle v-model="checked" :label="args.label" :disabled="args.disabled" />',
  }),
}

export const Checked: Story = {
  args: {
    modelValue: true,
    label: 'Enable Feature',
    disabled: false,
  },
  render: (args) => ({
    components: { DsToggle },
    setup() {
      const checked = ref(args.modelValue)
      return { args, checked }
    },
    template: '<DsToggle v-model="checked" :label="args.label" :disabled="args.disabled" />',
  }),
}

export const Unchecked: Story = {
  args: {
    modelValue: false,
    label: 'Disable Feature',
    disabled: false,
  },
  render: (args) => ({
    components: { DsToggle },
    setup() {
      const checked = ref(args.modelValue)
      return { args, checked }
    },
    template: '<DsToggle v-model="checked" :label="args.label" :disabled="args.disabled" />',
  }),
}

export const Disabled: Story = {
  args: {
    modelValue: false,
    label: 'Disabled Toggle',
    disabled: true,
  },
  render: (args) => ({
    components: { DsToggle },
    setup() {
      const checked = ref(args.modelValue)
      return { args, checked }
    },
    template: '<DsToggle v-model="checked" :label="args.label" :disabled="args.disabled" />',
  }),
}

export const DisabledChecked: Story = {
  args: {
    modelValue: true,
    label: 'Disabled Checked',
    disabled: true,
  },
  render: (args) => ({
    components: { DsToggle },
    setup() {
      const checked = ref(args.modelValue)
      return { args, checked }
    },
    template: '<DsToggle v-model="checked" :label="args.label" :disabled="args.disabled" />',
  }),
}

export const Interactive: Story = {
  render: () => ({
    components: { DsToggle, DsStack },
    setup() {
      const notifications = ref(true)
      const darkMode = ref(false)
      const emailUpdates = ref(true)
      return { notifications, darkMode, emailUpdates }
    },
    template: `
      <DsStack direction="column" gap="1.5">
        <DsToggle v-model="notifications" label="Enable Notifications" />
        <DsToggle v-model="darkMode" label="Dark Mode" />
        <DsToggle v-model="emailUpdates" label="Email Updates" />

        <div style="margin-top: 1rem; padding: 1rem; background: #f3f4f6; border-radius: 8px;">
          <p style="margin: 0; font-size: 0.875rem; font-weight: 600; margin-bottom: 0.5rem;">Current State:</p>
          <ul style="margin: 0; padding-left: 1.25rem; font-size: 0.875rem;">
            <li>Notifications: {{ notifications ? 'Enabled' : 'Disabled' }}</li>
            <li>Dark Mode: {{ darkMode ? 'Enabled' : 'Disabled' }}</li>
            <li>Email Updates: {{ emailUpdates ? 'Enabled' : 'Disabled' }}</li>
          </ul>
        </div>
      </DsStack>
    `,
  }),
}
