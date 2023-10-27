import { useForm, useField } from 'vee-validate'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import type {
  LoginApiCredential,
  LoginFrom,
  ChangePasswordFrom,
} from '@/types/auth'

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
      const { data, error } = await useAsyncData(() =>
        $fetch(apiPath, {
          baseURL: backendBaseUrl,
          headers: authorizationHeader.value,
          method: 'PUT',
          body: { password: newPassword },
        })
      )
      if (error.value) {
        throw createApiError(error.value)
      }
      return data
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
