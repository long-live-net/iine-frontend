<script setup lang="ts">
const props = defineProps<{
  modal: boolean
  activatorIcon?: string
  activatorSize?: 'x-small' | 'small' | 'default' | 'large' | 'x-large'
  activatorColor?: string
  activatorText?: string
}>()
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
  <v-dialog v-model="dialog" max-width="800">
    <div class="content-form-dialog">
      <header v-if="$slots.header" class="content-form-dialog__header">
        <slot name="header" />
      </header>
      <div class="content-form-dialog__body">
        <slot />
      </div>
    </div>
  </v-dialog>
</template>

<style lang="scss" scoped>
.content-form-dialog {
  background-color: $white;
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
