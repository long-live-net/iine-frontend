import { storeToRefs } from 'pinia'
import { useCustomerStore } from '@/stores/customer'
import { useCustomerSettingStore } from '@/stores/customer-setting'

export default defineNuxtPlugin(async () => {
  // 顧客情報取得
  const customerStore = useCustomerStore()
  await customerStore.loadCustomerByUrl(useRequestURL().host)

  // HOME画面構成情報取得
  const { customerRef } = storeToRefs(customerStore)
  const customerIdRef = computed(() => customerRef.value?.id ?? null)

  if (customerIdRef.value) {
    const customerSettingStore = useCustomerSettingStore()
    await customerSettingStore.loadCustomerSetting(customerIdRef.value)
  }
})
