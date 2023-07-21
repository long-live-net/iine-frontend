<script setup lang="ts">
import type { ContactType } from '@/types/content-types'

defineProps<{ contactData: ContactType }>()
</script>

<template>
  <GuiContentCard :loading="false" class="type1-contact">
    <GuiEyecatchImage
      v-if="contactData.image"
      :url="contactData.image.url"
      :settings="contactData.image.settings"
      class="eyecatcher"
    >
      <GuiEyecatchTitles
        place="section"
        :title="contactData.title"
        :subtitle="contactData.subtitle"
        class="eyecatcher__titles"
      />
      <div class="image-settings">
        <div>イメージセッティグ</div>
      </div>
    </GuiEyecatchImage>
    <GuiContentCardBody v-if="contactData.body?.length">
      {{ contactData.body }}
    </GuiContentCardBody>
    <div class="edit-activator">
      <div>編集ボタン</div>
    </div>
  </GuiContentCard>
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
  .type1-contact {
    .eyecatcher {
      height: 50vh;
      max-height: $eyecatcher-height-sm;
      min-height: calc($eyecatcher-height-sm * 0.5);
    }
  }
}
</style>
