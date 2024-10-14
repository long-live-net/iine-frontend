/**
 * Customer Data Types
 */
export type Customer = {
  id: number
  name: string
  nickName: string
  defaultEmail: string
  phone: string | null
  zip: string
  address: string
  note: string | null
}

/**
 * Customer Form
 */
export type CustomerForm = {
  name: string
  defaultEmail: string
  phone: string | null
  address: string
  note: string | null
}
