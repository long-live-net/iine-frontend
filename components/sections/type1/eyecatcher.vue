<script setup lang="ts">
import type { EyecatchType } from '@/types/content-types'

defineProps<{ eyecatchData: EyecatchType }>()
</script>

<template>
  <GuiContentWrap :loading="false" class="type1-eyecatcher">
    <GuiEyecatchImage
      :url="eyecatchData.image.url"
      :settings="eyecatchData.image.settings"
      class="eyecatcher"
    >
      <GuiEyecatchTitles
        place="top"
        :title="eyecatchData.title"
        :subtitle="eyecatchData.subtitle"
        class="titles"
      />
    </GuiEyecatchImage>
    <div class="edit-activator">
      <SectionsEditEyecatcher
        :content-id="1"
        :eyecatch-data="eyecatchData"
        :loading="false"
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
