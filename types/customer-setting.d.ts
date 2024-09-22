/**
 * Page Layout Settings
 */
export type SectionKind =
  | 'top'
  | 'information'
  | 'news'
  | 'service'
  | 'contact'
  | 'access'
  | 'menu'
  | 'menu-image'
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
