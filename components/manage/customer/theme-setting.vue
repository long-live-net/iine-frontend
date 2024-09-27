<script setup lang="ts">
const props = defineProps<{ modal: boolean }>()
const emit = defineEmits<{
  'update:modal': [modal: boolean]
}>()

const settingModal = computed({
  get: () => props.modal,
  set: (modal: boolean) => {
    emit('update:modal', modal)
  },
})

const titleData = {
  title: 'テーマ設定',
  titleIcon: 'mdi-cog',
  titleColor: 'accent',
}

const {
  editLayoutTheme,
  editColorTheme,
  layoutThemeOptions,
  colorThemeOptions,
} = useThemeSettingsEdit()
</script>

<template>
  <CommonModalDialog
    v-model:modal="settingModal"
    :title="titleData.title"
    :title-icon="titleData.titleIcon"
    :title-icon-color="titleData.titleColor"
  >
    <div class="theme-setting">
      <section>
        <h4>カラーテーマ</h4>
        <div class="theme-selection">
          <v-radio-group v-model="editColorTheme" inline>
            <v-radio
              v-for="ct in colorThemeOptions"
              :key="ct.type"
              color="primary"
              :label="ct.label"
              :value="ct.type"
            ></v-radio>
          </v-radio-group>
        </div>
      </section>
      <section class="disabled">
        <h4>
          <v-icon icon="mdi-lock" />
          レイアウトテーマ (未サポート)
        </h4>
        <div class="theme-selection">
          <v-radio-group v-model="editLayoutTheme" inline disabled>
            <v-radio
              v-for="st in layoutThemeOptions"
              :key="st.type"
              color="primary"
              :label="st.label"
              :value="st.type"
            ></v-radio>
          </v-radio-group>
        </div>
      </section>
    </div>
  </CommonModalDialog>
</template>

<style scoped lang="scss">
.theme-setting {
  display: flex;
  flex-direction: column;
  row-gap: 0.5rem;
  padding: 0.25rem 1rem;
  width: 600px;
  max-width: 100%;

  .disabled {
    h3,
    h4,
    h5,
    p {
      color: $gray-lighten1;
    }
  }
}
</style>
