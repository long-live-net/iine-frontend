import type { SectionKind } from '@/types/customer-setting'

export type PageSectionApi = {
  baseId: string
  id: number
  customerId: number
  kind: SectionKind
  title: string
  position?: number
  menuTitle?: string
}
