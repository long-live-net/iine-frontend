/**
 * Customer Data Types
 */
export type CustomerApi = {
  id: number
  nickName: string
  name: string
  defaultEmail: string
  phone?: string | null
  zip: string
  address: string
  note?: string | null
}
