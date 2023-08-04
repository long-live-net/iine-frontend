import type { ImageSettings } from '@/types/content'
import type { ContentGetApi, ContentSaveApi } from '@/types/content-api'

export const useContentRead = <T extends ContentGetApi>(
  customerId: number,
  apiPath: string
) => {
  const contentDataRef = ref<T | null>(null) as Ref<T | null>

  /**
   * get content data
   * @param contentId 未設定時は最新データを取得する
   */
  const get = async (contentId?: number) => {
    const key = 'create_content'
    const url =
      contentId === undefined || contentId === null
        ? `${apiPath}/recent`
        : `${apiPath}/${contentId}`

    const { data, error } = await useAsyncData<T>(key, () =>
      apiFetch(url, {
        method: 'GET',
        params: { customerId },
      })
    )
    if (error.value) {
      throw error.value
    }
    if (data.value) {
      contentDataRef.value = data.value as T
    }
  }
  return {
    get,
    contentDataRef,
  }
}

export const useContentWrite = <F extends ContentSaveApi>(
  customerId: number,
  apiPath: string
) => {
  /**
   * create content data
   * @param newData
   */
  const create = async (newData: F) => {
    const { imageFile, ...sendData } = newData
    const formData = new FormData()

    if (imageFile) {
      formData.append('imagefile', imageFile)
      const { data, error } = await useAsyncData(() =>
        apiFetch('/uploads/image', {
          method: 'POST',
          params: { customerId },
          body: formData,
        })
      )
      if (error.value) {
        throw error.value
      }
      const imageUrl = data.value as { fileUrl: string }
      sendData.image = {
        url: imageUrl.fileUrl,
        settings: getDefaultImageSettings(),
      }
    }
    const { data, error } = await useAsyncData(() =>
      apiFetch(apiPath, {
        method: 'POST',
        body: sendData,
      })
    )
    if (error.value) {
      throw error.value
    }
    return { data }
  }

  /**
   * update content data
   * @param contentId
   * @param modData
   */
  const update = async (contentId: number, modData: F) => {
    const { imageFile, ...sendData } = modData
    const formData = new FormData()
    if (imageFile) {
      formData.append('imagefile', imageFile)
      const { data, error } = await useAsyncData(() =>
        apiFetch('/uploads/image', {
          method: 'POST',
          params: { customerId },
          body: formData,
        })
      )
      if (error.value) {
        throw error
      }
      const imageUrl = data.value as { fileUrl: string }
      sendData.image = {
        url: imageUrl.fileUrl,
        settings: getDefaultImageSettings(),
      }
    }
    const { data, error } = await useAsyncData(() =>
      apiFetch(`${apiPath}/${contentId}`, {
        method: 'PUT',
        body: sendData,
      })
    )
    if (error.value) {
      throw error
    }
    return { data }
  }

  return {
    create,
    update,
  }
}

const getDefaultImageSettings = (): ImageSettings => ({
  lgSize: 'cover',
  smSize: 'cover',
  lgPosition: 'center',
  smPosition: 'center',
  lgParallax: 'scroll' as 'fixed' | 'scroll',
  smParallax: 'scroll' as 'fixed' | 'scroll',
})
