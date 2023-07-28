<script setup lang="ts">
const {
  imageUrl = '',
  state = null,
  buzy = false,
} = defineProps<{
  imageUrl: string
  state?: boolean | null
  buzy?: boolean
}>()

const emit = defineEmits<{
  'change-image-file': [file: File]
}>()

const isDragEnter = ref(false)
const imageFile = ref<File | null>(null)
const fileInputInput = ref<HTMLInputElement | null>(null)

const onDragEnter = () => {
  isDragEnter.value = true
}
const onDragLeave = () => {
  isDragEnter.value = false
}
const onDragOver = () => {
  isDragEnter.value = true
}
const onClick = () => {
  fileInputInput.value && fileInputInput.value.click()
}
const onDropFile = (e: DragEvent) => {
  isDragEnter.value = false
  if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]) {
    imageFile.value = e.dataTransfer.files[0]
    emit('change-image-file', imageFile.value)
  }
}
const onChangeFile = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target && target.files && target.files[0]) {
    imageFile.value = target.files[0]
    emit('change-image-file', imageFile.value)
  }
}
</script>

<template>
  <div class="file-input">
    <div
      class="file-input__drag-drop"
      :class="{
        'darg-enter': isDragEnter,
        'ok-state': state === true,
        'error-state': state === false,
      }"
      @dragenter="onDragEnter"
      @dragleave="onDragLeave"
      @dragover.prevent="onDragOver"
      @drop.prevent="onDropFile"
    >
      <div class="file-input__drag-drop--img">
        <overlay-wrapper :overlay="buzy">
          <img v-if="imageUrl.length" :src="imageUrl" :alt="imageUrl" />
          <img v-else src="~/assets/image/no-image.jpg" alt="no-image" />
        </overlay-wrapper>
      </div>
      <div class="file-input__drag-drop--nav">
        <p>ここに画像ファイルを<br />ドラッグ＆ドロップできます</p>
        <div class="file-input__drag-drop--nav-action">
          <v-btn
            prepend-icon="mdi-image"
            color="primary"
            variant="flat"
            :disabled="buzy"
            @click="onClick"
          >
            背景画像ファイルを選択
          </v-btn>
        </div>
      </div>
    </div>
    <input ref="fileInputInput" type="file" hidden @change="onChangeFile" />
  </div>
</template>

<style lang="scss" scoped>
.file-input {
  &__drag-drop {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    align-content: center;
    background-color: lightgray;
    border: 1px solid gray;
    &--img {
      padding: 1rem;
      img {
        width: 240px;
        height: 200px;
        object-fit: cover;
      }
      .on-buzy {
        width: 240px;
        height: 200px;
        background-color: white;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
    &--nav {
      padding: 1rem;
      display: flex;
      flex-direction: column;
      &-action {
        padding-top: 0.5rem;
        padding-bottom: 0.5rem;
      }
    }
  }
  .darg-enter {
    opacity: 0.5;
    cursor: copy;
  }
  .ok-state {
    border-color: $green;
  }
  .error-state {
    border-color: $red;
  }
}
</style>
