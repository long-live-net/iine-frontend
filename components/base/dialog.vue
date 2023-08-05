<script setup lang="ts">
const props = defineProps<{ modal: boolean }>()
const emit = defineEmits<{
  'update:modal': [modal: boolean]
}>()

const dialog = computed({
  get: () => props.modal,
  set: (modal: boolean) => {
    emit('update:modal', modal)
  },
})
</script>

<template>
  <v-dialog v-model="dialog" max-width="800">
    <slot />
  </v-dialog>
</template>
