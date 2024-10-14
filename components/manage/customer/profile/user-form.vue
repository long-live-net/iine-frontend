<script setup lang="ts">
import type { CustomerUser, CustomerUserForm } from '@/types/customer-user'

const props = withDefaults(
  defineProps<{
    customerUser: CustomerUser | null
    loading: boolean
  }>(),
  {
    customerUser: null,
    loading: false,
  }
)
const emit = defineEmits<{
  cancel: []
  update: [form: CustomerUserForm]
}>()

const { handleSubmit, formData } = useCustomerUserForm()
watch(
  () => props.customerUser,
  () => {
    if (props.customerUser) {
      formData.name.value.value = props.customerUser.name
      formData.email.value.value = props.customerUser.email
      formData.note.value.value = props.customerUser.note
    }
  },
  {
    immediate: true,
  }
)

const onUpdate = handleSubmit((userForm) => {
  emit('update', userForm)
})
const onCancel = () => {
  emit('cancel')
}
</script>

<template>
  <div>
    <v-form class="customer-user-form">
      <div>
        <v-text-field
          v-model="formData.name.value.value"
          :error-messages="formData.name.errorMessage.value"
          clearable
          label="お名前"
          placeholder="お名前を入力してください"
        />
      </div>
      <div>
        <v-text-field
          v-model="formData.email.value.value"
          :error-messages="formData.email.errorMessage.value"
          clearable
          label="メールアドレス"
          placeholder="メールアドレスを入力してください"
        />
      </div>
      <div>
        <v-text-field
          v-model="formData.note.value.value"
          :error-messages="formData.note.errorMessage.value"
          clearable
          label="備考"
          placeholder="備考を入力してください"
        />
      </div>
    </v-form>
    <div class="actions">
      <v-btn
        prepend-icon="mdi-content-save"
        color="accent"
        variant="flat"
        width="8rem"
        :loading="loading"
        @click="onUpdate"
      >
        変更する
      </v-btn>
      <v-btn
        prepend-icon="mdi-cancel"
        color="secondary"
        variant="flat"
        width="8rem"
        class="ml-1"
        @click="onCancel"
      >
        キャンセル
      </v-btn>
    </div>
  </div>
</template>

<style scoped lang="scss">
.customer-user-form {
  display: flex;
  flex-direction: column;
  row-gap: 0.5rem;
  padding: 0 1rem;
}

.actions {
  margin-top: 0.5rem;
  padding: 0 1rem;
  text-align: right;
}
</style>
