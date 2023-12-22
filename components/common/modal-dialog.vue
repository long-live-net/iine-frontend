<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    modal: boolean
    title?: string
    titleIcon?: string
    titleIconColor?: string
    maxWidth?: number
    persistent?: boolean
  }>(),
  {
    title: '設定ダイアログ',
    titleIcon: 'mdi-cog',
    titleIconColor: 'primary',
    maxWidth: 600,
    persistent: false,
  }
)
const emit = defineEmits<{
  'update:modal': [modal: boolean]
}>()

const dialog = computed({
  get: () => props.modal,
  set: (modal: boolean) => {
    emit('update:modal', modal)
  },
})
</script>

<template>
  <BaseDialog
    v-model:modal="dialog"
    :max-width="maxWidth"
    :persistent="persistent"
  >
    <div class="modal-dialog">
      <header class="modal-dialog__header">
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
            color="primary"
            @click="dialog = false"
            >閉じる</v-btn
          >
        </div>
      </header>
      <div class="modal-dialog__body">
        <slot />
      </div>
    </div>
  </BaseDialog>
</template>

<style lang="scss" scoped>
.modal-dialog {
  background-color: $white;
  color: $black;
  overflow-y: auto;
  border-radius: 6px;
  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem;
    padding-right: 6px;
    border-bottom: 1px solid lightgray;
    .header-label {
      display: flex;
      align-items: center;
    }
  }
  &__body {
    padding: 1.5rem;
  }
}
</style>
