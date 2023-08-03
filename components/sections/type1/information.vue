<script setup lang="ts">
import type { InformationType } from '@/types/content'

defineProps<{ informationData: InformationType }>()
</script>

<template>
  <GuiContentCard :loading="false" class="type1-information">
    <GuiEyecatchImage
      v-if="informationData.image"
      :url="informationData.image.url"
      :settings="informationData.image.settings"
      class="eyecatcher"
    >
      <GuiEyecatchTitles
        place="section"
        :title="informationData.title"
        :subtitle="informationData.subtitle"
        class="eyecatcher__titles"
      />
      <div class="image-settings">
        <div>イメージセッティグ</div>
      </div>
    </GuiEyecatchImage>
    <GuiContentCardBody v-if="informationData.body?.length">
      {{ informationData.body }}
    </GuiContentCardBody>
    <div class="edit-activator">
      <div>編集ボタン</div>
    </div>
  </GuiContentCard>
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
    background-color: rgba(255, 255, 255, 0.5);
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
    background-color: rgba(255, 255, 255, 0.5);
  }
}

@media only screen and (max-width: $grid-breakpoint-md) {
  .type1-information {
    .eyecatcher {
      height: 50vh;
      max-height: $eyecatcher-height-sm;
      min-height: calc($eyecatcher-height-sm * 0.5);
    }
  }
}
</style>
