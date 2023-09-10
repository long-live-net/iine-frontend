<script lang="ts">
definePageMeta({ layout: 'simple' })
</script>

<script setup lang="ts">
import type { LoginApiCredential, LoginFrom } from '@/types/auth'

const { customerId, customerName } = useCustomer()
const { login, authToken, authUser, authError } = useAuth()

const router = useRouter()
const onLogin = async (form: LoginFrom) => {
  const credential: LoginApiCredential = {
    customerId: customerId.value ?? 0,
    username: form.username,
    password: form.password,
  }
  await login(credential)
  if (authError.value) return
  if (!authToken.value) return
  if (!authUser.value) return

  router.push({ name: 'index' })
}
</script>

<template>
  <div class="auth-login">
    <div class="auth-login__navigation">
      <nuxt-link :to="{ name: 'index' }">HOME</nuxt-link>
    </div>
    <div class="auth-login__card">
      <h5 class="form-title">{{ customerName }} 管理者ログイン</h5>
      <p v-if="authError?.status" class="form-caution">
        ログイン認証できませんでした
      </p>
      <div>
        <EditorLogin :customerName="customerName" @login="onLogin" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.auth-login {
  width: 100%;
  height: 100vh;
  padding: 0 0.5rem;
  &__navigation {
    padding: 1rem;
  }
  &__card {
    max-width: 30rem;
    color: black;
    background-color: white;
    border-radius: 12px;
    padding: 2rem;
    margin: 2rem auto;
    .form-title {
      font-size: 1rem;
      font-weight: bold;
      margin-bottom: 1.5rem;
      text-align: center;
    }
    .form-caution {
      margin-bottom: 1.5rem;
      color: crimson;
    }
    .form-success {
      margin-bottom: 1.5rem;
      color: mediumseagreen;
      font-weight: bold;
    }
  }
}
</style>
