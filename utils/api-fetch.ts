export const backendBaseUrl = import.meta.env.VITE_BACKEND_BASEURL ?? ''

export interface ApiError extends Error {
  statusCode?: number | string | null
  data?: {
    message?: string
  }
}
