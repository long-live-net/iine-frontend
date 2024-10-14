<script setup lang="ts">
import type { InquireMail } from '@/types/inquire'
import type PublishInquireForm from './form.vue'

const props = defineProps<{ modal: boolean }>()
const emit = defineEmits<{
  'update:modal': [modal: boolean]
}>()

const { customerId } = useCustomer()
const confirmDialog = ref(false)
const pageMode = ref<'input' | 'done'>('input')
const inquireFormRef = ref<InstanceType<typeof PublishInquireForm> | null>(null)

const { sendInquire, loading: sending } = useInquireSend(customerId)
const inquireMail = ref<InquireMail | null>(null)
const inquireModal = computed({
  get: () => props.modal,
  set: (modal: boolean) => {
    emit('update:modal', modal)
  },
})
watch(inquireModal, (current) => {
  if (current) {
    pageMode.value = 'input'
    inquireMail.value = null
    inquireFormRef.value?.reset()
  }
})

const onConfirm = (inquire: InquireMail) => {
  inquireMail.value = inquire
  confirmDialog.value = true
}
const onSend = async () => {
  if (inquireMail.value) {
    await sendInquire(inquireMail.value)
    pageMode.value = 'done'
  }
  confirmDialog.value = false
}
const onCancelSending = () => {
  confirmDialog.value = false
}
const onCompleted = () => {
  inquireModal.value = false
}
const onCancel = () => {
  inquireModal.value = false
}

const titleData = {
  title: 'お問い合わせ',
  titleIcon: 'mdi-email',
  titleColor: 'primary',
}
</script>

<template>
  <CommonModalDialog
    v-model:modal="inquireModal"
    :width="800"
    :title="titleData.title"
    :title-icon="titleData.titleIcon"
    :title-icon-color="titleData.titleColor"
    persistent
    theme="auto"
  >
    <PublishInquireForm
      v-if="pageMode === 'input'"
      ref="inquireFormRef"
      @confirm="onConfirm"
      @cancel="onCancel"
    />
    <PublishInquireResult v-else @ok="onCompleted" />
    <BaseConfirm
      v-model:comfirm="confirmDialog"
      message="お問い合わせのメールを送信します。よろしいですか？"
      exec-text="送信する"
      cancel-text="戻る"
      :loading="sending"
      @cancel="onCancelSending"
      @confirm="onSend"
    />
  </CommonModalDialog>
</template>
