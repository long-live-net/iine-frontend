import { useForm, useField } from 'vee-validate'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import type { LoginApiCredential, LoginForm } from '@/types/auth'

/**
 * ユーザ認証・認可処理
 */
export const useAuth = () => {
  const authStore = useAuthStore()
  const {
    userRef: authUser,
    tokenRef: authToken,
    errorRef: authError,
  } = storeToRefs(authStore)

  /**
   * 利用者ログイン認証処理
   * @param customerId
   * @param credential
   */
  const login = async (credential: LoginApiCredential) => {
    await authStore.login(credential)
  }

  /**
   * ログアウト処理
   */
  const logout = () => {
    authStore.logout()
  }

  const authorizationHeader = computed(() => ({
    Authorization: `Bearer ${authToken.value ?? 'notoken'}`,
  }))

  const userId = computed(() => authUser.value?.id ?? null)
  const userName = computed(() => authUser.value?.name ?? '')
  const userCustomerId = computed(() => authUser.value?.customerId ?? null)

  return {
    login,
    logout,
    authToken: readonly(authToken),
    authUser: readonly(authUser),
    authError: readonly(authError),
    authorizationHeader,
    userId,
    userName,
    userCustomerId,
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
  const loginFormInitial: LoginForm = {
    username: '',
    password: '',
  }

  const { handleSubmit, handleReset, validate } = useForm({
    validationSchema: loginFormSchema,
    initialValues: loginFormInitial,
  })

  const formData = {
    username: useField<LoginForm['username']>('username'),
    password: useField<LoginForm['password']>('password'),
  }

  return {
    handleSubmit,
    handleReset,
    validate,
    formData,
  }
}
