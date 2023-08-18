import type { ImageData } from '@/types/image-settings'

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
