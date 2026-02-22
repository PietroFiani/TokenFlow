import type { Meta, StoryObj } from '@storybook/vue3'
import { ref, computed } from 'vue'
import FieldNumber from './FieldNumber.vue'
import DsStack from '../stack/DsStack.vue'

const meta: Meta<typeof FieldNumber> = {
  title: 'Design System/Forms/FieldNumber',
  component: FieldNumber,
  tags: ['autodocs'],
  argTypes: {
    modelValue: {
      control: 'number',
      description: 'The number value (v-model)',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the input is disabled',
    },
    min: {
      control: 'number',
      description: 'Minimum allowed value',
    },
    max: {
      control: 'number',
      description: 'Maximum allowed value',
    },
    step: {
      control: 'number',
      description: 'Step increment for the number input',
    },
    unitText: {
      control: 'text',
      description: 'Unit text displayed after the input (e.g., "px", "%")',
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
    label: 'Quantity',
    placeholder: 'Enter a number',
    modelValue: null,
  },
  render: (args) => ({
    components: { FieldNumber },
    setup() {
      const modelValue = ref(args.modelValue)
      return { modelValue, args }
    },
    template: '<FieldNumber v-model="modelValue" v-bind="args" />',
  }),
}

export const WithMinMax: Story = {
  args: {
    label: 'Age',
    placeholder: 'Enter your age',
    modelValue: 25,
    min: 0,
    max: 120,
    hint: 'Must be between 0 and 120',
  },
  render: (args) => ({
    components: { FieldNumber },
    setup() {
      const modelValue = ref(args.modelValue)
      return { modelValue, args }
    },
    template: '<FieldNumber v-model="modelValue" v-bind="args" />',
  }),
}

export const WithStep: Story = {
  args: {
    label: 'Price',
    placeholder: '0.00',
    modelValue: 9.99,
    step: 0.01,
    min: 0,
    unitText: '$',
  },
  render: (args) => ({
    components: { FieldNumber },
    setup() {
      const modelValue = ref(args.modelValue)
      return { modelValue, args }
    },
    template: '<FieldNumber v-model="modelValue" v-bind="args" />',
  }),
}

export const WithUnitText: Story = {
  args: {
    label: 'Font Size',
    placeholder: '16',
    modelValue: 16,
    unitText: 'px',
    min: 8,
    max: 72,
  },
  render: (args) => ({
    components: { FieldNumber },
    setup() {
      const modelValue = ref(args.modelValue)
      return { modelValue, args }
    },
    template: '<FieldNumber v-model="modelValue" v-bind="args" />',
  }),
}

export const Percentage: Story = {
  args: {
    label: 'Opacity',
    placeholder: '100',
    modelValue: 100,
    unitText: '%',
    min: 0,
    max: 100,
    step: 1,
    hint: 'Set opacity from 0 to 100%',
  },
  render: (args) => ({
    components: { FieldNumber },
    setup() {
      const modelValue = ref(args.modelValue)
      return { modelValue, args }
    },
    template: '<FieldNumber v-model="modelValue" v-bind="args" />',
  }),
}

export const WithError: Story = {
  args: {
    label: 'Port Number',
    placeholder: '3000',
    modelValue: 99999,
    min: 1,
    max: 65535,
    error: true,
    errorMessage: 'Port number must be between 1 and 65535',
    required: true,
  },
  render: (args) => ({
    components: { FieldNumber },
    setup() {
      const modelValue = ref(args.modelValue)
      return { modelValue, args }
    },
    template: '<FieldNumber v-model="modelValue" v-bind="args" />',
  }),
}

export const Disabled: Story = {
  args: {
    label: 'Disabled Field',
    modelValue: 42,
    disabled: true,
    unitText: 'items',
  },
  render: (args) => ({
    components: { FieldNumber },
    setup() {
      const modelValue = ref(args.modelValue)
      return { modelValue, args }
    },
    template: '<FieldNumber v-model="modelValue" v-bind="args" />',
  }),
}

export const Interactive: Story = {
  render: () => ({
    components: { FieldNumber, DsStack },
    setup() {
      const quantity = ref(1)
      const price = ref(9.99)
      const fontSize = ref(16)
      const opacity = ref(100)

      const priceDisplay = computed(() => {
        return price.value ? price.value.toFixed(2) : '0.00'
      })

      return { quantity, price, fontSize, opacity, priceDisplay }
    },
    template: `
      <DsStack direction="column" gap="1.5">
        <FieldNumber
          v-model="quantity"
          label="Quantity"
          :min="1"
          :max="99"
          :step="1"
        />

        <FieldNumber
          v-model="price"
          label="Price"
          :min="0"
          :step="0.01"
          unit-text="$"
        />

        <FieldNumber
          v-model="fontSize"
          label="Font Size"
          :min="8"
          :max="72"
          :step="1"
          unit-text="px"
        />

        <FieldNumber
          v-model="opacity"
          label="Opacity"
          :min="0"
          :max="100"
          :step="5"
          unit-text="%"
        />

        <div style="margin-top: 1rem; padding: 1rem; background: #f3f4f6; border-radius: 8px;">
          <p style="margin: 0; font-size: 0.875rem; font-weight: 600; margin-bottom: 0.5rem;">Current Values:</p>
          <ul style="margin: 0; padding-left: 1.25rem; font-size: 0.875rem; font-family: monospace;">
            <li>Quantity: {{ quantity }}</li>
            <li>Price: ${{ priceDisplay }}</li>
            <li>Font Size: {{ fontSize }}px</li>
            <li>Opacity: {{ opacity }}%</li>
          </ul>
        </div>
      </DsStack>
    `,
  }),
}
