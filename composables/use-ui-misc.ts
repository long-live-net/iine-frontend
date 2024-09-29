import type BaseSnackbars from '~/components/base/snackbars.vue'

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
  snackbarsRef: Ref<InstanceType<typeof BaseSnackbars>>
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
 * この use は inject できない場合 (setup context でない場所等) に使用できます
 * Global な変数を見ていることからあまり使いたくないので、限定的に使用すること
 */
export const useGlobalSnackbars = () => {
  return { addSnackber: globalAddSnackbar.value }
}
