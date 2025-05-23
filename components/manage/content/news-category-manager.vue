<script setup lang="ts">
import type { NewsCategoryType } from '@/types/content'

const modal = defineModel<boolean>('modal', { required: true })
defineProps<{
  contentTitle: string
  newsCategories: NewsCategoryType[]
}>()
defineEmits<{
  update: [category: NewsCategoryType]
  delete: [category: NewsCategoryType]
}>()
</script>

<template>
  <CommonModalDialog
    v-model:modal="modal"
    :title="`${contentTitle}管理`"
    title-icon="mdi-pencil"
    title-icon-color="info"
  >
    <div class="news-category-list">
      <h4 class="mb-2 pl-4">{{ contentTitle }}一覧</h4>
      <div
        v-for="category in newsCategories"
        :key="category.id"
        class="list-field"
      >
        <div class="list-field__item">
          <div>
            <PublishNewsCategoryBadge
              :category="{
                name: category.category,
                color: category.color,
              }"
            />
          </div>
          <div>
            <v-btn
              icon
              color="success"
              size="x-small"
              elevation="4"
              @click="$emit('update', category)"
            >
              <v-icon icon="mdi-pencil" size="x-large" />
            </v-btn>
            <v-btn
              icon
              color="grey-darken-1"
              size="x-small"
              elevation="4"
              class="ml-2"
              @click="$emit('delete', category)"
            >
              <v-icon icon="mdi-delete" size="x-large" />
            </v-btn>
          </div>
        </div>
      </div>
    </div>
  </CommonModalDialog>
</template>

<style scoped lang="scss">
.news-category-list {
  width: 360px;
  max-width: 98%;

  .list-field {
    padding-left: 2rem;

    &__item {
      display: flex;
      align-items: center;
      margin-bottom: 4px;
      gap: 1.5rem;
    }
  }
}
</style>
