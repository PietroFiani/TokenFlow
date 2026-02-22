import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
import FieldText from './FieldText.vue'
import DsStack from '../stack/DsStack.vue'

const meta: Meta<typeof FieldText> = {
  title: 'Design System/Forms/FieldText',
  component: FieldText,
  tags: ['autodocs'],
  argTypes: {
    modelValue: {
      control: 'text',
      description: 'The input value (v-model)',
    },
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'url', 'tel'],
      description: 'HTML input type',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the input is disabled',
    },
    prefixText: {
      control: 'text',
      description: 'Text to display before the input',
    },
    suffixText: {
      control: 'text',
      description: 'Text to display after the input',
    },
    label: {
      control: 'text',
      description: 'Field label (from FieldWrapper)',
    },
    hint: {
      control: 'text',
      description: 'Hint text (from FieldWrapper)',
    },
    error: {
      control: 'boolean',
      description: 'Error state (from FieldWrapper)',
    },
    errorMessage: {
      control: 'text',
      description: 'Error message (from FieldWrapper)',
    },
    required: {
      control: 'boolean',
      description: 'Required indicator (from FieldWrapper)',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: 'Full Name',
    placeholder: 'Enter your name',
    modelValue: '',
  },
  render: (args) => ({
    components: { FieldText },
    setup() {
      const modelValue = ref(args.modelValue || '')
      return { modelValue, args }
    },
    template: '<FieldText v-model="modelValue" v-bind="args" />',
  }),
}

export const WithHint: Story = {
  args: {
    label: 'Email Address',
    type: 'email',
    placeholder: 'you@example.com',
    hint: 'We will never share your email with anyone else.',
    modelValue: '',
  },
  render: (args) => ({
    components: { FieldText },
    setup() {
      const modelValue = ref(args.modelValue || '')
      return { modelValue, args }
    },
    template: '<FieldText v-model="modelValue" v-bind="args" />',
  }),
}

export const WithPrefix: Story = {
  args: {
    label: 'Website URL',
    type: 'url',
    placeholder: 'example.com',
    prefixText: 'https://',
    modelValue: '',
  },
  render: (args) => ({
    components: { FieldText },
    setup() {
      const modelValue = ref(args.modelValue || '')
      return { modelValue, args }
    },
    template: '<FieldText v-model="modelValue" v-bind="args" />',
  }),
}

export const WithSuffix: Story = {
  args: {
    label: 'Username',
    placeholder: 'username',
    suffixText: '@company.com',
    modelValue: '',
  },
  render: (args) => ({
    components: { FieldText },
    setup() {
      const modelValue = ref(args.modelValue || '')
      return { modelValue, args }
    },
    template: '<FieldText v-model="modelValue" v-bind="args" />',
  }),
}

export const Password: Story = {
  args: {
    label: 'Password',
    type: 'password',
    placeholder: 'Enter your password',
    required: true,
    modelValue: '',
  },
  render: (args) => ({
    components: { FieldText },
    setup() {
      const modelValue = ref(args.modelValue || '')
      return { modelValue, args }
    },
    template: '<FieldText v-model="modelValue" v-bind="args" />',
  }),
}

export const WithError: Story = {
  args: {
    label: 'Email Address',
    type: 'email',
    placeholder: 'you@example.com',
    modelValue: 'invalid-email',
    error: true,
    errorMessage: 'Please enter a valid email address.',
    required: true,
  },
  render: (args) => ({
    components: { FieldText },
    setup() {
      const modelValue = ref(args.modelValue || '')
      return { modelValue, args }
    },
    template: '<FieldText v-model="modelValue" v-bind="args" />',
  }),
}

export const Disabled: Story = {
  args: {
    label: 'Disabled Field',
    placeholder: 'Cannot edit',
    modelValue: 'Read-only value',
    disabled: true,
  },
  render: (args) => ({
    components: { FieldText },
    setup() {
      const modelValue = ref(args.modelValue || '')
      return { modelValue, args }
    },
    template: '<FieldText v-model="modelValue" v-bind="args" />',
  }),
}

export const Interactive: Story = {
  render: () => ({
    components: { FieldText, DsStack },
    setup() {
      const email = ref('')
      const website = ref('')
      const username = ref('')
      return { email, website, username }
    },
    template: `
      <DsStack direction="column" gap="1.5">
        <FieldText
          v-model="email"
          label="Email"
          type="email"
          placeholder="you@example.com"
          hint="We'll send a confirmation email"
        />

        <FieldText
          v-model="website"
          label="Website"
          type="url"
          placeholder="example.com"
          prefix-text="https://"
        />

        <FieldText
          v-model="username"
          label="Username"
          placeholder="username"
          suffix-text="@company.com"
        />

        <div style="margin-top: 1rem; padding: 1rem; background: #f3f4f6; border-radius: 8px;">
          <p style="margin: 0; font-size: 0.875rem; font-weight: 600; margin-bottom: 0.5rem;">Current Values:</p>
          <ul style="margin: 0; padding-left: 1.25rem; font-size: 0.875rem; font-family: monospace;">
            <li>Email: {{ email || '(empty)' }}</li>
            <li>Website: {{ website || '(empty)' }}</li>
            <li>Username: {{ username || '(empty)' }}</li>
          </ul>
        </div>
      </DsStack>
    `,
  }),
}

export const AllInputTypes: Story = {
  render: () => ({
    components: { FieldText, DsStack },
    setup() {
      const text = ref('')
      const email = ref('')
      const password = ref('')
      const url = ref('')
      const tel = ref('')
      return { text, email, password, url, tel }
    },
    template: `
      <DsStack direction="column" gap="1.5">
        <FieldText v-model="text" label="Text Input" type="text" placeholder="Text input" />
        <FieldText v-model="email" label="Email Input" type="email" placeholder="email@example.com" />
        <FieldText v-model="password" label="Password Input" type="password" placeholder="Password" />
        <FieldText v-model="url" label="URL Input" type="url" placeholder="https://example.com" />
        <FieldText v-model="tel" label="Tel Input" type="tel" placeholder="+1 (555) 123-4567" />
      </DsStack>
    `,
  }),
}
