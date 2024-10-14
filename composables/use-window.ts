import { debounce } from 'es-toolkit/compat'

/**
 * Use Window handling
 */
export const useWindowState = () => {
  const windowHeight = ref(2048)
  const scrollY = ref(0)

  if (import.meta.client) {
    const getWindowHeight = debounce(() => {
      windowHeight.value = window.innerHeight
    }, 200)

    const getScrollY = debounce(() => {
      scrollY.value = window.scrollY
    }, 20)

    onMounted(() => {
      getWindowHeight()
      getScrollY()

      window.addEventListener('load', getWindowHeight)
      window.addEventListener('resize', getWindowHeight)
      window.addEventListener('scroll', getScrollY)
    })
  }

  return {
    windowHeight,
    scrollY,
  }
}

/**
 * use isIOS
 */
const isIOS: Ref<boolean | null> = ref(null)
export const useDetectIOS = () => {
  onMounted(() => {
    if (import.meta.client) {
      if (isIOS.value === null) {
        isIOS.value = /iPad|iPhone|iPod/.test(navigator.userAgent)
      }
    }
  })

  return { isIOS }
}
