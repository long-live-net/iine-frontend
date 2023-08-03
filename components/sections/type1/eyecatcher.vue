<script setup lang="ts">
import type { EyecatchType } from '@/types/content'
import type { EyecatchInputType } from '@/types/content-input'

const customerId = 1 // TODO: 適当！！
const {
  get,
  contentDataRef: eyecatchData,
  loading,
} = useContentRead<EyecatchType>(customerId, '/eyecatches')

const { create, update } = useContentWrite<EyecatchType, EyecatchInputType>(
  customerId,
  '/eyecatches'
)

const onCreate = async (inputData: EyecatchInputType) => {
  const data = await create(inputData)
  get()
}

const onUpdate = async (inputData: EyecatchInputType) => {
  if (eyecatchData.value === null) return

  const data = await update(eyecatchData.value.id, inputData)
  get()
}

get()
</script>

<template>
  <GuiContentWrap :loading="loading" class="type1-eyecatcher">
    <GuiEyecatchImage
      :url="eyecatchData?.image?.url"
      :settings="eyecatchData?.image?.settings"
      class="eyecatcher"
    >
      <GuiEyecatchTitles
        place="top"
        :title="eyecatchData?.title"
        :subtitle="eyecatchData?.subtitle"
        class="titles"
      />
    </GuiEyecatchImage>
    <div class="edit-activator">
      <SectionsEditEyecatcher
        :eyecatch-data="eyecatchData"
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
