<script setup lang="ts">
import type { InquireMail } from '@/types/inquire'

const { customerId } = useFoundation()
const modal = ref(false)
const confirmDialog = ref(false)
const titleData = {
  title: 'お問い合わせ',
  titleIcon: 'mdi-email',
  titleColor: 'primary',
}
type PageMode = 'input' | 'done'
const pageMode = ref<PageMode>('input')

const { handleSubmit, handleReset, inquireForm } = useInquireForm()
const { sendInquire, loading: sending } = useInquireSend(customerId)
const inquireMail = ref<InquireMail | null>(null)

watch(modal, (current) => {
  if (current) {
    pageMode.value = 'input'
    inquireMail.value = null
    handleReset()
  }
})

const onConfirm = handleSubmit((inquire) => {
  inquireMail.value = inquire
  confirmDialog.value = true
})
const onSend = async () => {
  if (inquireMail.value) {
    await sendInquire(inquireMail.value)
    pageMode.value = 'done'
  }
  confirmDialog.value = false
}
const onCompleted = () => {
  modal.value = false
}
const onCancel = () => {
  modal.value = false
}
</script>

<template>
  <BaseActivator
    v-model:modal="modal"
    :activator-icon="titleData.titleIcon"
    :activator-color="titleData.titleColor"
    :activator-text="titleData.title"
  />
  <CommonModalDialog
    v-model:modal="modal"
    :max-width="800"
    :title="titleData.title"
    :title-icon="titleData.titleIcon"
    :title-icon-color="titleData.titleColor"
  >
    <PublishInquireForm
      v-if="pageMode === 'input'"
      :inquire-form="inquireForm"
      @confirm="onConfirm"
      @cancel="onCancel"
    />
    <PublishInquireResult v-else @ok="onCompleted" />
    <BaseConfirm
      v-model:comfirm="confirmDialog"
      message="お問い合わせのメールを送信します。よろしいですか？"
      exec-text="送信する"
      cancelText="戻る"
      :loading="sending"
      @cancel="confirmDialog = false"
      @confirm="onSend"
    />
  </CommonModalDialog>
</template>
