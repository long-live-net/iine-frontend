<script setup lang="ts">
import type { Editor } from '@tiptap/vue-3'
import type { HeaderLebel, FontSize } from '@/utils/wysiwsg-editor/tip-tap'

const props = withDefaults(
  defineProps<{
    editor: Editor
    noImage?: boolean
  }>(),
  {
    noImage: false,
  }
)
defineEmits<{
  'image-setting': []
}>()

// === Undo Redo ===
const onUndo = () => {
  props.editor.chain().focus().undo().run()
}
const onRedo = () => {
  props.editor.chain().focus().redo().run()
}

// === Marks ===
const isUnderLine = computed(() => props.editor.isActive('underline'))
const onToggleUnderLine = () => {
  props.editor.chain().focus().toggleUnderline().run()
}
const isStrike = computed(() => props.editor.isActive('strike'))
const onToggleStrike = () => {
  props.editor.chain().focus().toggleStrike().run()
}
const isItalic = computed(() => props.editor.isActive('italic'))
const onToggleItalic = () => {
  props.editor.chain().focus().toggleItalic().run()
}
const isBold = computed(() => props.editor.isActive('bold'))
const onToggleBold = () => {
  props.editor.chain().focus().toggleBold().run()
}

// === nodes ===
const isBlockquote = computed(() => props.editor.isActive('blockquote'))
const onToggleBlockQuote = () => {
  props.editor.chain().focus().toggleBlockquote().run()
}
const isBulletList = computed(() => props.editor.isActive('bulletList'))
const onToggleBulletList = () => {
  props.editor.chain().focus().toggleBulletList().run()
}
const isOrderedList = computed(() => props.editor.isActive('orderedList'))
const onToggleOrderedList = () => {
  props.editor.chain().focus().toggleOrderedList().run()
}

const isTextAlignLeft = computed(() =>
  props.editor.isActive({ textAlign: 'left' })
)
const onToggleTextAlignLeft = () => {
  if (isTextAlignLeft.value) {
    props.editor.chain().focus().unsetTextAlign().run()
  } else {
    props.editor.chain().focus().setTextAlign('left').run()
  }
}
const isTextAlignCenter = computed(() =>
  props.editor.isActive({ textAlign: 'center' })
)
const onToggleTextAlignCenter = () => {
  if (isTextAlignCenter.value) {
    props.editor.chain().focus().unsetTextAlign().run()
  } else {
    props.editor.chain().focus().setTextAlign('center').run()
  }
}
const isTextAlignRight = computed(() =>
  props.editor.isActive({ textAlign: 'right' })
)
const onToggleTextAlignRight = () => {
  if (isTextAlignRight.value) {
    props.editor.chain().focus().unsetTextAlign().run()
  } else {
    props.editor.chain().focus().setTextAlign('right').run()
  }
}
const isTextAlignJustify = computed(() =>
  props.editor.isActive({ textAlign: 'justify' })
)
const onToggleTextAlignJustify = () => {
  if (isTextAlignJustify.value) {
    props.editor.chain().focus().unsetTextAlign().run()
  } else {
    props.editor.chain().focus().setTextAlign('justify').run()
  }
}

const isImage = computed(() => props.editor.isActive('image'))

// ==== Header ====
// ==== Text Size ====
// ==== Text Color ====
// ==== URL Link ====
// ==== Youtube ====
const headerActivatorId = 'header-activator-button'
const textSizeActivatorId = 'text-size-activator-button'
const textColorActivatorId = 'text-color-activator-button'
const linkActivatorId = 'link-activator-button'
const youtubeActivatorId = 'youtube-activator-button'

//  Header
const inputHeader = computed<HeaderLebel>(
  () => props.editor.getAttributes('heading').level ?? null
)
const isHeader = computed(() => props.editor.isActive('heading'))
const onHeaderInputted = (level: HeaderLebel) => {
  if (level) {
    props.editor.chain().focus().toggleHeading({ level }).run()
  }
}

