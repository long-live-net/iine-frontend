<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    modal: boolean
    maxWidth?: number
  }>(),
  {
    maxWidth: 800,
  }
)
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
  <v-dialog v-model="dialog" :max-width="maxWidth" scrollable>
    <slot />
  </v-dialog>
</template>
