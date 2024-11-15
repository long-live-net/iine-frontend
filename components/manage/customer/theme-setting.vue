<script setup lang="ts">
const settingModal = defineModel<boolean>('modal', { required: true })

const titleData = {
  title: 'テーマ設定',
  titleIcon: 'mdi-cog',
  titleColor: 'accent',
}

const {
  initialLoading,
  init,
  editFontFamily,
  editColorTheme,
  // editDesignTheme,
  fontFamilyItems,
  colorThemeOptions,
  // DesignThemeOptions,
  chengeFontFamily,
  chengeColorTheme,
  // chengeDesignTheme,
} = useThemeSettingsEdit()

watch(settingModal, async () => {
  if (settingModal.value) {
    await init()
  }
})
</script>

<template>
  <CommonModalDialog
    v-model:modal="settingModal"
    :title="titleData.title"
    :title-icon="titleData.titleIcon"
    :title-icon-color="titleData.titleColor"
    :loading="initialLoading"
  >
    <div class="theme-setting">
      <section>
        <h4>フォント</h4>
        <div class="theme-selection mt-4 ml-4 mr-0 mr-md-8">
          <BaseFontSelector
            :font-family="editFontFamily"
            :font-family-items="fontFamilyItems"
            @update:font-family="chengeFontFamily"
          />
        </div>
      </section>
      <section>
        <h4>カラーテーマ</h4>
        <div class="theme-selection ml-2">
          <v-radio-group
            :model-value="editColorTheme"
            inline
            hide-details
            @update:model-value="chengeColorTheme($event)"
          >
            <v-radio
              v-for="ct in colorThemeOptions"
              :key="ct.type"
              :label="ct.label"
              :value="ct.type"
            />
          </v-radio-group>
        </div>
      </section>
      <!-- <section class="disabled">
        <h4>
          <v-icon icon="mdi-lock" />
          レイアウトテーマ (未サポート)
        </h4>
        <div class="theme-selection">
          <v-radio-group
            :model-value="editDesignTheme"
            inline
            hide-details
            disabled
            @update:model-value="chengeDesignTheme($event)"
          >
            <v-radio
              v-for="st in DesignThemeOptions"
              :key="st.type"
              :label="st.label"
              :value="st.type"
            />
          </v-radio-group>
        </div>
      </section> -->
    </div>
  </CommonModalDialog>
</template>

<style scoped lang="scss">
.theme-setting {
  display: flex;
  flex-direction: column;
  row-gap: 1.5rem;
  padding: 0 1rem 0.5rem;
  width: 520px;
  max-width: 100%;
}
</style>
