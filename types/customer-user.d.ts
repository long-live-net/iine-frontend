/**
 * CustomerUser 情報
 */
export type CustomerUser = {
  id: number
  customerId: number
  customerName?: string
  email: string
  name: string
  note?: string
}

/**
 * Customer User Form
 */
export type CustomerUserForm = {
  email: string
  name: string
  note?: string
}
