/**
 * Content Data Types
 */
// export type ContentKind =
//   | 'information'
//   | 'news'
//   | 'service'
//   | 'works'
//   | 'contact'
//   | 'about'
//   | 'menu'
//   | 'reason'

export type SectionType = 'type1' | 'type2'
export type SectionKind = 'information' | 'news' | 'service' | 'contact'

export type PageSection = {
  baseId: string
  id: number
  type: SectionType
  kind: SectionKind
  title: string
  order?: number
  menuTitle?: string
}

export type BasePageSection = Omit<PageSection, 'id'>
export type PageSectionEdit = BasePageSection & {
  id?: number
}
