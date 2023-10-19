/**
 * Page Layout Settings
 */
export type SectionKind = 'information' | 'news' | 'service' | 'contact'
export type PageSection = {
  baseId: string
  id: number
  customerId: number
  kind: SectionKind
  title: string
  position?: number
  menuTitle?: string
}

export type BasePageSection = Omit<PageSection, 'id', 'customerId'>
export type PageSectionEdit = Omit<PageSection, 'id'> & {
  id?: number
}