import type { NuxtError } from '#app'

const newError = (
  error: Error | null,
  defaultStatusMessage: string,
  defaultMessage: string
) => {
  const nerr = error as NuxtError | undefined | null
  if (nerr?.statusCode && nerr?.message) {
    const errorParams = {
      statusCode: nerr.statusCode,
      statusMessage: nerr.statusMessage ?? defaultStatusMessage,
      message: nerr.message,
    }
    if (nerr.statusCode >= 500) {
      Object.assign(errorParams, { fatal: true })
    }
    return createError(errorParams)
  }
  return createError({
    statusCode: 500,
    statusMessage: defaultStatusMessage,
    message: error?.toString() ?? defaultMessage,
    fatal: true,
  })
}

export const createApplicationError = (error?: Error | null) => {
  const nerr = error as NuxtError | null
  const statusMessage = 'Application Error'
  const message = 'アプリケーションエラーが発生しました'
  return newError(nerr, statusMessage, message)
}

export const createApiError = (error?: Error | null) => {
  const nerr = error as NuxtError | null
  const statusMessage = 'API Error'
  const message = 'API通信エラーが発生しました'
  return newError(nerr, statusMessage, message)
}
