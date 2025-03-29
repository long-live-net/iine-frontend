<script setup lang="ts">
import type { ContentEditMode } from '@/types/content'

const modal = defineModel<boolean>('modal', { required: true })
const props = defineProps<{
  editMode: ContentEditMode
  contentTitle: string
  loading?: boolean
}>()

const titleLabel = computed(
  () => `${props.contentTitle}を${props.editMode === 'new' ? '追加' : '変更'}`
)
const titleIcon = computed(() =>
  props.editMode === 'new'
    ? 'mdi-plus'
    : props.editMode === 'image'
      ? 'mdi-image'
      : 'mdi-pencil'
)
const titleColor = computed(() =>
  props.editMode === 'new' ? 'info' : 'success'
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
    <div class="content-edit-dialog">
      <CommonContentWrap :loading="loading">
        <slot />
      </CommonContentWrap>
    </div>
  </CommonModalDialog>
</template>

<style lang="scss" scoped>
.content-edit-dialog {
  min-width: 60dvw;
  max-width: 840px;
}
</style>
