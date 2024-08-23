export const useFilePost = (customerId: Ref<number | null>, kind: string) => {
  const loading = ref(false)
  const { authorizationHeader } = useAuth()

  const postImageData = async (
    imageFile: File
  ): Promise<{ fileUrl: string }> => {
    const formData = new FormData()
    formData.append('imagefile', imageFile)
    try {
      loading.value = true
      const response = await $fetch('/uploads/image', {
        baseURL: backendBaseUrl,
        method: 'POST',
        headers: authorizationHeader.value,
        params: { customerId: customerId.value, kind },
        body: formData,
      })
      return response as { fileUrl: string }
    } catch (e) {
      throw createError(e as Error)
    } finally {
      loading.value = false
    }
  }

  return {
    postImageData,
    loading,
  }
}

const acceptableImageExtensions = [
  'jpg',
  'JPG',
  'jpeg',
  'jpeg',
  'png',
  'PNG',
  'gif',
  '.webp',
]
export const isImageFileByExt = (file: File) => {
  const ext = file.name.split('.').pop() ?? 'bad-file'
  return acceptableImageExtensions.includes(ext)
}
const accesstableImageTypes = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
]
export const isImageFileByType = (file: File) => {
  const type = file.type
  return accesstableImageTypes.includes(type)
}
export const getAccesstableImageTypes = () => accesstableImageTypes

export const isImageFile = (file: File) =>
  isImageFileByType(file) || isImageFileByExt(file)
