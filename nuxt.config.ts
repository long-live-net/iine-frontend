// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  vite: {
    ssr: {
      noExternal: ['vuetify'],
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "@/assets/css/variables.scss" as *;',
        },
      },
    },
  },
  modules: ['@pinia/nuxt', '@pinia-plugin-persistedstate/nuxt'],
  css: [
    '~/assets/css/main.scss',
    'vuetify/styles',
    '@mdi/font/css/materialdesignicons.css',
  ],
})
