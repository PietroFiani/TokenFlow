import type { Meta, StoryObj } from '@storybook/vue3'
import FieldWrapper from './FieldWrapper.vue'
import DsStack from '../stack/DsStack.vue'

const meta: Meta<typeof FieldWrapper> = {
  title: 'Design System/Forms/FieldWrapper',
  component: FieldWrapper,
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Label text for the field',
    },
    hint: {
      control: 'text',
      description: 'Helper text displayed below the input',
    },
    error: {
      control: 'boolean',
      description: 'Whether the field is in error state',
    },
    errorMessage: {
      control: 'text',
      description: 'Error message to display when error is true',
    },
    required: {
      control: 'boolean',
      description: 'Whether to show required indicator (*)',
    },
    showOptional: {
      control: 'boolean',
      description: 'Whether to show "Optional" label',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: 'Field Label',
    hint: '',
    error: false,
    errorMessage: '',
    required: false,
    showOptional: false,
  },
  render: (args) => ({
    components: { FieldWrapper },
    setup() {
      return { args }
    },
    template: `
      <FieldWrapper v-bind="args">
        <template #input="{ inputId, ariaDescribedBy }">
          <input
            :id="inputId"
            :aria-describedby="ariaDescribedBy"
            type="text"
            placeholder="Example input"
            style="
              padding: 0.75rem 1rem;
              border: 1px solid #d1d5db;
              border-radius: 8px;
              font-size: 0.875rem;
              width: 100%;
            "
          />
        </template>
      </FieldWrapper>
    `,
  }),
}

export const WithHint: Story = {
  args: {
    label: 'Email Address',
    hint: 'We will never share your email with anyone else.',
    required: false,
  },
  render: (args) => ({
    components: { FieldWrapper },
    setup() {
      return { args }
    },
    template: `
      <FieldWrapper v-bind="args">
        <template #input="{ inputId, ariaDescribedBy }">
          <input
            :id="inputId"
            :aria-describedby="ariaDescribedBy"
            type="email"
            placeholder="you@example.com"
            style="
              padding: 0.75rem 1rem;
              border: 1px solid #d1d5db;
              border-radius: 8px;
              font-size: 0.875rem;
              width: 100%;
            "
          />
        </template>
      </FieldWrapper>
    `,
  }),
}

export const WithError: Story = {
  args: {
    label: 'Password',
    error: true,
    errorMessage: 'Password must be at least 8 characters long.',
    required: true,
  },
  render: (args) => ({
    components: { FieldWrapper },
    setup() {
      return { args }
    },
    template: `
      <FieldWrapper v-bind="args">
        <template #input="{ inputId, ariaDescribedBy }">
          <input
            :id="inputId"
            :aria-describedby="ariaDescribedBy"
            :aria-invalid="args.error"
            type="password"
            placeholder="Enter password"
            style="
              padding: 0.75rem 1rem;
              border: 1px solid #ef4444;
              border-radius: 8px;
              font-size: 0.875rem;
              width: 100%;
            "
          />
        </template>
      </FieldWrapper>
    `,
  }),
}

export const Required: Story = {
  args: {
    label: 'Full Name',
    hint: 'Please enter your full legal name.',
    required: true,
  },
  render: (args) => ({
    components: { FieldWrapper },
    setup() {
      return { args }
    },
    template: `
      <FieldWrapper v-bind="args">
        <template #input="{ inputId, ariaDescribedBy }">
          <input
            :id="inputId"
            :aria-describedby="ariaDescribedBy"
            type="text"
            placeholder="John Doe"
            style="
              padding: 0.75rem 1rem;
              border: 1px solid #d1d5db;
              border-radius: 8px;
              font-size: 0.875rem;
              width: 100%;
            "
          />
        </template>
      </FieldWrapper>
    `,
  }),
}

