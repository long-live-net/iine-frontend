import { useForm, useField } from 'vee-validate'
import type {
  CustomerUser,
  CustomerUserForm,
  ChangePasswordFrom,
} from '@/types/customer-user'
import type { CustomerUserApi } from '@/types/API/customer-user-api'

/**
 * 顧客ユーザ情報API通信処理
 */
const useCustomerUserApi = () => {
  const endpoint = '/customer-users'
  const { authorizationHeader } = useAuth()

  const api2Appdata = (
    apiData?: CustomerUserApi | null
  ): CustomerUser | null => {
    if (!apiData) {
      return null
    }
    return {
      id: apiData.id ?? '',
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
    id: string
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
    userId: string,
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
    note: null,
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
 * Customer User 変更アクションサービス
d */
export const useCustomerUserActions = () => {
  const { customer } = useCustomer()
  const customerUserRef = ref<CustomerUser | null>(null)
  const {
    fetchCustomerUser,
    updateCustomerUser,
    checkExistsEmail,
    loading: loadingRef,
  } = useCustomerUserApi()

  const authStore = useAuthStore()
  const { addSnackber } = useSnackbars()

  const fetch = async (userId: string) => {
    customerUserRef.value = await fetchCustomerUser(userId)
  }

  const checkEmail = async (userId: string, form: CustomerUserForm) => {
    if (await checkExistsEmail(userId, form.email)) {
      addSnackber?.('他のメールアドレスに変更してください。', 'warning')
      addSnackber?.('指定のメールアドレスは既に使用されています。', 'error')
      return false
    }
    return true
  }

  const update = async (userId: string, form: CustomerUserForm) => {
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

/**
 * update user password
 */
export const useUpdatePassword = () => {
  const { authorizationHeader } = useAuth()
  const apiPath = '/auth/customer-user/password'
  const loading = ref(false)

  const updatePassword = async (newPassword: string) => {
    loading.value = true
    try {
      await $fetch(apiPath, {
        baseURL: backendBaseUrl,
        headers: authorizationHeader.value,
        method: 'PUT',
        body: { password: newPassword },
      })
    } catch (e) {
      throw createError(e as Error)
    } finally {
      loading.value = false
    }
  }
  return {
    updatePassword,
    loading,
  }
}

/**
 * change password Form
 */
export const useChangePasswordForm = () => {
  const {
    noBlank,
    minLength,
    passwordComplexity,
    setCustomValidatorFunc,
    customValidator,
  } = useValidateRules()

  const changePasswordSchema = {
    password: (v: string | undefined) => {
      if (!noBlank(v)) return 'パスワードを入力してください'
      if (!minLength(v, 8)) return '8文字以上で設定してください'
      if (!passwordComplexity(v))
        return '英字大文字・小文字・数字を全て含めてください'
      return true
    },
    passwordConfirm: (v: string | undefined) => {
      if (!noBlank(v)) return 'パスワード確認用を入力してください'
      if (!customValidator()) return 'password と確認用が一致しません'
      return true
    },
  }
  const changePasswordInitial: ChangePasswordFrom = {
    password: '',
    passwordConfirm: '',
  }

  const { handleSubmit, handleReset, validate } = useForm({
    validationSchema: changePasswordSchema,
    initialValues: changePasswordInitial,
  })

  const formData = {
    password: useField<ChangePasswordFrom['password']>('password'),
    passwordConfirm:
      useField<ChangePasswordFrom['passwordConfirm']>('passwordConfirm'),
  }

  const valdateSame = () => {
    const pwd = formData.password.value.value
    const cfm = formData.passwordConfirm.value.value
    if (!pwd?.length || !cfm?.length) {
      return true
    }
    return pwd === cfm
  }
  setCustomValidatorFunc(valdateSame)

  return {
    handleSubmit,
    handleReset,
    validate,
    formData,
  }
}
