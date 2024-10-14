import type { CustomerUser } from '~/types/customer-user'

/**
 * User Login  Api Request Credential
 */
export type LoginApiCredential = {
  customerId: number
  username: string
  password: string
}

/**
 * ログインエラー情報
 */
export type LoginApiError = {
  status: number
  message: string
}

/**
 * Login Form
 */
export type LoginForm = {
  username: string
  password: string
}

/**
 * Login User 情報
 */
export type LoginUser = CustomerUser
