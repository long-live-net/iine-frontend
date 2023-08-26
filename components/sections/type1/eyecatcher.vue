<script setup lang="ts">
import type { ImageSettings } from '@/types/content'
import type { EyecatchForm } from '@/types/content'

const customerId = 1 // TODO: 適当！！
const canEdit = true // TODO: 適当

const {
  nextKey,
  getEyecatch,
  setEyecatchImageSettings,
  eyecatchRef,
  loading: readLoading,
} = useEyecatchRead(customerId)

const {
  createEyecatch,
  updateEyecatch,
  removeEyecatch,
  updateEyecatchImageSettings,
  loading: writeLoading,
} = useEyecatchWrite(customerId)

const onCreate = async (formData: EyecatchForm) => {
  const savedData = await createEyecatch(formData)
  nextKey()
  getEyecatch(savedData?.id)
}

const onUpdate = async ({
  id,
  formData,
}: {
  id: number
  formData: EyecatchForm
}) => {
  if (!id) return

  const savedData = await updateEyecatch(id, formData)
  nextKey()
  getEyecatch(savedData?.id)
}

const onRemove = async (id: number) => {
  await removeEyecatch(id)
  nextKey()
  getEyecatch()
}

const onUpdateImageSetting = (settings: Partial<ImageSettings>) => {
  if (!eyecatchRef.value?.id) return

  const newSettings = setEyecatchImageSettings(settings)
  if (!newSettings) return

  updateEyecatchImageSettings(eyecatchRef.value.id, newSettings)
}

const loading = computed(() => readLoading.value || writeLoading.value)

await getEyecatch()
</script>

<template>
  <GuiContentWrap
    class="type1-eyecatcher"
    :loading="loading"
    loadingSize="large"
  >
    <GuiEyecatchImage
      :url="eyecatchRef?.image?.url"
      :settings="eyecatchRef?.image?.settings"
      class="eyecatcher"
    >
      <GuiEyecatchTitles
        place="top"
        :title="eyecatchRef?.title"
        :subtitle="eyecatchRef?.subtitle"
        class="titles"
      />
      <div
        v-if="canEdit && eyecatchRef?.image?.settings"
        class="image-settings"
      >
        <GuiImageSetting
          :settings="eyecatchRef.image.settings"
          @update="onUpdateImageSetting"
        />
      </div>
    </GuiEyecatchImage>
    <div v-if="canEdit" class="edit-activator">
      <SectionsEditEyecatcher
        v-if="eyecatchRef?.id"
        :eyecatch-data="eyecatchRef"
        @update="onUpdate"
        @remove="onRemove"
      />
      <SectionsEditEyecatcher
        v-else
        :eyecatch-data="eyecatchRef"
        activaterLabel="トップ画像を登録してください"
        @create="onCreate"
      />
    </div>
  </GuiContentWrap>
</template>

<style lang="scss" scoped>
.type1-eyecatcher {
  position: relative;
  .edit-activator {
    position: absolute;
    top: 8.5rem;
    right: 2rem;
  }
}

.eyecatcher {
  position: relative;
  height: 100vh;
  min-height: 400px;
  .titles {
    position: absolute;
    top: 70%;
    left: 50%;
  }
  .image-settings {
    position: absolute;
    bottom: 2rem;
    right: 2rem;
    background-color: rgba(255, 255, 255, 0.6);
  }
}
@media only screen and (max-width: $grid-breakpoint-md) {
  .eyecatcher {
    height: 100vh;
    min-height: auto;
    .image-settings {
      bottom: 0.25rem;
      right: 0.25rem;
    }
  }
}
</style>
