<script setup lang="ts">
import type { LoginFrom } from '@/types/auth'

const props = defineProps<{
  customerName: string
}>()
const emit = defineEmits<{
  login: [credential: LoginFrom]
}>()

const { handleSubmit, formData } = useLoginForm()
const onLogin = handleSubmit((loginForm) => {
  emit('login', loginForm)
})

const passwordView = ref(false)
</script>

<template>
  <v-form class="login-form" @submit.prevent.stop="onLogin">
    <div class="form-input">
      <v-text-field
        v-model="formData.username.value.value"
        :error-messages="formData.username.errorMessage.value"
        label="Email"
        placeholder="メールアドレスを入力してください"
      />
    </div>
    <div class="form-input">
      <v-text-field
        v-model="formData.password.value.value"
        :error-messages="formData.password.errorMessage.value"
        label="Password"
        :type="passwordView ? 'text' : 'password'"
        placeholder="パスワードを入力してください"
      />
      <v-btn
        variant="plain"
        :prepend-icon="passwordView ? 'mdi-eye' : 'mdi-eye-off'"
        :color="passwordView ? 'primary' : 'grey-darken-4'"
        @click="passwordView = !passwordView"
      >
        パスワードを{{ passwordView ? '隠す' : '見る' }}
      </v-btn>
    </div>
    <div class="form-action">
      <v-btn
        type="submit"
        prepend-icon="mdi-login"
        color="primary"
        width="16rem"
      >
        ログイン
      </v-btn>
    </div>
  </v-form>
</template>

<style scoped lang="scss">
.login-form {
  .form-input {
    margin-top: 1rem;
  }
  .form-action {
    margin-top: 1.5rem;
    text-align: center;
  }
}
</style>
