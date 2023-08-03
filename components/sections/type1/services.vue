<script setup lang="ts">
import type { ServiceType } from '@/types/content'

defineProps<{ services: ServiceType[] }>()
</script>

<template>
  <GuiContentWrap :loading="false" class="type1-services">
    <GuiContentGrid :contents="services" class="type1-services__grid">
      <template #default="{ content }">
        <div class="service-item">
          <h5 class="service-item__title">
            {{ content.title }}
          </h5>
          <GuiEyecatchImage
            v-if="content.image"
            :url="content.image.url"
            :settings="content.image.settings"
            circle
            class="service-item__eyecatcher"
          />
          <div class="service-item__body">
            {{ content.body }}
          </div>
          <div class="edit-activator">
            <div>編集</div>
          </div>
        </div>
      </template>
    </GuiContentGrid>
    <div class="create-activator">
      <div>追加ボタン</div>
    </div>
  </GuiContentWrap>
</template>

<style lang="scss" scoped>
.type1-services {
  position: relative;
  &__grid {
    margin: 0 2rem;
  }
  .create-activator {
    position: absolute;
    top: -1rem;
    right: 3rem;
    background-color: rgba(255, 255, 255, 0.5);
  }

  .service-item {
    position: relative;
    &__title {
      text-align: center;
      font-weight: bold;
      font-size: 1.1rem;
      margin: 0;
    }
    &__eyecatcher {
      margin-top: 1rem;
      aspect-ratio: 6 / 5;
    }
    &__body {
      text-align: left;
      margin-top: 1rem;
    }
    .edit-activator {
      position: absolute;
      top: 0.5rem;
      left: 0.5rem;
    }
  }
}
</style>
