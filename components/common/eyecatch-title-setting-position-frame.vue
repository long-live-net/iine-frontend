<script setup lang="ts">
import type { TitleSettings } from '@/types/content'

const props = withDefaults(
  defineProps<{ settings?: TitleSettings | null; canEdit?: boolean }>(),
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
const settingsTop = computed(() => {
  if (position.value.y > 50) {
    return '-1rem'
  } else {
    return 'auto'
  }
})
const settingsBottom = computed(() =>
  settingsTop.value === 'auto' ? '-3.5rem' : 'auto'
)

const onUpdatePosition = (pos: { x: number; y: number }) => {
  emit('update', { position: positionValuesToString(pos.x, pos.y) })
}
</script>

<template>
  <CommonContentItemMovable
    :position="position"
    :can-edit="canEdit"
    @update:position="onUpdatePosition"
  >
    <div class="title-setting-position-frame">
      <slot />
      <div v-if="canEdit && $slots.topSettings" class="top-settings">
        <slot name="topSettings" />
      </div>
      <div v-if="canEdit && $slots.sideSettings" class="side-settings">
        <slot name="sideSettings" />
      </div>
    </div>
  </CommonContentItemMovable>
</template>

<style lang="scss" scoped>
.title-setting-position-frame {
  position: relative;

  .top-settings {
    position: absolute;
    top: v-bind('settingsTop');
    bottom: v-bind('settingsBottom');
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .side-settings {
    position: absolute;
    top: -0.25rem;
    left: v-bind('settingsLeft');
    right: v-bind('settingsRight');
  }
}
</style>
