import { defineStore } from 'pinia'
import type { NuxtError } from '#app'
import type { LoginApiCredential, LoginUser, LoginApiError } from '@/types/auth'

/**
 * ログイン認証関連API通信処理
 */
const useAuthApi = () => {
  const authEndpoint = '/auth/customer-user'
  const authenticate = async (credential: LoginApiCredential) => {
    const data = await $fetch<{ token: string }>(authEndpoint, {
      baseURL: backendBaseUrl,
      method: 'POST',
      body: { ...credential },
    })
    return data
  }
  const fetchUser = async (token: string) => {
    const data = await $fetch<LoginUser>(authEndpoint, {
      baseURL: backendBaseUrl,
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    })
    return data
  }
  return { authenticate, fetchUser }
}

/**
 * 認証関連 Store
 */
export const useAuthStore = defineStore(
  'auth',
  () => {
    const userRef = ref<LoginUser | null>(null)
    const tokenRef = ref<string | null>(null)
    const errorRef = ref<LoginApiError | null>(null)
    const { authenticate, fetchUser } = useAuthApi()

    const clearRef = () => {
      userRef.value = null
      tokenRef.value = null
      errorRef.value = null
    }

    /**
     * 利用者ログイン認証処理
     */
    const login = async (credential: LoginApiCredential) => {
      const onError = (status: number, message?: string) => {
        errorRef.value = {
          status,
          message: message ?? 'ログイン認証できませんでした',
        }
      }
      clearRef()
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
        const user = await fetchUser(token)
        if (!user || user.customerId !== credential.customerId) {
          onError(403)
          return
        }
        setUser(user)
        tokenRef.value = token
      } catch (error) {
        const loginError = error as NuxtError
        if (loginError.statusCode === 401 || loginError.statusCode === 403) {
          onError(loginError.statusCode)
        } else {
          throw error
        }
      }
    }

    const logout = () => {
      clearRef()
    }

    const setUser = (user: LoginUser) => {
      userRef.value = {
        id: user.id,
        customerId: user.customerId,
        email: user.email,
        name: user.name,
        note: user.note,
      }
    }

    return {
      userRef,
      tokenRef,
      errorRef,
      login,
      logout,
      setUser,
    }
  },
  {
    persist: {
      pick: ['userRef', 'tokenRef'],
      storage: piniaPluginPersistedstate.sessionStorage(),
    },
  }
)
