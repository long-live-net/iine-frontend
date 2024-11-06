<script setup lang="ts">
import { pageFontFamily } from '@/composables/use-customer/use-customer-setting'

const fontFamily = defineModel<string>('fontFamily', { required: true })
withDefaults(
  defineProps<{
    activaterLabel: string
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
    location: 'bottom',
  }
)

const selectorMenu = ref(false)
const fontFamilieItems = [
  {
    key: '自動',
    value: 'inherit',
    text: 'おはよう世界',
  },
  ...Object.keys(pageFontFamily).map((key) => ({
    key,
    value: pageFontFamily[key],
    text: 'おはよう世界',
  })),
]
</script>

<template>
  <v-menu
    v-model="selectorMenu"
    :location="location"
    :close-on-content-click="false"
  >
    <template #activator="{ props: menuProps }">
      <v-btn v-bind="menuProps" size="small" color="grey-darken-4" width="64px">
        {{ activaterLabel }}
      </v-btn>
    </template>
    <div class="font-selector-wrap">
      <div class="font-selector">
        <h4 class="label mb-3" :style="{ 'font-family': fontFamily }">
          <v-icon>mdi-format-font</v-icon>
          フォントを選択
        </h4>
        <v-select
          v-model="fontFamily"
          :items="fontFamilieItems"
          item-title="key"
          item-value="value"
          density="comfortable"
          label="フォント"
          hide-details
        >
          <template #item="{ props: itemProps, item }">
            <v-list-item
              v-bind="itemProps"
              :title="`${item.raw.text}: ${item.raw.key}`"
              :style="{ 'font-family': item.raw.value }"
            ></v-list-item>
          </template>
        </v-select>
      </div>
      <div class="actions">
        <v-btn
          size="small"
          append-icon="mdi-close"
          color="grey-darken-4"
          @click="selectorMenu = false"
          >閉じる</v-btn
        >
      </div>
    </div>
  </v-menu>
</template>

<style lang="scss" scoped>
.font-selector-wrap {
  width: 250px;
  background-color: white;

  .font-selector {
    padding: 0.75rem;

    label: {
      color: black;
      font-weight: bold;
    }
  }

  .actions {
    padding: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: end;
  }
}
</style>