//  Text Size
const inputTextSize = computed<FontSize>(() => {
  const sizeString = props.editor.getAttributes('textStyle').fontSize ?? ''
  const ret = sizeString.match(/[0-9]+/)
  const size = ret ? Number(ret) : 0
  return 10 <= size && size <= 36 ? size : null
})
const onTextSizeDeleted = () => {
  props.editor.chain().focus().unsetFontSize().run()
}
const onTextSizeInputted = (size: FontSize) => {
  if (size) {
    props.editor.chain().focus().setFontSize(`${size}px`).run()
  } else {
    props.editor.chain().focus().unsetFontSize().run()
  }
}

//  Text Color
const inputTextColor = computed<string>(
  () => props.editor.getAttributes('textStyle').color ?? ''
)
const onTextColorDeleted = () => {
  props.editor.chain().focus().unsetColor().run()
}
const onTextColorInputted = (color: string) => {
  if (color) {
    props.editor.chain().focus().setColor(color).run()
  } else {
    props.editor.chain().focus().unsetColor().run()
  }
}

//  URL Link
const inputUrl = computed<string>(
  () => props.editor.getAttributes('link').href ?? ''
)
const isLink = computed(() => props.editor.isActive('link'))
const onLinkDeleted = () => {
  props.editor.chain().focus().extendMarkRange('link').unsetLink().run()
}
const onLinkInputted = (url: string) => {
  if (url) {
    props.editor
      .chain()
      .focus()
      .extendMarkRange('link')
      .setLink({ href: url })
      .run()
  } else {
    props.editor.chain().focus().extendMarkRange('link').unsetLink().run()
  }
}

//  Youtube
const isYoutube = computed(() => props.editor.isActive('youtube'))
const onYoutubeInputted = (url: string) => {
  if (url) {
    props.editor.chain().focus().setYoutubeVideo({ src: url }).run()
  }
}

// ==== Unset Marks & Nnodes ====
const onClearNodesAndMarks = () => {
  props.editor.chain().focus().clearNodes().unsetAllMarks().run()
}
</script>

