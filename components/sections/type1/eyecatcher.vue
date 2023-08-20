<script setup lang="ts">
import type { EyecatchForm } from '@/types/content'

const customerId = 1 // TODO: 適当！！
const {
  nextKey,
  getEyecatch,
  eyecatchRef,
  loading: readLoading,
} = useEyecatchRead(customerId)

const {
  createEyecatch,
  updateEyecatch,
  loading: writeLoading,
} = useEyecatchWrite(customerId)

const onCreate = async (formData: EyecatchForm) => {
  await createEyecatch(formData)
  nextKey()
  getEyecatch()
}

const onUpdate = async (formData: EyecatchForm) => {
  if (eyecatchRef.value === null) return

  await updateEyecatch(eyecatchRef.value.id, formData)
  nextKey()
  getEyecatch()
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
      <div class="image-settings">
        <div>イメージセッティグ</div>
      </div>
    </GuiEyecatchImage>
    <div class="edit-activator">
      <SectionsEditEyecatcher
        v-if="eyecatchRef?.id"
        :eyecatch-data="eyecatchRef"
        @update="onUpdate"
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
    background-color: rgba(255, 255, 255, 0.5);
  }
}
@media only screen and (max-width: $grid-breakpoint-md) {
  .eyecatcher {
    height: 100vh;
    min-height: auto;
  }
  .image-settings {
    bottom: 1rem;
    right: 1rem;
  }
}
</style>
