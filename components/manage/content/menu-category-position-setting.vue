<script setup lang="ts">
import type { MenuCategoryType } from '@/types/content'

const modal = defineModel<boolean>('modal', { required: true })
defineProps<{ menuCategories: MenuCategoryType[] }>()
defineEmits<{ update: [contents: MenuCategoryType[]] }>()
</script>

<template>
  <CommonContentCategoryPositionSetting
    v-model:modal="modal"
    :categories="menuCategories"
    content-title="メニューカテゴリ"
    @update="$emit('update', $event)"
  />
</template>
