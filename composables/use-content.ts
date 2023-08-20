import type { ApiError } from '@/utils/api-fetch'
import type { ImageSettings } from '@/types/content'
import type {
  ContentGetApi,
  ContentSaveApi,
  ListFilter,
  ListSort,
  ListPager,
  ContentListResponse,
} from '@/types/content-api'

export const useContentRead = <T extends ContentGetApi>(
  customerId: number,
  apiPath: string
) => {
  const contentDataRef: Ref<T | null> = ref(null)
  const contentListRef: Ref<ContentListResponse<T> | null> = ref(null)

  const keyExt = ref(1)
  const nextKey = () => keyExt.value++

  /**
   * get content data
   * @param contentId 未設定時は最新データを取得する
   */
  const get = async (contentId?: number | null) => {
    const key = `get_content_${apiPath}_${keyExt.value}`
    const url =
      contentId === undefined || contentId === null
        ? `${apiPath}/recent`
        : `${apiPath}/${contentId}`

    const { data, error } = await useAsyncData<T>(key, () =>
      $fetch(url, {
        baseURL: backendBaseUrl,
        method: 'GET',
        params: { customerId },
      })
    )
    if (error.value) {
      contentDataRef.value = null
      const apiError: ApiError = error.value
      if (apiError.statusCode === 404) {
        return
      }
      throw apiError
    }
    if (data.value) {
      contentDataRef.value = data.value as T
    }
  }

  /**
   * get contents list
   * @param filter 検索フィルタ
   * @param sort ソートキー
   * @param pager ページとページあたり件数
   */
  const getList = async (
    filter: ListFilter = {},
    sort: ListSort = {},
    pager: ListPager = { page: 1, limit: 20 }
  ) => {
    const key = `get_list_content_${apiPath}_${keyExt.value}`
    const { data, error } = await useAsyncData(key, () =>
      $fetch(apiPath, {
        baseURL: backendBaseUrl,
        method: 'GET',
        params: {
          customerId,
          filter: JSON.stringify(filter),
          sort: JSON.stringify(sort),
          pager: JSON.stringify(pager),
        },
      })
    )
    if (error.value) {
      contentListRef.value = null
      const apiError: ApiError = error.value
      if (apiError.statusCode === 404) {
        return
      }
      throw apiError
    }
    if (data.value) {
      contentListRef.value = data.value as ContentListResponse<T>
    }
  }

  return {
    nextKey,
    get,
    getList,
    contentDataRef: readonly(contentDataRef),
    contentListRef: readonly(contentListRef),
  }
}

export const useContentWrite = <
  F extends ContentSaveApi,
  T extends ContentGetApi,
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
        $fetch('/uploads/image', {
          baseURL: backendBaseUrl,
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
    const { data, error } = await useAsyncData<T>(() =>
      $fetch(apiPath, {
        baseURL: backendBaseUrl,
        method: 'POST',
        body: sendData,
      })
    )
    if (error.value) {
      throw error.value
    }
    return data
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
        $fetch('/uploads/image', {
          baseURL: backendBaseUrl,
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
    const { data, error } = await useAsyncData<T>(() =>
      $fetch(`${apiPath}/${contentId}`, {
        baseURL: backendBaseUrl,
        method: 'PUT',
        body: sendData,
      })
    )
    if (error.value) {
      throw error.value
    }
    return data
  }

  /**
   * remove content data
   * @param contentId
   */
  const remove = async (contentId: number) => {
    const { data, error } = await useAsyncData(() =>
      $fetch(`${apiPath}/${contentId}`, {
        baseURL: backendBaseUrl,
        method: 'DELETE',
      })
    )
    if (error.value) {
      throw error.value
    }
    return data
  }
  return {
    create,
    update,
    remove,
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
