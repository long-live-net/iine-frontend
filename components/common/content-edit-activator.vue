<script setup lang="ts">
import type { ContentEditMode } from '@/types/content'

const modal = defineModel<boolean>('modal', { required: true })
const props = withDefaults(
  defineProps<{
    editMode: ContentEditMode
    contentTitle: string
    noTooltip?: boolean
    size?: 'x-small' | 'small' | 'default' | 'large' | 'x-large'
  }>(),
  {
    noTooltip: false,
    size: 'default',
  }
)

const titleText = computed(
  () => `${props.contentTitle}を${props.editMode === 'new' ? '追加' : '変更'}`
)
const activatorIcon = computed(() =>
  props.editMode === 'new'
    ? 'mdi-plus'
    : props.editMode === 'image'
      ? 'mdi-image'
      : 'mdi-pencil'
)
const activatorColor = computed(() =>
  props.editMode === 'new' ? 'info' : 'success'
)
</script>

<template>
  <BaseActivator
    v-model:modal="modal"
    icon
    :no-tooltip="noTooltip"
    :activator-icon="activatorIcon"
    :activator-color="activatorColor"
    :activator-text="titleText"
    :activator-size="size"
  />
</template>
