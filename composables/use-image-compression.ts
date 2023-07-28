import imageCompression from 'browser-image-compression'

const imageCompress = async (file: File) => {
  const blob = await imageCompression(file, {
    maxSizeMB: 1,
    maxWidthOrHeight: 1440,
  })
  // imageCompression の帰り値は File ではなく blob となってしまうので・・
  return new File([blob], file.name, { lastModified: file.lastModified })
}

const getImageDataUrl = async (file: File) =>
  await imageCompression.getDataUrlFromFile(file)

export const useImageCompression = () => {
  const compressing = ref(false)

  const compress = async (imageFile: File) => {
    compressing.value = true
    const compressedImageFile = await imageCompress(imageFile)
    const compressedImageUrl = await getImageDataUrl(compressedImageFile)
    compressing.value = false
    return { compressedImageFile, compressedImageUrl }
  }

  return { compressing, compress }
}
