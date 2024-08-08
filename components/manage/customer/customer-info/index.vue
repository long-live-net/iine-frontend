<script setup lang="ts">
import type { CustomerForm } from '@/types/customer'

const props = defineProps<{ modal: boolean }>()
const emit = defineEmits<{
  'update:modal': [modal: boolean]
}>()

const dialog = computed({
  get: () => props.modal,
  set: (modal: boolean) => {
    emit('update:modal', modal)
  },
})
const titleData = {
  title: 'テナント情報',
  titleIcon: 'mdi-domain',
  titleColor: 'info',
}
type OperationMode = 'none' | 'display' | 'edit'
const operationMode = ref<OperationMode>('none')

const { customer, loading, update } = useCustomerActions()

watch(dialog, () => {
  if (dialog.value) {
    operationMode.value = 'display'
  } else {
    // Note:
    // ダイアログが閉じる時にチラチラするため
    // 少しだけ遅れて unmount する
    setTimeout(() => {
      operationMode.value = 'none'
    }, 300)
  }
})

const onUpdate = async (customerForm: CustomerForm) => {
  await update(customerForm)
  operationMode.value = 'display'
}
</script>

<template>
  <CommonModalDialog
    v-model:modal="dialog"
    :max-width="1024"
    :title="titleData.title"
    :title-icon="titleData.titleIcon"
    :title-icon-color="titleData.titleColor"
  >
    <div v-if="operationMode === 'display'">
      <ManageCustomerCustomerInfoCustomerDisplay
        :customer="customer"
        @edit="operationMode = 'edit'"
      />
    </div>
    <div v-else-if="operationMode === 'edit'">
      <ManageCustomerCustomerInfoCustomerForm
        :customer="customer"
        :loading="loading"
        @update="onUpdate"
        @cancel="operationMode = 'display'"
      />
    </div>
  </CommonModalDialog>
</template>
