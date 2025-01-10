<script setup lang="ts">
import { debounce } from 'es-toolkit'
import type { ColorTheme } from '@/types/customer-setting'

const settingModal = defineModel<boolean>('modal', { required: true })
const titleData = {
  title: 'ページ設定',
  titleIcon: 'mdi-cog',
  titleColor: 'accent',
}

const {
  init,
  editFontFamily,
  editTextColor,
  editColorTheme,
  fontFamilyItems,
  colorThemeOptions,
  chengeFontFamily,
  chengeTextColor,
  chengeColorTheme,
} = useThemeSettingsEdit()

watch(settingModal, async () => {
  if (settingModal.value) {
    await init()
  }
})

const textColor = ref<string>('transparent')
watch(
  editTextColor,
  () => {
    textColor.value = editTextColor.value ?? 'transparent'
  },
  {
    immediate: true,
  }
)
watch(textColor, () => {
  const currentColor = editTextColor.value ?? 'transparent'
  if (textColor.value === currentColor) {
    return
  }
  const updatingColor =
    textColor.value === 'transparent' ? null : textColor.value
  onChangeTextColor(updatingColor)
})

const onChangeTextColor = debounce(
  (color: string | null) => chengeTextColor(color),
  200
)

const onChengeColorTheme = (colorTheme: ColorTheme | null) => {
  if (colorTheme) {
    chengeTextColor(null)
    chengeColorTheme(colorTheme)
  }
}
</script>

<template>
  <div v-if="settingModal" class="g-theme-modal theme-setting-wrap">
    <div class="theme-setting-header">
      <div class="theme-setting-header__title">
        <v-icon :icon="titleData.titleIcon" :color="titleData.titleColor" />
        <h4>{{ titleData.title }}</h4>
      </div>
      <div class="theme-setting-header__dismiss">
        <v-btn
          variant="tonal"
          icon="mdi-close"
          size="x-small"
          @click="settingModal = false"
        />
      </div>
    </div>
    <div class="theme-setting">
      <div>
        <CommonCustomerColorThemeSelectorMenu
          :theme="editColorTheme"
          :color-theme-options="colorThemeOptions"
          activator-label="カラーテーマ"
          activator-button-size="small"
          activator-button-width="96px"
          @update:theme="onChengeColorTheme"
        />
      </div>
      <div>
        <BaseFontSelectorMenu
          :font-family="editFontFamily"
          :font-family-items="fontFamilyItems"
          activator-label="フォント"
          activator-button-size="small"
          activator-button-width="64px"
          @update:font-family="chengeFontFamily"
        />
      </div>
      <div>
        <BaseColorPickerMenu
          v-model:color="textColor"
          activator-label="文字色"
          activator-button-size="small"
          activator-button-width="64px"
          use-delete
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.theme-setting-wrap {
  position: fixed;
  top: calc($nav-header-height + 0.5rem);
  right: 0.5rem;
  border-radius: 8px;
  padding: 0.5rem 0.75rem;

  .theme-setting-header {
    display: flex;
    justify-content: space-between;

    &__title {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
  }
  .theme-setting {
    display: flex;
    gap: 0.5rem;
    padding: 0.5rem 0;
  }
}
</style>
