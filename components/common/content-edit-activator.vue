<script setup lang="ts">
const props = defineProps<{
  modal: boolean
  isUpdate?: boolean
  activaterLabel?: string
  activaterSize?: 'x-small' | 'small' | 'default' | 'large' | 'x-large'
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

const activatorIcon = computed(() =>
  props.isUpdate ? 'mdi-pencil' : 'mdi-plus'
)
const activatorColor = computed(() => (props.isUpdate ? 'success' : 'info'))
</script>

<template>
  <BaseActivator
    v-model:modal="dialog"
    :activatorIcon="activatorIcon"
    :activator-color="activatorColor"
    :activator-text="activaterLabel"
    :activator-size="activaterSize"
  />
</template>
