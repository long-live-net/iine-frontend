import type {
  PageSection,
  BasePageSection,
  PageSectionEdit,
} from '@/types/page-setting'

export const useHomeLayoutRead = (customerId: Ref<number | null>) => {
  const apiPath = '/layout/home'
  const domidPrefix = 'home-index'

  const { authorizationHeader } = useAuth()
  const loading = ref(false)
  const homeSections = useState<PageSection[] | null>(() => null)

  const keyExt = ref(1)
  const nextKey = () => keyExt.value++

  const fetchHomeLayout = async () => {
    loading.value = true
    const key = `fetch_home_layout_${apiPath}_${keyExt.value}`
    try {
      const { data, error } = await useAsyncData<PageSection[]>(key, () =>
        $fetch(apiPath, {
          baseURL: backendBaseUrl,
          method: 'GET',
          headers: authorizationHeader.value,
          params: { customerId: customerId.value },
        })
      )
      if (error.value) {
        throw error.value
      }
      homeSections.value = (data.value ?? []).map((d) => ({
        baseId: d.baseId,
        id: d.id,
        customerId: d.customerId,
        kind: d.kind,
        title: d.title,
        position: d.position,
      }))
    } finally {
      loading.value = false
    }
  }

  return {
    nextKey,
    fetchHomeLayout,
    homeSections,
    loading,
    domidPrefix,
  }
}

export const useHomeLayoutWrite = (customerId: Ref<number | null>) => {
  const apiPath = '/layout/home'
  const { authorizationHeader } = useAuth()
  const loading = ref(false)

  const replaceHomeLayout = async (editSections: PageSectionEdit[]) => {
    let position = 0
    const modifiedData = editSections.map((s) => ({
      baseId: s.baseId,
      customerId: s.customerId,
      kind: s.kind,
      title: s.title,
      position: ++position,
      menuTitle: s.menuTitle,
    }))
    loading.value = true
    try {
      const { data, error } = await useAsyncData(() =>
        $fetch(apiPath, {
          baseURL: backendBaseUrl,
          method: 'PUT',
          headers: authorizationHeader.value,
          params: { customerId: customerId.value },
          body: modifiedData,
        })
      )
      if (error.value) {
        throw error.value
      }
      return data
    } finally {
      loading.value = false
    }
  }

  return {
    replaceHomeLayout,
    loading,
  }
}

export const useHomeLayoutEdit = (customerId: Ref<number | null>) => {
  const {
    homeSections,
    nextKey,
    fetchHomeLayout,
    loading: readLoading,
  } = useHomeLayoutRead(customerId)

  const { replaceHomeLayout, loading: writeLoading } =
    useHomeLayoutWrite(customerId)

  const { addSnackber } = useSnackbars()

  const baseSections: BasePageSection[] = [
    {
      baseId: 'type1-information',
      kind: 'information',
      title: 'Information',
    },
    {
      baseId: 'type1-news',
      kind: 'news',
      title: 'News',
    },
    {
      baseId: 'type1-service',
      kind: 'service',
      title: 'Service',
    },
    {
      baseId: 'type1-contact',
      kind: 'contact',
      title: 'Contact',
    },
  ]

  const editSections = ref<PageSectionEdit[]>([])

  watch(
    homeSections,
    (sections) => {
      if (!sections?.length) {
        editSections.value = []
        return
      }
      editSections.value = sections.map((s) => ({
        baseId: s.baseId,
        customerId: s.customerId,
        kind: s.kind,
        title: s.title,
        position: s.position,
        menuTitle: s.menuTitle,
      }))
    },
    {
      immediate: true,
    }
  )

  const loading = computed(() => readLoading.value || writeLoading.value)

  const onUpdateSections = async () => {
    nextKey()
    await replaceHomeLayout(editSections.value)
    await fetchHomeLayout()
    addSnackber?.('ホームページレイアウトを変更しました。')
  }

  return {
    baseSections,
    editSections,
    loading,
    onUpdateSections,
  }
}
