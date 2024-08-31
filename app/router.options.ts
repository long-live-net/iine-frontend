import type { RouterOptions } from '@nuxt/schema'

export default <RouterOptions>{
  scrollBehavior(to, from, savedPosition) {
    let position: {
      top?: number
      left?: number
      behavior?: 'auto' | 'instant' | 'smooth'
      el?: string | Element
    } = { top: 0, left: 0 }

    if (savedPosition) {
      position = savedPosition
    } else if (to.hash) {
      if (to.path === from.path) {
        position = { el: to.hash, behavior: 'smooth' }
      } else {
        position = { el: to.hash }
      }
    } else {
      position = { top: 0 }
    }
    if (to.path === from.path) {
      return position
    } else {
      return new Promise((resolve) => {
        useNuxtApp().hook('page:finish', () => {
          resolve(position)
        })
      })
    }
  },
}
