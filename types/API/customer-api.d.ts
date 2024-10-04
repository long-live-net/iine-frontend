import type {
  ColorTheme,
  LayoutTheme,
  NetworkServiceink,
} from '~/types/customer'

/**
 * Customer Data Types
 */
export interface CustomerApi {
  id: number
  nickName: string
  name: string
  defaultEmail: string
  phone?: string | null
  zip: string
  address: string
  availContentsKind?: string[] | null
  layoutTheme: LayoutTheme
  colorTheme?: ColorTheme | null
  note?: string | null
  links?: NetworkServiceink[] | null
  accessSource?: string | null
}
