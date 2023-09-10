/**
 * Content Data Types
 */
export type ContentKind =
  | 'infomation'
  | 'news'
  | 'service'
  | 'works'
  | 'contact'
  | 'about'
  | 'menu'
  | 'reason'

export type PageSection = {
  type: string
  kind: ContentKind
  order: number
  title?: string
  menuTitle?: string
}
