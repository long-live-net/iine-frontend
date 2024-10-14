<script setup lang="ts">
const modal = defineModel<boolean>('modal', { required: true })

const titleData = {
  title: 'テーマ設定',
  titleIcon: 'mdi-cog',
  titleColor: 'accent',
}

const {
  editDesignTheme,
  editColorTheme,
  DesignThemeOptions,
  colorThemeOptions,
  onChengeDesignTheme,
  onChengeColorTheme,
} = useThemeSettingsEdit()
</script>

<template>
  <CommonModalDialog
    v-model:modal="modal"
    :title="titleData.title"
    :title-icon="titleData.titleIcon"
    :title-icon-color="titleData.titleColor"
  >
    <div class="theme-setting">
      <section>
        <h4>カラーテーマ</h4>
        <div class="theme-selection">
          <v-radio-group
            :model-value="editColorTheme"
            inline
            @update:model-value="onChengeColorTheme($event)"
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
      <section class="disabled">
        <h4>
          <v-icon icon="mdi-lock" />
          レイアウトテーマ (未サポート)
        </h4>
        <div class="theme-selection">
          <v-radio-group
            :model-value="editDesignTheme"
            inline
            disabled
            @update:model-value="onChengeDesignTheme($event)"
          >
            <v-radio
              v-for="st in DesignThemeOptions"
              :key="st.type"
              :label="st.label"
              :value="st.type"
            />
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
