import { useForm, useField } from 'vee-validate'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { useCustomerStore } from '@/stores/customer'
import type { ApiError } from '@/utils/api-fetch'
import type {
  LoginApiCredential,
  LoginApiError,
  LoginFrom,
  LoginUser,
} from '@/types/auth'

/**
 * ユーザ認証・認可処理
 */
export const useAuth = () => {
  const customerStore = useCustomerStore()
  const { customerRef } = storeToRefs(customerStore)

  const authStore = useAuthStore()
  const { userRef: authUser, tokenRef: authToken } = storeToRefs(authStore)

  const authEndpoint = '/auth/customer-user'
  const authError = ref<LoginApiError | null>(null)

  const authenticate = async (credential: LoginApiCredential) => {
    const { data, error } = await useAsyncData<{ token: string }>(() =>
      $fetch(authEndpoint, {
        baseURL: backendBaseUrl,
        method: 'POST',
        body: { ...credential },
      })
    )
    if (error.value) {
      throw error.value
    }
    return data.value
  }
  const getUser = async (token: string) => {
    const { data, error } = await useAsyncData<LoginUser>(() =>
      $fetch(authEndpoint, {
        baseURL: backendBaseUrl,
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      })
    )
    if (error.value) {
      throw error.value
    }
    return data.value
  }

  const login = async (credential: LoginApiCredential) => {
    const onError = (status: number) => {
      authError.value = { status, message: 'ユーザ認証できませんでした' }
    }
    try {
      const response = await authenticate(credential)
      if (!response) {
        onError(401)
        return
      }
      const token = response.token
      if (!token) {
        onError(401)
        return
      }
      const user = await getUser(token)
      if (!user || user.customerId !== customerRef.value?.id) {
        onError(403)
        return
      }
      authStore.login({ token, user })
    } catch (error) {
      const apiError: ApiError = error as Error
      if (apiError.statusCode === 401 || apiError.statusCode === 403) {
        onError(apiError.statusCode)
      } else {
        throw error
      }
    }
  }

  const logout = () => {
    authStore.logout()
  }

  const authorizationHeader = computed(() => ({
    Authorization: `Bearer ${authToken.value ?? ''}`,
  }))

  return {
    login,
    logout,
    authError: readonly(authError),
    authToken: readonly(authToken),
    authUser: readonly(authUser),
    customer: readonly(customerRef),
    authorizationHeader,
  }
}

/**
 * login Form
 */
export const useLoginForm = () => {
  const { noBlank, validateEmail } = useValidateRules()

  const loginFormSchema = {
    username: (v: string | undefined) => {
      if (!noBlank(v)) return 'email を入力してください'
      if (!validateEmail(v)) return 'メールアドレスの形式で入力してください'
      return true
    },
    password: (v: string | undefined) =>
      noBlank(v) || 'password を入力してください',
  }
  const loginFormInitial: LoginFrom = {
    username: '',
    password: '',
  }

  const { handleSubmit, handleReset, validate } = useForm({
    validationSchema: loginFormSchema,
    initialValues: loginFormInitial,
  })

  const formData = {
    username: useField<LoginFrom['username']>('username'),
    password: useField<LoginFrom['password']>('password'),
  }

  return {
    handleSubmit,
    handleReset,
    validate,
    formData,
  }
}