<template>
  <div class="tiptap-toolbar">
    <nav class="toolbar">
      <button :disabled="!editor.can().undo()" @click.stop.prevent="onUndo">
        <v-icon size="small">mdi-undo</v-icon>
      </button>
      <button :disabled="!editor.can().redo()" @click.stop.prevent="onRedo">
        <v-icon size="small">mdi-redo</v-icon>
      </button>

      <button
        :id="headerActivatorId"
        :class="{ 'is-active': isHeader }"
        @click.stop.prevent
      >
        <v-icon size="small">mdi-format-header-equal</v-icon>
      </button>

      <button
        :id="textSizeActivatorId"
        :class="{ 'is-active': inputTextSize && inputTextSize > 0 }"
        @click.stop.prevent
      >
        <v-icon size="small">mdi-format-color-text</v-icon>
      </button>

      <button
        :id="textColorActivatorId"
        :class="{ 'is-active': inputTextColor.length }"
        @click.stop.prevent
      >
        <div class="d-flex align-center flex-column justify-center">
          <v-icon size="x-small" icon="mdi-format-color-text" />
          <v-sheet :color="inputTextColor" height="3" width="20" tile />
        </div>
      </button>

      <button
        :class="{ 'is-active': isUnderLine }"
        @click.stop.prevent="onToggleUnderLine"
      >
        <v-icon size="small">mdi-format-underline</v-icon>
      </button>
      <button
        :class="{ 'is-active': isStrike }"
        @click.stop.prevent="onToggleStrike"
      >
        <v-icon size="small">mdi-format-strikethrough-variant</v-icon>
      </button>
      <button
        :class="{ 'is-active': isItalic }"
        @click.stop.prevent="onToggleItalic"
      >
        <v-icon size="small">mdi-format-italic</v-icon>
      </button>
      <button
        :class="{ 'is-active': isBold }"
        @click.stop.prevent="onToggleBold"
      >
        <v-icon size="small">mdi-format-bold</v-icon>
      </button>
      <button
        :id="linkActivatorId"
        :class="{ 'is-active': isLink }"
        @click.stop.prevent
      >
        <v-icon size="small">mdi-link</v-icon>
      </button>
      <button
        :class="{ 'is-active': isBlockquote }"
        @click.stop.prevent="onToggleBlockQuote"
      >
        <v-icon size="small">mdi-format-quote-close</v-icon>
      </button>
      <button
        :class="{ 'is-active': isBulletList }"
        @click.stop.prevent="onToggleBulletList"
      >
        <v-icon size="small">mdi-format-list-bulleted</v-icon>
      </button>
      <button
        :class="{ 'is-active': isOrderedList }"
        @click.stop.prevent="onToggleOrderedList"
      >
        <v-icon size="small">mdi-format-list-numbered</v-icon>
      </button>

      <button
        :class="{ 'is-active': isTextAlignLeft }"
        @click.stop.prevent="onToggleTextAlignLeft"
      >
        <v-icon size="small">mdi-format-align-left</v-icon>
      </button>
      <button
        :class="{ 'is-active': isTextAlignCenter }"
        @click.stop.prevent="onToggleTextAlignCenter"
      >
        <v-icon size="small">mdi-format-align-center</v-icon>
      </button>
      <button
        :class="{ 'is-active': isTextAlignRight }"
        @click.stop.prevent="onToggleTextAlignRight"
      >
        <v-icon size="small">mdi-format-align-right</v-icon>
      </button>
      <button
        :class="{ 'is-active': isTextAlignJustify }"
        @click.stop.prevent="onToggleTextAlignJustify"
      >
        <v-icon size="small">mdi-format-align-justify</v-icon>
      </button>

      <button @click.stop.prevent="onClearNodesAndMarks">
        <v-icon size="small">mdi-format-clear</v-icon>
      </button>

      <template v-if="!noImage">
        <button
          :class="{ 'is-active': isImage }"
          @click.stop.prevent="$emit('image-setting')"
        >
          <v-icon size="small">mdi-image</v-icon>
        </button>
        <button
          :id="youtubeActivatorId"
          :class="{ 'is-active': isYoutube }"
          @click.stop.prevent
        >
          <v-icon size="small">mdi-youtube</v-icon>
        </button>
      </template>
    </nav>
    <base-wysiwsg-editor-tiptap-toolbar-header
      :level="inputHeader"
      :activator-id="headerActivatorId"
      @update:level="onHeaderInputted"
    />
    <base-wysiwsg-editor-tiptap-toolbar-font-size
      :size="inputTextSize"
      :activator-id="textSizeActivatorId"
      @update:size="onTextSizeInputted"
      @delete="onTextSizeDeleted"
    />
    <base-wysiwsg-editor-tiptap-toolbar-color
      :color="inputTextColor"
      :activator-id="textColorActivatorId"
      @update:color="onTextColorInputted"
      @delete="onTextColorDeleted"
    />
    <base-wysiwsg-editor-tiptap-toolbar-url
      :url="inputUrl"
      :activator-id="linkActivatorId"
      @update:url="onLinkInputted"
      @delete="onLinkDeleted"
    />
    <base-wysiwsg-editor-tiptap-toolbar-youtube
      :activator-id="youtubeActivatorId"
      @update:url="onYoutubeInputted"
    />
  </div>
</template>

<style scoped lang="scss">
.tiptap-toolbar {
  nav.toolbar {
    position: relative;
    color: $white;
    background-color: $gray-darken1;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;

    button {
      margin: 0 1px;
      padding: 0 5px;
      border-radius: 4px;
      transition: 0.25s;
      &:hover {
        background-color: $black;
      }
      &:active {
        background-color: $link-active;
      }
      &:disabled {
        opacity: 0.5;
        background-color: $gray;
      }
      &.is-active {
        background-color: $link-active;
      }
    }
  }
}
</style>
