import type {
  ImageData,
  MenuImageData,
  ContentPreNextId,
  ContentPosition,
} from '@/types/content'
import type { NewsCategory2Label } from '@/types/news-category'

/**
 * GET API で取得するデータ型
 */
export interface ContentGetApi {
  _id?: string
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
export interface MenuImageGetApi extends ContentGetApi {
  caption: string
  image: ImageData
  position: number
  menuImage: MenuImageData
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
}

export interface EyecatchSaveApi extends ContentSaveApi {
  image: ImageData
  subtitle: string
}
export interface InformationSaveApi extends ContentSaveApi {
  body: string
}
export interface ServiceSaveApi extends ContentSaveApi {
  image: ImageData
  caption: string
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
export interface MenuImageSaveApi extends ContentSaveApi {
  caption: string
  image: ImageData
  position: number
  menuImage: MenuImageData
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

/*
 * Pre Next ID 取得時のレスポンスデータ
 */
export type ContentPreNextIdApi = ContentPreNextId

/**
 * リストポジション更新時で使用するPositionデータ
 */
export type ContentPositionApi = ContentPosition
