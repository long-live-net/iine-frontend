import { createConfigForNuxt } from '@nuxt/eslint-config/flat'

export default createConfigForNuxt({
  // options here
}).override('nuxt/vue/rules', {
  rules: {
    'vue/html-self-closing': 'off',
  },
})
