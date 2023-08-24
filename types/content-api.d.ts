import type { ImageData } from '@/types/content'
import type { NewsCategory2Label } from '@/composables/use-news-category'

/**
 * GET API で取得するデータ型
 */
export interface ContentGetApi {
  _id: string
  id: number
  customerId: number
  title: string
  subtitle?: string
  body?: string
  image?: ImageData
}

export interface EyecatchGetApi extends ContentGetApi {
  subtitle: string
  image: ImageData
}
export interface InformationGetApi extends ContentGetApi {
  body: string
}
export interface ServiceGetApi extends ContentGetApi {
  caption: string
  image: ImageData
  position: number
}
export interface NewsGetApi extends ContentGetApi {
  body: string
  category: NewsCategory2Label
  publishOn: Date
}
export interface ContactGetApi extends ContentGetApi {
  body: string
}

/**
 * POST, PUT API で保存するデータ型
 */
export type ContentSaveApi = {
  customerId: number
  title: string
  subtitle?: string
  body?: string
  image?: ImageData
  imageFile?: File | null
}

export interface EyecatchSaveApi extends ContentSaveApi {
  subtitle: string
  imageFile: File | null
}
export interface InformationSaveApi extends ContentSaveApi {
  body: string
}
export interface ServiceSaveApi extends ContentSaveApi {
  caption: string
  imageFile: File | null
  position: number
}
export interface NewsSaveApi extends ContentSaveApi {
  body: string
  category: NewsCategory2Label
  publishOn: Date
}
export interface ContactSaveApi extends ContentSaveApi {
  body: string
}

/**
 * リストデータ取得時のクエリパラメータ
 */
export type ListFilter = { [key: string]: string | number | boolean }
export type ListSort = { [key: string]: 1 | -1 }
export type ListPager = { page: number; limit: number }

/**
 * リストデータ取得時のレスポンスデータ
 */
export type ContentListResponse<T> = { list: T[]; total: number }
