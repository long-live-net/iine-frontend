import type { ContactType, ContactForm, ImageSettings } from '@/types/content'
import type { ContactGetApi, ContactSaveApi } from '@/types/API/content-api'

const apiKind = 'contacts'
export const getContactKind = () => apiKind

const useContactContent = (customerId: Ref<number | null>) => {
  const {
    loadData,
    get,
    setImageSettings,
    contentDataRef,
    loadingRef: readLoading,
  } = useContentRead<ContactGetApi>(customerId, apiKind)
  const {
    create,
    update,
    remove,
    updateImageSettingsWithDebounced,
    getDefaultImageSettings,
    loadingRef: writeLoading,
  } = useContentWrite<ContactSaveApi, ContactGetApi>(customerId, apiKind)

  const apitypeToContactType = (
    apiData?: ContactGetApi | null
  ): ContactType | null =>
    apiData
      ? {
          id: apiData.id,
          customerId: apiData.customerId,
          title: apiData.title,
          subtitle: apiData.subtitle,
          body: apiData.body,
          ...(apiData.image
            ? {
                image: {
                  url: apiData.image.url,
                  name: apiData.image.name ?? 'dummy_name',
                  type:
                    apiData.image.type ??
                    getFileTypeByExtention(getFileExtension(apiData.image.url)),
                  settings: apiData.image.settings,
                },
              }
            : {}),
        }
      : null

  const contactRef = computed<ContactType | null>(() =>
    apitypeToContactType(contentDataRef.value)
  )
  const loading = computed(() => readLoading.value || writeLoading.value)

  const formToContactSaveApi = (formData: ContactForm): ContactSaveApi => ({
    customerId: customerId.value ?? 0,
    title: formData.title,
    subtitle: formData.subtitle,
    body: formData.body,
    ...(formData.image && formData.imageName && formData.imageType
      ? {
          image: {
            url: formData.image,
            name: formData.imageName,
            type: formData.imageType,
            settings: formData.imageSettings ?? getDefaultImageSettings(),
          },
        }
      : {}),
  })

  const createContact = async (
    formData: ContactForm
  ): Promise<ContactType | null> => {
    const inputData: ContactSaveApi = formToContactSaveApi(formData)
    const data = await create(inputData)
    return apitypeToContactType(data ?? null)
  }

  const updateContact = async (
    contentId: number,
    formData: ContactForm
  ): Promise<ContactType | null> => {
    const inputData: ContactSaveApi = formToContactSaveApi(formData)
    const data = await update(contentId, inputData)
    return apitypeToContactType(data ?? null)
  }

  const setContactImageSettings = (
    settings: Partial<ImageSettings>
  ): ImageSettings | undefined => {
    if (!contactRef.value) return
    if (!contactRef.value.image?.settings) return

    const newSettings: ImageSettings = {
      ...contactRef.value.image.settings,
      ...settings,
    }
    setImageSettings(newSettings)
    return newSettings
  }

  const updateContactImageSettings = (
    contentId: number,
    imageSettings: ImageSettings
  ) => {
    updateImageSettingsWithDebounced(contentId, imageSettings)
  }

  return {
    loadContact: loadData,
    getContact: get,
    createContact,
    updateContact,
    removeContact: remove,
    setContactImageSettings,
    updateContactImageSettings,
    contactRef,
    loading,
  }
}

/**
 * Contact API アクションサービス
 * @param customerId
 */
export const useContactActions = (customerId: Ref<number | null>) => {
  const {
    loadContact,
    getContact,
    setContactImageSettings,
    createContact,
    updateContact,
    removeContact,
    updateContactImageSettings,
    contactRef,
    loading,
  } = useContactContent(customerId)

  const { addSnackber } = useSnackbars()

  const onLoad = async () => {
    await loadContact()
  }

  const onCreate = async (formData: ContactForm) => {
    const savedData = await createContact(formData)
    addSnackber?.('Contact を登録しました。')
    await getContact(savedData?.id)
  }

  const onUpdate = async ({
    id,
    formData,
  }: {
    id: number
    formData: ContactForm
  }) => {
    if (!id) return

    const savedData = await updateContact(id, formData)
    addSnackber?.('Contact を更新しました。')
    await getContact(savedData?.id)
  }

  const onRemove = async (id: number) => {
    await removeContact(id)
    addSnackber?.('Contact を削除しました。')
    await getContact()
  }

  const onUpdateImageSetting = (settings: Partial<ImageSettings>) => {
    if (!contactRef.value?.id) return

    const newSettings = setContactImageSettings(settings)
    if (!newSettings) return

    updateContactImageSettings(contactRef.value.id, newSettings)
  }

  return {
    contactRef,
    onLoad,
    onCreate,
    onUpdate,
    onRemove,
    onUpdateImageSetting,
    loading,
  }
}
