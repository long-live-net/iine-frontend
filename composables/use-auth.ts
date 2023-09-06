import { useForm, useField } from 'vee-validate'
import type {
  LoginApiCredential,
  LoginApiError,
  LoginFrom,
  LoginUser,
} from '@/types/auth'
import type { ApiError } from '@/utils/api-fetch'

/**
 * ユーザ認証・認可処理
 */
export const useAuth = (customerId: number) => {
  const authEndpoint = '/auth/customer-user'
  const authError = ref<LoginApiError | null>(null)
  const authToken = useState<string | null>('authToken', () => null)
  const authUser = useState<LoginUser | null>('authUser', () => null)

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
      if (!user || user.customerId !== customerId) {
        onError(403)
        return
      }
      authToken.value = token
      authUser.value = user
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
    authToken.value = null
    authUser.value = null
  }

  const authorizationHeader = computed(() => ({
    Authorization: `Bearer ${authToken.value ?? ''}`,
  }))

  const isLoggedIn = computed(
    () => authToken.value && authUser.value?.customerId === customerId
  )

  return {
    login,
    logout,
    authError: readonly(authError),
    authToken: readonly(authToken),
    authUser: readonly(authUser),
    authorizationHeader,
    isLoggedIn,
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
