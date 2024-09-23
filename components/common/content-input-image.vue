<script setup lang="ts">
import type { ImageSettings } from '@/types/content'

const imageUrl = defineModel<string>('url')
const imageName = defineModel<string>('name')
const imageType = defineModel<string>('type')
const imageSetting = defineModel<ImageSettings | null>('settings')

const props = defineProps<{
  label?: string
  errorMessages?: string | string[]
  customerId: number | null
  apiKind: string
}>()

const { customerId, apiKind } = toRefs(props)
const accesstableImageTypes = getAccesstableImageTypes()
const { postImageData, loading: inputBodyImagePosting } = useFilePost(
  customerId,
  apiKind.value
)
const { compressing, compress } = useImageCompression()
const onChangeImageFile = async (imageFile: File) => {
  if (!isImageFile(imageFile)) {
    return
  }
  const { compressedImageFile } = await compress(imageFile)
  const response = await postImageData(compressedImageFile)
  imageUrl.value = response.fileUrl
  imageName.value = imageFile.name
  imageType.value = imageFile.type
  imageSetting.value = null
}
const isLoading = computed(
  () => compressing.value || inputBodyImagePosting.value
)
</script>

<template>
  <BaseFileInputImage
    :image-url="imageUrl"
    :image-name="imageName"
    :image-type="imageType"
    :label="label"
    :error-messages="errorMessages"
    :loading="isLoading"
    :accessables="accesstableImageTypes"
    @change-image-file="onChangeImageFile"
  />
</template>
