<script setup lang="ts">
import type { ContactForm, ImageSettings } from '@/types/content'

const customerId = 1 // TODO: 適当！！
const canEdit = true // TODO: 適当

const {
  nextKey,
  getContact,
  setContactImageSettings,
  contactRef,
  loading: readLoading,
} = useContactRead(customerId)

const {
  createContact,
  updateContact,
  removeContact,
  updateContactImageSettings,
  loading: writeLoading,
} = useContactWrite(customerId)

const onCreate = async (formData: ContactForm) => {
  const savedData = await createContact(formData)
  nextKey()
  getContact(savedData?.id)
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
  nextKey()
  getContact(savedData?.id)
}

const onRemove = async (id: number) => {
  await removeContact(id)
  nextKey()
  getContact()
}

const onUpdateImageSetting = (settings: Partial<ImageSettings>) => {
  if (!contactRef.value?.id) return

  const newSettings = setContactImageSettings(settings)
  if (!newSettings) return

  updateContactImageSettings(contactRef.value.id, newSettings)
}

const loading = computed(() => readLoading.value || writeLoading.value)

await getContact()
</script>

<template>
  <GuiContentWrap :loading="loading">
    <GuiContentCard class="type1-contact">
      <GuiEyecatchImage
        v-if="contactRef?.image"
        :url="contactRef?.image?.url"
        :settings="contactRef?.image?.settings"
        class="eyecatcher"
      >
        <GuiEyecatchTitles
          place="section"
          :title="contactRef?.title"
          :subtitle="contactRef?.subtitle"
          class="eyecatcher__titles"
        />
        <div
          v-if="canEdit && contactRef?.image?.settings"
          class="image-settings"
        >
          <GuiImageSetting
            :settings="contactRef.image.settings"
            @update="onUpdateImageSetting"
          />
        </div>
      </GuiEyecatchImage>
      <GuiContentCardBody>
        <div v-if="contactRef?.body" v-html="htmlSanitizer(contactRef?.body)" />
        <div v-else class="no-items">
          <p>データがありません</p>
          <div v-if="canEdit">
            <ScreenFormContact
              activaterLabel="コンテンツを登録してください"
              @create="onCreate"
            />
          </div>
        </div>
      </GuiContentCardBody>
      <div v-if="canEdit && contactRef?.id" class="edit-activator">
        <ScreenFormContact
          :contact-data="contactRef"
          @update="onUpdate"
          @remove="onRemove"
        />
      </div>
    </GuiContentCard>
  </GuiContentWrap>
</template>

<style scoped lang="scss">
$eyecatcher-height: 500px;
$eyecatcher-height-sm: 600px;

.type1-contact {
  position: relative;
  .edit-activator {
    position: absolute;
    top: 1rem;
    right: 1rem;
  }
  .no-items {
    display: flex;
    flex-direction: column;
    align-items: center;
    row-gap: 1rem;
    p {
      font-weight: bold;
      color: $warning;
    }
  }
}
.eyecatcher {
  position: relative;
  height: 30vh;
  min-height: 400px;
  max-height: $eyecatcher-height;
  min-height: calc($eyecatcher-height * 0.5);
  &__titles {
    position: absolute;
    top: 50%;
    left: 50%;
  }
  .image-settings {
    position: absolute;
    bottom: 1rem;
    right: 1rem;
  }
}

@media only screen and (max-width: $grid-breakpoint-md) {
  .eyecatcher {
    height: 50vh;
    max-height: $eyecatcher-height-sm;
    min-height: calc($eyecatcher-height-sm * 0.5);
    .image-settings {
      bottom: 0.5rem;
      right: 0.5rem;
    }
  }
}
</style>
