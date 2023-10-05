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
  <BaseDialog v-model:modal="dialog">
    <div class="content-edit-dialog">
      <header class="content-edit-dialog__header">
        <slot name="header">
          <template v-if="isUpdate">
            <p class="mr-1">
              <v-icon icon="mdi-pencil-circle" color="success" size="x-large" />
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
  &__header {
    display: flex;
    align-items: center;
    padding: 1rem;
    border-bottom: 1px solid lightgray;
  }
  &__body {
    padding: 1.5rem;
  }
}
</style>
