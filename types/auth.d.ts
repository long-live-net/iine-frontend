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
export type LoginFrom = {
  username: string
  password: string
}

/**
 * Change Password Form
 */
export type ChangePasswordFrom = {
  password: string
  passwordConfirm: string
}

/**
 * Login User 情報
 */
export type LoginUser = {
  id: number
  customerId: number
  email: string
  name: string
  note?: string
}