export const Optional: Story = {
  args: {
    label: 'Middle Name',
    showOptional: true,
  },
  render: (args) => ({
    components: { FieldWrapper },
    setup() {
      return { args }
    },
    template: `
      <FieldWrapper v-bind="args">
        <template #input="{ inputId, ariaDescribedBy }">
          <input
            :id="inputId"
            :aria-describedby="ariaDescribedBy"
            type="text"
            placeholder="Optional"
            style="
              padding: 0.75rem 1rem;
              border: 1px solid #d1d5db;
              border-radius: 8px;
              font-size: 0.875rem;
              width: 100%;
            "
          />
        </template>
      </FieldWrapper>
    `,
  }),
}

export const AllStates: Story = {
  render: () => ({
    components: { FieldWrapper, DsStack },
    template: `
      <DsStack direction="column" gap="2">
        <div>
          <p style="margin: 0 0 0.5rem 0; font-size: 0.875rem; font-weight: 600;">Default</p>
          <FieldWrapper label="Field Label">
            <template #input="{ inputId, ariaDescribedBy }">
              <input
                :id="inputId"
                :aria-describedby="ariaDescribedBy"
                type="text"
                placeholder="Enter text"
                style="
                  padding: 0.75rem 1rem;
                  border: 1px solid #d1d5db;
                  border-radius: 8px;
                  font-size: 0.875rem;
                  width: 100%;
                "
              />
            </template>
          </FieldWrapper>
        </div>

        <div>
          <p style="margin: 0 0 0.5rem 0; font-size: 0.875rem; font-weight: 600;">With Hint</p>
          <FieldWrapper label="Email" hint="We'll send a confirmation email">
            <template #input="{ inputId, ariaDescribedBy }">
              <input
                :id="inputId"
                :aria-describedby="ariaDescribedBy"
                type="email"
                placeholder="you@example.com"
                style="
                  padding: 0.75rem 1rem;
                  border: 1px solid #d1d5db;
                  border-radius: 8px;
                  font-size: 0.875rem;
                  width: 100%;
                "
              />
            </template>
          </FieldWrapper>
        </div>

        <div>
          <p style="margin: 0 0 0.5rem 0; font-size: 0.875rem; font-weight: 600;">Required</p>
          <FieldWrapper label="Username" :required="true">
            <template #input="{ inputId, ariaDescribedBy }">
              <input
                :id="inputId"
                :aria-describedby="ariaDescribedBy"
                type="text"
                placeholder="Required field"
                style="
                  padding: 0.75rem 1rem;
                  border: 1px solid #d1d5db;
                  border-radius: 8px;
                  font-size: 0.875rem;
                  width: 100%;
                "
              />
            </template>
          </FieldWrapper>
        </div>

        <div>
          <p style="margin: 0 0 0.5rem 0; font-size: 0.875rem; font-weight: 600;">Optional</p>
          <FieldWrapper label="Nickname" :show-optional="true">
            <template #input="{ inputId, ariaDescribedBy }">
              <input
                :id="inputId"
                :aria-describedby="ariaDescribedBy"
                type="text"
                placeholder="Optional field"
                style="
                  padding: 0.75rem 1rem;
                  border: 1px solid #d1d5db;
                  border-radius: 8px;
                  font-size: 0.875rem;
                  width: 100%;
                "
              />
            </template>
          </FieldWrapper>
        </div>

        <div>
          <p style="margin: 0 0 0.5rem 0; font-size: 0.875rem; font-weight: 600;">Error State</p>
          <FieldWrapper label="Password" :error="true" error-message="Password is too short" :required="true">
            <template #input="{ inputId, ariaDescribedBy }">
              <input
                :id="inputId"
                :aria-describedby="ariaDescribedBy"
                aria-invalid="true"
                type="password"
                value="pass"
                style="
                  padding: 0.75rem 1rem;
                  border: 1px solid #ef4444;
                  border-radius: 8px;
                  font-size: 0.875rem;
                  width: 100%;
                "
              />
            </template>
          </FieldWrapper>
        </div>
      </DsStack>
    `,
  }),
}
