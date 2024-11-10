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

/**
 * use can Handling Touche Event
 */
export const useDetectTouchDevice = () => {
  const isTouchDevice = ref(false)
  onMounted(() => {
    if (import.meta.client) {
      if ('ontouchstart' in window || navigator.maxTouchPoints) {
        isTouchDevice.value = true
      }
    }
  })

  return { isTouchDevice }
}

/**
 * Window Media Query
 */
export const useMediaQueryIsSmall = () => {
  const isSmall = ref(false)
  const isJudged = ref(false)
  const mediaQuery = ref<MediaQueryList | null>(null)
  const mediaQueryListner = (ev: MediaQueryListEvent) => {
    isSmall.value = false
    if (ev.matches) {
      isSmall.value = true
    }
  }

  onMounted(() => {
    if (import.meta.client) {
      mediaQuery.value = matchMedia('(max-width: 768px)')
      if (mediaQuery.value.matches) {
        isSmall.value = true
      }
      mediaQuery.value.addEventListener('change', mediaQueryListner)
      isJudged.value = true
    }
  })

  onBeforeUnmount(() => {
    if (mediaQuery.value && import.meta.client) {
      mediaQuery.value.removeEventListener('change', mediaQueryListner)
    }
  })

  return {
    isSmall,
    isJudged,
  }
}
