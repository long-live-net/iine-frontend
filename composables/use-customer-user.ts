import { useForm, useField } from 'vee-validate'
import type { Customer } from '@/types/customer'
import type { CustomerUser, CustomerUserForm } from '@/types/customer-user'
import type { CustomerUserApi } from '@/types/API/customer-user-api'

/**
 * 顧客ユーザ情報API通信処理
 */
export const useCustomerUserApi = () => {
  const endpoint = '/customer-users'
  const { authorizationHeader } = useAuth()

  const api2Appdata = (
    apiData?: CustomerUserApi | null
  ): CustomerUser | null => {
    if (!apiData) {
      return null
    }
    return {
      id: apiData.id ?? 0,
      customerId: apiData.customerId,
      email: apiData.email,
      name: apiData.name,
      note: apiData.note,
    }
  }
  const app2Apidata = (
    appData?: CustomerUser | null
  ): CustomerUserApi | null => {
    if (!appData) {
      return null
    }
    return {
      customerId: appData.customerId,
      email: appData.email,
      name: appData.name,
      note: appData.note,
    }
  }

  const loading = ref(false)

  const fetchCustomerUser = async (
    id: number
  ): Promise<CustomerUser | null> => {
    loading.value = true
    try {
      const data = await $fetch<CustomerUserApi | null>(`${endpoint}/${id}`, {
        baseURL: backendBaseUrl,
        method: 'GET',
        headers: authorizationHeader.value,
      })
      return api2Appdata(data)
    } catch (e) {
      throw createError(e as Error)
    } finally {
      loading.value = false
    }
  }

  const updateCustomerUser = async (
    user: CustomerUser
  ): Promise<CustomerUser | null> => {
    loading.value = true
    try {
      const data = await $fetch<CustomerUserApi | null>(
        `${endpoint}/${user.id}`,
        {
          baseURL: backendBaseUrl,
          method: 'PUT',
          headers: authorizationHeader.value,
          body: app2Apidata(user),
        }
      )
      return api2Appdata(data)
    } catch (e) {
      throw createError(e as Error)
    } finally {
      loading.value = false
    }
  }

  const checkExistsEmail = async (
    userId: number,
    email: string
  ): Promise<boolean | null> => {
    loading.value = true
    try {
      const data = await $fetch<{ existance: boolean } | null>(
        `${endpoint}/exists-email/${userId}`,
        {
          baseURL: backendBaseUrl,
          method: 'GET',
          headers: authorizationHeader.value,
          params: { email },
        }
      )
      return data?.existance || null
    } catch (e) {
      throw createError(e as Error)
    } finally {
      loading.value = false
    }
  }

  return { fetchCustomerUser, updateCustomerUser, checkExistsEmail, loading }
}

/**
 * Customer User Form
 */
export const useCustomerUserForm = () => {
  const { noBlank, validateEmail } = useValidateRules()

  const customerUserFormSchema = {
    email: (v: string | undefined) => {
      if (!noBlank(v)) return 'email を入力してください'
      if (!validateEmail(v)) return 'メールアドレスの形式で入力してください'
      return true
    },
    name: (v: string | undefined) => noBlank(v) || 'name を入力してください',
    note: () => true,
  }
  const customerUserFormInitial: CustomerUserForm = {
    email: '',
    name: '',
    note: '',
  }

  const { handleSubmit, handleReset, validate } = useForm({
    validationSchema: customerUserFormSchema,
    initialValues: customerUserFormInitial,
  })

  const formData = {
    email: useField<CustomerUserForm['email']>('email'),
    name: useField<CustomerUserForm['name']>('name'),
    note: useField<CustomerUserForm['note']>('note'),
  }

  return {
    handleSubmit,
    handleReset,
    validate,
    formData,
  }
}

/**
 *  アクションサービス
 * @param customerId
 */
export const useCustomerUserActions = (customer: Ref<Customer | null>) => {
  const customerUserRef = ref<CustomerUser | null>(null)
  const {
    fetchCustomerUser,
    updateCustomerUser,
    checkExistsEmail,
    loading: loadingRef,
  } = useCustomerUserApi()

  const authStore = useAuthStore()
  const { addSnackber } = useSnackbars()

  const fetch = async (userId: number) => {
    customerUserRef.value = await fetchCustomerUser(userId)
  }

  const checkEmail = async (userId: number, form: CustomerUserForm) => {
    if (await checkExistsEmail(userId, form.email)) {
      addSnackber?.('他のメールアドレスに変更してください。', 'warning')
      addSnackber?.('指定のメールアドレスは既に使用されています。', 'error')
      return false
    }
    return true
  }

  const update = async (userId: number, form: CustomerUserForm) => {
    if (!customer.value?.id) {
      return
    }
    const customerUser: CustomerUser = {
      id: userId,
      customerId: customer.value.id,
      email: form.email,
      name: form.name,
      note: form.note,
    }
    await updateCustomerUser(customerUser)
    addSnackber?.('ユーザ情報を更新しました。')

    customerUserRef.value = await fetchCustomerUser(userId)
    if (customerUserRef.value) {
      authStore.setUser(customerUserRef.value)
    }
  }

  watch(customerUserRef, () => {
    if (!customerUserRef.value) {
      return
    }
    customerUserRef.value.customerName = customer.value?.name
  })

  return {
    customerUserRef,
    loadingRef,
    fetch,
    update,
    checkEmail,
  }
}
