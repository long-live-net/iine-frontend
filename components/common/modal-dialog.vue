<script setup lang="ts">
const modal = defineModel<boolean>('modal', { required: true })

withDefaults(
  defineProps<{
    title?: string
    titleIcon?: string
    titleIconColor?: string
    width?: number | string
    maxWidth?: number | string
    persistent?: boolean
    theme?: 'white' | 'black' | 'auto'
    loading?: boolean
  }>(),
  {
    title: '設定ダイアログ',
    titleIcon: 'mdi-cog',
    titleIconColor: 'primary',
    width: 'auto',
    maxWidth: 'auto',
    persistent: false,
    theme: 'auto',
    loading: false,
  }
)
</script>

<template>
  <BaseDialog
    v-model:modal="modal"
    :width="width"
    :max-width="maxWidth"
    :persistent="persistent"
  >
    <div
      class="modal-dialog g-theme-modal"
      :class="{
        'theme-white': theme === 'white',
        'theme-black': theme === 'black',
      }"
    >
      <header
        class="modal-dialog__header g-theme-modal"
        :class="{
          'theme-white': theme === 'white',
          'theme-black': theme === 'black',
        }"
      >
        <div class="header-label">
          <slot name="header">
            <p class="mr-1">
              <v-icon
                :icon="titleIcon"
                :color="titleIconColor"
                size="x-large"
              />
            </p>
            <h3>{{ title }}</h3>
          </slot>
        </div>
        <div class="dismiss">
          <v-btn
            variant="text"
            append-icon="mdi-close"
            size="small"
            @click="modal = false"
            >閉じる</v-btn
          >
        </div>
      </header>
      <div class="modal-dialog__body">
        <slot />
      </div>
      <BaseOverlayLiner :overlay="loading" />
    </div>
  </BaseDialog>
</template>

<style lang="scss" scoped>
$modal-dialog-header-height: 80px;

.modal-dialog {
  position: relative;
  border-radius: 6px;
  padding-top: $modal-dialog-header-height;
  padding-bottom: 1.5rem;
  @media only screen and (max-width: $grid-breakpoint-md) {
    padding-bottom: 1rem;
  }

  &__header {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1999;
    height: $modal-dialog-header-height;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem;
    padding-right: 6px;
    border-bottom: 1px solid lightgray;
    border-radius: 6px;
    .header-label {
      display: flex;
      align-items: center;
    }
  }
  &__body {
    max-height: calc(100dvh - 180px);
    width: 100%;
    padding-left: 1.5rem;
    padding-right: 1.5rem;
    @media only screen and (max-width: $grid-breakpoint-md) {
      padding-left: 1rem;
      padding-right: 1rem;
    }
    overflow-y: auto;
  }
}

.theme-white {
  background-color: $white;
  color: $black;
  .dismiss {
    color: $primary;
  }
}

.theme-black {
  background-color: $black;
  color: $white;
  .dismiss {
    color: $accent;
  }
}
</style>
