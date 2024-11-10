<script setup lang="ts">
import type { TitleSettings, EyecatchTitleSettings } from '@/types/content'

const props = withDefaults(
  defineProps<{
    settings?: EyecatchTitleSettings | null
    canEdit?: boolean
  }>(),
  {
    settings: null,
    canEdit: false,
  }
)
const emit = defineEmits<{
  update: [partOfSettings: Partial<EyecatchTitleSettings>]
}>()

const { isSmall, isJudged } = useMediaQueryIsSmall()

const titleSettings = computed<TitleSettings | null>(() => {
  if (!props.settings) {
    return null
  }
  if (isSmall.value) {
    return {
      fontFamily: props.settings.fontFamily,
      color: props.settings.color,
      bgColor: props.settings.bgColor,
      align: props.settings.align,
      position: props.settings.positionSm,
    }
  } else {
    return {
      fontFamily: props.settings.fontFamily,
      color: props.settings.color,
      bgColor: props.settings.bgColor,
      align: props.settings.align,
      position: props.settings.position,
    }
  }
})

const onUpdateSettings = (setting: Partial<EyecatchTitleSettings>) => {
  if (isSmall.value) {
    emit('update', { positionSm: setting.position })
  } else {
    emit('update', { ...setting })
  }
}
</script>

<template>
  <CommonEyecatchTitleSettingPosition
    v-if="isJudged"
    :settings="titleSettings"
    :can-edit="canEdit"
    @update="onUpdateSettings"
  >
    <template #default>
      <slot />
    </template>
    <template v-if="$slots.topSettings" #topSettings>
      <slot name="topSettings" />
    </template>
    <template v-if="$slots.sideSettings" #sideSettings>
      <slot name="sideSettings" />
    </template>
  </CommonEyecatchTitleSettingPosition>
</template>
