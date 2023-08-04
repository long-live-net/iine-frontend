<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    imageUrl?: string
    rules?: ((v: string) => boolean | string)[]
  }>(),
  {
    imageUrl: '',
    rules: () => [],
  }
)
const emit = defineEmits<{
  'change-image-file': [
    {
      file: File
      url: string
    },
  ]
  touch: []
}>()

const isDragEnter = ref(false)
const fileInputInput = ref<HTMLInputElement | null>(null)
const touchStateImage = ref(false)

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

const { compressing, compress } = useImageCompression()
const onDropFile = async (ev: DragEvent) => {
  isDragEnter.value = false
  if (ev.dataTransfer && ev.dataTransfer.files && ev.dataTransfer.files[0]) {
    const { compressedImageFile, compressedImageUrl } = await compress(
      ev.dataTransfer.files[0]
    )
    emit('change-image-file', {
      file: compressedImageFile,
      url: compressedImageUrl,
    })
    emit('touch')
    touchStateImage.value = true
  }
}
const onChangeFile = async (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target && target.files && target.files[0]) {
    const { compressedImageFile, compressedImageUrl } = await compress(
      target.files[0]
    )
    emit('change-image-file', {
      file: compressedImageFile,
      url: compressedImageUrl,
    })
    emit('touch')
    touchStateImage.value = true
  }
}

const validate = () => {
  touchStateImage.value = true
}
const isValid = computed(() => {
  if (compressing.value) {
    return
  }
  if (!touchStateImage.value) {
    return null
  }
  return props.rules.every((rule) => rule(props.imageUrl) === true)
})
const invalidMessages = computed(() => {
  if (compressing.value) {
    return
  }
  if (!touchStateImage.value) {
    return null
  }
  const messages: string[] = []
  props.rules.forEach((rule) => {
    const ret = rule(props.imageUrl)
    if (typeof ret === 'string' && ret.length) {
      messages.push(ret)
    }
  })
  return messages
})

defineExpose({
  validate,
  isValid,
})
</script>

<template>
  <div class="file-input">
    <div>
      <div
        class="file-input__drag-drop"
        :class="{
          'darg-enter': isDragEnter,
          'ok-state': isValid === true,
          'error-state': isValid === false,
        }"
        @dragenter="onDragEnter"
        @dragleave="onDragLeave"
        @dragover.prevent="onDragOver"
        @drop.prevent="onDropFile"
      >
        <div class="file-input__drag-drop--img">
          <GuiBaseOverlayLinerWrap :overlay="compressing">
            <img v-if="imageUrl.length" :src="imageUrl" :alt="imageUrl" />
            <img v-else src="~/assets/image/no-image.jpg" alt="no-image" />
          </GuiBaseOverlayLinerWrap>
        </div>
        <div class="file-input__drag-drop--nav">
          <p>ここに画像ファイルを<br />ドラッグ＆ドロップできます</p>
          <div class="file-input__drag-drop--nav-action">
            <v-btn
              prepend-icon="mdi-image"
              color="primary"
              variant="flat"
              @click="onClick"
            >
              背景画像ファイルを選択
            </v-btn>
          </div>
        </div>
      </div>
      <input ref="fileInputInput" type="file" hidden @change="onChangeFile" />
    </div>
    <div
      v-if="isValid === false && invalidMessages?.length"
      class="error-messages"
    >
      <span v-for="(err, inx) in invalidMessages" :key="inx">
        {{ err }}<br />
      </span>
    </div>
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
    border-color: $gray;
  }
  .error-state {
    border-color: $red;
  }
  .error-messages {
    padding: 0.25rem 1rem;
    font-size: small;
    color: $red;
  }
}
</style>
