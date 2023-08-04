<script setup lang="ts">
import type { ContentType } from '@/types/content'

const props = defineProps<{ modal: boolean; content?: ContentType | null }>()
const emit = defineEmits<{
  'update:modal': [modal: boolean]
}>()

const dialog = computed({
  get: () => props.modal,
  set: (modal: boolean) => {
    emit('update:modal', modal)
  },
})
const activatorIcon = computed(() =>
  props.content?.id ? 'mdi-pencil' : 'mdi-plus'
)
const activatorColor = computed(() => (props.content?.id ? 'success' : 'info'))
const activatorText = computed(() =>
  props.content?.id ? '' : 'コンテンツを登録してください'
)
</script>

<template>
  <GuiBaseActivator
    v-model:modal="dialog"
    :activatorIcon="activatorIcon"
    :activator-color="activatorColor"
    :activator-text="activatorText"
  />
</template>
