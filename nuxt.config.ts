// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  typescript: {
    strict: true,
    typeCheck: true,
  },

  components: [
    {
      path: '~/app/components/ds',
      extensions: ['.vue'],
      prefix: 'Ds',
      pathPrefix: false,
    },
    {
      path: '~/app/components/ds/field',
      extensions: ['.vue'],
      pathPrefix: false,
    },
    {
      path: '~/app/components/palette',
      extensions: ['.vue'],
      pathPrefix: false,
    },
    {
      path: '~/app/components/token-forge',
      extensions: ['.vue'],
      pathPrefix: false,
    },
    {
      path: '~/app/components/shared',
      extensions: ['.vue'],
      pathPrefix: false,
    },
  ],

  imports: {
    dirs: ['app/composables/**'],
  },

  css: [
    '~/app/assets/styles/tokens/index.css',  // Load tokens FIRST
    '~/app/assets/styles/global.css',        // Then global styles
  ],

  vite: {
    css: {
      modules: {
        localsConvention: 'camelCaseOnly',
      },
    },
  },

  experimental: {
    typedPages: true,
  },

  dir: {
    pages: 'app/pages',
    layouts: 'app/layouts',
  },
})
