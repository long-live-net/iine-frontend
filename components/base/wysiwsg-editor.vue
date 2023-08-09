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

const touchValueData = ref(false)
const quillEditorRef = ref<typeof QuillEditor | null>(null)
const valueText = ref('')
const valueData = computed({
  get: () => props.modelValue,
  set: (value: string) => {
    touchValueData.value = true
    valueText.value = quillEditorRef.value?.getText().trim()
    emit('update:modelValue', value)
  },
})

const validate = () => {
  touchValueData.value = true
}
const isValid = computed(() => {
  if (!touchValueData.value) {
    return null
  }
  return props.rules.every((rule) => rule(valueText.value) === true)
})
const invalidMessages = computed(() => {
  if (!touchValueData.value) {
    return null
  }
  const messages: string[] = []
  props.rules.forEach((rule) => {
    const ret = rule(valueText.value)
    if (typeof ret === 'string' && ret.length) {
      messages.push(ret)
    }
  })
  return messages
})

const isFocus = ref(false)
const isHover = ref(false)
const editorClasses = computed(() => {
  if (isValid.value === false) {
    return isFocus.value
      ? ['focused-error-state']
      : isHover.value
      ? ['hovered', 'error-state']
      : ['error-state']
  } else {
    return isFocus.value ? ['focused'] : isHover.value ? ['hovered'] : []
  }
})

const onClear = () => {
  quillEditorRef.value?.setText('')
}

defineExpose({
  validate,
  isValid,
})
</script>

<template>
  <client-only>
    <div
      class="wysiwyg-editor g-theme-wysiwyg-editor"
      :class="editorClasses"
      @mouseover="isHover = true"
      @mouseleave="isHover = false"
    >
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
        v-if="isHover === true || isFocus === true"
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
    <div
      v-if="isValid === false && invalidMessages?.length"
      class="error-messages"
    >
      <span v-for="(err, inx) in invalidMessages" :key="inx">
        {{ err }}<br />
      </span>
    </div>
    <div v-else class="error-messages">
      <span><br /></span>
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
    position: absolute;
    top: 64px;
    right: 18px;
    padding-left: 0.5rem;
    min-width: 1.5rem;
  }
}

.hovered {
  background-color: $gray-lighten3;
}
.focused {
  border-bottom: 2px solid $gray-darken1;
  background-color: $gray-lighten2;
}

.error-state {
  border-bottom: 1px solid $red;
}

.focused-error-state {
  border-bottom: 2px solid $red;
  background-color: $gray-lighten2;
}

.error-messages {
  padding: 0.25rem 1rem;
  font-size: small;
  color: $red;
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
</style>
