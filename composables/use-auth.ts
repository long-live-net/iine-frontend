import { useForm, useField } from 'vee-validate'
import type {
  LoginApiCredential,
  LoginApiError,
  LoginFrom,
  LoginUser,
} from '@/types/auth'
import type { ApiError } from '@/utils/api-fetch'

/**
 * ユーザ認証処理
 */
export const useAuth = () => {
  const authEndpoint = '/auth/customer-user'
  const authError = ref<LoginApiError | null>(null)
  const authToken = useState<string | null>('authToken', () => null)
  const authUser = useState<LoginUser | null>('authUser', () => null)

  const login = async (credential: LoginApiCredential) => {
    const { data, error } = await useAsyncData(() =>
      $fetch(authEndpoint, {
        baseURL: backendBaseUrl,
        method: 'POST',
        body: { ...credential },
      })
    )
    if (error.value) {
      const apiError: ApiError = error.value
      if (apiError.statusCode === 401) {
        authError.value = {
          status: apiError.statusCode,
          message: 'メールアドレスかパスワードに誤りがあります',
        }
      } else if (apiError.statusCode === 403) {
        authError.value = {
          status: apiError.statusCode,
          message: 'アクセスするための権限がありません',
        }
      } else {
        throw error
      }
    }
    authToken.value = (data.value as { token: string }).token
  }

  const getUser = async () => {
    const { data, error } = await useAsyncData(() =>
      $fetch(authEndpoint, {
        baseURL: backendBaseUrl,
        method: 'GET',
        headers: authorizationHeader.value,
      })
    )
    if (error.value) {
      const apiError: ApiError = error.value
      if (apiError.statusCode === 401) {
        authError.value = {
          status: apiError.statusCode,
          message: 'ログインユーザが見つかりませんでした',
        }
      } else if (apiError.statusCode === 403) {
        authError.value = {
          status: apiError.statusCode,
          message: 'アクセスするための権限がありません',
        }
      } else {
        throw error
      }
    }
    authUser.value = data.value as LoginUser
  }

  const logout = () => {
    console.log('logout')
    authToken.value = null
  }

  const authorizationHeader = computed(() => ({
    Authorization: `Bearer ${authToken.value ?? ''}`,
  }))

  return {
    login,
    getUser,
    logout,
    authError: readonly(authError),
    authToken: readonly(authToken),
    isLoggedIn: computed(() => !!authToken),
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
