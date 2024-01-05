<script setup lang="ts">
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import debounce from 'lodash/debounce'

const props = withDefaults(
  defineProps<{
    modelValue?: string | null
    label?: string
    placeholder?: string
    clearable?: boolean
    errorMessages?: string | string[]
  }>(),
  { clearable: false }
)
const emit = defineEmits<{
  'update:modelValue': [value: string | null]
}>()

const wysiwygToolbar = [
  [{ header: [1, 2, 3, 4, false] }],
  ['bold', 'italic', 'underline'],
  [{ list: 'ordered' }, { list: 'bullet' }],
  [
    { align: '' },
    { align: 'center' },
    { align: 'right' },
    { align: 'justify' },
  ],
  ['blockquote', { color: [] }, 'link', 'clean'],
] as const

const valueData = computed({
  get: () => props.modelValue ?? undefined,
  set: debounce((value: string | undefined) => {
    emit('update:modelValue', value ?? null)
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

const quillEditorRef = ref<typeof QuillEditor | null>(null)
const onClear = () => {
  quillEditorRef.value?.setText('')
}

// Note: とりあえず不要となりましたが、
// また使用するかもしれないのでコメントアウトしておく
// const getValueText = () => quillEditorRef.value?.getText().trim()
// defineExpose({ getValueText })
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
      <div class="wysiwyg-editor__editor">
        <QuillEditor
          ref="quillEditorRef"
          v-model:content="valueData"
          contentType="html"
          theme="snow"
          :toolbar="wysiwygToolbar"
          :placeholder="placeholder"
          @focus="isFocus = true"
          @blur="isFocus = false"
        />
      </div>
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
    top: 94px;
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

<style deep lang="scss">
.ql-toolbar.ql-snow {
  background-color: $whitesmoke !important;
}
.ql-container {
  font-family: inherit !important;
  font-size: inherit !important;
}
.ql-container.ql-snow {
  border: none !important;
  padding-right: 2rem;
  .ql-editor {
    min-height: 7rem;
  }
}
.ql-editor.ql-blank::before {
  color: var(--g-theme-wysiwyg-editor-placeholder-color);
}
</style>
