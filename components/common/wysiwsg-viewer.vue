<script setup lang="ts">
import { htmlSanitizer } from '@/utils/sanitizer'

withDefaults(defineProps<{ value?: string | null }>(), {
  value: '',
})
</script>

<template>
  <!-- eslint-disable-next-line vue/no-v-html -->
  <div v-if="value" class="wysiwsg-viewer" v-html="htmlSanitizer(value)" />
</template>

<style lang="scss" scoped>
.wysiwsg-viewer {
  :deep(img) {
    max-width: 100% !important;
    height: auto !important;
    cursor: auto !important;
  }
}
</style>
