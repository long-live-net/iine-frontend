const QUERY_NAMR_FOR_FILE = 'iinefile'
const QUERY_NAMR_FOR_IMAGEFILE = 'iineimagefile'

export const useFilePost = (customerId: Ref<number | null>, kind: string) => {
  const loading = ref(false)
  const { authorizationHeader } = useAuth()

  const postFileData = async (file: File): Promise<{ fileUrl: string }> => {
    const formData = new FormData()
    formData.append(QUERY_NAMR_FOR_FILE, file)
    try {
      loading.value = true
      const response = await $fetch('/uploads/file', {
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

  const postImageData = async (
    imageFile: File
  ): Promise<{ fileUrl: string }> => {
    const formData = new FormData()
    formData.append(QUERY_NAMR_FOR_IMAGEFILE, imageFile)
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
    postFileData,
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
export const getAccesstableImageExtensions = () => acceptableImageExtensions
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
export const getAccesstableImageTypes = () => accesstableImageTypes
export const isImageFileByType = (file: File) => {
  const type = file.type
  return accesstableImageTypes.includes(type)
}

export const isImageFile = (file: File) =>
  isImageFileByType(file) || isImageFileByExt(file)

const accessiblePdfTypes = ['application/pdf']
export const getAccesstablePdfTypes = () => accessiblePdfTypes
