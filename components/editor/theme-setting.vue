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
  saving,
} = useThemeSettingsEdit()

const addSnackber = inject<(mesg: string) => void>('snackbarInjectionKey')
watch(saving, (cur, pre) => {
  if (pre && !cur) {
    addSnackber?.('テーマを更新しました')
  }
})
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
        <h4>カラーテーマ選択</h4>
        <div class="theme-selection">
          <v-radio-group v-model="editColorTheme" inline>
            <v-radio
              v-for="ct in colorThemeOptions"
              key="ct.type"
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
          レイアウトテーマ選択 (未サポート)
        </h4>
        <div class="theme-selection">
          <v-radio-group v-model="editLayoutTheme" inline disabled>
            <v-radio
              v-for="st in layoutThemeOptions"
              key="st.type"
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
