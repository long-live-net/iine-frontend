export type ColorTheme = 'light' | 'dark'
export type DesignTheme = 'type1' | 'type2'

export type SectionKind =
  | 'top'
  | 'information'
  | 'news'
  | 'service'
  | 'contact'
  | 'access'
  | 'menu'
  | 'menu-image'

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
 * Customer Setting
 */
export type CustomerSetting = {
  id: number
  customerId: number
  availContentsKind: string[]
  pageTitle: {
    title: string
    iconUrl?: string | null
  }
  colorTheme: ColorTheme
  designTheme: DesignTheme
  homeLayout: {
    kind: SectionKind
    title: string
    menuTitle?: string | null
  }[]
  snsLinks: NetworkServiceink[] | null
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

/**
 * Page Layout Settings
 */
export type PageSection = {
  baseId: string
  id: number
  customerId: number
  kind: SectionKind
  title: string
  position?: number
  menuTitle?: string
}

export type PageSectionEdit = Omit<PageSection, 'id'> & {
  id?: number | null
}
