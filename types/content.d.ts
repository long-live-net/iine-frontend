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

export interface NewsType extends ContentType {
  body: string
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

export interface MenuDetailType extends ContentType {
  menuId: string
  price?: string
  caption?: string
  isHilight: boolean
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

export interface NewsForm extends ContentForm {
  body: string
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

export interface MenuDetailForm extends ContentForm {
  menuId: string
  price?: string
  caption?: string
  isHilight: boolean
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
}

export type PositionObj = { [key: number]: number }
