<script setup lang="ts">
import type { FontFamilyItem } from '@/components/base/font-selector.vue'

const fontFamily = defineModel<string>('fontFamily', { required: true })
withDefaults(
  defineProps<{
    fontFamilyItems: FontFamilyItem[]
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
        color="grey-darken-4"
        @click.stop
      >
        {{ activatorLabel }}
      </v-btn>
    </template>
    <div class="font-selector-wrap">
      <h4 class="label" :style="{ 'font-family': fontFamily }">
        <v-icon>mdi-format-font</v-icon>
        フォントを選択
      </h4>
      <BaseFontSelector
        v-model:font-family="fontFamily"
        :font-family-items="fontFamilyItems"
      />
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
.font-selector-wrap {
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
