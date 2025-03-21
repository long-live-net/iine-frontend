<script setup lang="ts">
withDefaults(defineProps<{ value?: string | null }>(), {
  value: '',
})
</script>
<template>
  <BaseWysiwygEditorTiptapViewer
    :value="value"
    class="g-theme-wysiwyg-contents"
  />
</template>
