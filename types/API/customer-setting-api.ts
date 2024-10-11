import type {
  ColorTheme,
  DesignTheme,
  SectionKind,
  NetworkServiceink,
} from '@/types/customer-setting'

export type CustomerSettingApi = {
  id: number
  customerId: number
  availContentsKind: string[]
  pageTitle?: {
    title: string
    iconUrl?: string | null
  }
  colorTheme: ColorTheme
  designTheme: DesignTheme
  homeLayout?: {
    kind: SectionKind
    title: string
    menuTitle?: string | null
  }[]
  snsLinks?: NetworkServiceink[] | null
  accessSource?: string | null
}

export type PageSectionApi = {
  baseId: string
  id: number
  customerId: number
  kind: SectionKind
  title: string
  position?: number
  menuTitle?: string
}
