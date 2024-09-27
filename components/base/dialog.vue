<script setup lang="ts">
const modal = defineModel<boolean>('modal', { required: true })
withDefaults(
  defineProps<{
    width?: number | string
    maxWidth?: number | string
    persistent?: boolean
  }>(),
  {
    width: 'auto',
    maxWidth: 'auto',
    persistent: false,
  }
)
</script>

<template>
  <v-dialog
    v-model="modal"
    :width="width"
    :max-width="maxWidth"
    :persistent="persistent"
    scrollable
  >
    <slot />
  </v-dialog>
</template>
