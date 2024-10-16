<script setup lang="ts">
import type { PageTitle, PageLayout } from '@/types/customer-setting'

const settingModal = defineModel<boolean>('modal', { required: true })
const titleData = {
  title: 'タイトル設定',
  titleIcon: 'mdi-format-title',
  titleColor: 'accent',
}

const {
  pageTitle,
  loading: pageTitleLoading,
  initialLoading,
  init,
  updatePageTitle,
} = usePageTitleEdit()

const {
  homeSections,
  loading: menuTitleLoading,
  updateMenuTitles,
} = useHomeLayoutTitleEdit()

const onUpdatePageTitle = async (pageTitle: PageTitle) => {
  if (pageTitle.title) {
    await updatePageTitle(pageTitle)
  }
}
const onUpdateMenuTitle = async (sections: PageLayout[]) => {
  if (sections.length) {
    await updateMenuTitles(sections)
  }
}

const formMounting = ref(false)
watch(settingModal, async (value) => {
  if (value) {
    await init()
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
</script>

<template>
  <CommonModalDialog
    v-model:modal="settingModal"
    :title="titleData.title"
    :title-icon="titleData.titleIcon"
    :title-icon-color="titleData.titleColor"
    :width="600"
    :loading="initialLoading"
    theme="white"
  >
    <ManageCustomerTitleSettingPageTitleForm
      v-if="formMounting && pageTitle"
      :page-title="pageTitle"
      :loading="pageTitleLoading"
      @cancel="settingModal = false"
      @update="onUpdatePageTitle"
    />

    <ManageCustomerTitleSettingMenuTitleForm
      v-if="formMounting && homeSections.length"
      :home-sections="homeSections"
      :loading="menuTitleLoading"
      @cancel="settingModal = false"
      @update="onUpdateMenuTitle"
    />
  </CommonModalDialog>
</template>
