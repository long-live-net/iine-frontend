<script setup lang="ts">
import { htmlSanitizer } from '@/utils/sanitizer'

withDefaults(defineProps<{ value?: string | null }>(), {
  value: '',
})
</script>

<template>
  <!-- eslint-disable-next-line vue/no-v-html -->
  <div v-if="value" class="tiptap-viewer" v-html="htmlSanitizer(value)" />
</template>

<style lang="scss" scoped>
.tiptap-viewer {
  :deep(ul),
  :deep(ol) {
    padding: 0 1rem 0 1.5rem;
    margin: 1rem 0;

    li p {
      margin-top: 0.25em;
      margin-bottom: 0.25em;
    }
  }
  :deep(ul) {
    list-style-type: disc;
  }

  :deep(img) {
    display: block;
    max-width: 100% !important;
    height: auto !important;
    cursor: auto !important;
  }

  :deep(iframe) {
    display: block;
    max-width: 100%;
    min-height: 200px;
    min-width: 200px;
    outline: 0px solid transparent;
  }

  :deep(div.table-wrapper-responsive) {
    max-width: 100%;
    margin: 1rem 0;
    overflow-x: auto;
  }

  :deep(table) {
    border-spacing: 2px;
    margin: 0;
    table-layout: fixed;
    width: auto;

    td,
    th {
      min-width: 1.5rem;
      padding: 4px 6px;
      position: relative;
      vertical-align: top;
      white-space: nowrap;

      > * {
        margin-bottom: 0;
      }
    }

    th {
      font-weight: bold;
      text-align: left;
    }
  }
}
</style>
