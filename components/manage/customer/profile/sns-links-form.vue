<script setup lang="ts">
import type { CustomerSetting, SnsLinksForm } from '@/types/customer-setting'

const props = withDefaults(
  defineProps<{
    customerSetting: CustomerSetting | null
    loading: boolean
  }>(),
  {
    customerSetting: null,
    loading: false,
  }
)
const emit = defineEmits<{
  cancel: []
  update: [form: SnsLinksForm]
}>()

const { handleSubmit, formData } = useCustomerSnsLinksForm()
watch(
  () => props.customerSetting,
  () => {
    if (props.customerSetting) {
      props.customerSetting.snsLinks?.forEach((l) => {
        switch (l.serviceName) {
          case 'facebook':
            formData.facebook.value.value = l.url
            break
          case 'instagram':
            formData.instagram.value.value = l.url
            break
          case 'twitter':
            formData.twitter.value.value = l.url
            break
          case 'youtube':
            formData.youtube.value.value = l.url
            break
        }
      })
    }
  },
  {
    immediate: true,
  }
)
const { getSnsTitle, getSnsIcon, getSnsColor } = useCustomerSnsLinks()

const onUpdate = handleSubmit((userForm) => {
  emit('update', userForm)
})
const onCancel = () => {
  emit('cancel')
}
</script>

<template>
  <div>
    <v-form class="customer-form">
      <div class="d-flex align-center">
        <div class="g-block-lg pb-6 mr-2">
          <v-icon :color="getSnsColor('facebook')" size="large">
            {{ getSnsIcon('facebook') }}
          </v-icon>
        </div>
        <v-text-field
          v-model="formData.facebook.value.value"
          :error-messages="formData.facebook.errorMessage.value"
          clearable
          :label="getSnsTitle('facebook')"
          placeholder="URLを入力してください"
        />
      </div>
      <div class="d-flex align-center">
        <div class="g-block-lg pb-6 mr-2">
          <v-icon :color="getSnsColor('instagram')" size="large">
            {{ getSnsIcon('instagram') }}
          </v-icon>
        </div>
        <v-text-field
          v-model="formData.instagram.value.value"
          :error-messages="formData.instagram.errorMessage.value"
          clearable
          :label="getSnsTitle('instagram')"
          placeholder="URLを入力してください"
        />
      </div>
      <div class="d-flex align-center">
        <div class="g-block-lg pb-6 mr-2">
          <v-icon :color="getSnsColor('twitter')" size="large">
            {{ getSnsIcon('twitter') }}
          </v-icon>
        </div>
        <v-text-field
          v-model="formData.twitter.value.value"
          :error-messages="formData.twitter.errorMessage.value"
          clearable
          :label="getSnsTitle('twitter')"
          placeholder="URLを入力してください"
        />
      </div>
      <div class="d-flex align-center">
        <div class="g-block-lg pb-6 mr-2">
          <v-icon :color="getSnsColor('youtube')" size="large">
            {{ getSnsIcon('youtube') }}
          </v-icon>
        </div>
        <v-text-field
          v-model="formData.youtube.value.value"
          :error-messages="formData.youtube.errorMessage.value"
          clearable
          :label="getSnsTitle('youtube')"
          placeholder="URLを入力してください"
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
.customer-form {
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
