import { storeToRefs } from 'pinia'
import { useCustomerStore } from '@/stores/customer'
import type { ColorTheme, LayoutTheme } from '@/types/customer'

/**
 * 顧客情報
 */
export const useCustomer = () => {
  const customerStore = useCustomerStore()
  const { customerRef: customer } = storeToRefs(customerStore)

  const customerId = computed(() => customer.value?.id ?? null)
  const customerName = computed(() => customer.value?.name ?? '')

  return {
    customer: readonly(customer),
    customerId,
    customerName,
  }
}

/**
 * 顧客情報のテーマ設定関連
 */
export const useThemeSettingsEdit = () => {
  const editLayoutTheme = ref<LayoutTheme | null>(null)
  const editColorTheme = ref<ColorTheme | null>(null)

  const layoutThemeOptions: {
    type: LayoutTheme
    label: string
  }[] = [
    {
      type: 'type1',
      label: '標準',
    },
    {
      type: 'type2',
      label: 'シャープ',
    },
  ]
  const colorThemeOptions: {
    type: ColorTheme
    label: string
  }[] = [
    {
      type: 'light',
      label: 'ライト',
    },
    {
      type: 'dark',
      label: 'ダーク',
    },
  ]

  return {
    editLayoutTheme,
    editColorTheme,
    layoutThemeOptions,
    colorThemeOptions,
  }
}

// レイアウトテーマ選択 template 参考例
//
// <div class="page-setting-editor__theme">
//   <h4>レイアウトテーマ選択</h4>
//   <div class="theme-selection">
//     <v-radio-group v-model="editSectionType" inline>
//       <v-radio
//         v-for="st in sectionTypes"
//         key="st.type"
//         color="primary"
//         :label="st.label"
//         :value="st.type"
//       ></v-radio>
//     </v-radio-group>
//   </div>
// </div>
