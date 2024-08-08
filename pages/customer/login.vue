<script setup lang="ts">
import type { LoginApiCredential, LoginForm } from '@/types/auth'

definePageMeta({ layout: 'simple' })

const { customerId, customerName } = useCustomer()
const { login, authToken, authUser, authError } = useAuth()
const { addSnackber } = useSnackbars()

const route = useRoute()
const router = useRouter()

const onLogin = async (form: LoginForm) => {
  const credential: LoginApiCredential = {
    customerId: customerId.value ?? 0,
    username: form.username,
    password: form.password,
  }
  await login(credential)
  if (authError.value) return
  if (!authToken.value) return
  if (!authUser.value) return

  addSnackber?.('ログイン成功しました')
  addSnackber?.(`ようこそ ${authUser.value.name} さん`, 'info')
  router.push({ name: 'index' })
}

const isReauthorization = computed(() => route.query?.reauthorization)
const backhomeLabel = computed(() =>
  isReauthorization.value
    ? 'ログインせずに閲覧のみ行う（ホームへ）'
    : 'ホームに戻る'
)
</script>

<template>
  <div class="auth-login">
    <p v-if="isReauthorization" class="auth-login__note">
      管理者権限を維持するには再ログインが必要です。
    </p>
    <div class="auth-login__card">
      <h5 class="form-title">{{ customerName }} 管理者ログイン</h5>
      <p v-if="authError?.status" class="form-caution">
        {{ authError?.message ?? 'ログインできません' }}
      </p>
      <div>
        <ManageCustomerLogin :customer-name="customerName" @login="onLogin" />
      </div>
    </div>
    <div class="auth-login__navigation">
      <nuxt-link :to="{ name: 'index' }">{{ backhomeLabel }}</nuxt-link>
    </div>
  </div>
</template>

<style scoped lang="scss">
.auth-login {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  &__note {
    color: $error;
    font-size: 14px;
    font-weight: bolder;
    margin-bottom: 1rem;
  }
  &__card {
    width: 90%;
    max-width: 30rem;
    color: $black;
    background-color: $white;
    border-radius: 12px;
    padding: 2rem;
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
  &__navigation {
    margin-top: 2rem;
    text-align: center;
  }
}
</style>
