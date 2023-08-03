import type { ImageData } from '@/types/image-settings'

export type ContentInputType = {
  customerId: number
  title: string
  subtitle?: string
  body?: string
  image?: ImageData
  imageFile?: File | null
}

export interface EyecatchInputType extends ContentInputType {
  subtitle: string
  imageFile: File | null
}
