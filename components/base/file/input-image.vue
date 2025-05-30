<script setup lang="ts">
const props = defineProps<{
  imageUrl?: string
  imageName?: string
  imageType?: string
  label?: string
  errorMessages?: string | string[]
  accessables?: string[]
  loading?: boolean | null
}>()
const emit = defineEmits<{ 'change-image-file': [File] }>()

const isDragEnter = ref(false)
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
  if (fileInputInput.value) {
    fileInputInput.value.click()
  }
}

const changeFile = (file: File) => {
  if (props.accessables?.includes(file.type)) {
    emit('change-image-file', file)
  }
}
const onDropFile = async (ev: DragEvent) => {
  isDragEnter.value = false
  if (ev.dataTransfer && ev.dataTransfer.files && ev.dataTransfer.files[0]) {
    changeFile(ev.dataTransfer.files[0])
  }
}
const onChangeFile = async (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target && target.files && target.files[0]) {
    changeFile(target.files[0])
  }
}

const invalidMessages = computed<string[] | null>(() =>
  props.errorMessages
    ? Array.isArray(props.errorMessages)
      ? props.errorMessages
      : [props.errorMessages]
    : null
)

const imageSrc = computed(() => {
  if (!props.imageUrl) {
    return '/images/no-image.jpg'
  }
  if (!props.imageType) {
    return props.imageUrl?.length ? props.imageUrl : '/images/no-image.jpg'
  }
  return (props.accessables || getAccesstableImageTypes()).includes(
    props.imageType
  ) && props.imageUrl?.length
    ? props.imageUrl
    : '/images/no-image.jpg'
})
</script>

<template>
  <div>
    <div
      class="file-input"
      :class="{ 'file-input--error': invalidMessages?.length }"
    >
      <div
        v-if="label?.length"
        class="file-input__label"
        :class="{ 'file-input__label--error': invalidMessages?.length }"
      >
        {{ label }}
      </div>
      <div
        class="file-input__drag-drop"
        :class="{ 'file-input__drag-drop--enter': isDragEnter }"
        @dragenter="onDragEnter"
        @dragleave="onDragLeave"
        @dragover.prevent="onDragOver"
        @drop.prevent="onDropFile"
      >
        <div class="file-input__drag-drop--img">
          <img :src="imageSrc" :alt="imageUrl" />
          <BaseOverlayLiner :overlay="loading ?? false" />
        </div>
        <div class="file-input__drag-drop--nav">
          <p>ここに画像ファイルを<br />ドラッグ＆ドロップできます</p>
          <div class="file-input__drag-drop--nav-action">
            <v-btn
              prepend-icon="mdi-image"
              color="primary"
              variant="flat"
              :loading="loading ?? false"
              @click="onClick"
            >
              {{ `${label}ファイルを選択` }}
            </v-btn>
          </div>
        </div>
      </div>
      <input
        ref="fileInputInput"
        type="file"
        hidden
        :accept="accessables ? accessables.join(',') : undefined"
        @change="onChangeFile"
      />
    </div>
    <div class="error-messages-wrap">
      <transition name="error">
        <div v-show="invalidMessages?.length" class="error-messages">
          <span v-for="(err, inx) in invalidMessages" :key="inx">
            {{ err }}<br />
          </span>
        </div>
      </transition>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.file-input {
  background-color: $gray-lighten2;
  border: 1px solid $gray;
  position: relative;
  &__label {
    position: absolute;
    top: 0.75rem;
    left: 1rem;
    color: #7e7e7e;
    &--error {
      color: $error;
    }

    @media only screen and (max-width: $grid-breakpoint-md) {
      position: relative;
      top: unset;
      left: unset;
      padding: 1rem 1rem 0;
    }
  }
  &--error {
    border-color: $error;
  }
  &__drag-drop {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    align-content: center;
    &--enter {
      opacity: 0.5;
      cursor: copy;
    }
    &--img {
      position: relative;
      padding: 1rem;
      img {
        width: 240px;
        height: auto;
        object-fit: cover;
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
}

.error-messages-wrap {
  min-height: 1.8rem;
  .error-messages {
    padding: 0.25rem 1rem;
    font-size: small;
    color: $error;
  }

  .error-enter-active,
  .error-leave-active {
    transition: transform 0.25s ease-in-out;
  }
  .error-enter-from {
    transform: translateY(-10px);
  }
  .error-enter-to {
    transform: translateY(0px);
  }

  .error-leave-from {
    transform: translateY(0px);
  }
  .error-leave-to {
    transform: translateY(-10px);
  }
}
</style>
