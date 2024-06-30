<script setup lang="ts">
import type { MenuItemType, MenuItem } from '@/components/base/dropdown.vue'

const emit = defineEmits<{
  inquire: []
  access: []
}>()

const router = useRouter()
const { isLoggedIn } = useFoundation()
const logoutDialog = ref(false)

const footerMenuItemsLarge: MenuItem[] = [
  ...(isLoggedIn.value
    ? [
        {
          title: 'ログアウト',
          value: 'logout',
          props: { prependIcon: 'mdi-logout' },
        },
      ]
    : [
        {
          title: '管理者ログイン',
          value: 'login',
          props: { prependIcon: 'mdi-account-circle' },
        },
      ]),
  {
    type: 'divider' as MenuItemType,
  },
  {
    title: 'このホームページについて',
    value: 'poweredbyIine',
    props: { prependIcon: 'mdi-emoticon' },
  },
]
const footerMenuItemsSmall: MenuItem[] = [
  {
    title: 'お問い合わせ',
    value: 'contact',
    props: { prependIcon: 'mdi-email' },
  },
  {
    title: 'アクセス',
    value: 'access',
    props: { prependIcon: 'mdi-earth' },
  },
  {
    type: 'divider' as MenuItemType,
  },
  ...footerMenuItemsLarge,
]

const onSelectUserMenu = (value: number | string) => {
  switch (value) {
    case 'login':
      router.push({ name: 'customer-login' })
      break
    case 'logout':
      logoutDialog.value = true
      break
    case 'contact':
      emit('inquire')
      break
    case 'access':
      emit('access')
      break
  }
}
</script>

<template>
  <div class="g-block-lg">
    <BaseDropdown
      :items="footerMenuItemsLarge"
      location="top start"
      @select="onSelectUserMenu"
    >
      <template #activator="{ props }">
        <v-btn v-bind="props" variant="text" icon="mdi-menu" />
      </template>
    </BaseDropdown>
  </div>
  <div class="g-block-sm">
    <BaseDropdown
      :items="footerMenuItemsSmall"
      location="top start"
      @select="onSelectUserMenu"
    >
      <template #activator="{ props }">
        <v-btn v-bind="props" variant="text" icon="mdi-menu" />
      </template>
    </BaseDropdown>
  </div>
  <ManageCustomerLogout v-model:modal="logoutDialog" />
</template>
