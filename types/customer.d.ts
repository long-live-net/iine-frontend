export type ColorTheme = 'light' | 'dark'
export type LayoutTheme = 'type1' | 'type2'

export type NetworkServiceNames =
  | 'facebook'
  | 'instagram'
  | 'twitter'
  | 'youtube'
export type NetworkServiceink = {
  serviceName: NetworkServiceNames
  url: string
}

/**
 * Customer Data Types
 */
export interface Customer {
  id: number
  nickName: string
  name: string
  defaultEmail: string
  phone: string | null
  zip: string
  address: string
  layoutTheme: LayoutTheme
  colorTheme: ColorTheme
  note: string | null
  links: NetworkServiceink[] | null
  accessSource: string | null
}
