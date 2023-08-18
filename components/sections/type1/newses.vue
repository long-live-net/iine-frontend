<script setup lang="ts">
import type { NewsType } from '@/types/content'

defineProps<{ newses: NewsType[] }>()
const jstDateString = (pdate: Date) => formatLocalDate(pdate, 'YYYY/MM/DD')
</script>

<template>
  <GuiContentCard :loading="false" class="type1-news-list">
    <GuiContentCardBody>
      <GuiContentList :contents="newses">
        <template #default="{ content }">
          <div class="news-item">
            <div class="news-item__header g-theme-contets-item__header">
              <span>
                {{ jstDateString((content as NewsType).publishOn) }}
              </span>
              <GuiNewsCategoryBadge
                :category="(content as NewsType).category"
                style="margin-left: 0.5rem"
              />
            </div>
            <div class="news-item__title">
              <nuxt-link :to="`/news/${content.id}`">
                {{ content.title }}
              </nuxt-link>
            </div>
            <div class="edit-activator">
              <div>編集</div>
            </div>
          </div>
        </template>
      </GuiContentList>
    </GuiContentCardBody>
    <div class="type1-news-list__action">
      <NuxtLink to="/news">and more ...</NuxtLink>
    </div>
    <div class="create-activator">
      <SectionsEditNews @create="" />
    </div>
  </GuiContentCard>
</template>

<style lang="scss" scoped>
.type1-news-list {
  position: relative;
  min-height: 16rem;
  &__action {
    margin: 1.5rem 0;
    text-align: center;
  }
  .create-activator {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background-color: rgba(255, 255, 255, 0.5);
  }
  .news-item {
    position: relative;
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    gap: 0.5rem;
    &__header {
      padding: 0.2rem;
      text-align: center;
      width: 14rem;
      min-width: 14rem;
    }
    &__title {
      padding: 0.5rem;
      text-align: left;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .edit-activator {
      position: absolute;
      top: 0;
      left: -2rem;
    }
  }
}

@media only screen and (max-width: $grid-breakpoint-md) {
  .type1-news-list .news-item {
    flex-flow: column;
    align-items: stretch;
    padding: 0 0 0.6rem 0.3rem;
  }
}
</style>
