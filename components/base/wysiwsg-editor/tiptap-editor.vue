<script setup lang="ts">
import { Editor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import TextAlign from '@tiptap/extension-text-align'
import TextStyle from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import ImageResize from 'tiptap-extension-resize-image'
import { FontSize } from '@/utils/wysiwsg-editor/tip-tap'
import type TiptapFrameWithInputImage from './tiptap-frame-with-input-image.vue'

const props = withDefaults(
  defineProps<{
    content: string | null
    placeholder?: string | null
  }>(),
  {
    content: null,
    placeholder: null,
  }
)

const emit = defineEmits<{
  'update:content': [value: string | null]
  focus: []
  blur: []
}>()

const editor = shallowRef<Editor | null>(null)

watch(
  () => props.content,
  (value) => {
    if (editor.value?.getHTML() === value) {
      return
    }
    editor.value?.commands?.setContent(value, false)
  }
)

onMounted(() => {
  editor.value = new Editor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5],
        },
      }),
      Underline,
      Link,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      TextStyle,
      Color,
      FontSize,
      ImageResize,
    ],
    content: props.content,
    onUpdate: () => {
      emit('update:content', editor.value?.getHTML() ?? null)
    },
    onFocus: () => {
      emit('focus')
    },
    onBlur: () => {
      emit('blur')
    },
  })
})

onBeforeUnmount(() => {
  editor.value?.destroy()
})

const frameWithInputImage = ref<typeof TiptapFrameWithInputImage | null>(null)
const { compress } = useImageCompression()
const onInputImage = async (imageFile: File) => {
  const { compressedImageFile: _, compressedImageUrl } =
    await compress(imageFile)
  if (compressedImageUrl) {
    editor.value?.chain()?.focus()?.setImage({ src: compressedImageUrl }).run()
  }
}
</script>

<template>
  <div v-if="editor" id="wysiwsg-editor-tiptap-toolbar">
    <base-wysiwsg-editor-tiptap-toolbar
      :editor="editor"
      @image-setting="frameWithInputImage?.clickFileInput()"
    />
  </div>

  <div v-if="editor" id="wysiwsg-editor-tiptap-editor">
    <base-wysiwsg-editor-tiptap-frame-with-input-image
      ref="frameWithInputImage"
      @input-image="onInputImage"
    >
      <editor-content :editor="editor" />
    </base-wysiwsg-editor-tiptap-frame-with-input-image>
  </div>
</template>

<style scoped lang="scss">
#wysiwsg-editor-tiptap-toolbar {
  position: sticky;
  top: 0;
  z-index: 1000;
}

#wysiwsg-editor-tiptap-editor {
  overflow-x: hidden;
}

.drag-enter {
  opacity: 0.5;
  cursor: copy;
}

:deep(.tiptap) {
  padding: 8px;

  :first-child {
    margin-top: 0;
  }

  ul,
  ol {
    padding: 0 1rem;
    margin: 1.25rem 1rem 1.25rem 0.4rem;

    li p {
      margin-top: 0.25em;
      margin-bottom: 0.25em;
    }
  }
  ul {
    list-style-type: disc;
  }

  a {
    text-decoration: underline;
    cursor: pointer;
  }

  /* Code and preformatted text styles */
  /* no used at this moment (2024.08.26)
  code {
    background-color: var(--purple-light);
    border-radius: 0.4rem;
    color: var(--black);
    font-size: 0.85rem;
    padding: 0.25em 0.3em;
  }

  pre {
    background: var(--black);
    border-radius: 0.5rem;
    color: var(--white);
    font-family: 'JetBrainsMono', monospace;
    margin: 1.5rem 0;
    padding: 0.75rem 1rem;

    code {
      background: none;
      color: inherit;
      font-size: 0.8rem;
      padding: 0;
    }
  }

  hr {
    border: none;
    border-top: 1px solid var(--gray-2);
    margin: 2rem 0;
  }
  */
}
</style>
