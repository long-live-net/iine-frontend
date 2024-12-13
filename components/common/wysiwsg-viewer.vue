<script setup lang="ts">
withDefaults(defineProps<{ value?: string | null }>(), {
  value: '',
})
</script>
<template>
  <BaseWysiwsgEditorTiptapViewer
    :value="value"
    class="g-theme-wysiwyg-contents"
  />
</template>
