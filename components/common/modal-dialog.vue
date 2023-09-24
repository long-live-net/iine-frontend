<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    modal: boolean
    title?: string
    titleIcon?: string
    titleIconColor?: string
    maxWidth?: number
  }>(),
  {
    title: '設定ダイアログ',
    titleIcon: 'mdi-cog',
    titleIconColor: 'primary',
    maxWidth: 600,
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
  <BaseDialog v-model:modal="dialog" :max-width="maxWidth">
    <div class="page-setting-dialog">
      <header class="page-setting-dialog__header">
        <slot name="header">
          <p class="mr-1">
            <v-icon :icon="titleIcon" :color="titleIconColor" size="x-large" />
          </p>
          <h3>{{ title }}</h3>
        </slot>
      </header>
      <div class="page-setting-dialog__body">
        <slot />
      </div>
    </div>
  </BaseDialog>
</template>

<style lang="scss" scoped>
.page-setting-dialog {
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
