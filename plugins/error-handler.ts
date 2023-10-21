import type { NuxtError } from '#app'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.config.errorHandler = async (error /* instance, info */) => {
    // ===========
    // Note:
    // nuxtApp.hook('vue:error' ....) で定義すると Unhandled error と
    // なってしまうため注意すること
    // ----------
    // nuxtApp.hook('vue:error', (error, instance, info) => {
    // ===========
    const nerr: NuxtError = error as NuxtError
    const message =
      nerr.statusCode && nerr.message
        ? `${nerr.statusCode}: ${nerr.message}`
        : nerr.toString()

    console.error('message', message)
    if (nerr.statusCode && nerr.message) {
      console.log('statusCode', nerr.statusCode)
      console.log('statusMessage', nerr.statusMessage)
      console.log('message', nerr.message)
    }

    const { addSnackber } = useGlobalSnackbars()
    addSnackber?.(message, 'error')
    await clearError()
  }
})
