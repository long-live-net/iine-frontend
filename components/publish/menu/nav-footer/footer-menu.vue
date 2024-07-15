<script setup lang="ts">
import type { MenuItemType, MenuItem } from '@/components/base/dropdown.vue'

defineEmits<{ inquire: [] }>()

const router = useRouter()
const { isLoggedIn } = useFoundation()
const { snsLinks, getSnsTitle, getSnsIcon, getSnsColor, onClickLink } =
  useCustomerLinks()
const logoutDialog = ref(false)

const snsLinkItems: MenuItem[] = snsLinks.value.reduce((acc, link) => {
  acc.push({
    title: getSnsTitle(link.serviceName),
    value: link.serviceName,
    props: {
      prependIcon: getSnsIcon(link.serviceName),
      color: getSnsColor(link.serviceName),
    },
  })
  return acc
}, [] as MenuItem[])
const loginLogoutItems: MenuItem[] = isLoggedIn.value
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
    ]
const footerMenuItemsLarge: MenuItem[] = [
  ...loginLogoutItems,
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
  ...snsLinkItems,
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
    case 'facebook':
    case 'instagram':
    case 'twitter':
    case 'youtube': {
      onClickLink(value)
      break
    }
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
      <template #activator="{ props: on }">
        <v-btn v-bind="on" variant="text" icon="mdi-menu" />
      </template>
    </BaseDropdown>
  </div>
  <div class="g-block-sm">
    <BaseDropdown
      :items="footerMenuItemsSmall"
      location="top start"
      @select="onSelectUserMenu"
    >
      <template #activator="{ props: on }">
        <v-btn v-bind="on" variant="text" icon="mdi-menu" />
      </template>
    </BaseDropdown>
  </div>
  <ManageCustomerLogout v-model:modal="logoutDialog" />
</template>
