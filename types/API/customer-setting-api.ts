import type {
  ColorTheme,
  DesignTheme,
  PageTitle,
  PageLayout,
  NetworkServiceLink,
} from '@/types/customer-setting'

export type CustomerSettingApi = {
  id: number
  customerId: number
  availContentsKind: string[]
  pageTitle: PageTitle
  colorTheme: ColorTheme
  designTheme: DesignTheme
  homeLayout?: PageLayout[]
  snsLinks?: NetworkServiceLink[] | null
  accessSource?: string | null
}
