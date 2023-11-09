import debounce from 'lodash/debounce'
import type { ImageSettings } from '@/types/content'
import type {
  ContentGetApi,
  ContentSaveApi,
  ListFilter,
  ListSort,
  ListPager,
  ContentListResponse,
  ContentPosition,
} from '@/types/content-api'

export const useContentRead = <T extends ContentGetApi>(
  customerId: Ref<number | null>,
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
        params: { customerId: customerId.value },
      })
    )
    if (error.value) {
      contentDataRef.value = null
      throw error.value
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
          customerId: customerId.value,
          filter: JSON.stringify(filter),
          sort: JSON.stringify(sort),
          pager: JSON.stringify(pager),
        },
      })
    )
    if (error.value) {
      contentListRef.value = null
      throw error.value
    }
    if (data.value) {
      contentListRef.value = data.value as ContentListResponse<T>
    }
  }

  /**
   * contents list 配列の並び順を引数のIDリストに合わせて更新
   * @param list
   */
  const setListPositions = (positions: ContentPosition[]) => {
    if (!contentListRef.value) return

    const contentTotal = contentListRef.value.total
    const contentList = positions.map((pos) => {
      const fc = contentListRef.value?.list.find((c) => pos.id === c.id)
      if (fc) {
        return { ...fc }
      } else {
        return {} as T
      }
    })
    contentListRef.value = {
      total: contentTotal,
      list: contentList,
    }
  }

  /**
   * image settings の情報を更新する
   */
  const setImageSettings = (settings: ImageSettings) => {
    if (!contentDataRef.value) return
    if (!contentDataRef.value.image?.settings) return

    const url = contentDataRef.value.image.url
    contentDataRef.value.image = { url, settings }
  }

  return {
    nextKey,
    get,
    getList,
    setListPositions,
    setImageSettings,
    contentDataRef: readonly(contentDataRef),
    contentListRef: readonly(contentListRef),
  }
}

export const useContentWrite = <
  F extends ContentSaveApi,
  T extends ContentGetApi,
>(
  customerId: Ref<number | null>,
  apiPath: string
) => {
  const { authorizationHeader } = useAuth()

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
          headers: authorizationHeader.value,
          params: { customerId: customerId.value },
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
        headers: authorizationHeader.value,
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
          headers: authorizationHeader.value,
          params: { customerId: customerId.value },
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
        headers: authorizationHeader.value,
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
        headers: authorizationHeader.value,
        method: 'DELETE',
      })
    )
    if (error.value) {
      throw error.value
    }
    return data
  }

  /**
   * 並び順更新
   * @param updatedList
   */
  const updatePositions = async (positions: ContentPosition[]) => {
    const { data, error } = await useAsyncData<T>(() =>
      $fetch(`${apiPath}/positions`, {
        baseURL: backendBaseUrl,
        method: 'PUT',
        headers: authorizationHeader.value,
        body: positions,
      })
    )
    if (error.value) {
      throw error.value
    }
    return data
  }

  /**
   * useUpdateImageSettings
   *
   * Note.
   * lodash.debounce() は非同期に実行するので
   * 実行する関数のリターン値を指定しても undefined
   * となる。
   * このため useAsyncData の結果をリアクティブな
   * 変数にセットして、それを watch しつつ結果を
   * 返すような形で実装するようにした。
   */
  const useUpdateImageSettings = () => {
    const data = ref<any>(null)
    const error = ref<Error | null>(null)
    const fatal = ref<Error | null>(null)

    const debouncedFunc = debounce(
      (contentId: number, imageSettings: ImageSettings) => {
        useAsyncData<T>(() =>
          $fetch(`${apiPath}/${contentId}/image-settings`, {
            baseURL: backendBaseUrl,
            method: 'PUT',
            headers: authorizationHeader.value,
            body: imageSettings,
          })
        )
          .then((response) => {
            data.value = response?.data?.value ?? null
            error.value = response?.error?.value ?? null
          })
          .catch((e) => {
            fatal.value = e
          })
      },
      600
    )
    watch(error, () => {
      if (error.value) {
        throw error.value
      }
    })
    watch(fatal, () => {
      if (fatal.value) {
        throw error.value
      }
    })

    return {
      debouncedFunc,
      data,
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

  return {
    create,
    update,
    remove,
    updatePositions,
    useUpdateImageSettings,
    getDefaultImageSettings,
  }
}
