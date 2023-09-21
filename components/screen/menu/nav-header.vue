<script setup lang="ts">
import type { MenuItem } from '@/components/base/dropdown.vue'

// Todo: 適当
const headerTitle = {
  title: 'ロングリブネット',
  color: 'yellow',
  to: { name: 'index', hash: '#home-index-top' },
}
const { domidPrefix, homeSections } = useHomeSectionsRead()
const sidebar = ref(false)

const { logout } = useAuth()
const { user, isLoggedIn, isPreview, togglePreview } = useFoundation()
const userMenuItems: MenuItem[] = [
  { title: 'プレビュー', value: 'preview', props: { prependIcon: 'mdi-eye' } },
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
const logoutDialog = ref(false)
const onSelectUserMenu = (value: number | string) => {
  switch (value) {
    case 'preview':
      togglePreview()
      break
    case 'userinfo':
      console.log('userinfo')
      break
    case 'changePassword':
      console.log('changePassword')
      break
    case 'logout':
      logoutDialog.value = true
      break
  }
}
const onLogout = () => {
  logoutDialog.value = false
  logout()
}
</script>

<template>
  <nav class="nav-header g-theme-header">
    <div class="g-block-lg">
      <div class="nav-header__menu">
        <h2 class="menu-title">
          <nuxt-link :to="headerTitle.to">
            {{ headerTitle.title }}
          </nuxt-link>
        </h2>
        <div class="row-direction">
          <p
            v-for="section in homeSections"
            :key="section.order"
            class="menu-link"
          >
            <nuxt-link
              :to="{
                name: 'index',
                hash: `#${domidPrefix}-${section.kind}`,
              }"
            >
              {{ section.menuTitle ?? section.title }}
            </nuxt-link>
          </p>
          <ClientOnly>
            <BaseDropdown
              v-if="isLoggedIn"
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
          </ClientOnly>
        </div>
      </div>
    </div>
    <div class="g-block-sm">
      <div class="nav-header__menu">
        <h2 class="menu-title">
          <nuxt-link :to="headerTitle.to">
            {{ headerTitle.title }}
          </nuxt-link>
        </h2>
        <ClientOnly>
          <div>
            <BaseDropdown
              v-if="isLoggedIn"
              :items="userMenuItems"
              @select="onSelectUserMenu"
            >
              <template #activator="{ props }">
                <v-btn v-bind="props" color="accent" rounded="lg">
                  <v-icon icon="mdi-account" />
                </v-btn>
              </template>
            </BaseDropdown>
            <v-btn
              variant="text"
              icon="mdi-menu"
              color="white"
              @click="sidebar = !sidebar"
            />
          </div>
          <teleport to="#application-body">
            <BaseDrawer v-model:drawer="sidebar" color="#424242" theme="dark">
              <div class="column-direction">
                <h2 class="menu-title">
                  <nuxt-link :to="headerTitle.to">
                    {{ headerTitle.title }}
                  </nuxt-link>
                </h2>
                <p
                  v-for="section in homeSections"
                  :key="section.order"
                  class="menu-link"
                >
                  <nuxt-link
                    :to="{
                      name: 'index',
                      hash: `#${domidPrefix}-${section.kind}`,
                    }"
                  >
                    {{ section.menuTitle ?? section.title }}
                  </nuxt-link>
                </p>
              </div>
            </BaseDrawer>
          </teleport>
        </ClientOnly>
      </div>
    </div>
    <BaseConfirm
      v-model:comfirm="logoutDialog"
      message="本当にログアウトしますか？"
      exec-text="ログアウト"
      @cancel="logoutDialog = false"
      @confirm="onLogout"
    />
    <ScreenMenuOnPreview
      v-if="isPreview"
      class="nav-header__on-preview"
      @click="togglePreview"
    />
  </nav>
</template>

<style lang="scss" scoped>
.nav-header {
  .g-block-lg {
    padding: 0 1.8rem;
  }
  .g-block-sm {
    padding: 0 0.5rem 0 1rem;
  }
  &__menu {
    height: $nav-header-height;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  &__on-preview {
    position: fixed;
    top: calc($nav-header-height + 0.75rem);
    right: 1rem;
  }
}

.row-direction {
  display: flex;
  align-items: center;
  column-gap: 1rem;
}
.column-direction {
  display: flex;
  flex-direction: column;
  row-gap: 1rem;
  margin-top: 0.5rem;
  padding-left: 1.5rem;
  .menu-title {
    margin-bottom: 0.5rem;
  }
}

.menu-title {
  font-size: 1.3rem;
  :deep(a) {
    font-weight: 900;
    color: v-bind('headerTitle.color');
  }
  :deep(a:hover) {
    color: orange;
  }
}

.menu-link {
  font-weight: bold;
  font-size: 1rem;
  :deep(a) {
    font-weight: bold;
    color: white;
  }
  :deep(a:hover) {
    color: orange;
  }
}
</style>
