<script setup lang="ts">
import type { ColorTheme } from '@/types/customer-setting'

const theme = defineModel<ColorTheme>('theme', { required: true })
withDefaults(
  defineProps<{
    colorThemeOptions: {
      type: ColorTheme
      label: string
    }[]
    activatorLabel: string
    activatorButtonSize?: 'small' | 'default'
    activatorButtonWidth?: string
    location?:
      | 'top'
      | 'top center'
      | 'top right'
      | 'right'
      | 'left'
      | 'bottom'
      | 'bottom center'
      | 'bottom right'
  }>(),
  {
    activatorButtonSize: 'default',
    activatorButtonWidth: undefined,
    location: 'bottom',
  }
)

const selectorMenu = ref(false)
</script>

<template>
  <v-menu
    v-model="selectorMenu"
    :location="location"
    :close-on-content-click="false"
  >
    <template #activator="{ props: menuProps }">
      <v-btn
        v-bind="menuProps"
        :size="activatorButtonSize"
        :width="activatorButtonWidth"
        color="info"
        @click.stop
      >
        {{ activatorLabel }}
      </v-btn>
    </template>
    <div class="color-theme-selector-wrap">
      <h4 class="label" :style="{ 'font-family': theme }">
        カラーテーマを選択
      </h4>
      <v-radio-group v-model="theme" inline hide-details>
        <v-radio
          v-for="ct in colorThemeOptions"
          :key="ct.type"
          :label="ct.label"
          :value="ct.type"
        />
      </v-radio-group>
      <div class="actions">
        <v-btn
          size="small"
          append-icon="mdi-close"
          color="grey-darken-4"
          @click.stop="selectorMenu = false"
          >閉じる</v-btn
        >
      </div>
    </div>
  </v-menu>
</template>

<style lang="scss" scoped>
.color-theme-selector-wrap {
  width: 250px;
  color: $black;
  background-color: $white;
  padding: 0.75rem;

  .label {
    margin-bottom: 1rem;
    font-weight: bold;
  }

  .actions {
    display: flex;
    align-items: center;
    justify-content: end;
    margin-top: 1rem;
  }
}
</style>
