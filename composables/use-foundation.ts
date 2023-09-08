import { storeToRefs } from 'pinia'
import { useCustomerStore } from '@/stores/customer'
import { useAuthStore } from '@/stores/auth'

export const useFoundation = () => {
  const customerStore = useCustomerStore()
  const { customerRef } = storeToRefs(customerStore)

  const authStore = useAuthStore()
  const { userRef, tokenRef } = storeToRefs(authStore)

  const customerId = computed(() => customerRef.value?.id ?? 0)

  const isLoggedIn = computed(
    () => !!tokenRef.value && userRef.value?.customerId === customerId.value
  )

  const canEdit = ref(false)
  onMounted(() => {
    watch(
      isLoggedIn,
      (value) => {
        canEdit.value = value
      },
      { immediate: true }
    )
  })

  return {
    customerId,
    isLoggedIn,
    canEdit,
  }
}
