<script setup lang="ts">
import type { EyecatchType } from '@/types/content-types'

const { loading = false } = defineProps<{
  contentId: number
  eyecatchData: EyecatchType
  loading: boolean
}>()

type EyecatchFormType = {
  title: string
  subtitle: string
  image: string
  imageFile: File | null
}
const eyecatcherForm = reactive<EyecatchFormType>({
  title: '',
  subtitle: '',
  image: '',
  imageFile: null,
})

const modal = ref(false)

const { compressing, compress } = useImageCompression()
const onChangeImageFile = async (imageFile: File) => {
  const { compressedImageFile, compressedImageUrl } = await compress(imageFile)
  eyecatcherForm.imageFile = compressedImageFile
  eyecatcherForm.image = compressedImageUrl
}

const validStateImage = computed(() => null)
</script>

<template>
  <GuiContentFormDialogActivator v-model:modal="modal" />
  <GuiContentFormDialog v-model:modal="modal">
    <template #header>
      <p class="mr-1">
        <v-icon icon="mdi-pencil-circle" color="success" size="x-large" />
      </p>
      <h3>コンテンツの編集</h3>
    </template>
    <template #default>
      <v-form>
        <div>
          <label for="eyecatcher-form-input-image">トップ背景画像</label>
          <GuiBaseFileInput
            id="eyecatcher-form-input-image"
            :image-url="eyecatcherForm.image"
            :state="validStateImage"
            :buzy="compressing"
            @change-image-file="onChangeImageFile"
          />
        </div>
        <div class="mt-8">
          <label for="eyecatcher-form-input-title">トップタイトル</label>
          <v-text-field
            v-model="eyecatcherForm.title"
            clearable
            placeholder="トップタイトルを入力してください"
          />
        </div>
        <div class="mt-4">
          <label for="eyecatcher-form-input-subtitle">サブタイトル</label>
          <v-text-field
            v-model="eyecatcherForm.subtitle"
            clearable
            placeholder="サブタイトルを入力してください"
          />
        </div>
        <div class="mt-4 mb-2 text-right">
          <v-btn
            prepend-icon="mdi-content-save"
            color="success"
            variant="flat"
            width="8rem"
          >
            保存する
          </v-btn>
          <v-btn
            prepend-icon="mdi-cancel"
            color="grey-lighten-2"
            variant="flat"
            width="8rem"
            class="ml-1"
            @click="modal = false"
          >
            キャンセル
          </v-btn>
        </div>
      </v-form>
    </template>
  </GuiContentFormDialog>
</template>
