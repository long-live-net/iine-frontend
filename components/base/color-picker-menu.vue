<script setup lang="ts">
const color = defineModel<string>('color', { required: true })
withDefaults(
  defineProps<{
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
    useDelete?: boolean
    useLightSwatches?: boolean
  }>(),
  {
    activatorButtonSize: 'default',
    activatorButtonWidth: undefined,
    location: 'bottom',
    useDelete: false,
    useLightSwatches: false,
  }
)
const pickerMenu = ref(false)
const btnColor = computed(() =>
  useContentUtils().colorStringToUiColor(color.value)
)

const lightSwatches = [
  ['#FF0000', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5'],
  ['#0000FF', '#0399F4', '#88D8EF', '#42CEA4', '#08C422'],
  ['#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800'],
  ['#F04E22', '#795548', '#607D8B', '#8E8E9E', '#B2B2B2'],
  ['#D0D0D0', '#E4E4E4', '#FFFFFF', '#000000', '#FFFFFF00'],
]
</script>

<template>
  <v-menu
    v-model="pickerMenu"
    :location="location"
    :close-on-content-click="false"
  >
    <template #activator="{ props: menuProps }">
      <slot name="activator" :props="menuProps">
        <v-btn
          v-bind="menuProps"
          :size="activatorButtonSize"
          :width="activatorButtonWidth"
          :color="btnColor"
          @click.stop
        >
          {{ activatorLabel }}
        </v-btn>
      </slot>
    </template>

    <div class="color-picker">
      <BaseColorPicker
        v-model:color="color"
        :swatches="useLightSwatches ? lightSwatches : undefined"
      />
      <div class="actions">
        <div class="d-flex align-center">
          <v-btn
            v-if="useDelete && color"
            size="small"
            prepend-icon="mdi-circle-opacity"
            :color="btnColor"
            @click.stop="color = 'transparent'"
            >クリア</v-btn
          >
          <p v-else>
            <b :style="{ color }">Font Color</b>
          </p>
        </div>
        <div>
          <v-btn
            size="small"
            append-icon="mdi-close"
            color="grey-darken-4"
            @click.stop="pickerMenu = false"
            >閉じる</v-btn
          >
        </div>
      </div>
    </div>
  </v-menu>
</template>

<style scoped lang="scss">
.color-picker {
  padding: 0;
  color: $black;
  background-color: rgb(225 225 225);
  border-radius: 4px;

  .actions {
    padding: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
</style>
