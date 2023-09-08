import { defineStore } from 'pinia'
import type { LoginUser } from '@/types/auth'

export const useAuthStore = defineStore(
  'auth',
  () => {
    const userRef = ref<LoginUser | null>(null)
    const tokenRef = ref<string | null>(null)

    function login({ token, user }: { token: string; user: LoginUser }) {
      userRef.value = {
        id: user.id,
        customerId: user.customerId,
        email: user.email,
        name: user.name,
        note: user.note,
      }
      tokenRef.value = token
    }

    function logout() {
      userRef.value = null
      tokenRef.value = null
    }

    return {
      userRef,
      tokenRef,
      login,
      logout,
    }
  },
  {
    persist: {
      storage: persistedState.sessionStorage,
    },
  }
)
