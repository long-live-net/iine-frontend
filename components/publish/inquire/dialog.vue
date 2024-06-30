<script setup lang="ts">
import type { InquireMail } from '@/types/inquire'

const props = defineProps<{ modal: boolean }>()
const emit = defineEmits<{
  'update:modal': [modal: boolean]
}>()

const inquireModal = computed({
  get: () => props.modal,
  set: (modal: boolean) => {
    emit('update:modal', modal)
  },
})

const { customerId } = useFoundation()
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

watch(inquireModal, (current) => {
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
  inquireModal.value = false
}
const onCancel = () => {
  inquireModal.value = false
}
</script>

<template>
  <CommonModalDialog
    v-model:modal="inquireModal"
    :max-width="800"
    :title="titleData.title"
    :title-icon="titleData.titleIcon"
    :title-icon-color="titleData.titleColor"
    persistent
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
