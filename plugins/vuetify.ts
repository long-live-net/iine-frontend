import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

export default defineNuxtPlugin((nuxtApp) => {
  const myThemeLightColors = {
    primary: '#006CCC',
    secondary: '#00B4C8',
    accent: '#FABE00',
    error: '#FF5252',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FB8C00',
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
