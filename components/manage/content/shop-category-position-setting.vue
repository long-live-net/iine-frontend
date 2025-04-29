<script setup lang="ts">
import type { ShopCategoryType } from '@/types/content'

const modal = defineModel<boolean>('modal', { required: true })
defineProps<{ shopCategories: ShopCategoryType[] }>()
defineEmits<{ update: [contents: ShopCategoryType[]] }>()
</script>

<template>
  <CommonContentCategoryPositionSetting
    v-model:modal="modal"
    :categories="shopCategories"
    content-title="カテゴリ"
    @update="$emit('update', $event)"
  />
</template>
