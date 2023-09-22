export type ColorTheme = 'light' | 'dark'
export type LayoutTheme = 'type1' | 'type2'

/**
 * Customer Data Types
 */
export interface Customer {
  id: number
  name: string
  layoutTheme: LayoutTheme
  colorTheme?: ColorTheme
  note?: string
}
