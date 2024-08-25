<script setup lang="ts">
const model = defineModel<string>()
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
  model.value = response.fileUrl
}
const isLoading = computed(
  () => compressing.value || inputBodyImagePosting.value
)
</script>

<template>
  <BaseFileInput
    :image-url="model"
    :label="label"
    :error-messages="errorMessages"
    :loading="isLoading"
    :accessables="accesstableImageTypes"
    @change-image-file="onChangeImageFile"
  />
</template>
