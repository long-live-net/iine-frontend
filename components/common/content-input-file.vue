<script setup lang="ts">
const fileUrl = defineModel<string>('url')
const fileName = defineModel<string>('name')
const fileType = defineModel<string>('type')
const props = defineProps<{
  label?: string
  accessables?: string[]
  errorMessages?: string | string[]
  customerId: string | null
  apiKind: string
}>()

const { customerId, apiKind } = toRefs(props)
const { postFileData, loading: isLoading } = useFilePost(
  customerId,
  apiKind.value
)
const onChangeFile = async (file: File) => {
  const response = await postFileData(file)
  fileUrl.value = response.fileUrl
  fileName.value = file.name
  fileType.value = file.type
}
</script>

<template>
  <BaseFileInputFile
    :file-url="fileUrl"
    :file-name="fileName"
    :file-type="fileType"
    :label="label"
    :error-messages="errorMessages"
    :loading="isLoading"
    :accessables="accessables"
    @change-file="onChangeFile"
  />
</template>
