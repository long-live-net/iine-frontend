<script setup lang="ts">
const emit = defineEmits<{ 'input-image': [imageFile: File] }>()

const isDragEnter = ref(false)
const onDragEnter = () => {
  isDragEnter.value = true
}
const onDragLeave = () => {
  isDragEnter.value = false
}
const onDragOver = () => {
  isDragEnter.value = true
}
const onDropFile = async (ev: DragEvent) => {
  isDragEnter.value = false
  if (ev.dataTransfer && ev.dataTransfer.files && ev.dataTransfer.files[0]) {
    emit('input-image', ev.dataTransfer.files[0])
  }
}
const accesstable = getAccesstableImageTypes().join()
const fileInput = ref<HTMLInputElement | null>(null)
const onChangeFile = async (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target && target.files && target.files[0]) {
    emit('input-image', target.files[0])
  }
}

const clickFileInput = () => {
  fileInput.value?.click()
}

defineExpose({ clickFileInput })
</script>

<template>
  <div class="tiptap-frame">
    <div
      :class="{ 'drag-enter': isDragEnter }"
      @dragenter="onDragEnter"
      @dragleave="onDragLeave"
      @dragover.prevent="onDragOver"
      @drop.prevent="onDropFile"
    >
      <slot />
    </div>
    <input
      ref="fileInput"
      type="file"
      hidden
      :accept="accesstable"
      @change="onChangeFile"
    />
  </div>
</template>

<style scoped lang="scss">
.tiptap-frame {
  .drag-enter {
    opacity: 0.5;
    cursor: copy;
  }
}
</style>
