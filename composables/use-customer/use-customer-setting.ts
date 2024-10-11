// import { useForm, useField } from 'vee-validate'
import { storeToRefs } from 'pinia'
import { useCustomerSettingStore } from '@/stores/customer-setting'
import type {
  CustomerSetting,
  NetworkServiceink,
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
 * Customer Form
 */
/*
export const useCustomerForm = () => {
  const { noBlank, validateEmail, validatePhone, validateUrl } =
    useValidateRules()

  const customerFormSchema = {
    name: (v: string | undefined) => noBlank(v) || '名称を入力してください',
    defaultEmail: (v: string | undefined) => {
      if (!noBlank(v)) return '代表メールアドレスを入力してください'
      if (!validateEmail(v)) return 'メールアドレスの形式で入力してください'
      return true
    },
    phone: (v: string | undefined) =>
      validatePhone(v) || '電話番号の形式で入力してください',
    address: (v: string | undefined) => noBlank(v) || '住所を入力してください',
    note: () => true,
    facebook: (v: string | undefined) =>
      validateUrl(v) || 'URL の形式で入力してください',
    instagram: (v: string | undefined) =>
      validateUrl(v) || 'URL の形式で入力してください',
    twitter: (v: string | undefined) =>
      validateUrl(v) || 'URL の形式で入力してください',
    youtube: (v: string | undefined) =>
      validateUrl(v) || 'URL の形式で入力してください',
  }
  const customerFormInitial: CustomerForm = {
    name: '',
    defaultEmail: '',
    phone: null,
    address: '',
    note: null,
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
    name: useField<CustomerForm['name']>('name'),
    defaultEmail: useField<CustomerForm['defaultEmail']>('defaultEmail'),
    phone: useField<CustomerForm['phone']>('phone'),
    address: useField<CustomerForm['address']>('address'),
    note: useField<CustomerForm['note']>('note'),
    facebook: useField<CustomerForm['facebook']>('facebook'),
    instagram: useField<CustomerForm['instagram']>('instagram'),
    twitter: useField<CustomerForm['twitter']>('twitter'),
    youtube: useField<CustomerForm['youtube']>('youtube'),
  }

  return {
    handleSubmit,
    handleReset,
    validate,
    formData,
  }
}
  */

/**
 * 顧客情報のテーマ設定関連
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

  const onChengeDesignTheme = async (designTheme: DesignTheme) => {
    if (!customerSetting.value) {
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

  const onChengeColorTheme = async (colorTheme: ColorTheme) => {
    if (!customerSetting.value) {
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
