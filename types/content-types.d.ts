import { newsCategory2Label } from '@/composables/use-news-category'
import type { ImageData } from '@/types/image-settings'

/**
 * Content Data Types
 */
export interface ContentType {
  id: number
  customerId?: number
  title: string
  subtitle?: string
  body?: string
  image?: ImageData
  tags?: string[]
}

export type ContentKind =
  | 'infomation'
  | 'news'
  | 'services'
  | 'works'
  | 'contact'
  | 'about'
  | 'menu'
  | 'reason'

/**
 * Information
 */
export interface InformationType extends ContentType {}

/**
 * News
 */
export type NewsCategory2LabelType = keyof typeof newsCategory2Label

export interface NewsType extends ContentType {
  body: string
  category: NewsCategory2LabelType
  publishOn: Date
}

/**
 * Service
 */
export interface ServiceType extends ContentType {
  body: string
  image: ImageData
  position: number
}

/**
 * Work
 */
export interface WorkType extends ContentType {
  category?: string
}

export interface AboutType extends ContentType {}

export interface ReasonType extends ContentType {}

/**
 * Contact
 */
export interface ContactType extends ContentType {}

/**
 * Eyecatcher
 */
export interface EyecatchType extends ContentType {
  image: ImageData
}

/**
 * ContentListOption
 */
export interface ContentPosition {
  id: number
  position: number
}

export type PositionObj = { [key: number]: number }
