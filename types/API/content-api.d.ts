import type {
  TitleSettings,
  EyecatchTitleSettings,
  ImageData,
  ImageSettings,
  MenuImageData,
  ContentPreNextId,
  ContentPosition,
} from '@/types/content'

/**
 * GET API で取得するデータ型
 */
export interface ContentGetApi {
  _id?: string
  id: string
  customerId: string
  title: string
  subtitle?: string
  titleSettings?: TitleSettings
  body?: string
  image?: ImageData
  imageSettings?: ImageSettings
}

export interface EyecatchGetApi extends ContentGetApi {
  titleSettings?: EyecatchTitleSettings
  image: ImageData
  imageSettings: ImageSettings
}
export interface InformationGetApi extends ContentGetApi {
  body: string
}
export interface ProfileGetApi extends ContentGetApi {
  captionBody: string
}
export interface ServiceGetApi extends ContentGetApi {
  caption: string
  image: ImageData
  imageSettings: ImageSettings
  position: number
}
export interface FeatureGetApi extends ContentGetApi {
  caption: string
  image: ImageData
  imageSettings: ImageSettings
  position: number
}
export interface NewsGetApi extends ContentGetApi {
  category: string
  publishOn: Date
}
export interface ContactGetApi extends ContentGetApi {
  body: string
}
export interface MenuGetApi extends ContentGetApi {
  caption: string
  image: ImageData
  imageSettings: ImageSettings
  position: number
}

export interface MenuCategoryGetApi {
  _id?: string
  id: string
  customerId: string
  menuId: string
  category: string
  position: number
}

export interface MenuDetailGetApi extends ContentGetApi {
  menuId: string
  categoryId: string
  isHilight?: boolean
  price?: string
  caption?: string
  position: number
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
  customerId: string
  title: string
  subtitle?: string
  titleSettings: TitleSettings
  body?: string
  image?: ImageData
  imageSettings?: ImageSettings
}

export interface EyecatchSaveApi extends ContentSaveApi {
  titleSettings: EyecatchTitleSettings
  image: ImageData
  imageSettings: ImageSettings
}
export interface InformationSaveApi extends ContentSaveApi {
  body: string
}
export interface ProfileSaveApi extends ContentSaveApi {
  captionBody: string
}
export interface ServiceSaveApi extends ContentSaveApi {
  caption: string
  image: ImageData
  imageSettings: ImageSettings
  position: number
}
export interface FeatureSaveApi extends ContentSaveApi {
  caption: string
  image: ImageData
  imageSettings: ImageSettings
  position: number
}
export interface NewsSaveApi extends ContentSaveApi {
  category: string
  publishOn: Date
}
export interface ContactSaveApi extends ContentSaveApi {
  body: string
}
export interface MenuSaveApi extends ContentSaveApi {
  caption: string
  image: ImageData
  imageSettings: ImageSettings
  position: number
}
export interface MenuCategorySaveApi {
  customerId: string
  menuId: string
  category: string
  position: number
}
export interface MenuDetailSaveApi extends ContentSaveApi {
  menuId: string
  categoryId: string
  isHilight?: boolean
  price?: string
  caption?: string
  position: number
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
