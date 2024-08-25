<script setup lang="ts">
import debounce from 'lodash/debounce'
import type TiptapEditor from '@/components/base/wysiwsg-editor/tiptap-editor.vue'

const model = defineModel<string | null>()
const props = withDefaults(
  defineProps<{
    label?: string
    placeholder?: string
    clearable?: boolean
    errorMessages?: string | string[]
    noImage?: boolean
    customerId: number | null
    apiKind: string
  }>(),
  {
    label: undefined,
    placeholder: undefined,
    clearable: false,
    errorMessages: undefined,
    noImage: false,
  }
)
defineEmits<{ 'input-image-file': [file: File] }>()

const valueData = computed({
  get: () => model.value ?? undefined,
  set: debounce((value: string | undefined) => {
    model.value = value ?? null
  }, 300),
})

const isFocus = ref(false)
const isHover = ref(false)

const invalidMessages = computed<string[] | null>(() =>
  props.errorMessages
    ? Array.isArray(props.errorMessages)
      ? props.errorMessages
      : [props.errorMessages]
    : null
)
const editorClasses = computed(() => {
  if (invalidMessages.value?.length) {
    return isFocus.value
      ? ['focused-error-state']
      : isHover.value
        ? ['hovered', 'error-state']
        : ['error-state']
  } else {
    return isFocus.value ? ['focused'] : isHover.value ? ['hovered'] : []
  }
})
const labelClass = computed(() =>
  invalidMessages.value?.length
    ? ['wysiwyg-editor__label--error']
    : isFocus.value
      ? ['wysiwyg-editor__label--focused']
      : []
)

const tiptapEditorRef = ref<typeof TiptapEditor | null>(null)
const onClear = () => {
  tiptapEditorRef.value?.clearContent()
}

const { customerId, apiKind } = toRefs(props)
const { postImageData, loading: inputBodyImagePosting } = useFilePost(
  customerId,
  apiKind.value
)
const { compress } = useImageCompression()
const inputBodyImageFunction = async (
  imageFile: File
): Promise<string | undefined> => {
  if (!isImageFile(imageFile)) {
    return
  }
  const { compressedImageFile } = await compress(imageFile)
  const response = await postImageData(compressedImageFile)
  return response.fileUrl
}
</script>

<template>
  <client-only>
    <div
      class="wysiwyg-editor g-theme-wysiwyg-editor"
      :class="editorClasses"
      @mouseover="isHover = true"
      @mouseleave="isHover = false"
    >
      <p v-if="label?.length" class="wysiwyg-editor__label" :class="labelClass">
        {{ label }}
      </p>
      <CommonContentWrap :loading="inputBodyImagePosting">
        <BaseWysiwsgEditorTiptapEditor
          ref="tiptapEditorRef"
          v-model:content="valueData"
          :placeholder="placeholder"
          :no-image="noImage"
          :input-body-image-function="inputBodyImageFunction"
          @focus="isFocus = true"
          @blur="isFocus = false"
        />
      </CommonContentWrap>
      <div
        v-if="clearable && (isHover || isFocus)"
        class="wysiwyg-editor__icon"
      >
        <v-btn
          color="grey-darken-1"
          icon="mdi-close"
          size="small"
          density="compact"
          flat
          @click="onClear"
        />
      </div>
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
  </client-only>
</template>

<style lang="scss" scoped>
.wysiwyg-editor {
  padding: 0.5rem;
  border-style: solid;
  border-width: 1px;
  border-radius: 4px;
  position: relative;
  &__label {
    color: var(--g-theme-wysiwyg-editor-label-color);
    padding: 0 9px 6px 9px;
    &--focused {
      color: var(--g-theme-wysiwyg-editor-label-focused-color);
    }
    &--error {
      color: $error;
    }
  }
  &__icon {
    position: absolute;
    top: 80px;
    right: 18px;
    padding-left: 0.5rem;
    min-width: 1.5rem;
  }
}

.hovered {
  background-color: var(--g-theme-wysiwyg-editor-hovered-background-color);
}
.focused {
  border-bottom: 2px solid $gray-darken1;
  background-color: var(--g-theme-wysiwyg-editor-focused-background-color);
}

.error-state {
  border-bottom: 1px solid $error;
}

.focused-error-state {
  border-bottom: 2px solid $error;
  background-color: var(--g-theme-wysiwyg-editor-focused-background-color);
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
    transition: transform 0.25s ease-out;
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
