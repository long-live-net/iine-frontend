// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  css: ['~/assets/css/main.scss'],

  app: {
    head: {
      title: 'iine-t',
      htmlAttrs: {
        lang: 'en',
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { hid: 'description', name: 'description', content: '' },
        { name: 'format-detection', content: 'telephone=no' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        {
          rel: 'preconnect',
          href: 'https://fonts.googleapis.com',
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Noto+Sans+JP&family=Noto+Serif+JP&family=M+PLUS+Rounded+1c&display=swap',
          crossorigin: '',
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Zen+Kaku+Gothic+New&family=Zen+Maru+Gothic&family=Zen+Old+Mincho&display=swap',
          crossorigin: '',
        },
      ],
    },
  },

  devtools: { enabled: true },

  vite: {
    ssr: {
      noExternal: ['vuetify'],
    },
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
          additionalData: '@use "@/assets/css/_variables.scss" as *;',
        },
      },
    },
  },

  modules: ['@pinia/nuxt', '@pinia-plugin-persistedstate/nuxt'],
  compatibilityDate: '2024-07-07',
})
