<script setup lang="ts">
import type { ContentType } from '@/types/content'

const props = defineProps<{
  modal: boolean
  content?: ContentType | ContentType[] | null
}>()
const emit = defineEmits<{
  'update:modal': [modal: boolean]
}>()

const dialog = computed({
  get: () => props.modal,
  set: (modal: boolean) => {
    emit('update:modal', modal)
  },
})

const isExists = computed(() =>
  Array.isArray(props.content) ? !!props.content[0]?.id : !!props.content?.id
)
const isUpdate = computed(() =>
  Array.isArray(props.content) ? false : !!props.content?.id
)
const activatorIcon = computed(() =>
  isUpdate.value ? 'mdi-pencil' : 'mdi-plus'
)
const activatorColor = computed(() => (isUpdate.value ? 'success' : 'info'))
const activatorText = computed(() =>
  isExists.value ? '' : 'コンテンツを登録してください'
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
