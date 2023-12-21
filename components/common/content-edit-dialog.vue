<script setup lang="ts">
const props = defineProps<{ modal: boolean; isUpdate?: boolean }>()
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
  <BaseDialog v-model:modal="dialog" persistent>
    <div class="content-edit-dialog">
      <header class="content-edit-dialog__header">
        <div class="header-label">
          <slot name="header">
            <template v-if="isUpdate">
              <p class="mr-1">
                <v-icon
                  icon="mdi-pencil-circle"
                  color="success"
                  size="x-large"
                />
              </p>
              <h3>コンテンツの更新</h3>
            </template>
            <template v-else>
              <p class="mr-1">
                <v-icon icon="mdi-plus-circle" color="info" size="x-large" />
              </p>
              <h3>コンテンツの追加</h3>
            </template>
          </slot>
        </div>
        <div class="header-dismiss">
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
      <div class="content-edit-dialog__body">
        <slot />
      </div>
    </div>
  </BaseDialog>
</template>

<style lang="scss" scoped>
.content-edit-dialog {
  background-color: $white;
  color: $black;
  overflow-y: auto;
  border-radius: 6px;
  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem;
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
