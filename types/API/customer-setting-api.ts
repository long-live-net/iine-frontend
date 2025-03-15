import type {
  ColorTheme,
  DesignTheme,
  PageTitle,
  PageLayout,
  NetworkServiceLink,
  SeoTag,
  Favicon,
} from '@/types/customer-setting'

export type CustomerSettingApi = {
  id: string
  customerId: string
  availContentsKind: string[]
  newsCategories: string[]
  pageTitle: PageTitle
  fontFamily?: string | null
  textColor?: string | null
  colorTheme: ColorTheme
  designTheme: DesignTheme
  homeLayout?: PageLayout[]
  snsLinks?: NetworkServiceLink[] | null
  accessSource?: string | null
  seoTags?: SeoTag[] | null
  favicon?: Favicon | null
  reservationUrl?: string | null
}
