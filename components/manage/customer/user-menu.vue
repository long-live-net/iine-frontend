<script setup lang="ts">
import type { MenuItem } from '@/components/base/dropdown.vue'

const { authUser, isPreview, togglePreview } = useCustomerPageContext()
const router = useRouter()

const logoutDialog = ref(false)
const titleSettingDialog = ref(false)
const homeLayoutSettingDialog = ref(false)
const themeSettingDialog = ref(false)

const userMenuItems: MenuItem[] = [
  { title: 'プレビュー', value: 'preview', props: { prependIcon: 'mdi-eye' } },
  { type: 'divider' },
  {
    title: 'タイトル設定',
    value: 'titleSetting',
    props: { prependIcon: 'mdi-format-title' },
  },
  {
    title: 'ホームレイアウト設定',
    value: 'homeLayoutSetting',
    props: { prependIcon: 'mdi-page-layout-header-footer' },
  },
  {
    title: 'テーマ設定',
    value: 'themeSetting',
    props: { prependIcon: 'mdi-cog' },
  },
  { type: 'divider' },
  {
    title: 'プロファイル',
    value: 'profile',
    props: { prependIcon: 'mdi-account' },
  },
  {
    title: 'パスワード変更',
    value: 'changePassword',
    props: { prependIcon: 'mdi-lock' },
  },
  { type: 'divider' },
  {
    title: 'ログアウト',
    value: 'logout',
    props: { prependIcon: 'mdi-logout' },
  },
]
const onSelectUserMenu = (value: number | string) => {
  switch (value) {
    case 'preview':
      togglePreview()
      break
    case 'titleSetting':
      titleSettingDialog.value = true
      break
    case 'homeLayoutSetting':
      homeLayoutSettingDialog.value = true
      break
    case 'themeSetting':
      themeSettingDialog.value = true
      break
    case 'profile':
      router.push('/customer/profile')
      break
    case 'changePassword':
      router.push('/customer/change-password')
      break
    case 'logout':
      logoutDialog.value = true
      break
  }
}
</script>

<template>
  <div class="g-block-lg">
    <BaseDropdown
      :items="userMenuItems"
      location="bottom end"
      @select="onSelectUserMenu"
    >
      <template #activator="{ props }">
        <v-btn
          v-bind="props"
          color="accent"
          prepend-icon="mdi-account"
          rounded="lg"
          style="text-transform: none; min-width: 8rem"
        >
          {{ authUser?.name ?? 'No Name' }}
        </v-btn>
      </template>
    </BaseDropdown>
  </div>
  <div class="g-block-sm">
    <BaseDropdown
      :items="userMenuItems"
      location="bottom end"
      @select="onSelectUserMenu"
    >
      <template #activator="{ props }">
        <v-btn v-bind="props" color="accent" rounded="lg">
          <v-icon icon="mdi-account" />
        </v-btn>
      </template>
    </BaseDropdown>
  </div>
  <ManageCustomerOnPreview
    v-if="isPreview"
    id="on-preview-button"
    @click="togglePreview"
  />
  <ManageCustomerTitleSetting v-model:modal="titleSettingDialog" />
  <ManageCustomerHomeLayoutSetting v-model:modal="homeLayoutSettingDialog" />
  <ManageCustomerThemeSetting v-model:modal="themeSettingDialog" />
  <ManageCustomerLogout v-model:modal="logoutDialog" />
</template>

<style scoped lang="scss">
#on-preview-button {
  position: fixed;
  top: calc($nav-header-height + 0.75rem);
  right: 1rem;
}
</style>
