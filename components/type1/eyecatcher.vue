<script setup lang="ts">
import type { EyecatchType } from '@/types/content-types'

type TopEyeCatcherProps = {
  udata: EyecatchType
}
defineProps<TopEyeCatcherProps>()
</script>

<template>
  <GuiSectionWrap :loading="false" class="type1-eyecatcher">
    <GuiEyecatchImage :image="udata.image" class="eyecatcher">
      <GuiEyecatchTitles
        place="top"
        :title="udata.title"
        :subtitle="udata.subtitle"
        class="titles"
      />
    </GuiEyecatchImage>
    <div class="image-settings">
      <div>イメージセッティグ</div>
    </div>
    <div class="edit-activator">
      <div>編集ボタン</div>
    </div>
  </GuiSectionWrap>
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
  .image-settings {
    position: absolute;
    bottom: 2rem;
    right: 2rem;
    background-color: rgba(255, 255, 255, 0.5);
  }
  .edit-activator {
    position: absolute;
    top: 10rem;
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
