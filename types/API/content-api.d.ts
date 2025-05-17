import type {
  TitleSettings,
  EyecatchTitleSettings,
  ImageData,
  ImageSettings,
  MenuImageData,
  ContentPosition,
  NewsCategory,
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

export interface ContentCategoryGetApi {
  _id?: string
  id: string
  customerId: string
  category: string
  position?: number
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
  category: NewsCategory | string
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

export interface MenuCategoryGetApi extends ContentCategoryGetApi {
  menuId: string
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
export interface ShopCategoryGetApi extends ContentCategoryGetApi {
  position: number
}

export interface ShopGetApi extends ContentGetApi {
  categoryId: string
  caption: string
  image: ImageData
  imageSettings: ImageSettings
  position: number
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
export interface ContentCategorySaveApi {
  customerId: string
  category: string
  position?: number
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
  category: NewsCategory
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
export interface MenuCategorySaveApi extends ContentCategorySaveApi {
  menuId: string
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
export interface ShopCategorySaveApi extends ContentCategorySaveApi {
  position: number
}
export interface ShopSaveApi extends ContentSaveApi {
  categoryId: string
  caption: string
  image: ImageData
  imageSettings: ImageSettings
  position: number
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

/**
 * リストポジション更新時で使用するPositionデータ
 */
export type ContentPositionApi = ContentPosition
