<script setup lang="ts">
import type { InquireMail } from '@/types/inquire'

const emit = defineEmits<{ confirm: [inquireMail: InquireMail]; cancel: [] }>()
const { handleSubmit, handleReset, inquireForm } = useInquireForm()

const onConfirm = handleSubmit((inquire) => {
  emit('confirm', inquire)
})
const onCancel = () => {
  emit('cancel')
}
const reset = () => {
  handleReset()
}

defineExpose({ reset })
</script>

<template>
  <v-form class="inquire-email-form">
    <div>
      <v-text-field
        v-model="inquireForm.name.value.value"
        :error-messages="inquireForm.name.errorMessage.value"
        clearable
        label="お名前"
        placeholder="入力してください"
      />
    </div>
    <div class="mt-1">
      <v-text-field
        v-model="inquireForm.email.value.value"
        :error-messages="inquireForm.email.errorMessage.value"
        clearable
        label="メールアドレス"
        placeholder="入力してください"
      />
    </div>
    <div class="mt-1">
      <v-text-field
        v-model="inquireForm.phone.value.value"
        :error-messages="inquireForm.phone.errorMessage.value"
        clearable
        label="電話番号（任意）"
        placeholder="入力してください"
      />
    </div>
    <div class="mt-1">
      <v-textarea
        v-model="inquireForm.inquiry.value.value"
        :error-messages="inquireForm.inquiry.errorMessage.value"
        auto-grow
        clearable
        label="お問い合わせ内容"
        placeholder="入力してください"
      />
    </div>
    <div class="d-flex justify-end mt-1">
      <v-btn
        prepend-icon="mdi-email-fast"
        color="primary"
        width="7.5rem"
        @click="onConfirm"
      >
        送信する
      </v-btn>
      <v-btn
        prepend-icon="mdi-cancel"
        color="secondary"
        width="7.5rem"
        class="ml-2"
        @click="onCancel"
      >
        キャンセル
      </v-btn>
    </div>
  </v-form>
</template>

<style scoped lang="scss">
.inquire-email-form {
  padding: 0 1.5rem;
}

@media only screen and (max-width: $grid-breakpoint-md) {
  .inquire-email-form {
    padding: 0;
  }
}
</style>
