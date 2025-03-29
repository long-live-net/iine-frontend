<script setup lang="ts">
import type { ContentEditMode } from '@/types/content'

const modal = defineModel<boolean>('modal', { required: true })
const props = withDefaults(
  defineProps<{
    editMode: ContentEditMode
    contentTitle: string
    icon?: boolean
    noTooltip?: boolean
    size?: 'x-small' | 'small' | 'default' | 'large' | 'x-large'
  }>(),
  {
    icon: false,
    noTooltip: false,
    size: 'default',
  }
)

const titleText = computed(() => {
  if (props.icon) {
    return `${props.contentTitle}を${props.editMode === 'new' ? '追加' : '変更'}`
  }
  return `${props.contentTitle}${props.editMode === 'new' ? 'を登録してください' : 'を変更してください'}`
})
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
    :icon="icon"
    :no-tooltip="noTooltip"
    :activator-icon="activatorIcon"
    :activator-color="activatorColor"
    :activator-text="titleText"
    :activator-size="size"
  />
</template>
