import type { PageSection, PageSectionEdit } from '@/types/customer-setting'
import type { PageSectionApi } from '@/types/API/customer-setting-api'
import type { Customer } from '@/types/customer'

const apiToPageSection = (
  apiData?: PageSectionApi | null
): PageSection | null =>
  apiData
    ? {
        baseId: apiData.baseId,
        id: apiData.id,
        customerId: apiData.customerId,
        kind: apiData.kind as PageSection['kind'],
        title: apiData.title,
        menuTitle: apiData.menuTitle,
        position: apiData.position,
      }
    : null

/**
 * ホームレイアウト情報の取得処理
 * @param customerId
 */
export const useHomeLayoutRead = (customerId: Ref<number | null>) => {
  const apiPath = '/layout/home'
  const domidPrefix = 'home-index'

  const { authorizationHeader } = useAuth()
  const loading = ref(false)
  const homeSections = useState<PageSection[] | null>(() => null)

  const keyExt = ref(1)
  const loadHomeLayout = async () => {
    loading.value = true
    const key = `fetch_home_layout_${apiPath}_${keyExt.value++}`
    try {
      const { data, error } = await useAsyncData(key, () =>
        $fetch<PageSectionApi[]>(apiPath, {
          baseURL: backendBaseUrl,
          method: 'GET',
          headers: authorizationHeader.value,
          params: { customerId: customerId.value },
        })
      )
      if (error.value) {
        throw error.value
      }
      homeSections.value = (data.value ?? []).map(
        (d) => apiToPageSection(d) ?? ({} as PageSection)
      )
    } finally {
      loading.value = false
    }
  }

  const fetchHomeLayout = async () => {
    loading.value = true
    try {
      const data = await $fetch<PageSectionApi[]>(apiPath, {
        baseURL: backendBaseUrl,
        method: 'GET',
        headers: authorizationHeader.value,
        params: { customerId: customerId.value },
      })
      homeSections.value = (data ?? []).map(
        (d) => apiToPageSection(d) ?? ({} as PageSection)
      )
    } catch (e) {
      throw createError(e as Error)
    } finally {
      loading.value = false
    }
  }

  return {
    loadHomeLayout,
    fetchHomeLayout,
    homeSections,
    loading,
    domidPrefix,
  }
}

/**
 * ホームレイアウト情報の更新・保存処理
 * @param customerId
 */
export const useHomeLayoutWrite = (customerId: Ref<number | null>) => {
  const apiPath = '/layout/home'
  const { authorizationHeader } = useAuth()
  const loading = ref(false)

  const updateHomeLayout = async (editSections: PageSectionEdit[]) => {
    loading.value = true
    try {
      await $fetch(apiPath, {
        baseURL: backendBaseUrl,
        method: 'PUT',
        headers: authorizationHeader.value,
        params: { customerId: customerId.value },
        body: editSections,
      })
    } catch (e) {
      throw createError(e as Error)
    } finally {
      loading.value = false
    }
  }

  const replaceHomeLayout = async (editSections: PageSectionEdit[]) => {
    let position = 0
    const modifiedData = editSections.map<PageSectionEdit>((s) => {
      const { id, ...modified } = s
      modified.position = ++position
      return modified
    })
    loading.value = true
    try {
      await $fetch(apiPath, {
        baseURL: backendBaseUrl,
        method: 'PUT',
        headers: authorizationHeader.value,
        params: { customerId: customerId.value },
        body: modifiedData,
      })
    } catch (e) {
      throw createError(e as Error)
    } finally {
      loading.value = false
    }
  }

  return {
    updateHomeLayout,
    replaceHomeLayout,
    loading,
  }
}

/**
 * ホームレイアウト情報変更用フォームデータ
 * @param customerId
 */
export const useHomeLayoutEdit = (customer: Ref<Customer | null>) => {
  const customerId = computed(() => customer.value?.id ?? null)
  const {
    homeSections,
    fetchHomeLayout,
    loading: readLoading,
  } = useHomeLayoutRead(customerId)

  const { replaceHomeLayout, loading: writeLoading } =
    useHomeLayoutWrite(customerId)

  const { addSnackber } = useSnackbars()

  const baseSectionsOrder: Pick<PageSection, 'baseId' | 'kind' | 'title'>[] = [
    { baseId: 'type1-information', kind: 'information', title: 'information' },
    { baseId: 'type1-news', kind: 'news', title: 'news' },
    { baseId: 'type1-service', kind: 'service', title: 'service' },
    { baseId: 'type1-contact', kind: 'contact', title: 'contact' },
    { baseId: 'type1-access', kind: 'access', title: 'access' },
    { baseId: 'type1-menu-image', kind: 'menu-image', title: 'menu' },
  ]
  const baseSections = ref<PageSectionEdit[]>([])
  const editSections = ref<PageSectionEdit[]>([])

  const reset = () => {
    if (!homeSections.value?.length) {
      return
    }
    baseSections.value.forEach((b) => {
      const hs = homeSections.value?.find((s) => s.kind === b.kind)
      if (hs) {
        b.menuTitle = hs.menuTitle
        b.position = hs.position
      }
    })
    editSections.value = homeSections.value.map<PageSectionEdit>((s) => {
      const { id, ...section } = s
      return section
    })
  }

  watch(
    customer,
    () => {
      if (customer.value) {
        const availContentsKind = customer.value.availContentsKind
        const cid = customer.value.id
        baseSections.value = baseSectionsOrder
          .filter((b) => availContentsKind.includes(b.kind))
          .map((b) => ({
            ...b,
            customerId: cid,
          }))
      } else {
        baseSections.value = []
        editSections.value = []
      }
    },
    {
      immediate: true,
    }
  )

  const loading = computed(() => readLoading.value || writeLoading.value)

  const replaceSections = async () => {
    await replaceHomeLayout(editSections.value)
    await fetchHomeLayout()
    addSnackber?.('ホームページのレイアウトを変更しました。')
  }

  return {
    baseSections,
    editSections,
    loading,
    reset,
    replaceSections,
  }
}

/**
 * セクションタイトル編集用フォームデータ
 * @param customerId
 */
export type FormField = { [id: string]: string }
export const usSectionTitleEdit = (customerId: Ref<number | null>) => {
  const {
    homeSections,
    fetchHomeLayout,
    loading: readLoading,
  } = useHomeLayoutRead(customerId)

  const { updateHomeLayout, loading: writeLoading } =
    useHomeLayoutWrite(customerId)

  const { addSnackber } = useSnackbars()

  const update = async (formField: FormField) => {
    const updatingSectionds =
      homeSections.value?.map((s) => ({
        ...s,
        menuTitle: formField[`${s.id}`] ?? '',
      })) ?? []

    await updateHomeLayout(updatingSectionds)
    await fetchHomeLayout()
    addSnackber?.('メニュータイトルを変更しました。')
  }

  const loading = computed(() => readLoading.value || writeLoading.value)

  return {
    homeSections,
    loading,
    update,
  }
}
