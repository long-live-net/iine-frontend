<script setup lang="ts">
import { Editor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import TextAlign from '@tiptap/extension-text-align'
import TextStyle from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import Placeholder from '@tiptap/extension-placeholder'
import ImageResize from 'tiptap-extension-resize-image'
import { FontSize } from '@/utils/wysiwsg-editor/tip-tap'
import Table from '@tiptap/extension-table'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TableRow from '@tiptap/extension-table-row'
import Youtube from '@tiptap/extension-youtube'
import type TiptapFrameWithInputImage from './tiptap-frame-with-input-image.vue'

const CustomTable = Table.extend({
  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      { class: 'table-wrapper-responsive' },
      ['table', HTMLAttributes, ['tbody', 0]],
    ]
  },
})

const content = defineModel<string | null>('content', { default: null })
const props = withDefaults(
  defineProps<{
    placeholder?: string | null
    noImage?: boolean
    inputBodyImageFunction?: (imageFile: File) => Promise<string | undefined>
  }>(),
  {
    placeholder: null,
    noImage: false,
    inputBodyImageFunction: undefined,
  }
)

const emit = defineEmits<{
  'input-image-file': [{ file: File; url: string }]
  focus: []
  blur: []
}>()

const editor = shallowRef<Editor | null>(null)

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
      Placeholder.configure({
        placeholder: props.placeholder || 'Plase input',
      }),
      ImageResize,
      CustomTable,
      TableRow,
      TableHeader,
      TableCell,
      Youtube.configure({
        controls: false,
        nocookie: true,
        allowFullscreen: false,
        width: 480,
        height: 320,
      }),
    ],
    content: content.value,
    onUpdate: () => {
      content.value = editor.value?.getHTML() ?? null
    },
    onFocus: () => {
      emit('focus')
    },
    onBlur: () => {
      emit('blur')
    },
  })

  watch(content, (value) => {
    if (editor.value?.getHTML() === value) {
      return
    }
    editor.value?.commands?.setContent(value, false)
  })
})

onBeforeUnmount(() => {
  editor.value?.destroy()
})

const frameWithInputImage = ref<InstanceType<
  typeof TiptapFrameWithInputImage
> | null>(null)
const onInputImage = async (imageFile: File) => {
  if (props.noImage) {
    return
  }
  const imageUrl = await props.inputBodyImageFunction?.(imageFile)
  if (imageUrl) {
    editor.value?.chain()?.focus()?.setImage({ src: imageUrl }).run()
  }
}

const clearContent = () => {
  editor.value?.commands.clearContent(true)
}
defineExpose({ clearContent })
</script>

<template>
  <div class="wysiwsg-editor-container">
    <base-wysiwsg-editor-tiptap-toolbar
      v-if="editor"
      :editor="editor"
      :no-image="noImage"
      class="wysiwsg-editor-tiptap-toolbar"
      @image-setting="frameWithInputImage?.clickFileInput()"
    />
    <base-wysiwsg-editor-tiptap-frame-with-input-image
      v-if="editor"
      ref="frameWithInputImage"
      class="wysiwsg-editor-tiptap-editor"
      @input-image="onInputImage"
    >
      <editor-content :editor="editor" />
    </base-wysiwsg-editor-tiptap-frame-with-input-image>
  </div>
</template>

<style scoped lang="scss">
.wysiwsg-editor-container {
  .wysiwsg-editor-tiptap-toolbar {
    position: sticky;
    top: 0;
    z-index: 1000;
  }

  .wysiwsg-editor-tiptap-editor {
    overflow-x: hidden;
  }

  .drag-enter {
    opacity: 0.5;
    cursor: copy;
  }
}

:deep(.tiptap) {
  padding: 8px;
  min-height: 4rem;

  :first-child {
    margin-top: 0;
  }

  ul,
  ol {
    padding: 0 1rem 0 1.5rem;
    margin: 1.25rem 0;

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

  img {
    max-width: 100% !important;
    height: auto !important;
  }

  table {
    border-spacing: 2px;
    margin: 0;
    table-layout: fixed;
    width: auto;

    td,
    th {
      min-width: 1.5rem;
      padding: 4px 6px;
      position: relative;
      vertical-align: top;
      white-space: nowrap;

      > * {
        margin-bottom: 0;
      }
    }

    th {
      font-weight: bold;
      text-align: left;
    }

    .selectedCell:after {
      background: gray;
      content: '';
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      pointer-events: none;
      position: absolute;
      z-index: 2;
    }

    .column-resize-handle {
      background-color: purple;
      bottom: -2px;
      pointer-events: none;
      position: absolute;
      right: -2px;
      top: 0;
      width: 6px;
    }
  }

  .tableWrapper {
    max-width: 100%;
    margin: 1rem 0;
    overflow-x: auto;
  }

  .table-wrapper-responsive {
    max-width: 100%;
    margin: 1rem 0;
    overflow-x: auto;
  }

  p.is-editor-empty:first-child::before {
    color: #adb5bd;
    content: attr(data-placeholder);
    float: left;
    height: 0;
    pointer-events: none;
  }

  div[data-youtube-video] {
    iframe {
      display: block;
      max-width: 100%;
      min-height: 200px;
      min-width: 200px;
      outline: 0px solid transparent;
    }
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
