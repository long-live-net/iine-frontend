<script setup lang="ts">
const props = defineProps<{
  fileUrl?: string
  fileName?: string
  fileType?: string
  label?: string
  errorMessages?: string | string[]
  accessables?: string[]
  loading?: boolean | null
}>()
const emit = defineEmits<{ 'change-file': [File] }>()

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
    emit('change-file', file)
  }
}
const onDropFile = async (ev: DragEvent) => {
  isDragEnter.value = false
  if (ev.dataTransfer && ev.dataTransfer.files && ev.dataTransfer.files[0]) {
    changeFile(ev.dataTransfer.files[0])
  }
}
const onSelectFile = async (e: Event) => {
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
</script>

<template>
  <div>
    <div
      class="file-input"
      :class="{ 'file-input--error': invalidMessages?.length }"
    >
      <div
        class="file-input__drag-drop"
        :class="{ 'file-input__drag-drop--enter': isDragEnter }"
        @dragenter="onDragEnter"
        @dragleave="onDragLeave"
        @dragover.prevent="onDragOver"
        @drop.prevent="onDropFile"
      >
        <div
          v-if="label?.length"
          class="file-input__drag-drop--label"
          :class="{
            'file-input__drag-drop--label__error': invalidMessages?.length,
          }"
        >
          {{ label }}
        </div>
        <div v-if="fileName && fileUrl" class="file-input__drag-drop--file">
          <a :href="fileUrl" target="_blank">
            {{ fileName }}
          </a>
        </div>
        <div>
          <v-btn
            prepend-icon="mdi-file"
            color="primary"
            variant="flat"
            :loading="loading ?? false"
            @click="onClick"
          >
            ファイルを選択する
          </v-btn>
        </div>
        <p>ドラッグ＆ドロップできます</p>
      </div>
      <input
        ref="fileInputInput"
        type="file"
        hidden
        :accept="accessables ? accessables.join(',') : undefined"
        @change="onSelectFile"
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
  background-color: $gray-lighten4;
  border: 1px solid $gray;
  position: relative;
  &--error {
    border-color: $error;
  }
  &__drag-drop {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;

    &--enter {
      background-color: $gray-lighten1;
      opacity: 0.5;
      cursor: copy;
    }
    &--label {
      color: #7e7e7e;
      &__error {
        color: $error;
      }
    }
    &--file {
      background-color: $white;
      padding: 0.5rem;
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
