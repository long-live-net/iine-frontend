<script setup lang="ts">
import type { ContentEditMode } from '@/types/content'

const modal = defineModel<boolean>('modal', { required: true })
const props = defineProps<{
  editMode: ContentEditMode
  contentTitle: string
  loading?: boolean
}>()

const titleText = computed(() =>
  props.editMode === 'new'
    ? '追加'
    : props.editMode === 'delete'
      ? '削除'
      : '変更'
)
const titleLabel = computed(() => `${props.contentTitle}を${titleText.value}`)
const titleIcon = computed(() =>
  props.editMode === 'new'
    ? 'mdi-plus'
    : props.editMode === 'delete'
      ? 'mdi-delete'
      : props.editMode === 'image'
        ? 'mdi-image'
        : 'mdi-pencil'
)
const titleColor = computed(() =>
  props.editMode === 'new'
    ? 'info'
    : props.editMode === 'delete'
      ? 'grey-darken-1'
      : 'success'
)
</script>

<template>
  <CommonModalDialog
    v-model:modal="modal"
    :title="titleLabel"
    :title-icon="titleIcon"
    :title-icon-color="titleColor"
    persistent
  >
    <CommonContentWrap :loading="loading">
      <slot />
    </CommonContentWrap>
  </CommonModalDialog>
</template>
