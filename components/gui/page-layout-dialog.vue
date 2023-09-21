<script setup lang="ts">
const props = defineProps<{ modal: boolean }>()
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
  <BaseDialog v-model:modal="dialog" :max-width="540">
    <div class="page-layout-dialog">
      <header class="page-layout-dialog__header">
        <slot name="header">
          <p class="mr-1">
            <v-icon
              icon="mdi-view-dashboard-edit"
              color="accent"
              size="x-large"
            />
          </p>
          <h3>ページレイアウト変更</h3>
        </slot>
      </header>
      <div class="page-layout-dialog__body">
        <slot />
      </div>
    </div>
  </BaseDialog>
</template>

<style lang="scss" scoped>
.page-layout-dialog {
  background-color: $white;
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
