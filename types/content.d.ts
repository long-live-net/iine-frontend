/**
 * Title Settings
 */
export type TextAlignValue = 'left' | 'center' | 'right'
export interface TitleSettings {
  fontFamily: string
  color: string
  bgColor: string
  position: string
  align: TextAlignValue
}

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
  type: string
  name: string
}

export interface MenuImageData {
  url: string
  type: string
  name: string
}

export interface ContentType {
  id: string
  customerId?: string
  title: string
  subtitle?: string
  titleSettings: TitleSettings
  caption?: string
  body?: string
  image?: ImageData
  imageSettings?: ImageSettings
  tags?: string[]
}

export interface EyecatchTitleSettings extends TitleSettings {
  positionSm: string
}

export interface EyecatchType extends ContentType {
  titleSettings: EyecatchTitleSettings
  image: ImageData
  imageSettings: ImageSettings
}

export interface InformationType extends ContentType {
  body: string
}

export interface ProfileType extends ContentType {
  captionBody: string
}

export interface NewsType extends ContentType {
  category: string
  publishOn: Date
}

export interface ServiceType extends ContentType {
  caption: string
  image: ImageData
  imageSettings: ImageSettings
  position: number
}

export interface FeatureType extends ContentType {
  caption: string
  image: ImageData
  imageSettings: ImageSettings
  position: number
}

export interface ContactType extends ContentType {
  body: string
}

export interface MenuType extends ContentType {
  caption: string
  image: ImageData
  imageSettings: ImageSettings
  position: number
}

export interface MenuCategoryType {
  id: string
  customerId: string
  menuId: string
  category: string
  position: number
}

export interface MenuDetailType extends ContentType {
  menuId: string
  categoryId: string
  isHilight?: boolean
  price?: string
  caption?: string
  position: number
}

export interface MenuImageType extends ContentType {
  caption: string
  image: ImageData
  position: number
  menuImage: MenuImageData
}

/**
 * Content Form Data Types
 */
export interface ContentForm {
  id?: string
  title: string
  subtitle?: string
  titleSettings: TitleSettings
  body?: string
  image?: string
  imageName?: string
  imageType?: string
  imageSettings?: ImageSettings | null
}

export interface EyecatchForm extends ContentForm {
  titleSettings: EyecatchTitleSettings
  image: string
  imageName: string
  imageType: string
}

export interface InformationForm extends ContentForm {
  body: string
}
export interface ProfileForm extends ContentForm {
  captionBody: string
}

export interface NewsForm extends ContentForm {
  category: string | null
  publishOn: Date | null
}

export interface ServiceForm extends ContentForm {
  image: string
  imageName: string
  imageType: string
  caption: string
  position: number
}

export interface FeatureForm extends ContentForm {
  image: string
  imageName: string
  imageType: string
  caption: string
  position: number
}

export interface ContactForm extends ContentForm {
  body: string
}

export interface MenuForm extends ContentForm {
  caption: string
  image: string
  imageName: string
  imageType: string
  position: number
}

export interface MenuCategoryForm {
  category: string
  position: number
}

export interface MenuDetailForm extends ContentForm {
  isHilight?: boolean
  price?: string
  caption?: string
  position: number
}

export interface MenuImageForm extends ContentForm {
  caption: string
  image: string
  imageName: string
  imageType: string
  position: number
  menuImageUrl: string
  menuImageName: string
  menuImageType: string
}

/*
 * Pre Next ID 取得時のレスポンスデータ
 */
export interface ContentPreNextId {
  preId: string | null
  nextId: string | null
}

/**
 * トップ画面表示位置 (position)
 */
export interface ContentPosition {
  id: string
  position: number
  [key: string]: string | number | boolean | null | undefined
}

export type PositionObj = { [key: number]: number }

/**
 * Content edit mode
 */
export type ContentEditMode =
  | 'new'
  | 'delete'
  | 'update'
  | 'image'
  | 'title'
  | 'body'
  | 'caption'
  | 'captionBody'
