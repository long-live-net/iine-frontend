/**
 * CustomerUser 情報
 */
export type CustomerUser = {
  id: string
  customerId: string
  customerName?: string
  email: string
  name: string
  note?: string | null
}

/**
 * Customer User Form
 */
export type CustomerUserForm = {
  email: string
  name: string
  note?: string | null
}

/**
 * Change Password Form
 */
export type ChangePasswordFrom = {
  password: string
  passwordConfirm: string
}
