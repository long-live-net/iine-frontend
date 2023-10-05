<script setup lang="ts">
import type { UserType } from '@/composables/use-foundation'
import type { MenuItem } from '@/components/base/dropdown.vue'

defineProps<{ user?: UserType }>()
const emit = defineEmits<{
  logout: []
  preview: []
}>()

const userMenuItems: MenuItem[] = [
  { title: 'プレビュー', value: 'preview', props: { prependIcon: 'mdi-eye' } },
  {
    title: 'テーマ設定',
    value: 'themeSetting',
    props: { prependIcon: 'mdi-cog' },
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
      emit('preview')
      break
    case 'themeSetting':
      console.log('themeSetting')
      break
    case 'userinfo':
      console.log('userinfo')
      break
    case 'changePassword':
      console.log('changePassword')
      break
    case 'logout':
      emit('logout')
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
</template>
