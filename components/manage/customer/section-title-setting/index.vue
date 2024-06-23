<script setup lang="ts">
const props = defineProps<{ modal: boolean }>()
const emit = defineEmits<{
  'update:modal': [modal: boolean]
}>()

const settingModal = computed({
  get: () => props.modal,
  set: (modal: boolean) => {
    emit('update:modal', modal)
  },
})
const formMounting = ref(false)
watch(settingModal, (value) => {
  if (value) {
    formMounting.value = value
  } else {
    // Note:
    // フォームコンポーネントは少しだけ遅れて unmount する
    // ダイアログが閉じる時にチラチラするため
    setTimeout(() => {
      formMounting.value = value
    }, 300)
  }
})

const titleData = {
  title: 'メニュータイトル設定',
  titleIcon: 'mdi-layers-edit',
  titleColor: 'accent',
}

const { customerId } = useFoundation()
const { homeSections, loading, update } = usSectionTitleEdit(customerId)

type FormField = { [id: string]: string }
const onUpdate = async (formField: FormField) => {
  await update(formField)
  settingModal.value = false
}
</script>

<template>
  <CommonModalDialog
    v-model:modal="settingModal"
    :title="titleData.title"
    :title-icon="titleData.titleIcon"
    :title-icon-color="titleData.titleColor"
  >
    <ManageCustomerSectionTitleSettingTitleForm
      v-if="formMounting"
      :home-sections="homeSections"
      :loading="loading"
      @cancel="settingModal = false"
      @update="onUpdate"
    />
  </CommonModalDialog>
</template>

<style scoped lang="scss">
.section-title-setting {
  .section-titles {
    display: flex;
    flex-direction: column;
    row-gap: 0.25rem;
    margin-top: 1rem;
    padding: 0.25rem 1rem;
  }
}
</style>
