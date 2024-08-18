import type { NewsCategory2Label } from '@/types/news-category'

/**
 * Image Data Types
 */
export interface ImageSettings {
  lgSize: string | 'cover'
  smSize: string | 'cover'
  lgPosition: string | 'center'
  smPosition: string | 'center'
  lgParallax: 'fixed' | 'scroll'
  smParallax: 'fixed' | 'scroll'
}

export interface ImageData {
  url: string
  settings: ImageSettings
}

export interface ContentType {
  id: number
  customerId?: number
  title: string
  subtitle?: string
  body?: string
  image?: ImageData
  tags?: string[]
}

export interface InformationType extends ContentType {
  body: string
}
export interface NewsType extends ContentType {
  body: string
  category: NewsCategory2Label
  publishOn: Date
}
export interface ServiceType extends ContentType {
  caption: string
  image: ImageData
  position: number
}
export interface WorkType extends ContentType {
  category?: string
}
export interface AboutType extends ContentType {}
export interface ReasonType extends ContentType {}
export interface ContactType extends ContentType {
  body: string
}
export interface EyecatchType extends ContentType {
  image: ImageData
}

/**
 * Content Form Data Types
 */
export interface ContentForm {
  id?: number
  title: string
  subtitle?: string
  body?: string
  image?: string
  imageFile?: File | null
}
export interface EyecatchForm extends ContentForm {
  subtitle: string
  image: string
  imageFile: File | null
}
export interface InformationForm extends ContentForm {
  body: string
}
export interface NewsForm extends ContentForm {
  body: string
  category: NewsCategory2Label | null
  publishOn: Date | null
}
export interface ServiceForm extends ContentForm {
  caption: string
  image: string
  imageFile: File | null
  position: number
}
export interface ContactForm extends ContentForm {
  body: string
}

/*
 * Pre Next ID 取得時のレスポンスデータ
 */
export interface ContentPreNextId {
  preId: number | null
  nextId: number | null
}

/**
 * トップ画面表示位置 (position)
 */
export interface ContentPosition {
  id: number
  position: number
}

export type PositionObj = { [key: number]: number }
