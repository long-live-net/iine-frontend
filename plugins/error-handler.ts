import type { NuxtError } from '#app'

export default defineNuxtPlugin((nuxtApp) => {
  const handleNuxtError = async (nuxtError: NuxtError) => {
    console.error('--- nuxtError.statusCode ---', nuxtError.statusCode)
    console.error('--- nuxtError.statusMessage ---', nuxtError.statusMessage)
    console.error('--- nuxtError.message ---', nuxtError.message)

    const { addSnackber } = useGlobalSnackbars()
    if (nuxtError.statusCode === 401 || nuxtError.statusCode === 403) {
      addSnackber?.('管理者ユーザの再認証が必要です。', 'warning')
      useAuth().logout()
      await clearError({ redirect: '/customer/login?reauthorization=true' })
    } else if (nuxtError.statusCode < 500) {
      addSnackber?.(`${nuxtError.statusCode}: ${nuxtError.message}`, 'error')
      await clearError()
    } else {
      showError({
        statusCode: nuxtError.statusCode,
        statusMessage: nuxtError.statusMessage ?? 'Application Error',
        message: nuxtError.message,
      })
    }
  }
  const handleError = async (error: any) => {
    if ('statusCode' in error && 'message' in error) {
      handleNuxtError(error)
    } else {
      showError({
        statusCode: 500,
        statusMessage: 'Application Error',
        message:
          error?.message ?? error?.toString() ?? '不明なエラーが発生しました',
      })
    }
  }

  /**
   * Note: === nuxt3ノウハウメモ ===
   * nuxtApp.hook('vue:error' ....) で定義すると
   * Unhandled error となってしまうため注意すること
   *
  nuxtApp.hook('vue:error', (error) => {
    console.error('--- errorHandler ---', error)
    handleError(error)
  })
  */

  nuxtApp.vueApp.config.errorHandler = async (error /* instance, info */) => {
    console.error('--- errorHandler ---', error)
    handleError(error)
  }

  /**
   * Note: === nuxt3ノウハウメモ ===
   * nuxtApp.vueApp.config.errorHandler で定義すると
   * unhandledrejection 含め全てのエラーを取得できるようなので
   * 以下のような window を listen しなくともよくなる模様
   *
  if (process.client) {
    window.addEventListener('error', (event) => {
      console.error('--- window error ---', event.error)
      handleError(event.error)
    })
    window.addEventListener('unhandledrejection', (event) => {
      console.error('--- window unhandledrejection ---', event.reason)
      handleError(event.reason)
    })
  }
  */
})
