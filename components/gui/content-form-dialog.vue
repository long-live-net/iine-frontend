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
  <BaseDialog v-model:modal="dialog">
    <div class="content-form-dialog">
      <header v-if="$slots.header" class="content-form-dialog__header">
        <slot name="header" />
      </header>
      <div class="content-form-dialog__body">
        <slot />
      </div>
    </div>
  </BaseDialog>
</template>

<style lang="scss" scoped>
.content-form-dialog {
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
