<script setup lang="ts">
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'

const props = withDefaults(
  defineProps<{
    modelValue?: string
    rules?: ((v: string) => boolean | string)[]
    placeholder?: string
  }>(),
  {
    modelValue: '',
    rules: () => [],
    placeholder: '',
  }
)
const emit = defineEmits<{
  'update:modelValue': [value: string]
  touch: []
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

type QuillEditorType = typeof QuillEditor
const wysiwygEditor = ref<QuillEditorType | null>(null)

const valueText = computed({
  get: () => props.modelValue,
  set: (value: string) => {
    console.log('modelValue', value)

    const html = wysiwygEditor.value?.getHTML()
    console.log('html', html)
    emit('update:modelValue', value)
  },
})
const onTextChange = (value: string) => {
  console.log('onTextChange', value)
}

const isFocus = ref(false)

const classByFocus = computed(() => {
  return isFocus.value ? 'focused' : ''
})
</script>

<template>
  <client-only>
    <div
      class="wysiwyg-editor g-theme-wysiwyg-editor"
      :class="{ focused: classByFocus }"
    >
      <div class="wysiwyg-editor__editor">
        <QuillEditor
          ref="wysiwygEditor"
          v-model:content="valueText"
          theme="snow"
          :toolbar="wysiwygToolbar"
          :placeholder="placeholder"
          @focus="isFocus = true"
          @blur="isFocus = false"
        />
      </div>
      <div class="wysiwyg-editor__icon">
        <b-icon
          v-show="isFocus === false"
          icon="exclamation-circle"
          variant="danger"
          font-scale="1.5"
        />
      </div>
    </div>
  </client-only>
</template>

<style lang="scss" scoped>
.wysiwyg-editor {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  position: relative;
  &__icon {
    padding-left: 0.5rem;
    min-width: 1.5rem;
  }
}

.focused {
  border-bottom: 2px solid $gray-darken1;
  background-color: $gray-lighten2;
}

.error-state {
  border-color: $red;
}

.focused-error-state {
  border-color: $red;
  box-shadow: 0 0 5px 1px $red;
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
    min-height: 6rem;
  }
}
</style>
