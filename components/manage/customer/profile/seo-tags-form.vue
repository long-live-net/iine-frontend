<script setup lang="ts">
import type { CustomerSetting, SeoTagForm } from '@/types/customer-setting'

const props = withDefaults(
  defineProps<{
    customerSetting: CustomerSetting | null
    loading?: boolean
  }>(),
  { loading: false }
)
const emit = defineEmits<{
  cancel: []
  update: [form: SeoTagForm]
}>()

const { handleSubmit, formData } = useCustomerSeoTagsForm()
watch(
  () => props.customerSetting,
  () => {
    if (props.customerSetting) {
      props.customerSetting.seoTags?.forEach((t) => {
        switch (t.keyName) {
          case 'title':
            formData.title.value.value = t.content
            break
          case 'description':
            formData.description.value.value = t.content
            break
          case 'ogImage':
            formData.ogImage.value.value = t.content
            break
        }
      })
    }
  },
  {
    immediate: true,
  }
)

const { customerId } = useCustomer()
const accesstableImageTypes = ['image/jpeg', 'image/png', 'image/gif']
const { postImageData, loading: imageUploading } = useFilePost(
  customerId,
  'meta-data'
)
const { compressing, compress } = useImageCompression()
const onChangeImageFile = async (imageFile: File) => {
  if (!isImageFile(imageFile)) {
    return
  }
  const { compressedImageFile } = await compress(imageFile)
  const response = await postImageData(compressedImageFile)
  formData.ogImage.value.value = response.fileUrl
}
const isImageLoading = computed(() => imageUploading.value || compressing.value)

const { getSeoTagName } = useCustomerSeoTags()
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
      <div>
        <p class="notion">
          <small>
            {{ `※ ${getSeoTagName('title')} は 32 文字以内が望ましいです` }}
          </small>
        </p>
        <v-text-field
          v-model="formData.title.value.value"
          :error-messages="formData.title.errorMessage.value"
          clearable
          :label="getSeoTagName('title')"
          placeholder="title を入力してください"
          counter
        />
      </div>
      <div>
        <p class="notion">
          <small>
            {{
              `※ ${getSeoTagName('description')} は 80 文字以内が望ましいです`
            }}
          </small>
        </p>
        <v-text-field
          v-model="formData.description.value.value"
          :error-messages="formData.description.errorMessage.value"
          clearable
          :label="getSeoTagName('description')"
          placeholder="description を入力してください"
          counter
        />
      </div>
      <div>
        <p class="notion">
          <small>
            {{
              `※ ${getSeoTagName('ogImage')} 画像は 1200 x 630 ピクセルが望ましいです`
            }}
          </small>
        </p>
        <BaseFileInputImage
          :image-url="formData.ogImage.value.value ?? undefined"
          :label="`${getSeoTagName('ogImage')} 画像`"
          :error-messages="formData.ogImage.errorMessage.value"
          :loading="isImageLoading"
          :accessables="accesstableImageTypes"
          @change-image-file="onChangeImageFile"
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

  .notion {
    margin-bottom: 0.5rem;

    small {
      color: $red;
    }
  }
}

.actions {
  margin-top: 0.5rem;
  padding: 0 1rem;
  text-align: right;
}
</style>
