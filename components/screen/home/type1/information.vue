<script setup lang="ts">
import type { InformationForm, ImageSettings } from '@/types/content'

const customerId = 1 // TODO: 適当！！
const canEdit = true // TODO: 適当

const {
  nextKey,
  getInformation,
  setInformationImageSettings,
  informationRef,
  loading: readLoading,
} = useInformationRead(customerId)

const {
  createInformation,
  updateInformation,
  removeInformation,
  updateInformationImageSettings,
  loading: writeLoading,
} = useInformationWrite(customerId)

const onCreate = async (formData: InformationForm) => {
  const savedData = await createInformation(formData)
  nextKey()
  getInformation(savedData?.id)
}

const onUpdate = async ({
  id,
  formData,
}: {
  id: number
  formData: InformationForm
}) => {
  if (!id) return

  const savedData = await updateInformation(id, formData)
  nextKey()
  getInformation(savedData?.id)
}

const onRemove = async (id: number) => {
  await removeInformation(id)
  nextKey()
  getInformation()
}

const onUpdateImageSetting = (settings: Partial<ImageSettings>) => {
  if (!informationRef.value?.id) return

  const newSettings = setInformationImageSettings(settings)
  if (!newSettings) return

  updateInformationImageSettings(informationRef.value.id, newSettings)
}

const loading = computed(() => readLoading.value || writeLoading.value)

await getInformation()
</script>

<template>
  <GuiContentWrap :loading="loading">
    <GuiContentCard class="type1-information">
      <GuiEyecatchImage
        v-if="informationRef?.image"
        :url="informationRef?.image?.url"
        :settings="informationRef?.image?.settings"
        class="eyecatcher"
      >
        <GuiEyecatchTitles
          place="section"
          :title="informationRef?.title"
          :subtitle="informationRef?.subtitle"
          class="eyecatcher__titles"
        />
        <div
          v-if="canEdit && informationRef?.image?.settings"
          class="image-settings"
        >
          <GuiImageSetting
            :settings="informationRef.image.settings"
            @update="onUpdateImageSetting"
          />
        </div>
      </GuiEyecatchImage>
      <GuiContentCardBody>
        <div
          v-if="informationRef?.body"
          v-html="htmlSanitizer(informationRef?.body)"
        />
        <div v-else class="no-items">
          <p>データがありません</p>
          <div v-if="canEdit">
            <ScreenFormInformation
              activaterLabel="コンテンツを登録してください"
              @create="onCreate"
            />
          </div>
        </div>
      </GuiContentCardBody>
      <div v-if="canEdit && informationRef?.id" class="edit-activator">
        <ScreenFormInformation
          :information-data="informationRef"
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

.type1-information {
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
