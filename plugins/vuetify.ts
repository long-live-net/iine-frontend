import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

export default defineNuxtPlugin((nuxtApp) => {
  const myThemeLightColors = {
    primary: '#1976D2',
    secondary: '#E0E0E0',
    accent: '#FFAB40',
    error: '#F44336',
    info: '#00ACC1',
    success: '#4CAF50',
    warning: '#FFFF00',
  }

  const vuetify = createVuetify({
    ssr: true,
    components,
    directives,
    theme: {
      themes: {
        light: {
          colors: myThemeLightColors,
        },
      },
    },
  })
  nuxtApp.vueApp.use(vuetify)
})
