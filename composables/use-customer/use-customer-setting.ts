import { useForm, useField } from 'vee-validate'
import { storeToRefs } from 'pinia'
import { useCustomerSettingStore } from '@/stores/customer-setting'
import type {
  CustomerSetting,
  NetworkServiceink,
  SnsLinksForm,
  ColorTheme,
  DesignTheme,
} from '@/types/customer-setting'

/**
 * 顧客情報
 */
export const useCustomerSetting = () => {
  const customerId = computed(
    () => storeToRefs(useCustomerStore()).customerRef.value?.id ?? null
  )

  const customerSettingStore = useCustomerSettingStore()
  const { customerSettingRef } = storeToRefs(customerSettingStore)
  const loading = ref(false)

  const fetchCustomerSetting = async () => {
    if (!customerId.value) {
      return
    }
    loading.value = true
    await customerSettingStore
      .fetchCustomerSetting(customerId.value)
      .finally(() => {
        loading.value = false
      })
  }

  const updateCustomerSetting = async (
    customerSetting: CustomerSetting | null
  ) => {
    if (!customerSetting) {
      return
    }
    loading.value = true
    await customerSettingStore
      .updateCustomerSetting(customerSetting)
      .finally(() => {
        loading.value = false
      })
  }

  const setCustomerSetting = (customerSetting: CustomerSetting | null) => {
    customerSettingStore.setCustomerSetting(customerSetting)
  }

  return {
    customerSetting: customerSettingRef,
    loading,
    fetchCustomerSetting,
    updateCustomerSetting,
    setCustomerSetting,
  }
}

/**
 * 顧客設定情報のテーマ設定関連
 */
export const useThemeSettingsEdit = () => {
  const {
    customerSetting,
    setCustomerSetting,
    updateCustomerSetting,
    fetchCustomerSetting,
    loading,
  } = useCustomerSetting()
  const { addSnackber } = useSnackbars()

  const editDesignTheme = ref<DesignTheme>('type1')
  const editColorTheme = ref<ColorTheme>('light')

  watch(
    customerSetting,
    () => {
      editDesignTheme.value = customerSetting.value?.designTheme ?? 'type1'
      editColorTheme.value = customerSetting.value?.colorTheme ?? 'light'
    },
    { immediate: true }
  )

  const onChengeDesignTheme = async (designTheme: DesignTheme | null) => {
    if (!customerSetting.value || !designTheme) {
      return
    }
    const updateData = { ...customerSetting.value, designTheme }
    setCustomerSetting(updateData)
    await updateCustomerSetting(updateData)
      .then(() => {
        addSnackber?.('デザインテーマを更新しました。')
        return fetchCustomerSetting()
      })
      .catch((e: Error) => {
        throw e
      })
  }

  const onChengeColorTheme = async (colorTheme: ColorTheme | null) => {
    if (!customerSetting.value || !colorTheme) {
      return
    }
    const updateData = { ...customerSetting.value, colorTheme }
    setCustomerSetting(updateData)
    await updateCustomerSetting(updateData)
      .then(() => {
        addSnackber?.('カラーテーマを更新しました。')
        return fetchCustomerSetting()
      })
      .catch((e: Error) => {
        throw e
      })
  }

  const DesignThemeOptions: {
    type: DesignTheme
    label: string
  }[] = [
    { type: 'type1', label: '標準' },
    { type: 'type2', label: 'シャープ' },
  ]
  const colorThemeOptions: {
    type: ColorTheme
    label: string
  }[] = [
    { type: 'light', label: 'ライト' },
    { type: 'dark', label: 'ダーク' },
  ]

  return {
    editDesignTheme,
    editColorTheme,
    DesignThemeOptions,
    colorThemeOptions,
    loading,
    onChengeDesignTheme,
    onChengeColorTheme,
  }
}

/**
 * Customer setting sns links 関連
 */
