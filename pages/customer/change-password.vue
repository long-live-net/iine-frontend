<script setup lang="ts">
const { isLoggedIn } = useCustomerPageContext()
watch(
  isLoggedIn,
  (logined) => {
    if (!logined) {
      useRouter().replace({ name: 'index' })
    }
  },
  { immediate: true }
)
const { handleSubmit, formData } = useChangePasswordForm()
const { updatePassword, loading } = useUpdatePassword()

const changeDone = ref(false)
const passwordView = ref(false)

const onSubmit = handleSubmit(async (changePassword) => {
  await updatePassword(changePassword.password)
  changeDone.value = true
})
</script>

<template>
  <div class="change-password">
    <CommonContentCard>
      <template v-if="changeDone">
        <div class="change-password__container text-center">
          <h4>パスワードを変更しました</h4>
          <div class="text-center mt-10">
            <v-btn color="primary" width="250" @click="$router.push('/')">
              ホームに戻る
            </v-btn>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="change-password__container">
          <h3>パスワード変更</h3>
          <v-form class="form-frame" @submit.prevent.stop="onSubmit">
            <div class="form-input">
              <v-text-field
                v-model="formData.password.value.value"
                :error-messages="formData.password.errorMessage.value"
                :type="passwordView ? 'text' : 'password'"
                label="新しいパスワード"
                placeholder="パスワードを入力してください"
              />
            </div>
            <div class="form-input">
              <v-text-field
                v-model="formData.passwordConfirm.value.value"
                :error-messages="formData.passwordConfirm.errorMessage.value"
                :type="passwordView ? 'text' : 'password'"
                label="新しいパスワード (確認用)"
                placeholder="パスワード (確認用) を入力してください"
              />
            </div>
            <div>
              <v-btn
                variant="plain"
                :prepend-icon="passwordView ? 'mdi-eye' : 'mdi-eye-off'"
                :color="passwordView ? 'primary' : 'grey-darken-4'"
                :loading="loading"
                @click="passwordView = !passwordView"
              >
                パスワードを{{ passwordView ? '隠す' : '見る' }}
              </v-btn>
            </div>
            <div class="form-action">
              <v-btn type="submit" color="primary">
                パスワードを変更する
              </v-btn>
            </div>
          </v-form>
        </div>
      </template>
    </CommonContentCard>
  </div>
</template>

<style scoped lang="scss">
.change-password {
  padding-top: calc($nav-header-height + 4rem);
  padding-bottom: 4rem;
  &__container {
    max-width: 540px;
    margin: 0 auto;
    padding: 4rem;
    h3,
    h4 {
      margin-bottom: 1.5rem;
    }
  }
}

.form-frame {
  .form-input {
    margin-top: 1rem;
    margin-bottom: 1rem;
  }
  .form-action {
    margin-top: 2rem;
    text-align: center;
  }
}
</style>
