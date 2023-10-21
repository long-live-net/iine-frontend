import BaseSnackbars from '~/components/base/snackbars.vue'

/**
 * Snackbar
 */
type AddSnackbarFunc = (message: string, color?: string) => void
const globalAddSnackbar = ref<AddSnackbarFunc | null>(null)
const snackbarInjectionKey = Symbol()
/**
 * useProvideSnackbars - Snackbarコンポーネントの登録と共有化
 * @param snackbarsRef
 */
export const useProvideSnackbars = (
  snackbarsRef: Ref<typeof BaseSnackbars>
) => {
  const addSnackber: AddSnackbarFunc = (message: string, color?: string) => {
    if (snackbarsRef.value) {
      snackbarsRef.value.addSnackbar(message, color)
    }
  }
  provide(snackbarInjectionKey, addSnackber)
  globalAddSnackbar.value = addSnackber
}
/**
 * useSnackbars - 共有化されたSnackbarコンポーネントを利用
 */
export const useSnackbars = () => {
  const addSnackber = inject<AddSnackbarFunc>(snackbarInjectionKey)
  return { addSnackber }
}
/**
 * useGlobalSnackbars
 * この use は setup context でない場所で inject が使用できない場合に使用できます
 */
export const useGlobalSnackbars = () => {
  return { addSnackber: globalAddSnackbar.value }
}
