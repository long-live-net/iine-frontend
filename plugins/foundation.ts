import { storeToRefs } from 'pinia'
import { useCustomerStore } from '@/stores/customer'

export default defineNuxtPlugin(async () => {
  // 顧客情報取得
  const customerStore = useCustomerStore()
  const url = useRequestURL().host
  await customerStore.loadCustomerByUrl(url)

  // HOME画面構成情報取得
  const { customerRef } = storeToRefs(customerStore)
  const customerId = computed(() => customerRef.value?.id ?? null)
  const { loadHomeLayout } = useHomeLayoutRead(customerId)
  await loadHomeLayout()
})
