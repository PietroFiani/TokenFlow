import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
import FieldSelect from './FieldSelect.vue'
import DsStack from '../stack/DsStack.vue'

const meta: Meta<typeof FieldSelect> = {
  title: 'Design System/Forms/FieldSelect',
  component: FieldSelect,
  tags: ['autodocs'],
  argTypes: {
    modelValue: {
      control: 'text',
      description: 'The selected value (v-model)',
    },
    options: {
      control: 'object',
      description: 'Array of options with { value, label, disabled? }',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text when no option is selected',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the select is disabled',
    },
    searchable: {
      control: 'boolean',
      description: 'Whether to show search input',
    },
    clearable: {
      control: 'boolean',
      description: 'Whether to show clear button',
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

const simpleOptions = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' },
]

const countryOptions = [
  { value: 'us', label: 'United States' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'ca', label: 'Canada' },
  { value: 'au', label: 'Australia' },
  { value: 'de', label: 'Germany' },
  { value: 'fr', label: 'France' },
  { value: 'jp', label: 'Japan' },
  { value: 'cn', label: 'China' },
]

const optionsWithDisabled = [
  { value: 'red', label: 'Red' },
  { value: 'blue', label: 'Blue' },
  { value: 'green', label: 'Green', disabled: true },
  { value: 'yellow', label: 'Yellow' },
  { value: 'purple', label: 'Purple', disabled: true },
]

export const Default: Story = {
  args: {
    label: 'Choose an option',
    options: simpleOptions,
    placeholder: 'Select an option',
    modelValue: null,
  },
  render: (args) => ({
    components: { FieldSelect },
    setup() {
      const modelValue = ref(args.modelValue)
      return { modelValue, args }
    },
    template: '<FieldSelect v-model="modelValue" v-bind="args" />',
  }),
}

export const WithSelection: Story = {
  args: {
    label: 'Country',
    options: countryOptions,
    placeholder: 'Select a country',
    modelValue: 'us',
  },
  render: (args) => ({
    components: { FieldSelect },
    setup() {
      const modelValue = ref(args.modelValue)
      return { modelValue, args }
    },
    template: '<FieldSelect v-model="modelValue" v-bind="args" />',
  }),
}

export const Searchable: Story = {
  args: {
    label: 'Country',
    options: countryOptions,
    placeholder: 'Search for a country',
    searchable: true,
    modelValue: null,
    hint: 'Type to search through options',
  },
  render: (args) => ({
    components: { FieldSelect },
    setup() {
      const modelValue = ref(args.modelValue)
      return { modelValue, args }
    },
    template: '<FieldSelect v-model="modelValue" v-bind="args" />',
  }),
}

export const NotSearchable: Story = {
  args: {
    label: 'Size',
    options: [
      { value: 'xs', label: 'Extra Small' },
      { value: 's', label: 'Small' },
      { value: 'm', label: 'Medium' },
      { value: 'l', label: 'Large' },
      { value: 'xl', label: 'Extra Large' },
    ],
    searchable: false,
    modelValue: null,
  },
  render: (args) => ({
    components: { FieldSelect },
    setup() {
      const modelValue = ref(args.modelValue)
      return { modelValue, args }
    },
    template: '<FieldSelect v-model="modelValue" v-bind="args" />',
  }),
}

export const WithDisabledOptions: Story = {
  args: {
    label: 'Color',
    options: optionsWithDisabled,
    placeholder: 'Select a color',
    modelValue: null,
    hint: 'Some options are disabled',
  },
  render: (args) => ({
    components: { FieldSelect },
    setup() {
      const modelValue = ref(args.modelValue)
      return { modelValue, args }
    },
    template: '<FieldSelect v-model="modelValue" v-bind="args" />',
  }),
}

export const WithError: Story = {
  args: {
    label: 'Country',
    options: countryOptions,
    placeholder: 'Select a country',
    modelValue: null,
    error: true,
    errorMessage: 'Please select a country',
    required: true,
  },
  render: (args) => ({
    components: { FieldSelect },
    setup() {
      const modelValue = ref(args.modelValue)
      return { modelValue, args }
    },
    template: '<FieldSelect v-model="modelValue" v-bind="args" />',
  }),
}

export const Disabled: Story = {
  args: {
    label: 'Disabled Select',
    options: simpleOptions,
    modelValue: 'option2',
    disabled: true,
  },
  render: (args) => ({
    components: { FieldSelect },
    setup() {
      const modelValue = ref(args.modelValue)
      return { modelValue, args }
    },
    template: '<FieldSelect v-model="modelValue" v-bind="args" />',
  }),
}

export const ManyOptions: Story = {
  args: {
    label: 'State',
    options: [
      { value: 'AL', label: 'Alabama' },
      { value: 'AK', label: 'Alaska' },
      { value: 'AZ', label: 'Arizona' },
      { value: 'AR', label: 'Arkansas' },
      { value: 'CA', label: 'California' },
      { value: 'CO', label: 'Colorado' },
      { value: 'CT', label: 'Connecticut' },
      { value: 'DE', label: 'Delaware' },
      { value: 'FL', label: 'Florida' },
      { value: 'GA', label: 'Georgia' },
      { value: 'HI', label: 'Hawaii' },
      { value: 'ID', label: 'Idaho' },
      { value: 'IL', label: 'Illinois' },
      { value: 'IN', label: 'Indiana' },
      { value: 'IA', label: 'Iowa' },
      { value: 'KS', label: 'Kansas' },
      { value: 'KY', label: 'Kentucky' },
      { value: 'LA', label: 'Louisiana' },
      { value: 'ME', label: 'Maine' },
      { value: 'MD', label: 'Maryland' },
      { value: 'MA', label: 'Massachusetts' },
      { value: 'MI', label: 'Michigan' },
      { value: 'MN', label: 'Minnesota' },
      { value: 'MS', label: 'Mississippi' },
      { value: 'MO', label: 'Missouri' },
      { value: 'MT', label: 'Montana' },
      { value: 'NE', label: 'Nebraska' },
      { value: 'NV', label: 'Nevada' },
      { value: 'NH', label: 'New Hampshire' },
      { value: 'NJ', label: 'New Jersey' },
      { value: 'NM', label: 'New Mexico' },
      { value: 'NY', label: 'New York' },
      { value: 'NC', label: 'North Carolina' },
      { value: 'ND', label: 'North Dakota' },
      { value: 'OH', label: 'Ohio' },
      { value: 'OK', label: 'Oklahoma' },
      { value: 'OR', label: 'Oregon' },
      { value: 'PA', label: 'Pennsylvania' },
      { value: 'RI', label: 'Rhode Island' },
      { value: 'SC', label: 'South Carolina' },
      { value: 'SD', label: 'South Dakota' },
      { value: 'TN', label: 'Tennessee' },
      { value: 'TX', label: 'Texas' },
      { value: 'UT', label: 'Utah' },
      { value: 'VT', label: 'Vermont' },
      { value: 'VA', label: 'Virginia' },
      { value: 'WA', label: 'Washington' },
      { value: 'WV', label: 'West Virginia' },
      { value: 'WI', label: 'Wisconsin' },
      { value: 'WY', label: 'Wyoming' },
    ],
    placeholder: 'Select a state',
    searchable: true,
    modelValue: null,
    hint: 'Search for a US state',
  },
  render: (args) => ({
    components: { FieldSelect },
    setup() {
      const modelValue = ref(args.modelValue)
      return { modelValue, args }
    },
    template: '<FieldSelect v-model="modelValue" v-bind="args" />',
  }),
}

export const Interactive: Story = {
  render: () => ({
    components: { FieldSelect, DsStack },
    setup() {
      const country = ref(null)
      const size = ref(null)
      const color = ref(null)

      const countries = [
        { value: 'us', label: 'United States' },
        { value: 'uk', label: 'United Kingdom' },
        { value: 'ca', label: 'Canada' },
        { value: 'au', label: 'Australia' },
        { value: 'de', label: 'Germany' },
      ]

      const sizes = [
        { value: 's', label: 'Small' },
        { value: 'm', label: 'Medium' },
        { value: 'l', label: 'Large' },
      ]

      const colors = [
        { value: 'red', label: 'Red' },
        { value: 'blue', label: 'Blue' },
        { value: 'green', label: 'Green' },
      ]

      return { country, size, color, countries, sizes, colors }
    },
    template: `
      <DsStack direction="column" gap="1.5">
        <FieldSelect
          v-model="country"
          label="Country"
          :options="countries"
          placeholder="Select a country"
          searchable
        />

        <FieldSelect
          v-model="size"
          label="Size"
          :options="sizes"
          placeholder="Select a size"
          :searchable="false"
        />

        <FieldSelect
          v-model="color"
          label="Color"
          :options="colors"
          placeholder="Select a color"
        />

        <div style="margin-top: 1rem; padding: 1rem; background: #f3f4f6; border-radius: 8px;">
          <p style="margin: 0; font-size: 0.875rem; font-weight: 600; margin-bottom: 0.5rem;">Current Selections:</p>
          <ul style="margin: 0; padding-left: 1.25rem; font-size: 0.875rem; font-family: monospace;">
            <li>Country: {{ country || '(none)' }}</li>
            <li>Size: {{ size || '(none)' }}</li>
            <li>Color: {{ color || '(none)' }}</li>
          </ul>
        </div>
      </DsStack>
    `,
  }),
}