export const useCustomerSnsLinks = () => {
  const { customerSetting } = useCustomerSetting()
  const snsLinks = computed<NetworkServiceink[]>(
    () => customerSetting.value?.snsLinks ?? []
  )
  const getSnsTitle = (serviceName: string) => {
    switch (serviceName) {
      case 'facebook':
        return 'Facebook'
      case 'instagram':
        return 'Instagram'
      case 'twitter':
        return 'X(Twitter)'
      case 'youtube':
        return 'Youtube'
      default:
        return ''
    }
  }
  const getSnsIcon = (serviceName: string) => {
    switch (serviceName) {
      case 'facebook':
        return 'mdi-facebook'
      case 'instagram':
        return 'mdi-instagram'
      case 'twitter':
        return 'mdi-twitter'
      case 'youtube':
        return 'mdi-youtube'
      default:
        return ''
    }
  }
  const getSnsColor = (serviceName: string) => {
    switch (serviceName) {
      case 'facebook':
        return '#1877F2'
      case 'instagram':
        return '#dd2a7b'
      case 'twitter':
        return 'black'
      case 'youtube':
        return 'red'
      default:
        return ''
    }
  }
  const onClickLink = (serviceName: string) => {
    if (import.meta.client) {
      const url = snsLinks.value.find((l) => l.serviceName === serviceName)?.url
      if (url) {
        window.open(url, '_blank')
      }
    }
  }

  return {
    snsLinks,
    getSnsTitle,
    getSnsIcon,
    getSnsColor,
    onClickLink,
  }
}

export const useCustomerSnsLinksForm = () => {
  const { validateUrl } = useValidateRules()

  const customerFormSchema = {
    facebook: (v: string | undefined) =>
      validateUrl(v) || 'URL の形式で入力してください',
    instagram: (v: string | undefined) =>
      validateUrl(v) || 'URL の形式で入力してください',
    twitter: (v: string | undefined) =>
      validateUrl(v) || 'URL の形式で入力してください',
    youtube: (v: string | undefined) =>
      validateUrl(v) || 'URL の形式で入力してください',
  }
  const customerFormInitial: SnsLinksForm = {
    facebook: null,
    instagram: null,
    twitter: null,
    youtube: null,
  }

  const { handleSubmit, handleReset, validate } = useForm({
    validationSchema: customerFormSchema,
    initialValues: customerFormInitial,
  })

  const formData = {
    facebook: useField<SnsLinksForm['facebook']>('facebook'),
    instagram: useField<SnsLinksForm['instagram']>('instagram'),
    twitter: useField<SnsLinksForm['twitter']>('twitter'),
    youtube: useField<SnsLinksForm['youtube']>('youtube'),
  }

  return {
    handleSubmit,
    handleReset,
    validate,
    formData,
  }
}

export const useCustomerSnsLinksUpdate = () => {
  const {
    customerSetting,
    updateCustomerSetting,
    fetchCustomerSetting,
    loading,
  } = useCustomerSetting()
  const { addSnackber } = useSnackbars()

  const update = async (form: SnsLinksForm) => {
    if (!customerSetting.value || !customerSetting.value.id) {
      return
    }
    const links: NetworkServiceink[] = []
    if (form.facebook) {
      links.push({ serviceName: 'facebook', url: form.facebook })
    }
    if (form.instagram) {
      links.push({ serviceName: 'instagram', url: form.instagram })
    }
    if (form.twitter) {
      links.push({ serviceName: 'twitter', url: form.twitter })
    }
    if (form.youtube) {
      links.push({ serviceName: 'youtube', url: form.youtube })
    }

    const customerSettingData: CustomerSetting = {
      ...customerSetting.value,
      snsLinks: links.length ? links : null,
    }
    await updateCustomerSetting(customerSettingData)
    await fetchCustomerSetting()
    addSnackber?.('SNSページ情報を更新しました。')
  }
  return {
    customerSetting,
    loading,
    update,
  }
}
