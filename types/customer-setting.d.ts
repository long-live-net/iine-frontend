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
  | 'feature'
  | 'contact'
  | 'access'
  | 'menu'
  | 'menu-image'

export type PageLayout = {
  kind: SectionKind
  title: string
  menuTitle?: string | null
}

/**
 * SNS Links
 */
export type NetworkServiceNames =
  | 'facebook'
  | 'instagram'
  | 'twitter'
  | 'youtube'
export type NetworkServiceLink = {
  serviceName: NetworkServiceNames
  url: string
}
export type SnsLinkForm = {
  facebook: string | null
  instagram: string | null
  twitter: string | null
  youtube: string | null
}

/**
 * SEO Tags
 */
export type SeoTagKeyNames = 'title' | 'description' | 'ogImage'
export type SeoTag = {
  keyName: SeoTagKeyNames
  content: string
}
export type SeoTagForm = {
  title: string | null
  description: string | null
  ogImage: string | null
}

/**
 * Favicon
 */
export type Favicon = {
  faviconIco: string | null
  icoSvg: string | null
  appleTouchIconPng: string | null
}

/**
 * Customer Setting
 */
export type CustomerSetting = {
  id: string
  customerId: string
  availContentsKind: string[]
  newsCategories: string[]
  pageTitle: PageTitle
  fontFamily: string | null
  textColor: string | null
  colorTheme: ColorTheme
  designTheme: DesignTheme
  homeLayout: PageLayout[]
  snsLinks: NetworkServiceLink[] | null
  accessSource: string | null
  seoTags: SeoTag[] | null
  favicon: Favicon
  reservationUrl: string | null
}
