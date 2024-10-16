export type ColorTheme = 'light' | 'dark'
export type DesignTheme = 'type1' | 'type2'

export type PageTitle = {
  title: string
  iconUrl?: string | null
}

export type SectionKind =
  | 'top'
  | 'information'
  | 'news'
  | 'service'
  | 'contact'
  | 'access'
  | 'menu'
  | 'menu-image'

export type PageLayout = {
  kind: SectionKind
  title: string
  menuTitle?: string | null
}

export type NetworkServiceNames =
  | 'facebook'
  | 'instagram'
  | 'twitter'
  | 'youtube'
export type NetworkServiceLink = {
  serviceName: NetworkServiceNames
  url: string
}
/**
 * Customer Setting
 */
export type CustomerSetting = {
  id: number
  customerId: number
  availContentsKind: string[]
  pageTitle: PageTitle
  colorTheme: ColorTheme
  designTheme: DesignTheme
  homeLayout: PageLayout[]
  snsLinks: NetworkServiceLink[] | null
  accessSource: string | null
}

/**
 * Customer Setting Form
 */
export type SnsLinksForm = {
  facebook: string | null
  instagram: string | null
  twitter: string | null
  youtube: string | null
}
