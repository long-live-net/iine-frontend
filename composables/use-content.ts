import type { ContentType, ImageSettings } from '@/types/content'
import type { ContentInputType } from '@/types/content-input'

export const useContentRead = <T extends ContentType>(
  customerId: number,
  apiPath: string
) => {
  const contentDataRef = ref<T | null>(null) as Ref<T | null>
  const loading = ref(false)

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

    try {
      loading.value = true
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
    } finally {
      loading.value = false
    }
  }
  return {
    get,
    contentDataRef,
    loading,
  }
}

export const useContentWrite = <
  T extends ContentType,
  F extends ContentInputType,
>(
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
      if (error.value) throw error.value

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
    if (error.value) throw error.value

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
      if (error.value) throw error

      const imageUrl = data.value as { fileUrl: string }
      sendData.image = {
        url: imageUrl.fileUrl,
        settings: getDefaultImageSettings(),
      }
    }
    const { data, error } = await useAsyncData(() =>
      apiFetch(`${apiPath}/${contentId}`, {
        method: 'PUT',
        params: { customerId },
        body: sendData,
      })
    )
    if (error.value) throw error

    return { data }
  }

  const getDefaultImageSettings = (): ImageSettings => ({
    lgSize: 'cover',
    smSize: 'cover',
    lgPosition: 'center',
    smPosition: 'center',
    lgParallax: 'scroll' as 'fixed' | 'scroll',
    smParallax: 'scroll' as 'fixed' | 'scroll',
  })

  return {
    create,
    update,
    getDefaultImageSettings,
  }
}
