<script setup lang="ts">
const color = defineModel<string>('color', { required: true })
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
    useDelete?: boolean
  }>(),
  {
    location: 'bottom',
    useDelete: false,
  }
)
const pickerMenu = ref(false)
const btnColor = computed(() =>
  useContentUtils().colorStringToUiColor(color.value)
)
</script>

<template>
  <v-menu
    v-model="pickerMenu"
    :location="location"
    :close-on-content-click="false"
  >
    <template #activator="{ props: menuProps }">
      <v-btn
        v-bind="menuProps"
        size="small"
        :color="btnColor"
        width="64px"
        @click.stop
      >
        {{ activaterLabel }}
      </v-btn>
    </template>

    <div class="color-picker">
      <BaseColorPicker v-model:color="color" />
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
