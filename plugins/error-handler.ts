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
    const nuxtError: NuxtError = error as NuxtError
    const uiErrData: {
      message: string
      color: string
      status: number
      redirect: string | null
    } = {
      message: nuxtError.toString(),
      color: 'error',
      status: 400,
      redirect: null,
    }
    if (nuxtError.statusCode && nuxtError.message) {
      uiErrData.status = nuxtError.statusCode
      uiErrData.message = `${nuxtError.statusCode}: ${nuxtError.message}`
      if (nuxtError.statusCode === 401 || nuxtError.statusCode === 403) {
        uiErrData.message = '管理者ユーザの再認証が必要です。'
        uiErrData.color = 'warning'
        uiErrData.redirect = '/customer/login?reauthorization=true'
        useAuth().logout()
      }
    }
    console.error('### status ####', uiErrData.status)
    console.error('### message ###', uiErrData.message)

    useGlobalSnackbars().addSnackber?.(uiErrData.message, uiErrData.color)
    const options = uiErrData.redirect?.length
      ? { redirect: uiErrData.redirect }
      : {}
    await clearError(options)
  }
})
