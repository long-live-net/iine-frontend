<script setup lang="ts">
const settingModal = defineModel<boolean>('modal', { required: true })

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

const { customerId } = useCustomer()
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
    :width="600"
    theme="white"
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
