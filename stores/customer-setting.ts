import { defineStore, storeToRefs } from 'pinia'
import { cloneDeep } from 'es-toolkit'
import { useAuthStore } from '@/stores/auth'
import type { CustomerSettingApi } from '@/types/API/customer-setting-api'
import type { CustomerSetting } from '@/types/customer-setting'

const useCustomerSettingApi = (token: Ref<string | null>) => {
  const endpoint = '/customer-settings'
  const keyExt = ref(1)
  const api2Appdata = (
    apiData?: CustomerSettingApi | null
  ): CustomerSetting | null => {
    if (!apiData) {
      return null
    }
    return {
      id: apiData.id,
      customerId: apiData.customerId,
      availContentsKind: [...(apiData.availContentsKind ?? [])],
      newsCategories: [...(apiData.newsCategories ?? [])],
      pageTitle: {
        title: apiData.pageTitle?.title ?? 'IINE TITLE',
        iconUrl: apiData.pageTitle?.iconUrl ?? null,
      },
      fontFamily: apiData.fontFamily ?? null,
      textColor: apiData.textColor ?? null,
      colorTheme: apiData.colorTheme,
      designTheme: apiData.designTheme,
      homeLayout:
        apiData.homeLayout?.map((l) => ({
          kind: l.kind,
          title: l.title,
          menuTitle: l.menuTitle ?? null,
        })) ?? [],
      accessSource: apiData.accessSource ?? null,
      snsLinks:
        apiData.snsLinks?.map((l) => ({
          serviceName: l.serviceName,
          url: l.url,
        })) ?? null,
      seoTags:
        apiData.seoTags?.map((t) => ({
          keyName: t.keyName,
          content: t.content,
        })) ?? null,
      favicon: {
        faviconIco: apiData.favicon?.faviconIco ?? null,
        icoSvg: apiData.favicon?.icoSvg ?? null,
        appleTouchIconPng: apiData.favicon?.appleTouchIconPng ?? null,
      },
    }
  }
  const app2Apidata = (appData: CustomerSetting): CustomerSettingApi => ({
    id: appData.id,
    customerId: appData.customerId,
    availContentsKind: [...appData.availContentsKind],
    newsCategories: [...appData.newsCategories],
    pageTitle: {
      title: appData.pageTitle.title,
      iconUrl: appData.pageTitle?.iconUrl ?? null,
    },
    ...(appData.fontFamily ? { fontFamily: appData.fontFamily } : {}),
    ...(appData.textColor
      ? { textColor: appData.textColor }
      : { textColor: null }),
    colorTheme: appData.colorTheme,
    designTheme: appData.designTheme,
    homeLayout: appData.homeLayout.map((l) => ({
      kind: l.kind,
      title: l.title,
      menuTitle: l.menuTitle ?? null,
    })),
    accessSource: appData.accessSource ?? null,
    snsLinks:
      appData.snsLinks?.map((l) => ({
        serviceName: l.serviceName,
        url: l.url,
      })) ?? null,
    seoTags:
      appData.seoTags?.map((t) => ({
        keyName: t.keyName,
        content: t.content,
      })) ?? null,
    favicon: {
      faviconIco: appData.favicon.faviconIco ?? null,
      icoSvg: appData.favicon.icoSvg ?? null,
      appleTouchIconPng: appData.favicon.appleTouchIconPng ?? null,
    },
  })

  const load = async (customerId: string): Promise<CustomerSetting | null> => {
    const key = `fetch_customer_setting_${endpoint}_${keyExt.value++}`
    const { data, error } = await useAsyncData<CustomerSettingApi>(key, () =>
      $fetch(`${endpoint}/${customerId}`, {
        baseURL: backendBaseUrl,
        method: 'GET',
      })
    )
    if (error.value) {
      throw error.value
    }
    return api2Appdata(data.value)
  }
  const fetch = async (customerId: string): Promise<CustomerSetting | null> => {
    const data = await $fetch<CustomerSettingApi | null>(
      `${endpoint}/${customerId}`,
      {
        baseURL: backendBaseUrl,
        method: 'GET',
      }
    )
    return api2Appdata(data)
  }
  const update = async (
    customerSetting: CustomerSetting
  ): Promise<CustomerSetting | null> => {
    const data = await $fetch<CustomerSettingApi | null>(
      `${endpoint}/${customerSetting.customerId}`,
      {
        baseURL: backendBaseUrl,
        method: 'PUT',
        headers: { Authorization: `Bearer ${token.value ?? 'notoken'}` },
        body: app2Apidata(customerSetting),
      }
    )
    return api2Appdata(data)
  }

  return {
    load,
    fetch,
    update,
  }
}

export const useCustomerSettingStore = defineStore('customerSetting', () => {
  const { tokenRef } = storeToRefs(useAuthStore())
  const { load, fetch, update } = useCustomerSettingApi(tokenRef)

  const customerSettingRef = ref<CustomerSetting | null>(null)

  function setCustomerSetting(customerSetting: CustomerSetting | null) {
    customerSettingRef.value = customerSetting
      ? cloneDeep(customerSetting) // structuredClone だと Failed to execute となるので cloneDeep に戻す
      : null
  }

  async function loadCustomerSetting(customerId: string) {
    const customerSetting = await load(customerId)
    setCustomerSetting(customerSetting)
  }

  async function fetchCustomerSetting(customerId: string) {
    const customerSetting = await fetch(customerId)
    setCustomerSetting(customerSetting)
  }

  async function updateCustomerSetting(customerSetting: CustomerSetting) {
    await update(customerSetting)
  }

  return {
    customerSettingRef,
    setCustomerSetting,
    loadCustomerSetting,
    fetchCustomerSetting,
    updateCustomerSetting,
  }
})
