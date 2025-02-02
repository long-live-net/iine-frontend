<script setup lang="ts">
const modal = defineModel<boolean>('modal', { required: true })
const props = defineProps<{
  isUpdate?: boolean
  loading?: boolean
}>()

const titleLabel = computed(() =>
  props.isUpdate ? 'コンテンツの更新' : 'コンテンツの追加'
)
const titleIcon = computed(() =>
  props.isUpdate ? 'mdi-pencil-circle' : 'mdi-plus-circle'
)
const titleColor = computed(() => (props.isUpdate ? 'success' : 'info'))
</script>

<template>
  <CommonModalDialog
    v-model:modal="modal"
    :title="titleLabel"
    :title-icon="titleIcon"
    :title-icon-color="titleColor"
    persistent
  >
    <div class="content-edit-dialog">
      <CommonContentWrap :loading="loading">
        <slot />
      </CommonContentWrap>
    </div>
  </CommonModalDialog>
</template>

<style lang="scss" scoped>
.content-edit-dialog {
  min-width: 60dvw;
  max-width: 840px;
}
</style>
