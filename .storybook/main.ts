import type { StorybookConfig } from '@storybook/vue3-vite'
import { mergeConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'

const config: StorybookConfig = {
  stories: [
    '../app/components/ds/**/*.stories.ts',
  ],

  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-a11y',
    '@storybook/addon-interactions',
  ],

  framework: {
    name: '@storybook/vue3-vite',
    options: {},
  },

  docs: {
    autodocs: 'tag',
  },

  async viteFinal(config) {
    return mergeConfig(config, {
      resolve: {
        alias: {
          '~': path.resolve(__dirname, '../'),
          '@': path.resolve(__dirname, '../'),
        },
      },

      css: {
        modules: {
          localsConvention: 'camelCaseOnly', // Match Nuxt config
        },
      },

      plugins: [
        // Must be first to handle .vue files before other plugins process them
        vue(),

        // Auto-import DS components (enables FieldText to use FieldWrapper)
        Components({
          dirs: [
            path.resolve(__dirname, '../app/components/ds'),
            path.resolve(__dirname, '../app/components/ds/field'),
          ],
          extensions: ['vue'],
          dts: path.resolve(__dirname, './components.d.ts'),
        }),

        // Auto-import composables (enables FieldSelect to use useDropdown)
        AutoImport({
          imports: [
            'vue',
            {
              '~/app/composables/useDropdown': ['useDropdown'],
              '~/app/composables/useClickOutside': ['useClickOutside'],
            },
          ],
          dts: path.resolve(__dirname, './auto-imports.d.ts'),
        }),
      ],
    })
  },
}

export default config
