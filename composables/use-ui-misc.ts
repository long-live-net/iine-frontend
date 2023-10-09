import BaseSnackbars from '~/components/base/snackbars.vue'

/**
 * Snackbar
 */
export const snackbarInjectionKey = Symbol()
export const useProvideSnackbars = (
  snackbarsRef: Ref<typeof BaseSnackbars>
) => {
  const addSnackber = (message: string, color?: string) => {
    if (snackbarsRef.value) {
      snackbarsRef.value.addSnackbar(message, color)
    }
  }
  provide(snackbarInjectionKey, addSnackber)
}
export const useSnackbars = () => {
  const addSnackber =
    inject<(mesg: string, color?: string) => void>(snackbarInjectionKey)
  return {
    addSnackber,
  }
}
