<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    modal: boolean
    maxWidth?: number
    persistent?: boolean
  }>(),
  {
    maxWidth: 800,
    persistent: false,
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
  <v-dialog
    v-model="dialog"
    :max-width="maxWidth"
    :persistent="persistent"
    scrollable
  >
    <slot />
  </v-dialog>
</template>
