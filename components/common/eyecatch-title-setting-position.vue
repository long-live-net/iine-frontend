<script setup lang="ts">
import type { TitleSettings } from '@/types/content'

const props = withDefaults(
  defineProps<{
    settings?: TitleSettings | null
    canEdit?: boolean
  }>(),
  {
    settings: null,
    canEdit: false,
  }
)
const emit = defineEmits<{
  update: [partOfSettings: Partial<TitleSettings>]
}>()

const { positionStringToValues, positionValuesToString } = useContentUtils()
const positionString = computed(() => props.settings?.position)
const position = ref({ x: 50, y: 50 })
watch(
  positionString,
  () => {
    if (positionString.value) {
      position.value = positionStringToValues(positionString.value)
    } else {
      position.value = { x: 50, y: 50 }
    }
  },
  {
    immediate: true,
  }
)

/**
 * Side Settings
 */
const settingsLeft = computed(() => {
  if (position.value.x > 50) {
    return '-4rem'
  } else {
    return 'auto'
  }
})
const settingsRight = computed(() =>
  settingsLeft.value === 'auto' ? '-4rem' : 'auto'
)
const sideSettingsTop = computed(() => {
  if (position.value.y <= 50) {
    return '0'
  } else {
    return 'auto'
  }
})
const sideSettingsBottom = computed(() =>
  sideSettingsTop.value === 'auto' ? '0' : 'auto'
)

/**
 * Top Bottom Settings
 */
const settingsTop = computed(() => {
  if (position.value.y > 50) {
    return '-2rem'
  } else {
    return 'auto'
  }
})
const settingsBottom = computed(() =>
  settingsTop.value === 'auto' ? '-2rem' : 'auto'
)

/**
 * edit button
 */
const editASctionsLeft = computed(() => {
  if (position.value.x > 50) {
    return '0.5rem'
  } else {
    return 'auto'
  }
})
const editActionsRight = computed(() =>
  settingsLeft.value === 'auto' ? '0.5rem' : 'auto'
)

const onUpdatePosition = (pos: { x: number; y: number }) => {
  emit('update', { position: positionValuesToString(pos.x, pos.y) })
}
</script>

<template>
  <CommonContentItemMovable
    v-if="canEdit"
    :position="position"
    @update:position="onUpdatePosition"
  >
    <div class="eyecatch-title-setting-position-editable">
      <slot />
      <div v-if="$slots.topSettings" class="top-settings">
        <slot name="topSettings" />
      </div>
      <div v-if="$slots.sideSettings" class="side-settings">
        <slot name="sideSettings" />
      </div>
      <div v-if="$slots.editActions" class="edit-actions">
        <slot name="editActions" />
      </div>
    </div>
  </CommonContentItemMovable>
  <div v-else class="eyecatch-title-setting-position">
    <div class="eyecatch-title">
      <slot />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.eyecatch-title-setting-position-editable {
  position: relative;

  .top-settings {
    position: absolute;
    top: v-bind('settingsTop');
    bottom: v-bind('settingsBottom');
    left: 50%;
    transform: translate3d(-50%, 0, 0);
  }

  .side-settings {
    position: absolute;
    top: v-bind('sideSettingsTop');
    bottom: v-bind('sideSettingsBottom');
    left: v-bind('settingsLeft');
    right: v-bind('settingsRight');
  }

  .edit-actions {
    position: absolute;
    top: v-bind('settingsTop');
    bottom: v-bind('settingsBottom');
    left: v-bind('editASctionsLeft');
    right: v-bind('editActionsRight');
  }
}

.eyecatch-title-setting-position {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;

  .eyecatch-title {
    position: absolute;
    top: v-bind('`${position.y}%`');
    left: v-bind('`${position.x}%`');
    transform: translate(-50%, -50%);
  }
}
</style>
