<script setup lang="ts">
import type { SnsLinksForm } from '@/types/customer-setting'

const modal = defineModel<boolean>('modal', { required: true })

const titleData = {
  title: 'SNSページ情報',
  titleIcon: 'mdi-domain',
  titleColor: 'info',
}
type OperationMode = 'none' | 'display' | 'edit'
const operationMode = ref<OperationMode>('none')

const { customerSetting, loading, update } = useCustomerSnsLinksUpdate()

watch(modal, () => {
  if (modal.value) {
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

const onUpdate = async (snsLinksForm: SnsLinksForm) => {
  await update(snsLinksForm)
  operationMode.value = 'display'
}
</script>

<template>
  <CommonModalDialog
    v-model:modal="modal"
    :title="titleData.title"
    :title-icon="titleData.titleIcon"
    :title-icon-color="titleData.titleColor"
  >
    <div v-if="operationMode === 'display'" class="customer-info">
      <ManageCustomerSnsLinksInfoSnsLinksDisplay
        :customer-setting="customerSetting"
        @edit="operationMode = 'edit'"
      />
    </div>
    <div v-else-if="operationMode === 'edit'" class="customer-info">
      <ManageCustomerSnsLinksInfoSnsLinksForm
        :customer-setting="customerSetting"
        :loading="loading"
        @update="onUpdate"
        @cancel="operationMode = 'display'"
      />
    </div>
  </CommonModalDialog>
</template>

<style scoped lang="scss">
.customer-info {
  width: 1024px;
  max-width: 100%;
}
</style>
