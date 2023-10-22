<script setup lang="ts">
import type { MenuItem } from '@/components/base/dropdown.vue'

const emit = defineEmits<{
  userinfo: []
  changePassword: []
  logout: []
}>()

const { logout } = useAuth()
const { user, isPreview, togglePreview } = useFoundation()
const router = useRouter()

const logoutDialog = ref(false)
const onLogout = () => {
  logoutDialog.value = false
  logout()
  router.push('/customer/logout')
}

const homeLayoutSettingModal = ref(false)
const themeSettingModal = ref(false)

const userMenuItems: MenuItem[] = [
  { title: 'プレビュー', value: 'preview', props: { prependIcon: 'mdi-eye' } },
  {
    title: 'テーマ設定',
    value: 'themeSetting',
    props: { prependIcon: 'mdi-cog' },
  },
  {
    title: 'ホームレイアウト設定',
    value: 'homeLayout',
    props: { prependIcon: 'mdi-view-split-horizontal' },
  },
  { type: 'divider' },
  {
    title: 'ユーザ情報',
    value: 'userinfo',
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
    case 'themeSetting':
      themeSettingModal.value = true
      break
    case 'homeLayout':
      homeLayoutSettingModal.value = true
      break
    case 'userinfo':
      console.log('userinfo')
      emit('userinfo')
      break
    case 'changePassword':
      console.log('changePassword')
      emit('changePassword')
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
      location="bottom left"
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
          {{ user?.name ?? 'No Name' }}
        </v-btn>
      </template>
    </BaseDropdown>
  </div>
  <div class="g-block-sm">
    <BaseDropdown :items="userMenuItems" @select="onSelectUserMenu">
      <template #activator="{ props }">
        <v-btn v-bind="props" color="accent" rounded="lg">
          <v-icon icon="mdi-account" />
        </v-btn>
      </template>
    </BaseDropdown>
  </div>
  <ScreenMenuOnPreview
    v-if="isPreview"
    id="on-preview-button"
    @click="togglePreview"
  />
  <EditorThemeSetting v-model:modal="themeSettingModal" />
  <EditorHomeLayoutSetting v-model:modal="homeLayoutSettingModal" />
  <BaseConfirm
    v-model:comfirm="logoutDialog"
    message="本当にログアウトしますか？"
    exec-text="ログアウト"
    @cancel="logoutDialog = false"
    @confirm="onLogout"
  />
</template>

<style scoped lang="scss">
#on-preview-button {
  position: fixed;
  top: calc($nav-header-height + 0.75rem);
  right: 1rem;
}
</style>
