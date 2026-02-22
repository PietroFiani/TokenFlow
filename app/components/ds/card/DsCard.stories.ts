import type { Meta, StoryObj } from '@storybook/vue3'
import DsCard from './DsCard.vue'
import DsButton from '../button/DsButton.vue'
import DsStack from '../stack/DsStack.vue'

const meta: Meta<typeof DsCard> = {
  title: 'Design System/Layout/DsCard',
  component: DsCard,
  tags: ['autodocs'],
  argTypes: {
    padding: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg'],
      description: 'Padding size of the card',
    },
    shadow: {
      control: 'boolean',
      description: 'Whether to show box shadow',
    },
    title: {
      control: 'text',
      description: 'Optional title displayed at the top of the card',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    padding: 'md',
    shadow: true,
  },
  render: (args) => ({
    components: { DsCard },
    setup() {
      return { args }
    },
    template: `
      <DsCard v-bind="args">
        <p style="margin: 0;">This is the default card with medium padding and a shadow.</p>
      </DsCard>
    `,
  }),
}

export const WithTitle: Story = {
  args: {
    title: 'Card Title',
    padding: 'md',
    shadow: true,
  },
  render: (args) => ({
    components: { DsCard },
    setup() {
      return { args }
    },
    template: `
      <DsCard v-bind="args">
        <p style="margin: 0;">This card has a title displayed at the top.</p>
      </DsCard>
    `,
  }),
}

export const WithoutShadow: Story = {
  args: {
    padding: 'md',
    shadow: false,
  },
  render: (args) => ({
    components: { DsCard },
    setup() {
      return { args }
    },
    template: `
      <DsCard v-bind="args">
        <p style="margin: 0;">This card has no shadow, creating a flatter appearance.</p>
      </DsCard>
    `,
  }),
}

export const PaddingVariants: Story = {
  render: () => ({
    components: { DsCard, DsStack },
    template: `
      <DsStack direction="column" gap="2">
        <div>
          <p style="margin: 0 0 0.5rem 0; font-size: 0.875rem; font-weight: 600;">No Padding</p>
          <DsCard padding="none">
            <div style="background: #f3f4f6; padding: 1rem;">
              Content with no card padding
            </div>
          </DsCard>
        </div>

        <div>
          <p style="margin: 0 0 0.5rem 0; font-size: 0.875rem; font-weight: 600;">Small Padding</p>
          <DsCard padding="sm">
            <p style="margin: 0;">Small padding card</p>
          </DsCard>
        </div>

        <div>
          <p style="margin: 0 0 0.5rem 0; font-size: 0.875rem; font-weight: 600;">Medium Padding (Default)</p>
          <DsCard padding="md">
            <p style="margin: 0;">Medium padding card</p>
          </DsCard>
        </div>

        <div>
          <p style="margin: 0 0 0.5rem 0; font-size: 0.875rem; font-weight: 600;">Large Padding</p>
          <DsCard padding="lg">
            <p style="margin: 0;">Large padding card</p>
          </DsCard>
        </div>
      </DsStack>
    `,
  }),
}

export const WithComplexContent: Story = {
  render: () => ({
    components: { DsCard, DsButton, DsStack },
    template: `
      <DsCard title="User Settings" padding="lg">
        <DsStack direction="column" gap="1.5">
          <div>
            <h3 style="margin: 0 0 0.5rem 0; font-size: 1.125rem; font-weight: 600;">Profile Information</h3>
            <p style="margin: 0; color: #6b7280;">Update your account settings and preferences.</p>
          </div>

          <div style="border-top: 1px solid #e5e7eb; padding-top: 1rem;">
            <DsStack direction="column" gap="1">
              <div>
                <label style="display: block; margin-bottom: 0.25rem; font-size: 0.875rem; font-weight: 500;">Email</label>
                <p style="margin: 0; font-size: 0.875rem; color: #6b7280;">user@example.com</p>
              </div>
              <div>
                <label style="display: block; margin-bottom: 0.25rem; font-size: 0.875rem; font-weight: 500;">Role</label>
                <p style="margin: 0; font-size: 0.875rem; color: #6b7280;">Administrator</p>
              </div>
            </DsStack>
          </div>

          <div style="border-top: 1px solid #e5e7eb; padding-top: 1rem;">
            <DsStack direction="row" gap="1">
              <DsButton>Save Changes</DsButton>
              <DsButton variant="secondary">Cancel</DsButton>
            </DsStack>
          </div>
        </DsStack>
      </DsCard>
    `,
  }),
}
