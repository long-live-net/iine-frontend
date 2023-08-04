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

getEyecatch()
</script>

<template>
  <GuiContentWrap
    :loading="loading"
    :loading-size="150"
    :loading-width="20"
    class="type1-eyecatcher"
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
    </GuiEyecatchImage>
    <div class="edit-activator">
      <SectionsEditEyecatcher
        :eyecatch-data="eyecatchRef"
        @create="onCreate"
        @update="onUpdate"
      />
    </div>
    <div class="image-settings">
      <div>イメージセッティグ</div>
    </div>
  </GuiContentWrap>
</template>

<style lang="scss" scoped>
.type1-eyecatcher {
  position: relative;
  .eyecatcher {
    position: relative;
    height: 100vh;
    min-height: 400px;
    .titles {
      position: absolute;
      top: 70%;
      left: 50%;
    }
  }
  .edit-activator {
    position: absolute;
    top: 8.5rem;
    right: 2rem;
  }
  .image-settings {
    position: absolute;
    bottom: 2rem;
    right: 2rem;
    background-color: rgba(255, 255, 255, 0.5);
  }
}

@media only screen and (max-width: $grid-breakpoint-md) {
  .type1-top-eyecatcher {
    .eyecatcher {
      height: 100vh;
      min-height: auto;
    }
    .image-settings {
      bottom: 1rem;
      right: 1rem;
    }
  }
}
</style>
