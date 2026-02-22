import type { Meta, StoryObj } from '@storybook/vue3'
import DsStack from './DsStack.vue'
import DsButton from '../button/DsButton.vue'
import DsBadge from '../badge/DsBadge.vue'

const meta: Meta<typeof DsStack> = {
  title: 'Design System/Layout/DsStack',
  component: DsStack,
  tags: ['autodocs'],
  argTypes: {
    direction: {
      control: 'select',
      options: ['row', 'column'],
      description: 'Flex direction of the stack',
    },
    gap: {
      control: 'select',
      options: ['0', '0.25', '0.5', '0.75', '1', '1.5', '2', '3'],
      description: 'Gap between items in rem units',
    },
    align: {
      control: 'select',
      options: ['start', 'center', 'end', 'stretch'],
      description: 'Align items (flexbox align-items)',
    },
    justify: {
      control: 'select',
      options: ['start', 'center', 'end', 'between', 'around'],
      description: 'Justify content (flexbox justify-content)',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    direction: 'column',
    gap: '1',
    align: 'stretch',
    justify: 'start',
  },
  render: (args) => ({
    components: { DsStack, DsButton },
    setup() {
      return { args }
    },
    template: `
      <DsStack v-bind="args">
        <DsButton>First Item</DsButton>
        <DsButton variant="secondary">Second Item</DsButton>
        <DsButton variant="outline">Third Item</DsButton>
      </DsStack>
    `,
  }),
}

export const Row: Story = {
  args: {
    direction: 'row',
    gap: '1',
    align: 'center',
    justify: 'start',
  },
  render: (args) => ({
    components: { DsStack, DsButton },
    setup() {
      return { args }
    },
    template: `
      <DsStack v-bind="args">
        <DsButton size="sm">Small</DsButton>
        <DsButton size="md">Medium</DsButton>
        <DsButton size="lg">Large</DsButton>
      </DsStack>
    `,
  }),
}

export const GapVariations: Story = {
  render: () => ({
    components: { DsStack, DsBadge },
    template: `
      <DsStack direction="column" gap="2">
        <div>
          <p style="margin: 0 0 0.5rem 0; font-size: 0.875rem; font-weight: 600;">Gap: 0</p>
          <DsStack direction="row" gap="0">
            <DsBadge label="One" />
            <DsBadge label="Two" />
            <DsBadge label="Three" />
          </DsStack>
        </div>

        <div>
          <p style="margin: 0 0 0.5rem 0; font-size: 0.875rem; font-weight: 600;">Gap: 0.5rem</p>
          <DsStack direction="row" gap="0.5">
            <DsBadge label="One" />
            <DsBadge label="Two" />
            <DsBadge label="Three" />
          </DsStack>
        </div>

        <div>
          <p style="margin: 0 0 0.5rem 0; font-size: 0.875rem; font-weight: 600;">Gap: 1rem (default)</p>
          <DsStack direction="row" gap="1">
            <DsBadge label="One" />
            <DsBadge label="Two" />
            <DsBadge label="Three" />
          </DsStack>
        </div>

        <div>
          <p style="margin: 0 0 0.5rem 0; font-size: 0.875rem; font-weight: 600;">Gap: 2rem</p>
          <DsStack direction="row" gap="2">
            <DsBadge label="One" />
            <DsBadge label="Two" />
            <DsBadge label="Three" />
          </DsStack>
        </div>
      </DsStack>
    `,
  }),
}

export const AlignmentOptions: Story = {
  render: () => ({
    components: { DsStack, DsButton },
    template: `
      <DsStack direction="column" gap="2">
        <div>
          <p style="margin: 0 0 0.5rem 0; font-size: 0.875rem; font-weight: 600;">Align: start</p>
          <div style="border: 1px dashed #ccc; padding: 1rem;">
            <DsStack direction="row" gap="1" align="start">
              <DsButton size="sm">Small</DsButton>
              <DsButton size="md">Medium</DsButton>
              <DsButton size="lg">Large</DsButton>
            </DsStack>
          </div>
        </div>

        <div>
          <p style="margin: 0 0 0.5rem 0; font-size: 0.875rem; font-weight: 600;">Align: center</p>
          <div style="border: 1px dashed #ccc; padding: 1rem;">
            <DsStack direction="row" gap="1" align="center">
              <DsButton size="sm">Small</DsButton>
              <DsButton size="md">Medium</DsButton>
              <DsButton size="lg">Large</DsButton>
            </DsStack>
          </div>
        </div>

        <div>
          <p style="margin: 0 0 0.5rem 0; font-size: 0.875rem; font-weight: 600;">Align: end</p>
          <div style="border: 1px dashed #ccc; padding: 1rem;">
            <DsStack direction="row" gap="1" align="end">
              <DsButton size="sm">Small</DsButton>
              <DsButton size="md">Medium</DsButton>
              <DsButton size="lg">Large</DsButton>
            </DsStack>
          </div>
        </div>
      </DsStack>
    `,
  }),
}
